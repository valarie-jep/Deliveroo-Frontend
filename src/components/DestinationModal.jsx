// components/DestinationModal.jsx
import React, { useState, useEffect, useRef } from 'react';

const DestinationModal = ({ isOpen, onClose, onConfirm, currentDestination }) => {
  const [newDestination, setNewDestination] = useState(currentDestination || '');
  const modalRef = useRef(null);

  
  useEffect(() => {
    if (isOpen) {
      setNewDestination(currentDestination || '');
    }
  }, [isOpen, currentDestination]);

  
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
    if (newDestination.trim()) {
      onConfirm(newDestination);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-2xl font-bold text-orange-600 mb-4">Change Destination</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newDestination" className="block text-gray-700 text-sm font-bold mb-2">
              New Destination:
            </label>
            <input
              type="text"
              id="newDestination"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500"
              placeholder="Enter new destination"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
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
  );
};

export default DestinationModal;