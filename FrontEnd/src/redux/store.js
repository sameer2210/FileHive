// // src/redux/store.js
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice.js';
// import folderReducer from '../features/folders/folderSlice.js';
// import imageReducer from '../features/images/imageSlice.js';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     folders: folderReducer,
//     images: imageReducer,
//   },
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST'],
//       },
//     }),
// });




// src/redux/store.js
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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;