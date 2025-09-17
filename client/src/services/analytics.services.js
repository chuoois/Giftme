import api from '@/lib/axios';

const getToken = localStorage.getItem("admin-user");

const getAnalyticsData = async () => {
  try {
    const response = await api.get('/analytics', {
      headers: { Authorization: `Bearer ${getToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phân tích:', error);
    throw error; 
  }
};

export const analyticsService = {
  getAnalyticsData,
};