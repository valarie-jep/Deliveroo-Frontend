import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createParcel } from '../redux/parcelSlice';

const ParcelForm = () => {
  const dispatch = useDispatch();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const loading = useSelector((state) => state.parcels.loading);
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (!user || !user.id) {
      setError('User not found. Please log in again.');
      return;
    }
    const parcelData = {
      user_id: user.id,
      pickup_location_text: pickup,
      destination_location_text: destination,
    };
    if (weight) parcelData.weight = Number(weight);
    try {
      await dispatch(createParcel(parcelData)).unwrap();
      setSuccess('Parcel created successfully!');
      setPickup('');
      setDestination('');
      setWeight('');
    } catch (err) {
      setError(err?.message || err?.error || 'Failed to create parcel.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Create New Parcel</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Pickup Location</label>
          <input
            type="text"
            value={pickup}
            onChange={e => setPickup(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            min="0.1"
            step="0.1"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Creating...' : 'Create Parcel'}
        </button>
        {success && <div style={{ color: 'green', marginTop: 12 }}>{success}</div>}
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
};

export default ParcelForm; 