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
      });
  },
});

// Export actions
export const { clearError, resetAuth, logout, updateUserProfile } = authSlice.actions;

// Export selectors
export const selectCurrentUser = state => state.auth.user;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthLoading = state => state.auth.isLoading;
export const selectAuthError = state => state.auth.error;

// Export reducer
export default authSlice.reducer;
