// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import parcelReducer from './parcelSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    parcels: parcelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // In case we store non-serializable objects like Date
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
