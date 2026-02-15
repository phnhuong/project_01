import api from './api';

const parentService = {
  getAll: async (params) => {
    try {
      const response = await api.get('/parents', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/parents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/parents', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/parents/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try{
      const response = await api.delete(`/parents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resetPassword: async (id, password) => {
    try {
      const response = await api.post(`/parents/${id}/password`, { password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getChildren: async (id) => {
    try {
      const response = await api.get(`/parents/${id}/children`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default parentService;
