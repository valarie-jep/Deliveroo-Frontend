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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-orange-600">
        Parcel #{parcel.id}
      </h3>
      <div className="text-gray-800 space-y-1">
        <p>
          <span className="font-medium">Status:</span> {parcel.status}
        </p>
        <p>
          <span className="font-medium">Cancellation Status:</span>{" "}
          {parcel.status === "cancelled" ? "Cancelled" : "Active"}
        </p>
        <p>
          <span className="font-medium">Pickup:</span>{" "}
          {parcel.pickup_location_text}
        </p>
        <p>
          <span className="font-medium">Destination:</span>{" "}
          {parcel.destination_location_text}
        </p>
        <p>
          <span className="font-medium">Weight:</span> {parcel.weight} kg
        </p>
      </div>
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => navigate(`/parcels/${parcel.id}`)}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          View Details
        </button>
        <button
          onClick={() =>
            navigate("/tracking", { state: { trackingId: parcel.id } })
          }
          className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition"
        >
          Track
        </button>
        {parcel.status !== "cancelled" && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition disabled:bg-red-300"
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
      <div className="max-w-6xl mx-auto mt-8 p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-600">My Parcels</h2>
          <button
            onClick={() => navigate("/parcels/new")}
            className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition"
          >
            Create New Parcel
          </button>
        </div>
        {filteredList.length === 0 ? (
          <p className="text-center text-gray-600">No parcels found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((parcel) => (
              <ParcelCard key={parcel.id} parcel={parcel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Parcels;
