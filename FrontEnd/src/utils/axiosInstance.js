// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add token and basic logging
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.DEV) {
      console.log(` ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: Basic error handling
axiosInstance.interceptors.response.use(
  response => {
    if (import.meta.env.DEV) {
      console.log(` ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  error => {
    if (import.meta.env.DEV) {
      console.error(` Error:`, error.response?.data || error.message);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Helpers
export const setAuthToken = token => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const clearAuth = () => setAuthToken(null);

export default axiosInstance;
