// components/DestinationModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { LoadScript } from "@react-google-maps/api"; // Make sure to import LoadScript
import LocationAutocomplete from "./LocationAutocomplete"; // Your custom autocomplete component

// Define the libraries needed for Google Maps Autocomplete
const libraries = ["places"];

const DestinationModal = ({ isOpen, onClose, onConfirm, currentDestination }) => {
  // State for the text input of the new destination
  const [destinationText, setDestinationText] = useState(currentDestination || '');
  // State for the coordinates of the selected destination
  const [destinationCoords, setDestinationCoords] = useState(null); // { lat: ..., lng: ... }
  const modalRef = useRef(null);

  // Effect to reset input when modal opens or currentDestination changes
  useEffect(() => {
    if (isOpen) {
      setDestinationText(currentDestination || '');
      // Reset coords when modal opens, unless you have existing coords to pass
      setDestinationCoords(null);
    }
  }, [isOpen, currentDestination]);

  // Effect to handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only confirm if destination text is not empty
    // You might want to also ensure destinationCoords is not null if coordinates are mandatory
    if (destinationText.trim()) {
      // Pass both text and coordinates to the parent's onConfirm function
      onConfirm({
        newDestinationText: destinationText,
        newDestinationCoords: destinationCoords
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    // Wrap the modal content with LoadScript to enable Google Maps services
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_Maps_API_KEY} // Make sure this env variable is set
      libraries={libraries}
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div ref={modalRef} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <h3 className="text-2xl font-bold text-orange-600 mb-4">Change Destination</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="destinationAutocomplete" className="block text-gray-700 text-sm font-bold mb-2">
                New Destination:
              </label>
              {/* Correctly bind LocationAutocomplete to local state */}
              <LocationAutocomplete
                value={destinationText}
                onChange={setDestinationText} // This updates the text input
                onLocationSelect={(place) => {
                  // This updates coordinates when a place is selected from suggestions
                  setDestinationCoords(
                    place.lat && place.lng
                      ? { lat: place.lat, lng: place.lng }
                      : null
                  );
                  setDestinationText(place.address); // Update text with the selected place's address
                }}
                placeholder="Start typing to search locations..."
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Update Destination
              </button>
            </div>
          </form>
        </div>
      </div>
    </LoadScript>
  );
};

export default DestinationModal;