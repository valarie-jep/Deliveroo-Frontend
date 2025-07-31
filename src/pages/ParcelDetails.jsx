import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchParcels } from '../redux/parcelSlice';
import Navbar from '../components/Navbar';

const ParcelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Debug logging
  console.log('🔍 ParcelDetails - ParcelId from URL:', id);
  console.log('🔍 ParcelDetails - All parcels in store:', useSelector(state => state.parcels?.parcels));

  const parcel = useSelector(state => {
    // Ensure state.parcels.parcels is an array
    const parcels = state.parcels?.parcels || [];
    const foundParcel = parcels.find(p => String(p.id) === String(id));
    console.log('🔍 ParcelDetails - Found parcel:', foundParcel);
    return foundParcel;
  });

  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.admin;

  // Fetch parcels if not found
  React.useEffect(() => {
    if (!parcel && id) {
      console.log('🔍 Parcel not found in store, fetching parcels...');
      dispatch(fetchParcels());
    }
  }, [parcel, id, dispatch]);

  if (!parcel) {
    return (
      <div>
        {!isAdmin && <Navbar />}
        <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">Parcel Not Found</h2>
          <button
            onClick={() => navigate(isAdmin ? '/admin/parcels' : '/parcels')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
          >
            Back to My Parcels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!isAdmin && <Navbar />}
      <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Parcel #{parcel.id} Details</h2>

        <div className="space-y-2 text-gray-800">
          <div><span className="font-semibold">Status:</span> {parcel.status}</div>
          <div><span className="font-semibold">Sender:</span> {parcel.sender_name} ({parcel.sender_phone_number})</div>
          <div><span className="font-semibold">Recipient:</span> {parcel.recipient_name} ({parcel.recipient_phone_number})</div>
          <div><span className="font-semibold">Pickup:</span> {parcel.pickup_location_text}</div>
          <div><span className="font-semibold">Destination:</span> {parcel.destination_location_text}</div>
          {parcel.current_location && (
            <div><span className="font-semibold">Current Location:</span> {parcel.current_location}</div>
          )}
          <div><span className="font-semibold">Description:</span> {parcel.description}</div>
          <div><span className="font-semibold">Weight:</span> {parcel.weight} kg</div>
          <div><span className="font-semibold">Cost:</span> KES {parcel.cost?.toFixed(2)}</div>
          <div><span className="font-semibold">Distance:</span> {parcel.distance?.toFixed(2)} km</div>
          <div><span className="font-semibold">Created At:</span> {new Date(parcel.created_at).toLocaleString()}</div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate(isAdmin ? '/admin/parcels' : '/parcels')}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-blue-600 transition"
          >
            Back Parcels
          </button>
          {isAdmin?(''):(<button
            onClick={() => navigate(`/tracking`, { state: { trackingId: parcel.id } })}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Track Parcel
          </button>)}
          
        </div>
      </div>
    </div>
  );
};

export default ParcelDetails;
