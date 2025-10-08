import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService.js';

// ===== Async Thunks =====
export const signupUser = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await authService.signup(userData);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Signup failed';
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    return {};
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Logout failed';
    return rejectWithValue(message);
  }
});

export const sendOtp = createAsyncThunk(
  'otp/send',
  async ({ email, name }, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtp({ email, name });
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send OTP';
      return rejectWithValue(message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'otp/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(email, otp);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'OTP verification failed';
      return rejectWithValue(message);
    }
  }
);

// Helper function to get initial state from localStorage
const getStoredAuthState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    return {
      token: token || null,
      user: user ? JSON.parse(user) : null,
    };
  } catch (error) {
    // Clear corrupted data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      token: null,
      user: null,
    };
  }
};

// ===== Initial State =====
const storedAuth = getStoredAuthState();

const initialState = {
  user: storedAuth.user,
  token: storedAuth.token,
  isLoading: false,
  error: null,
  isAuthenticated: !!storedAuth.token,
  otpStatus: 'idle',
  otpError: null,
  isVerified: false,
};

// ===== Auth Slice =====
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error messages
    clearError: state => {
      state.error = null;
    },

    // Reset auth state
    resetAuth: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },

    // Manual logout (without API call)
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    // Update user profile
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    resetOtp: state => {
      (state.otpStatus = 'idle'), (state.otpError = null);
    },
  },

  extraReducers: builder => {
    builder
      // ===== Signup Cases =====
      .addCase(signupUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // Store in localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ===== Login Cases =====
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // Store in localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ===== Logout Cases =====
      .addCase(logoutUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;

        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        // Still logout even if API call fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        // Clear localStorage (FIXED: was removeUser → removeItem)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(sendOtp.pending, state => {
        state.otpStatus = 'loading';
      })
      .addCase(sendOtp.fulfilled, state => {
        state.otpStatus = 'succeeded';
        state.otpError = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.otpError = action.payload;
      })
      .addCase(verifyOtp.pending, state => {
        state.otpStatus = 'loading';
      })
      .addCase(verifyOtp.fulfilled, state => {
        state.otpStatus = 'succeeded';
        state.isVerified = true;
        state.otpError = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.otpError = action.payload;
      });
  },
});

// Export actions
export const { resetOtp, clearError, resetAuth, logout, updateUserProfile } = authSlice.actions;

// Export selectors
export const selectCurrentUser = state => state.auth.user;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthLoading = state => state.auth.isLoading;
export const selectAuthError = state => state.auth.error;

export default authSlice.reducer;
