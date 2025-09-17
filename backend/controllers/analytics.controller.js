require('dotenv').config();
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Khởi tạo client GA4 với thông tin xác thực từ biến môi trường
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

// Controller để lấy dữ liệu phân tích GA4
const getAnalyticsData = async (req, res) => {
  try {
    // Lấy dữ liệu tổng quan (page views, sessions, bounce rate, avg session duration, new/returning users)
    const [totalStatsResponse] = await analyticsDataClient.runReport({
      property: `properties/505029153`, // Thay YOUR_PROPERTY_ID bằng ID thuộc tính GA4 của bạn
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    });

    // Lấy dữ liệu lượt xem trang theo ngày
    const [pageViewsResponse] = await analyticsDataClient.runReport({
      property: `properties/505029153`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'sessions' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    // Lấy dữ liệu loại thiết bị
    const [deviceTypesResponse] = await analyticsDataClient.runReport({
      property: `properties/505029153`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'totalUsers' }],
    });

    // Lấy dữ liệu trang hàng đầu
    const [topPagesResponse] = await analyticsDataClient.runReport({
      property: `properties/505029153`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5,
    });

    // Xử lý dữ liệu tổng quan
    const totalStats = {
      totalPageViews: parseInt(totalStatsResponse.rows[0].metricValues[3].value),
      totalSessions: parseInt(totalStatsResponse.rows[0].metricValues[2].value),
      bounceRate: (parseFloat(totalStatsResponse.rows[0].metricValues[4].value) * 100).toFixed(1),
      avgSessionDuration: new Date(parseFloat(totalStatsResponse.rows[0].metricValues[5].value) * 1000).toISOString().substr(14, 5),
      newUsers: parseInt(totalStatsResponse.rows[0].metricValues[1].value),
      returningUsers: parseInt(totalStatsResponse.rows[0].metricValues[0].value) - parseInt(totalStatsResponse.rows[0].metricValues[1].value),
    };

    // Xử lý dữ liệu lượt xem trang
    const pageViews = pageViewsResponse.rows.map(row => ({
      date: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
      sessions: parseInt(row.metricValues[1].value),
    }));

    // Xử lý dữ liệu loại thiết bị
    const totalUsers = parseInt(totalStatsResponse.rows[0].metricValues[0].value);
    const deviceTypes = deviceTypesResponse.rows.map(row => ({
      name: row.dimensionValues[0].value.charAt(0).toUpperCase() + row.dimensionValues[0].value.slice(1),
      value: (parseInt(row.metricValues[0].value) / totalUsers * 100).toFixed(1),
      color: row.dimensionValues[0].value === 'desktop' ? '#3b82f6' : row.dimensionValues[0].value === 'mobile' ? '#ef4444' : '#f59e0b',
    }));

    // Xử lý dữ liệu trang hàng đầu
    const totalPageViews = totalStats.totalPageViews;
    const topPages = topPagesResponse.rows.map(row => ({
      page: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
      percentage: ((parseInt(row.metricValues[0].value) / totalPageViews) * 100).toFixed(1),
    }));

    // Trả về dữ liệu
    res.json({
      totalStats,
      pageViews,
      deviceTypes,
      topPages,
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu GA4:', error);
    res.status(500).json({ error: 'Không thể lấy dữ liệu phân tích' });
  }
};

module.exports = { getAnalyticsData };