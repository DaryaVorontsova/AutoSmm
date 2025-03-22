import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/authSlice';
import groupsReducer from '../features/Groups/groupsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
