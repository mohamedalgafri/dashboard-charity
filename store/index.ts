// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import donationsReducer from './slices/donationsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    donations: donationsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // لتجنب مشاكل مع البيانات غير القابلة للتسلسل
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;