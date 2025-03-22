import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../shared/api/authApi';
import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    { username, email, password }: RegisterCredentials,
    { rejectWithValue },
  ) => {
    try {
      const response = await authApi.register(username, email, password);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.detail || 'Ошибка регистрации',
        );
      }

      return rejectWithValue('Ошибка регистрации');
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { email, password, rememberMe }: LoginCredentials,
    { rejectWithValue },
  ) => {
    try {
      const response = await authApi.login(email, password);

      if (rememberMe) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', response.data.user_name);
      } else {
        sessionStorage.setItem('token', response.data.access_token);
        sessionStorage.setItem('username', response.data.user_name);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.detail || 'Ошибка входа');
      }

      return rejectWithValue('Ошибка входа');
    }
  },
);
