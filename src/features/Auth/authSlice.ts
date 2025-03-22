import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './authThunks';

interface AuthState {
  token: string | null;
  username: string;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token:
    localStorage.getItem('token') || sessionStorage.getItem('token') || null,
  username:
    localStorage.getItem('username') ||
    sessionStorage.getItem('username') ||
    '',
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.token = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.username = action.payload.user_name;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Ошибка входа';
      })
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(
        registerUser.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error =
            typeof action.payload === 'string'
              ? action.payload
              : 'Ошибка регистрации';
        },
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
