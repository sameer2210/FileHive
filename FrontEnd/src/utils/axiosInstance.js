// // src/utils/axiosInstance.js
// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor: Add token, full URL logging
// axiosInstance.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     if (import.meta.env.DEV) {
//       console.log(
//         ` ${config.method?.toUpperCase()} ${config.baseURL}${config.url} | Data:`,
//         config.data
//       ); // Full URL + request body for debugging
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// // Response interceptor: Enhanced error logging
// axiosInstance.interceptors.response.use(
//   response => {
//     if (import.meta.env.DEV) {
//       console.log(
//         ` ${response.config.method?.toUpperCase()} ${response.config.baseURL}${
//           response.config.url
//         } | Status: ${response.status} | Data:`,
//         response.data
//       );
//     }
//     return response;
//   },
//   error => {
//     if (import.meta.env.DEV) {
//       console.error(
//         ` Error on ${error.config?.method?.toUpperCase()} ${error.config?.baseURL}${
//           error.config?.url
//         }:`,
//         {
//           status: error.response?.status,
//           data: error.response?.data,
//           message: error.message,
//         }
//       );
//     }

//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // Helpers (unchanged)
// export const setAuthToken = token => {
//   if (token) {
//     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     localStorage.setItem('token', token);
//   } else {
//     delete axiosInstance.defaults.headers.common['Authorization'];
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }
// };

// export const clearAuth = () => setAuthToken(null);

// export default axiosInstance;




// src/utils/axiosInstance.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for JWT
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
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

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Return a formatted error
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({
      ...error,
      message: errorMessage,
      response: error.response
    });
  }
);

export default axiosInstance;