import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice.js';
import folderSlice from '../features/folders/folderSlice.js';
import imageSlice from '../features/images/imageSlice.js';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    folders: folderSlice,
    images: imageSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
