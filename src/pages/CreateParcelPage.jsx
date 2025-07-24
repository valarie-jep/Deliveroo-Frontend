import React from 'react';
import ParcelForm from '../components/ParcelForm';

const CreateParcelPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
    <h1>Create New Parcel</h1>
    <ParcelForm />
  </div>
);

export default CreateParcelPage; 