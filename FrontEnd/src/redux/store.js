// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import folderReducer from '../features/folders/folderSlice.js';
import imageReducer from '../features/images/imageSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    folders: folderReducer,
    images: imageReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
