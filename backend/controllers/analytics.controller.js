require('dotenv').config();
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const NodeCache = require('node-cache');

/**
 * Khởi tạo client GA4 với thông tin xác thực từ biến môi trường
 * @type {BetaAnalyticsDataClient}
 */
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    type: process.env.GA_TYPE,
    project_id: process.env.GA_PROJECT_ID,
    private_key_id: process.env.GA_PRIVATE_KEY_ID,
    private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GA_CLIENT_EMAIL,
    client_id: process.env.GA_CLIENT_ID,
    auth_uri: process.env.GA_AUTH_URI,
    token_uri: process.env.GA_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GA_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GA_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GA_UNIVERSE_DOMAIN,
  },
});

/**
 * Khởi tạo bộ nhớ đệm với TTL là 1 giờ (3600 giây)
 * @type {NodeCache}
 */
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

/**
 * Định dạng thời lượng phiên trung bình từ giây sang chuỗi mm:ss
 * @param {number} seconds - Thời lượng phiên trung bình (giây)
 * @returns {string} Chuỗi thời gian định dạng mm:ss
 */
const formatSessionDuration = (seconds) => {
  const date = new Date(seconds * 1000);
  return date.toISOString().substr(14, 5);
};

/**
 * Tính toán khoảng thời gian của tháng trước dựa trên startDate và endDate
 * @param {string} startDate - Ngày bắt đầu hiện tại
 * @param {string} endDate - Ngày kết thúc hiện tại
 * @returns {Object} Khoảng thời gian tháng trước { startDate, endDate }
 */
const getPreviousMonthRange = (startDate, endDate) => {
  const currentStart = new Date(startDate.includes('daysAgo') ? new Date() - parseInt(startDate) * 24 * 60 * 60 * 1000 : startDate);
  const currentEnd = new Date(endDate === 'today' ? new Date() : endDate);

  const daysDiff = Math.ceil((currentEnd - currentStart) / (24 * 60 * 60 * 1000));
  const prevEnd = new Date(currentStart.getTime() - 24 * 60 * 60 * 1000);
  const prevStart = new Date(prevEnd.getTime() - daysDiff * 24 * 60 * 60 * 1000);

  return {
    startDate: prevStart.toISOString().split('T')[0],
    endDate: prevEnd.toISOString().split('T')[0],
  };
};

/**
 * Tính phần trăm thay đổi so với giá trị trước đó
 * @param {number} current - Giá trị hiện tại
 * @param {number} previous - Giá trị trước đó
 * @returns {string} Phần trăm thay đổi (định dạng chuỗi với 1 chữ số thập phân)
 */
const calculatePercentChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 'Infinity' : '0.0';
  return (((current - previous) / previous) * 100).toFixed(1);
};

/**
 * Lấy báo cáo GA4 với cấu hình linh hoạt, hỗ trợ bộ nhớ đệm
 * @param {string} property - ID thuộc tính GA4
 * @param {Object} config - Cấu hình báo cáo (dateRanges, dimensions, metrics, orderBys, limit)
 * @param {string} cacheKey - Khóa duy nhất cho bộ nhớ đệm
 * @returns {Promise<Object>} Dữ liệu báo cáo hoặc dữ liệu mặc định nếu rỗng
 */
const runReport = async (property, config, cacheKey) => {
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Lấy dữ liệu từ cache cho ${cacheKey}`);
    return cachedData;
  }

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${property}`,
      ...config,
    });

    if (!response.rows || response.rows.length === 0) {
      console.warn(`Không có dữ liệu trả về cho báo cáo ${cacheKey}. Trả về dữ liệu mặc định.`);
      return { rows: [], isEmpty: true };
    }

    cache.set(cacheKey, response);
    return response;
  } catch (error) {
    console.error(`Lỗi khi gọi API GA4 cho ${cacheKey}:`, error.message);
    throw error;
  }
};

