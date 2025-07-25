import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getParcels } from '../redux/parcelSlice';
import ParcelCard from '../components/ParcelCard';
import Navbar from '../components/Navbar';

const Parcels = () => {
  const dispatch = useDispatch();
  const parcelsState = useSelector(state => state.parcels) || {};
  const user = useSelector(state => state.auth.user);
  const { list = [], loading = false, error = null } = parcelsState;

  useEffect(() => {
    dispatch(getParcels());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-6">Loading parcels...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">Error: {error}</p>;
  if (!Array.isArray(list)) {
    return <p className="text-red-600">Parcel data is invalid</p>;
  }

  // Filter parcels to only show those belonging to the logged-in user
  const filteredList = user ? list.filter(parcel => parcel.user_id === user.id) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mt-8">
        {filteredList.map(parcel => (
          <ParcelCard key={parcel.id} parcel={parcel} />
        ))}
      </div>
    </div>
  );
};

export default Parcels;
