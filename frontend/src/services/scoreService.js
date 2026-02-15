import api from './api';

const scoreService = {
  // Get scores with filters (classId, studentId, subjectId)
  getScores: async (params) => {
    try {
      const response = await api.get('/scores', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new score
  create: async (data) => {
    try {
      const response = await api.post('/scores', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update score
  update: async (id, data) => {
    try {
      const response = await api.put(`/scores/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete score
  delete: async (id) => {
    try {
      const response = await api.delete(`/scores/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default scoreService;
