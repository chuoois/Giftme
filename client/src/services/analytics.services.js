import api from '@/lib/axios';

const getAnalyticsData = async (filters = {}) => {
  try {
    const { startDate = '30daysAgo', endDate = 'today', pageViewsDays = '7daysAgo' } = filters;
    const response = await api.get('/analytics', {
      params: { startDate, endDate, pageViewsDays },
    });
    const { data } = response;

    // Kiểm tra warnings từ backend
    if (data.warnings) {
      console.warn('Cảnh báo từ backend:', data.warnings);
      // Có thể hiển thị thông báo trên UI, ví dụ: toast.warning(data.warnings.join(', '))
    }

    return data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phân tích:', error.message);
    throw new Error(error.response?.data?.error || 'Không thể lấy dữ liệu phân tích');
  }
};

const refreshData = async (filters = {}) => {
  try {
    // Gọi endpoint clear-cache
    await api.get('/analytics/clear-cache');

    // Gọi lại getAnalyticsData để lấy dữ liệu mới
    const newData = await getAnalyticsData(filters);
    console.log('Dữ liệu đã được làm mới thành công');
    return newData;
  } catch (error) {
    console.error('Lỗi khi làm mới dữ liệu:', error.message);
    throw new Error(error.response?.data?.error || 'Không thể làm mới dữ liệu');
  }
};

export const analyticsService = {
  getAnalyticsData,
  refreshData,
};