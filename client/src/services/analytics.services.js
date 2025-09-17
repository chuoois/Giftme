import api from '@/lib/axios';

const getAnalyticsData = async () => {
  try {
    const response = await api.get('/analytics');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phân tích:', error);
    throw error; 
  }
};

export const analyticsService = {
  getAnalyticsData,
};