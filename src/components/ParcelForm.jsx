import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createParcel } from "../redux/parcelSlice";
import { LoadScript } from "@react-google-maps/api";
import LocationAutocomplete from "./LocationAutocomplete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Static libraries array to prevent LoadScript reloading
const GOOGLE_MAPS_LIBRARIES = ["places"];

const ParcelForm = ({ setSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destination, setDestination] = useState("");
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [error, setError] = useState(null);
  const loading = useSelector((state) => state.parcels.loading);
  const user = useSelector((state) => state.auth.user);

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const hasValidApiKey =
    googleMapsApiKey && googleMapsApiKey !== "your_google_maps_api_key_here";

  const validateInputs = useCallback(() => {
    const phoneRegex = /^\d{10,15}$/;
    const nameRegex = /^[a-zA-Z\s.'-]{2,}$/;

    if (
      !pickup ||
      !destination ||
      !senderName ||
      !senderPhone ||
      !recipientName ||
      !recipientPhone
    ) {
      return "All fields are required.";
    }

    if (!nameRegex.test(senderName)) {
      return "Sender name must be at least 2 characters and contain only letters, spaces, or basic punctuation.";
    }

    if (!phoneRegex.test(senderPhone)) {
      return "Sender phone must be a valid number (10-15 digits).";
    }

    if (!nameRegex.test(recipientName)) {
      return "Recipient name must be at least 2 characters and contain only letters, spaces, or basic punctuation.";
    }

    if (!phoneRegex.test(recipientPhone)) {
      return "Recipient phone must be a valid number (10-15 digits).";
    }

    if (weight && (isNaN(Number(weight)) || Number(weight) <= 0)) {
      return "Weight must be a positive number.";
    }

    if (pickup.length < 5) {
      return "Pickup location must be a valid address (at least 5 characters).";
    }

    if (destination.length < 5) {
      return "Destination must be a valid address (at least 5 characters).";
    }

    if (hasValidApiKey && !pickupCoords && pickup.length > 0) {
      return "Please select a valid pickup location from the suggestions.";
    }

    if (hasValidApiKey && !destinationCoords && destination.length > 0) {
      return "Please select a valid destination from the suggestions.";
    }

    return null;
  }, [
    pickup,
    pickupCoords,
    destination,
    destinationCoords,
    senderName,
    senderPhone,
    recipientName,
    recipientPhone,
    weight,
    hasValidApiKey,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('📝 Starting parcel creation...');
    console.log('📍 Pickup coordinates:', pickupCoords);
    console.log('🎯 Destination coordinates:', destinationCoords);
    console.log('📦 Form data:', {
      sender_name,
      recipient_name,
      description,
      weight,
      pickup_location_text,
      destination_location_text
    });

    try {
      const parcelData = {
        sender_name,
        recipient_name,
        description,
        pick_up_latitude: pickupCoords ? pickupCoords.lat : null,
        pick_up_longitude: pickupCoords ? pickupCoords.lng : null,
        destination_latitude: destinationCoords ? destinationCoords.lat : null,
        destination_longitude: destinationCoords ? destinationCoords.lng : null,
        weight: weight ? Number(weight) : undefined,
        pickup_location_text,
        destination_location_text,
      };

      console.log('📤 Submitting parcel data:', parcelData);

      const result = await dispatch(createParcel(parcelData)).unwrap();
      
      console.log('✅ Parcel created successfully:', result);
      console.log('🆔 New parcel ID:', result.id);

      if (setSuccess) setSuccess('Parcel created successfully!');
      
      // Reset form
      setSenderName('');
      setRecipientName('');
      setDescription('');
      setWeight('');
      setPickupLocationText('');
      setDestinationLocationText('');
      setPickupCoords(null);
      setDestinationCoords(null);
      
      // Navigate to tracking page
      navigate(`/tracking/${result.id}`, {
        state: { message: 'Parcel created successfully!' }
      });
      
    } catch (err) {
      console.error('❌ Parcel creation failed:', err);
      setError(err.message || 'Failed to create parcel');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={GOOGLE_MAPS_LIBRARIES}
      onError={() =>
        toast.error(
          "Failed to load Google Maps API. Please check your API key."
        )
      }
    >
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-gray-500 mt-1">All fields are Required*</p>
          <div>
            <label className="block font-medium mb-1">Pickup Location</label>
            <LocationAutocomplete
              value={pickup}
              onChange={setPickup}
              onLocationSelect={(place) => {
                console.log('Pickup location selected:', place);
                const coords = place.lat && place.lng
                  ? { lat: place.lat, lng: place.lng }
                  : null;
                console.log('Setting pickup coordinates:', coords);
                setPickupCoords(coords);
              }}
              placeholder="Start typing to search locations..."
              className="w-full border rounded px-3 py-2"
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
              onLocationSelect={(place) => {
                console.log('Destination location selected:', place);
                const coords = place.lat && place.lng
                  ? { lat: place.lat, lng: place.lng }
                  : null;
                console.log('Setting destination coordinates:', coords);
                setDestinationCoords(coords);
              }}
              placeholder="Start typing to search locations..."
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Type to see suggestions from Google Maps
            </p>
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0.1"
              step="0.1"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Sender Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Sender Phone Number
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Recipient Phone Number
              </label>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition disabled:bg-orange-300"
            >
              {loading ? "Creating..." : "Create Parcel"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/parcels")}
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Back to My Parcels
            </button>
          </div>
          {error && (
            <div className="text-red-600 mt-2 text-center">{error}</div>
          )}
        </form>
      </div>
    </LoadScript>
  );
};

export default ParcelForm;
