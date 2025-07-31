import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../config/api';

// Async thunks
export const fetchParcels = createAsyncThunk(
  'parcels/fetchParcels',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/parcels`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch parcels');
    }
  }
);

export const createParcel = createAsyncThunk(
  'parcels/createParcel',
  async (parcelData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/parcels`, parcelData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create parcel');
    }
  }
);

export const updateParcel = createAsyncThunk(
  'parcels/updateParcel',
  async ({ id, parcelData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/parcels/${id}`, parcelData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update parcel');
    }
  }
);

export const deleteParcel = createAsyncThunk(
  'parcels/deleteParcel',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/parcels/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete parcel');
    }
  }
);

export const cancelParcel = createAsyncThunk(
  'parcels/cancelParcel',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/parcels/${id}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel parcel');
    }
  }
);

export const updateParcelDestination = createAsyncThunk(
  'parcels/updateParcelDestination',
  async ({ id, newDestination }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BASE_URL}/parcels/${id}`, {
        destination_location_text: newDestination
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update parcel destination');
    }
  }
);

const parcelSlice = createSlice({
  name: 'parcels',
  initialState: {
    parcels: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    // New action to update parcel status (for demo mode)
    updateParcelStatus: (state, action) => {
      const { parcelId, status, current_location, estimated_delivery, last_updated, progress, map_position } = action.payload;
      
      // Ensure state.parcels is an array
      if (!Array.isArray(state.parcels)) {
        state.parcels = [];
      }
      
      const parcelIndex = state.parcels.findIndex(p => p.id === parcelId);
      
      if (parcelIndex !== -1) {
        state.parcels[parcelIndex] = {
          ...state.parcels[parcelIndex],
          status,
          current_location,
          estimated_delivery,
          last_updated,
          progress,
          map_position
        };
        console.log(`✅ Updated parcel ${parcelId} status to ${status} in Redux store`);
      } else {
        console.warn(`⚠️ Parcel ${parcelId} not found in Redux store`);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch parcels
      .addCase(fetchParcels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParcels.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure we always set an array
        state.parcels = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create parcel
      .addCase(createParcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParcel.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure state.parcels is an array
        if (!Array.isArray(state.parcels)) {
          state.parcels = [];
        }
        state.parcels.push(action.payload);
        state.success = 'Parcel created successfully';
      })
      .addCase(createParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update parcel
      .addCase(updateParcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParcel.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure state.parcels is an array
        if (!Array.isArray(state.parcels)) {
          state.parcels = [];
        }
        const index = state.parcels.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.parcels[index] = action.payload;
        }
        state.success = 'Parcel updated successfully';
      })
      .addCase(updateParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete parcel
      .addCase(deleteParcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteParcel.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure state.parcels is an array
        if (!Array.isArray(state.parcels)) {
          state.parcels = [];
        }
        state.parcels = state.parcels.filter(p => p.id !== action.payload);
        state.success = 'Parcel deleted successfully';
      })
      .addCase(deleteParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel parcel
      .addCase(cancelParcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelParcel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.parcels.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.parcels[index] = action.payload;
        }
        state.success = 'Parcel cancelled successfully';
      })
      .addCase(cancelParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, updateParcelStatus } = parcelSlice.actions;
export default parcelSlice.reducer;


