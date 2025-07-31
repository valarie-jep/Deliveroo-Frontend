import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { notify } from '../utils/toast';
import emailService from '../services/emailService';

const BASE_URL = process.env.REACT_APP_API_URL || '';

const getAuthHeaders = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  console.log('Auth token:', token ? 'Present' : 'Missing');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getParcels = createAsyncThunk(
  'parcels/getParcels',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/parcels`, getAuthHeaders(thunkAPI));
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load parcels';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createParcel = createAsyncThunk(
  'parcels/createParcel',
  async (parcelData, thunkAPI) => {
    try {
      console.log('Making API request to create parcel:', {
        url: `${BASE_URL}/parcels`,
        data: parcelData,
        headers: getAuthHeaders(thunkAPI)
      });
      
      const res = await axios.post(`${BASE_URL}/parcels`, parcelData, getAuthHeaders(thunkAPI));
      const createdParcel = res.data;

      // non-blocking email notification
      try {
        const user = thunkAPI.getState().auth.user;
        if (user && user.email) {
          await emailService.sendParcelCreatedEmail(createdParcel, user.email);
        }
      } catch (emailErr) {
        console.error('Failed to send parcel created email:', emailErr);
      }

      return createdParcel;
    } catch (error) {
      console.error('Parcel creation error:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
        config: {
          url: error?.config?.url,
          method: error?.config?.method,
          headers: error?.config?.headers
        }
      });
      
      // Try to get more detailed error information
      let errorMessage = 'Failed to create parcel';
      if (error?.response?.status === 500) {
        errorMessage = 'Backend server error. Please try again later or contact support.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const updateParcelDestination = createAsyncThunk(
  'parcels/updateParcelDestination',
  async ({ parcelId, newDestination }, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/parcels/${parcelId}/destination`,
        { destination: newDestination },
        getAuthHeaders(thunkAPI)
      );
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update destination';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cancelParcel = createAsyncThunk(
  'parcels/cancelParcel',
  async (parcelId, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/parcels/${parcelId}/cancel`,
        {},
        getAuthHeaders(thunkAPI)
      );
      const cancelledParcel = res.data;

      // non-blocking email notification
      try {
        const user = thunkAPI.getState().auth.user;
        if (user && user.email) {
          await emailService.sendCancellationEmail(cancelledParcel, user.email);
        }
      } catch (emailErr) {
        console.error('Failed to send cancellation email:', emailErr);
      }

      return cancelledParcel;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to cancel parcel';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateParcelStatus = createAsyncThunk(
  'parcels/updateParcelStatus',
  async ({ parcelId, status }, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/parcels/${parcelId}/status`,
        { status },
        getAuthHeaders(thunkAPI)
      );
      const updatedParcel = res.data;

      // non-blocking email notifications
      try {
        const state = thunkAPI.getState();
        const user = state.auth.user;
        if (user && user.email) {
          const oldStatus = state.parcels.list.find(p => p.id === parcelId)?.status;
          await emailService.sendStatusUpdateEmail(parcelId, user.email, oldStatus, status);

          if (status === 'delivered') {
            await emailService.sendDeliveryConfirmationEmail(updatedParcel, user.email);
          }
        }
      } catch (emailErr) {
        console.error('Failed to send status update email:', emailErr);
      }

      return updatedParcel;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update status';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateParcelLocation = createAsyncThunk(
  'parcels/updateParcelLocation',
  async ({ parcelId, location }, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/parcels/${parcelId}/location`,
        { current_location: location },
        getAuthHeaders(thunkAPI)
      );
      const updatedParcel = res.data;

      // non-blocking email notification
      try {
        const user = thunkAPI.getState().auth.user;
        if (user && user.email) {
          await emailService.sendLocationUpdateEmail(updatedParcel, user.email, location);
        }
      } catch (emailErr) {
        console.error('Failed to send location update email:', emailErr);
      }

      return updatedParcel;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update location';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch a single parcel by ID
export const getParcelById = createAsyncThunk(
  'parcels/getParcelById',
  async (parcelId, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/parcels/${parcelId}`, getAuthHeaders(thunkAPI));
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch parcel details';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Track parcel by ID (using existing parcels endpoint)
export const trackParcel = createAsyncThunk(
  'parcels/trackParcel',
  async (parcelId, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/parcels`, getAuthHeaders(thunkAPI));
      const parcels = res.data;
      const parcel = parcels.find(p => p.id === parseInt(parcelId));
      
      if (!parcel) {
        throw new Error('Parcel not found');
      }
      
      return parcel;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to track parcel';
      return thunkAPI.rejectWithValue(message);
    }
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
      // GET PARCELS
      .addCase(getParcels.pending, (state) => {
        state.loading = true;
        state.error = null;
        notify.once('get-parcels', 'Loading parcels…', 'info');
      })
      .addCase(getParcels.fulfilled, (state, action) => {
        state.list = action.payload?.parcels || [];
        state.loading = false;
        // Keep success silent to avoid noise; users will see content update.
      })
      .addCase(getParcels.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Failed to load parcels';
        state.loading = false;
        notify.error(state.error);
      })

      // CREATE PARCEL
      .addCase(createParcel.pending, (state) => {
        state.error = null;
        notify.once('create-parcel', 'Creating parcel…', 'info');
      })
      .addCase(createParcel.fulfilled, (state, action) => {
        state.list.push(action.payload);
        notify.success('Parcel created successfully.');
      })
      .addCase(createParcel.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Failed to create parcel';
        notify.error(state.error);
      })

      // UPDATE DESTINATION
      .addCase(updateParcelDestination.pending, (state) => {
        state.error = null;
        notify.once('update-destination', 'Updating destination…', 'info');
      })
      .addCase(updateParcelDestination.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((p) => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
        notify.success('Destination updated.');
      })
      .addCase(updateParcelDestination.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Failed to update destination';
        notify.error(state.error);
      })

      // CANCEL PARCEL
      .addCase(cancelParcel.pending, (state) => {
        state.error = null;
        notify.once('cancel-parcel', 'Cancelling parcel…', 'info');
      })
      .addCase(cancelParcel.fulfilled, (state, action) => {
        const cancelled = action.payload;
        const index = state.list.findIndex((p) => p.id === cancelled.id);
        if (index !== -1) state.list[index] = cancelled;
        notify.success('Parcel cancelled.');
      })
      .addCase(cancelParcel.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Failed to cancel parcel';
        notify.error(state.error);
      })

      // UPDATE STATUS
      .addCase(updateParcelStatus.pending, (state) => {
        state.error = null;
        notify.once('update-status', 'Updating status…', 'info');
      })
      .addCase(updateParcelStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((p) => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
        notify.success('Status updated.');
      })
      .addCase(updateParcelStatus.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Failed to update status';
        notify.error(state.error);
      })

      // UPDATE LOCATION
      .addCase(updateParcelLocation.pending, (state) => {
        state.error = null;
        notify.once('update-location', 'Updating location…', 'info');
      })
      .addCase(updateParcelLocation.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((p) => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
        notify.success('Location updated.');
      })
      .addCase(updateParcelLocation.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Failed to update location';
        notify.error(state.error);
      })

      // GET PARCEL BY ID
      .addCase(getParcelById.pending, (state) => {
        state.error = null;
        notify.once('get-parcel-by-id', 'Fetching parcel details…', 'info');
      })
      .addCase(getParcelById.fulfilled, (state, action) => {
        const parcel = action.payload;
        const index = state.list.findIndex((p) => p.id === parcel.id);
        if (index === -1) {
          state.list.push(parcel);
        } else {
          state.list[index] = parcel;
        }
      })
      .addCase(getParcelById.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Failed to fetch parcel details';
        notify.error(state.error);
      })

      // TRACK PARCEL
      .addCase(trackParcel.pending, (state) => {
        state.error = null;
        notify.once('track-parcel', 'Tracking parcel…', 'info');
      })
      .addCase(trackParcel.fulfilled, (state, action) => {
        const parcel = action.payload;
        const index = state.list.findIndex((p) => p.id === parcel.id);
        if (index === -1) {
          state.list.push(parcel);
        } else {
          state.list[index] = parcel;
        }
      })
      .addCase(trackParcel.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Failed to track parcel';
        notify.error(state.error);
      });
  },
});

export default parcelSlice.reducer;


