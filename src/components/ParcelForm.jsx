import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createParcel } from '../redux/parcelSlice';

const ParcelForm = ({ setSuccess }) => {
  const dispatch = useDispatch();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [error, setError] = useState(null);
  const loading = useSelector((state) => state.parcels.loading);
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setSuccess) setSuccess(null);
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
    if (description) parcelData.description = description;
    if (senderName) parcelData.sender_name = senderName;
    if (senderPhone) parcelData.sender_phone_number = senderPhone;
    if (recipientName) parcelData.recipient_name = recipientName;
    if (recipientPhone) parcelData.recipient_phone_number = recipientPhone;
    try {
      await dispatch(createParcel(parcelData)).unwrap();
      if (setSuccess) setSuccess('Parcel created successfully!');
      setPickup('');
      setDestination('');
      setWeight('');
      setDescription('');
      setSenderName('');
      setSenderPhone('');
      setRecipientName('');
      setRecipientPhone('');
    } catch (err) {
      setError(err?.message || err?.error || 'Failed to create parcel.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Pickup Location</label>
          <input type="text" value={pickup} onChange={e => setPickup(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Destination</label>
          <input type="text" value={destination} onChange={e => setDestination(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} min="0.1" step="0.1" className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Sender Name</label>
            <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Sender Phone Number</label>
            <input type="text" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Recipient Name</label>
            <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Recipient Phone Number</label>
            <input type="text" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition">
          {loading ? 'Creating...' : 'Create Parcel'}
        </button>
        {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default ParcelForm; 