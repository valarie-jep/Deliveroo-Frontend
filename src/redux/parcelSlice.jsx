import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { notify } from '../utils/toast';
import emailService from '../services/emailService';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const getAuthHeaders = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

const getErrMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

/* ===================== THUNKS ===================== */

export const getParcels = createAsyncThunk(
  'parcels/getParcels',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/parcels?per_page=100`,
        getAuthHeaders(thunkAPI)
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrMessage(error, 'Failed to load parcels'));
    }
  }
);

export const createParcel = createAsyncThunk(
  'parcels/createParcel',
  async (parcelData, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/parcels`,
        parcelData,
        getAuthHeaders(thunkAPI)
      );
      const createdParcel = res.data;

      // Non-blocking email notification
      try {
        const user = thunkAPI.getState().auth.user;
        if (user && user.email) {
          await emailService.sendParcelCreatedEmail(createdParcel, user.email);
        }
      } catch (emailErr) {
        // Don't block the main flow
        console.error('Failed to send parcel created email:', emailErr);
      }

      return createdParcel;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrMessage(error, 'Failed to create parcel'));
    }
  }
);

export const updateParcelDestination = createAsyncThunk(
  'parcels/updateParcelDestination',
  // Accept either { parcelId, newDestination } or { id, newDestination }
  async (payload, thunkAPI) => {
    const { parcelId, id, newDestination } = payload || {};
    const pid = parcelId ?? id;
    try {
      const res = await axios.patch(
        `${BASE_URL}/parcels/${pid}/destination`,
        { destination_location_text: newDestination }, // <-- aligned with backend
        getAuthHeaders(thunkAPI)
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrMessage(error, 'Failed to update destination'));
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

      // Non-blocking email notification
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
      return thunkAPI.rejectWithValue(getErrMessage(error, 'Failed to cancel parcel'));
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

      // Non-blocking email notifications
      try {
        const state = thunkAPI.getState();
        const user = state.auth.user;
        if (user && user.email) {
          const oldStatus = state.parcels.list.find((p) => p.id === parcelId)?.status;
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
      return thunkAPI.rejectWithValue(getErrMessage(error, 'Failed to update status'));
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

      // Non-blocking email notification
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
      return thunkAPI.rejectWithValue(getErrMessage(error, 'Failed to update location'));
    }
  }
);

// Admin endpoint (kept as-is)
export const getParcelById = createAsyncThunk(
  'parcels/getParcelById',
  async (parcelId, thunkAPI) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/parcels/${parcelId}`,
        getAuthHeaders(thunkAPI)
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrMessage(error, 'Failed to fetch parcel details'));
    }
  }
);

/* ===================== SLICE ===================== */

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
      });
  },
});

export default parcelSlice.reducer;
