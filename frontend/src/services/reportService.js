import api from './api';

const reportService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/reports/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getHierarchyData: async (params) => {
    try {
      const response = await api.get('/reports/hierarchy', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPerformanceReport: async (params) => {
    try {
      const response = await api.get('/reports/performance', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default reportService;
