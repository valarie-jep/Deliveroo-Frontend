import React, { useState, useEffect } from "react";
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
          onClick={() =>
            navigate("/tracking", { state: { trackingId: parcel.id } })
          }
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
    dispatch(fetchParcels());
  }, [dispatch]);

  // Debug logging
  console.log('Parcels State:', parcelsState);
  console.log('User:', user);
  console.log('All Parcels:', parcels);
  const filteredList = user
  ? parcels.filter((parcel) => {
      // Handle different possible user ID field names
      const parcelUserId = parcel.user_id || parcel.userId || parcel.user?.id;
      const currentUserId = user.id || user.user_id || user.userId;
      
      console.log('Parcel User ID:', parcelUserId, 'Current User ID:', currentUserId);
      
      return parcelUserId === currentUserId;
    })
  : [];

  // Temporary fallback: if no parcels found for user, show all parcels
  const displayList = filteredList.length === 0 && parcels.length > 0 ? parcels : filteredList;
  
  console.log('Filtered Parcels:', filteredList);
  console.log('Display List:', displayList);

  if (loading) return <p className="text-center mt-6">Loading parcels...</p>;
  if (error)
    return <p className="text-center mt-6 text-red-500">Error: {error}</p>;
  if (!Array.isArray(parcels)) {
    return <p className="text-red-600">Parcel data is invalid</p>;
  }
  
  // Filter by search term
  const searchFiltered = displayList.filter((parcel) => {
    const term = searchTerm.toLowerCase();
    return (
      parcel.status?.toLowerCase().includes(term) ||
      parcel.sender_name?.toLowerCase().includes(term) ||
      parcel.recipient_name?.toLowerCase().includes(term) ||
      parcel.pickup_location_text?.toLowerCase().includes(term) ||
      parcel.destination_location_text?.toLowerCase().includes(term)
    );
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 pt-8 max-w-6xl mx-auto gap-4">
  <h2 className="text-2xl font-bold text-orange-600">My Parcels</h2>

  <div className="flex flex-col md:flex-row items-center gap-4">
    <input
      type="text"
      placeholder="Search parcels..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border px-3 py-2 rounded-md shadow-sm"
    />

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="border px-3 py-2 rounded-md shadow-sm"
    >
      <option value="">Sort by...</option>
      <option value="status">Status</option>
      <option value="receipient">Receipient Name</option>
      <option value="created_at">Date Created</option>
    </select>
    <button
      onClick={() => setViewMode((prev) => (prev === "grid" ? "list" : "grid"))}
      className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded hover:bg-gray-300 transition"
    >
      {viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
    </button>
    <button
      onClick={() => navigate("/parcels/new")}
      className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition"
    >
      Create New Parcel
    </button>
  </div>
</div>
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
                  onClick={() =>
                    navigate("/tracking", { state: { trackingId: parcel.id } })
                  }
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
