import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import habitReducer from './abitSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    habits: habitReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;