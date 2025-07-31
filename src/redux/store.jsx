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
      serializableCheck: false,
    }),
});

export default store;
export { store };

