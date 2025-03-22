import type { RootState } from '../../app/store';

export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectToken = (state: RootState) => state.auth.token;
export const selectUsername = (state: RootState) => state.auth.username;
