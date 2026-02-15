import api from './api';

const authService = {
  // Login
  login: async (credentials) => {
    try {
      // Expected payload: { username, password }
      const response = await api.post('/auth/login', credentials);
      
      // Expected response: { success: true, token: '...', user: { ... } }
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optional: Call logout endpoint if needed
    // return api.post('/auth/logout'); 
  },

  // Get Current User (from Local Storage)
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Get Profile (Refresh user data from server)
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile'); // Adjust endpoint based on backend
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default authService;
