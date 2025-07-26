import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getParcels, cancelParcel } from "../redux/parcelSlice";
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
          <span className="font-medium">Pickup:</span> {parcel.pickup_location_text}
        </p>
        <p>
          <span className="font-medium">Destination:</span> {parcel.destination_location_text}
        </p>
        <p>
          <span className="font-medium">Weight:</span> {parcel.weight} kg
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/parcels/${parcel.id}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          View Details
        </button>
        <button
          onClick={() =>
            navigate("/tracking", { state: { trackingId: parcel.id } })
          }
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Track
        </button>
        {parcel.status !== "cancelled" && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            {loading ? "Cancelling..." : "Cancel"}
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
  const { list = [], loading = false, error = null } = parcelsState;

  useEffect(() => {
    dispatch(getParcels());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-6">Loading parcels...</p>;
  if (error)
    return <p className="text-center mt-6 text-red-500">Error: {error}</p>;
  if (!Array.isArray(list)) {
    return <p className="text-red-600">Parcel data is invalid</p>;
  }

  const filteredList = user
    ? list.filter((parcel) => parcel.user_id === user.id)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-between items-center px-4 pt-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-orange-600">My Parcels</h2>
        <button
          onClick={() => navigate("/parcels/new")}
          className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition"
        >
          Create New Parcel
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-6xl mx-auto">
        {filteredList.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No parcels found.</p>
        ) : (
          filteredList.map((parcel) => (
            <ParcelCard key={parcel.id} parcel={parcel} />
          ))
        )}
      </div>
    </div>
  );
};

export default Parcels;
