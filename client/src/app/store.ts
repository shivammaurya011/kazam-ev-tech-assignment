import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/tasks/tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      devTools: true
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;