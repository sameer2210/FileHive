// src/services/authService.js
import axiosInstance from '../utils/axiosInstance.js';

const API_ENDPOINTS = {
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  REFRESH: '/auth/refresh-token',
};

class AuthService {
  // User signup
  async signup(userData) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SIGNUP, userData);

      // Backend returns _id, name, email, token directly (no success wrapper)
      const { _id, name, email, token } = response.data;

      if (token) {
        return {
          user: { _id, name, email },
          token: token,
        };
      }

      throw new Error('Signup failed - no token received');
    } catch (error) {
      this.handleError(error, 'Signup failed');
    }
  }

  // User login
  async login(credentials) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);

      // Backend returns _id, name, email, token directly (no success wrapper)
      const { _id, name, email, token } = response.data;

      if (token) {
        // Set the auth token for future requests
        this.setAuthToken(token);

        return {
          user: { _id, name, email }, // Build user object
          token: token,
        };
      }

      throw new Error('Login failed - no token received');
    } catch (error) {
      this.handleError(error, 'Login failed');
    }
  }

  // User logout
  async logout() {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);

      // Clear auth token
      this.clearAuthToken();

      return response.data;
    } catch (error) {
      // Even if logout fails on server, clear local data
      this.clearAuthToken();
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);

      if (response.data.success) {
        return response.data.user;
      }

      throw new Error(response.data.message || 'Failed to fetch profile');
    } catch (error) {
      this.handleError(error, 'Failed to fetch profile');
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.PROFILE, profileData);

      if (response.data.success) {
        return response.data.user;
      }

      throw new Error(response.data.message || 'Failed to update profile');
    } catch (error) {
      this.handleError(error, 'Failed to update profile');
    }
  }

  // Refresh authentication token
  async refreshToken() {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REFRESH);

      if (response.data.success) {
        this.setAuthToken(response.data.token);
        return response.data.token;
      }

      throw new Error(response.data.message || 'Token refresh failed');
    } catch (error) {
      this.clearAuthToken();
      this.handleError(error, 'Token refresh failed');
    }
  }

  // Verify if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Get current token
  getCurrentToken() {
    return localStorage.getItem('token');
  }

  // Set authentication token in axios headers
  setAuthToken(token) {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      this.clearAuthToken();
    }
  }

  // Clear authentication token
  clearAuthToken() {
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Initialize auth token from localStorage
  initializeAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setAuthToken(token);
    }
  }

  // Handle API errors
  handleError(error, defaultMessage) {
    let errorMessage = defaultMessage;

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data
      this.clearAuthToken();
      errorMessage = 'Session expired. Please login again.';
    } else if (error.response?.status === 403) {
      errorMessage = "Access denied. You don't have permission to perform this action.";
    } else if (error.response?.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.response?.status === 422) {
      errorMessage = 'Invalid data provided. Please check your inputs.';
    } else if (error.response?.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your internet connection.';
    }

    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.originalError = error;

    throw customError;
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
    };
  }
}

// Create and export a singleton instance
const authService = new AuthService();

// Initialize auth token when the service is imported
authService.initializeAuth();

export default authService;
