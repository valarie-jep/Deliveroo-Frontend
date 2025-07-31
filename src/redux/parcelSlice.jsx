import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://deliveroo-server.onrender.com';

const getAuthHeaders = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getParcels = createAsyncThunk(
  'parcels/getParcels',
  async (_, thunkAPI) => {
    const res = await axios.get(`${BASE_URL}/parcels?per_page=100`, getAuthHeaders(thunkAPI));
    return res.data;
  }
);

export const createParcel = createAsyncThunk(
  'parcels/createParcel',
  async (parcelData, thunkAPI) => {
    const res = await axios.post(`${BASE_URL}/parcels`, parcelData, getAuthHeaders(thunkAPI));
    return res.data;
  }
);

export const updateParcelDestination = createAsyncThunk(
  'parcels/updateParcelDestination',
  async ({ parcelId, newDestination }, thunkAPI) => {
    const res = await axios.patch(
      `${BASE_URL}/parcels/${parcelId}/destination`,
      { destination_location_text: newDestination },
      getAuthHeaders(thunkAPI)
    );
    return res.data;
  }
);

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

// Fetch a single parcel by ID
export const getParcelById = createAsyncThunk(
  'parcels/getParcelById',
  async (parcelId, thunkAPI) => {
    const res = await axios.get(`${BASE_URL}/admin/parcels/${parcelId}`, getAuthHeaders(thunkAPI));
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
      .addCase(getParcels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getParcels.fulfilled, (state, action) => {
        state.list = action.payload.parcels || [];
        state.loading = false;
      })
      .addCase(getParcels.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(createParcel.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(updateParcelDestination.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex(p => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
      })

      .addCase(cancelParcel.fulfilled, (state, action) => {
        const cancelled = action.payload;
        const index = state.list.findIndex(p => p.id === cancelled.id);
        if (index !== -1) state.list[index] = cancelled;
      })

      .addCase(updateParcelStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex(p => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
      })

      .addCase(updateParcelLocation.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex(p => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
      })

      .addCase(getParcelById.fulfilled, (state, action) => {
        const parcel = action.payload;
        const index = state.list.findIndex(p => p.id === parcel.id);
        if (index === -1) {
          state.list.push(parcel); 
        } else {
          state.list[index] = parcel; 
        }
      });
  }
});

export default parcelSlice.reducer;
