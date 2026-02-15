import axios from 'axios';
import { toast } from 'react-toastify';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

// Create Axios Instance
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle 401 Unauthorized (Token expired or invalid)
    if (response && response.status === 401) {
      // Only redirect if not already on login page to avoid loops
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
    } else if (response && response.data && response.data.message) {
      // Handle generic API errors
      toast.error(response.data.message);
    } else {
      // Handle network errors
      toast.error('Something went wrong. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default api;
