import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://deliveroo-server.onrender.com';

// Helper to get auth token
const getAuthHeaders = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ------------------ THUNKS ------------------

// Fetch all parcels (admin or user-specific, backend decides)
export const getParcels = createAsyncThunk(
  'parcels/getParcels',
  async (_, thunkAPI) => {
    const res = await axios.get(`${BASE_URL}/parcels`, getAuthHeaders(thunkAPI));
    return res.data;
  }
);

// Create a new parcel
export const createParcel = createAsyncThunk(
  'parcels/createParcel',
  async (parcelData, thunkAPI) => {
    const res = await axios.post(`${BASE_URL}/parcels`, parcelData, getAuthHeaders(thunkAPI));
    return res.data;
  }
);

// Update parcel destination (user)
export const updateParcelDestination = createAsyncThunk(
  'parcels/updateParcelDestination',
  async ({ parcelId, newDestination }, thunkAPI) => {
    const res = await axios.patch(
      `${BASE_URL}/parcels/${parcelId}/destination`,
      { destination: newDestination },
      getAuthHeaders(thunkAPI)
    );
    return res.data;
  }
);

// Cancel a parcel (user)
export const cancelParcel = createAsyncThunk(
  'parcels/cancelParcel',
  async (parcelId, thunkAPI) => {
    const res = await axios.patch(
      `${BASE_URL}/parcels/${parcelId}/cancel`,
      {},
      getAuthHeaders(thunkAPI)
    );
    return res.data;
  }
);

// Admin: update status
export const updateParcelStatus = createAsyncThunk(
  'parcels/updateParcelStatus',
  async ({ parcelId, status }, thunkAPI) => {
    const res = await axios.patch(
      `${BASE_URL}/parcels/${parcelId}/status`,
      { status },
      getAuthHeaders(thunkAPI)
    );
    return res.data;
  }
);

// Admin: update location
export const updateParcelLocation = createAsyncThunk(
  'parcels/updateParcelLocation',
  async ({ parcelId, location }, thunkAPI) => {
    const res = await axios.patch(
      `${BASE_URL}/parcels/${parcelId}/location`,
      { current_location: location },
      getAuthHeaders(thunkAPI)
    );
    return res.data;
  }
);

// ------------------ SLICE ------------------

const parcelSlice = createSlice({
  name: 'parcels',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getParcels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getParcels.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(getParcels.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // CREATE
      .addCase(createParcel.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE DESTINATION
      .addCase(updateParcelDestination.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex(p => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
      })

      // CANCEL
      .addCase(cancelParcel.fulfilled, (state, action) => {
        const cancelled = action.payload;
        const index = state.list.findIndex(p => p.id === cancelled.id);
        if (index !== -1) state.list[index] = cancelled;
      })

      // ADMIN STATUS UPDATE
      .addCase(updateParcelStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex(p => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
      })

      // ADMIN LOCATION UPDATE
      .addCase(updateParcelLocation.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex(p => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
      });
  }
});

export default parcelSlice.reducer;
