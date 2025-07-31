import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchParcels, cancelParcel,updateParcelDestination } from "../redux/parcelSlice";
import Navbar from "../components/Navbar";


const ParcelCard = ({ parcel }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.parcels.loading);
  


  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel this parcel? This action cannot be undone."
      )
    ) {
      dispatch(cancelParcel(parcel.id));
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-transit": "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusClass = statusColors[parcel.status] || "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-6 hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-bold text-orange-600 mb-2">
        Parcel #{parcel.id}
      </h3>
      <div className="space-y-2 text-gray-700">
        <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
          {parcel.status.toUpperCase()}
        </p>
        
        <p>
          <span className="font-medium">Recipient:</span> {parcel.recipient_name || "N/A"}
        </p>
        <p>
          <span className="font-medium">Current Location:</span> {parcel.current_location || "N/A"}
        </p>

        <p>
          <span className="font-medium">Pickup:</span> {parcel.pickup_location_text}
        </p>
        <p>
          <span className="font-medium">Destination:</span> {parcel.destination_location_text}
        </p>
        <p>
          <span className="font-medium">Cost:</span> KES.{parcel.cost?.toFixed(2)} 
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/parcels/${parcel.id}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          View Details
        </button>
        {parcel.status !== "cancelled" && parcel.status !== "delivered" &&(<button
                            onClick={() => navigate(`/tracking/${parcel.id}`, { state: { trackingId: parcel.id } })}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Track
        </button>)}
        {parcel.status !== "cancelled" && parcel.status !== "delivered" && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            {loading ? "Cancelling..." : "Cancel"}
          </button>
        )}
        {parcel.status !== "cancelled" && parcel.status !== "delivered" && (
            <button
              onClick={() => {
                const newDestination = prompt("Enter new destination:");
                if (newDestination) {
                  dispatch(updateParcelDestination({ id: parcel.id, newDestination }));
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md transition"
            >
              Change Destination
            </button>
          )}
      </div>
    </div>
  );
};

const Parcels = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const parcelsState = useSelector((state) => state.parcels) || {};
  const user = useSelector((state) => state.auth.user);
  const { parcels = [], loading = false, error = null } = parcelsState;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('');
  const [viewMode, setViewMode] = React.useState("grid");

  useEffect(() => {
    if (parcelsState.success) {
      return;
    }
    dispatch(fetchParcels());
  }, [dispatch, parcelsState.success]);

  // Show all parcels for now (temporarily disable user filtering)
  const filteredList = parcels;
  const displayList = filteredList;

  if (loading) return <p className="text-center mt-6">Loading parcels...</p>;
  if (error)
    return <p className="text-center mt-6 text-red-500">Error: {error}</p>;
  if (!Array.isArray(parcels)) {
    return <p className="text-red-600">Parcel data is invalid</p>;
  }
  
  // Filter by search term
  const searchFiltered = displayList.filter((parcel) => {
    const term = searchTerm.toLowerCase();
    const matches = (
      parcel.status?.toLowerCase().includes(term) ||
      parcel.sender_name?.toLowerCase().includes(term) ||
      parcel.recipient_name?.toLowerCase().includes(term) ||
      parcel.pickup_location_text?.toLowerCase().includes(term) ||
      parcel.destination_location_text?.toLowerCase().includes(term)
    );
    
    return matches;
  });
  
  // Sort based on selection
  const sortedList = [...searchFiltered].sort((a, b) => {
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    } else if (sortBy === 'sender') {
      return a.sender_name?.localeCompare(b.sender_name || '') || 0;
    } else if (sortBy === 'created_at') {
      return new Date(b.created_at) - new Date(a.created_at); // Newest first
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Search and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-orange-600">My Parcels</h1>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search parcels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Sort by...</option>
              <option value="status">Status</option>
              <option value="sender">Sender</option>
              <option value="created_at">Date Created</option>
            </select>
            
            {/* View Toggle */}
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Switch to {viewMode === "grid" ? "List" : "Grid"} View
            </button>
            
            {/* Create New Parcel */}
            <button
              onClick={() => navigate("/parcels/new")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Create New Parcel
            </button>
          </div>
        </div>
        
        {/* Parcels Content */}
        <div className="p-4 max-w-6xl mx-auto w-full">
  {sortedList.length === 0 ? (
    <p className="text-center text-gray-600">No parcels found.</p>
  ) : viewMode === "grid" ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedList.map((parcel) => (
        <ParcelCard key={parcel.id} parcel={parcel} />
      ))}
    </div>
  ) : (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4">Parcel ID</th>
            <th className="py-3 px-4">Recipient</th>
            <th className="py-3 px-4">Pickup</th>
            <th className="py-3 px-4">Destination</th>
            <th className="py-3 px-4">Current Location</th>
            <th className="py-3 px-4">Cost (KES)</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedList.map((parcel) => (
            <tr key={parcel.id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4">{parcel.id}</td>
              <td className="py-2 px-4">{parcel.recipient_name || "N/A"}</td>
              <td className="py-2 px-4">{parcel.pickup_location_text}</td>
              <td className="py-2 px-4">{parcel.destination_location_text}</td>
              <td className="py-2 px-4">{parcel.current_location || "N/A"}</td>
              <td className="py-2 px-4">{parcel.cost?.toFixed(2)}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    {
                      pending: "bg-yellow-100 text-yellow-800",
                      "in-transit": "bg-blue-100 text-blue-800",
                      delivered: "bg-green-100 text-green-800",
                      cancelled: "bg-red-100 text-red-800",
                    }[parcel.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {parcel.status.toUpperCase()}
                </span>
              </td>
              <td className="py-2 px-4 space-x-2 whitespace-nowrap">
                {parcel.status !== "cancelled" && parcel.status !== "delivered" && (
                  <button
                    onClick={() => {
                      const newDestination = prompt("Enter new destination:");
                      if (newDestination) {
                        dispatch(updateParcelDestination({ id: parcel.id, newDestination }));
                      }
                    }}
                    className="bg-orange-500 text-white px-3 py-1 rounded-md text-xs hover:bg-orange-600 transition"
                  >
                    Change
                  </button>
                )}
                <button
                  onClick={() => navigate(`/parcels/${parcel.id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 transition"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/tracking/${parcel.id}`, { state: { trackingId: parcel.id } })}
                  className="bg-orange-500 text-white px-3 py-1 rounded-md text-xs hover:bg-orange-600 transition"
                >
                  Track
                </button>
                {parcel.status !== "cancelled" && parcel.status !== "delivered" && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm("Are you sure you want to cancel this parcel?")
                      ) {
                        dispatch(cancelParcel(parcel.id));
                      }
                    }}
                    disabled={loading}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 disabled:bg-red-300 transition"
                  >
                    {loading ? "..." : "Cancel"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        )}
      </div>
    </div>
  );
};

export default Parcels;
