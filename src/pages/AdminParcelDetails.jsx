import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getParcelById } from '../redux/parcelSlice';


const AdminParcelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const parcel = useSelector(state => 
    state.parcels.list.find(p => String(p.id) === String(id))
  );
  const loading = useSelector(state => state.parcels.loading);

  useEffect(() => {
    if (!parcel) {
      dispatch(getParcelById(id));
    }
  }, [id, parcel, dispatch]);

  if (loading || !parcel) {
    return (
      <div>
        
        <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">Loading Parcel...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      
      <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Parcel #{parcel.id} Details</h2>
        <div className="space-y-2 text-gray-800">
          <div><span className="font-semibold">Status:</span> {parcel.status}</div>
          <div><span className="font-semibold">Sender:</span> {parcel.sender_name} ({parcel.sender_phone_number})</div>
          <div><span className="font-semibold">Recipient:</span> {parcel.recipient_name} ({parcel.recipient_phone_number})</div>
          <div><span className="font-semibold">Pickup:</span> {parcel.pickup_location_text}</div>
          <div><span className="font-semibold">Destination:</span> {parcel.destination_location_text}</div>
          {parcel.current_location && <div><span className="font-semibold">Current Location:</span> {parcel.current_location}</div>}
          <div><span className="font-semibold">Description:</span> {parcel.description}</div>
          <div><span className="font-semibold">Weight:</span> {parcel.weight} kg</div>
          <div><span className="font-semibold">Cost:</span> KES {parcel.cost?.toFixed(2)}</div>
          <div><span className="font-semibold">Distance:</span> {parcel.distance?.toFixed(2)} km</div>
          <div><span className="font-semibold">Created At:</span> {new Date(parcel.created_at).toLocaleString()}</div>
        </div>
        <button onClick={() => navigate('/admin')} className="mt-6 px-4 py-2 bg-orange-500 text-white rounded">Back to Dashboard</button>
      </div>
    </div>
  );
};

export default AdminParcelDetails;
