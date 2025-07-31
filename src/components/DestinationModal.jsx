// components/DestinationModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { LoadScript } from "@react-google-maps/api"; 
import LocationAutocomplete from "./LocationAutocomplete";

const libraries = ["places"];

const DestinationModal = ({ isOpen, onClose, onConfirm, currentDestination }) => {
  const [destinationText, setDestinationText] = useState(currentDestination || '');
  const [destinationCoords, setDestinationCoords] = useState(null); 
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setDestinationText(currentDestination || '');
      setDestinationCoords(null);
    }
  }, [isOpen, currentDestination]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!event.target.closest('.pac-container')) {
          onClose();
        }
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
    
    if (destinationText.trim()) {
      onConfirm({
        newDestinationText: destinationText,
        newDestinationCoords: destinationCoords
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_Maps_API_KEY} 
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
              
              <LocationAutocomplete
                value={destinationText}
                onChange={setDestinationText} 
                onLocationSelect={(place) => {
                  
                  setDestinationCoords(
                    place.lat && place.lng
                      ? { lat: place.lat, lng: place.lng }
                      : null
                  );
                  setDestinationText(place.address); 
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
