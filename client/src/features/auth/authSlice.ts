import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import { AuthState } from '../../types/user';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  initialized: false,
  loading: false,
  error: null,
};

// Login User
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await axiosInstance.post('/api/auth/logout');
});

// Check Auth Status (New)
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/auth/verify');
    return response.data.data;

  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Not authenticated");
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.initialized = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.initialized = true;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;