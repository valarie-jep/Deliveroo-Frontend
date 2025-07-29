import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createParcel } from '../redux/parcelSlice';
import LocationAutocomplete from './LocationAutocomplete';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const navigate=useNavigate();

  const validateInputs = () => {
    const phoneRegex = /^\d{10,15}$/; // Adjust as needed
    const nameRegex = /^[a-zA-Z\s.'-]{2,}$/;

    if (!pickup || !destination || !senderName || !senderPhone || !recipientName || !recipientPhone) {
      return "All fields are required.";
    }

    if (!nameRegex.test(senderName)) {
      return "Sender name must be at least 2 characters and contain only letters.";
    }

    if (!phoneRegex.test(senderPhone)) {
      return "Sender phone must be a valid number (10-15 digits).";
    }

    if (!nameRegex.test(recipientName)) {
      return "Recipient name must be at least 2 characters and contain only letters.";
    }

    if (!phoneRegex.test(recipientPhone)) {
      return "Recipient phone must be a valid number (10-15 digits).";
    }

    return null; // valid
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (setSuccess) setSuccess(null);
    setError(null);

    if (!user || !user.id) {
      setError('User not found. Please log in again.');
      return;
    }

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const parcelData = {
      user_id: user.id,
      pickup_location_text: pickup,
      destination_location_text: destination,
      weight: weight ? Number(weight) : undefined,
      description,
      sender_name: senderName,
      sender_phone_number: senderPhone,
      recipient_name: recipientName,
      recipient_phone_number: recipientPhone,
    };

    try {
      await dispatch(createParcel(parcelData)).unwrap();
      if (setSuccess) setSuccess('Parcel created successfully!');
      toast.success("Parcel created successfully!");

      
      setTimeout(() => navigate('/parcels'), 300);
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
      <form  className="space-y-4">
        <p className="text-xs text-gray-500 mt-1">
            All fields are Required*
          </p>
        <div>
          <label className="block font-medium mb-1">Pickup Location</label>
          <LocationAutocomplete
            value={pickup}
            onChange={setPickup}
            placeholder="Start typing to search locations..."
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Type to see suggestions from Google Maps
          </p>
        </div>
        <div>
          <label className="block font-medium mb-1">Destination</label>
          <LocationAutocomplete
            value={destination}
            onChange={setDestination}
            placeholder="Start typing to search locations..."
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Type to see suggestions from Google Maps
          </p>
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
        <button type="button"  
        onClick={handleSubmit} disabled={loading} className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition">
          {loading ? 'Creating...' : 'Create Parcel'}
        </button>

        <button 
            onClick={() => navigate('/parcels')} 
            className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Back to My Parcels
          </button>
        {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default ParcelForm; 