/**
 * Controller để lấy dữ liệu phân tích GA4
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */
const getAnalyticsData = async (req, res) => {
  try {
    const propertyId = '505029153'; // Thay bằng ID thuộc tính GA4 của bạn
    const { startDate = '30daysAgo', endDate = 'today', pageViewsDays = '7daysAgo' } = req.query;

    // Kiểm tra tham số đầu vào
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Tham số startDate và endDate là bắt buộc' });
    }

    // Tạo khóa cache duy nhất dựa trên tham số
    const cacheKeyPrefix = `${propertyId}_${startDate}_${endDate}`;
    const pageViewsCacheKey = `${cacheKeyPrefix}_pageViews_${pageViewsDays}`;

    // Lấy dữ liệu tổng quan hiện tại
    const totalStatsResponse = await runReport(propertyId, {
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    }, `${cacheKeyPrefix}_totalStats`);

    // Lấy dữ liệu tổng quan tháng trước
    const prevMonth = getPreviousMonthRange(startDate, endDate);
    const prevTotalStatsResponse = await runReport(propertyId, {
      dateRanges: [{ startDate: prevMonth.startDate, endDate: prevMonth.endDate }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    }, `${cacheKeyPrefix}_prevTotalStats_${prevMonth.startDate}_${prevMonth.endDate}`);

    // Lấy dữ liệu lượt xem trang theo ngày
    const pageViewsResponse = await runReport(propertyId, {
      dateRanges: [{ startDate: pageViewsDays, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'sessions' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }, pageViewsCacheKey);

    // Lấy dữ liệu loại thiết bị
    const deviceTypesResponse = await runReport(propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'totalUsers' }],
    }, `${cacheKeyPrefix}_deviceTypes`);

    // Lấy dữ liệu trang hàng đầu
    const topPagesResponse = await runReport(propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5,
    }, `${cacheKeyPrefix}_topPages`);

    // Khởi tạo dữ liệu mặc định và mảng cảnh báo
    const totalStats = {
      totalPageViews: 0,
      totalSessions: 0,
      bounceRate: '0.0',
      avgSessionDuration: '00:00',
      newUsers: 0,
      returningUsers: 0,
      percentChange: {
        totalPageViews: '0.0',
        totalSessions: '0.0',
        bounceRate: '0.0',
        avgSessionDuration: '0.0',
        newUsers: '0.0',
        returningUsers: '0.0',
      },
    };
    let warnings = [];

    // Xử lý dữ liệu tổng quan hiện tại
    if (!totalStatsResponse.isEmpty) {
      totalStats.totalPageViews = parseInt(totalStatsResponse.rows[0].metricValues[3].value) || 0;
      totalStats.totalSessions = parseInt(totalStatsResponse.rows[0].metricValues[2].value) || 0;
      totalStats.bounceRate = (parseFloat(totalStatsResponse.rows[0].metricValues[4].value) * 100).toFixed(1) || '0.0';
      totalStats.avgSessionDuration = formatSessionDuration(parseFloat(totalStatsResponse.rows[0].metricValues[5].value) || 0);
      totalStats.newUsers = parseInt(totalStatsResponse.rows[0].metricValues[1].value) || 0;
      totalStats.returningUsers = parseInt(totalStatsResponse.rows[0].metricValues[0].value) - parseInt(totalStatsResponse.rows[0].metricValues[1].value) || 0;
    } else {
      warnings.push('Không có dữ liệu tổng quan cho khoảng thời gian hiện tại.');
    }

    // Xử lý dữ liệu tổng quan tháng trước và tính % thay đổi
    if (!prevTotalStatsResponse.isEmpty) {
      totalStats.percentChange = {
        totalPageViews: calculatePercentChange(
          totalStats.totalPageViews,
          parseInt(prevTotalStatsResponse.rows[0].metricValues[3].value) || 0
        ),
        totalSessions: calculatePercentChange(
          totalStats.totalSessions,
          parseInt(prevTotalStatsResponse.rows[0].metricValues[2].value) || 0
        ),
        bounceRate: calculatePercentChange(
          parseFloat(totalStats.bounceRate) || 0,
          parseFloat(prevTotalStatsResponse.rows[0].metricValues[4].value) * 100 || 0
        ),
        avgSessionDuration: calculatePercentChange(
          parseFloat(totalStatsResponse.rows[0]?.metricValues[5].value) || 0,
          parseFloat(prevTotalStatsResponse.rows[0].metricValues[5].value) || 0
        ),
        newUsers: calculatePercentChange(
          totalStats.newUsers,
          parseInt(prevTotalStatsResponse.rows[0].metricValues[1].value) || 0
        ),
        returningUsers: calculatePercentChange(
          totalStats.returningUsers,
          parseInt(prevTotalStatsResponse.rows[0].metricValues[0].value) - parseInt(prevTotalStatsResponse.rows[0].metricValues[1].value) || 0
        ),
      };
    } else {
      warnings.push('Không có dữ liệu tổng quan cho tháng trước để so sánh.');
    }

    // Xử lý dữ liệu lượt xem trang
    const pageViews = pageViewsResponse.isEmpty
      ? []
      : pageViewsResponse.rows.map(row => ({
          date: row.dimensionValues[0].value,
          views: parseInt(row.metricValues[0].value) || 0,
          sessions: parseInt(row.metricValues[1].value) || 0,
        }));

    if (pageViewsResponse.isEmpty) {
      warnings.push('Không có dữ liệu lượt xem trang theo ngày.');
    }

    // Xử lý dữ liệu loại thiết bị
    const totalUsers = totalStatsResponse.isEmpty ? 1 : parseInt(totalStatsResponse.rows[0].metricValues[0].value) || 1;
    const deviceTypes = deviceTypesResponse.isEmpty
      ? []
      : deviceTypesResponse.rows.map(row => {
          const device = row.dimensionValues[0].value;
          return {
            name: device.charAt(0).toUpperCase() + device.slice(1),
            value: (parseInt(row.metricValues[0].value) / totalUsers * 100).toFixed(1),
            color: device === 'desktop' ? '#3b82f6' : device === 'mobile' ? '#ef4444' : '#f59e0b',
          };
        });

    if (deviceTypesResponse.isEmpty) {
      warnings.push('Không có dữ liệu loại thiết bị.');
    }

    // Xử lý dữ liệu trang hàng đầu
    const topPages = topPagesResponse.isEmpty
      ? []
      : topPagesResponse.rows.map(row => ({
          page: row.dimensionValues[0].value,
          views: parseInt(row.metricValues[0].value) || 0,
          percentage: ((parseInt(row.metricValues[0].value) / (totalStats.totalPageViews || 1)) * 100).toFixed(1),
        }));

    if (topPagesResponse.isEmpty) {
      warnings.push('Không có dữ liệu trang hàng đầu.');
    }

    // Trả về dữ liệu với cảnh báo (nếu có)
    res.json({
      totalStats,
      pageViews,
      deviceTypes,
      topPages,
      warnings: warnings.length > 0 ? warnings : undefined,
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu GA4:', error.message);
    res.status(500).json({ error: `Không thể lấy dữ liệu phân tích: ${error.message}` });
  }
};

/**
 * Controller để xóa bộ nhớ đệm
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */
const clearCache = async (req, res) => {
  try {
    cache.flushAll();
    res.json({ message: 'Đã xóa bộ nhớ đệm thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa bộ nhớ đệm:', error.message);
    res.status(500).json({ error: 'Không thể xóa bộ nhớ đệm' });
  }
};

module.exports = { getAnalyticsData, clearCache };