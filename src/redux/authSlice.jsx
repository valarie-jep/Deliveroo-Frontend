import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { notify } from '../utils/toast';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const tokenFromStorage = localStorage.getItem('token');
const userFromStorage = localStorage.getItem('user');

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, formData);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      // IMPORTANT: backend route is /signup (not /register)
      const response = await axios.post(`${BASE_URL}/signup`, formData);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Signup failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: tokenFromStorage || null,
    role: userFromStorage ? (JSON.parse(userFromStorage).admin ? 'admin' : 'user') : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      notify.info('You have been signed out.');
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        notify.once('login-pending', 'Signing you in…', 'info');
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, access_token } = action.payload;
        state.loading = false;
        state.user = user;
        state.token = access_token;
        state.role = user?.admin ? 'admin' : 'user';
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        notify.success(`Welcome back, ${user?.first_name || user?.firstName || user?.username || 'user'}!`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        notify.error(state.error);
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        notify.once('register-pending', 'Creating your account…', 'info');
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        notify.success('Signup successful. You can now log in.');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
        notify.error(state.error);
      });
  },
});

export const { logout } = authSlice.actions;
export const selectIsAuthenticated = (state) => !!state.auth.token;

export default authSlice.reducer;


