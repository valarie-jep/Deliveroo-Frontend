import React from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';

const TrackingMap = ({ parcel, containerStyle, center, zoom, onLoad, onError }) => {
  const getPickupCoordinates = (parcel) => {
    console.log('Parcel data for pickup:', parcel);
    if (!parcel || !parcel.pick_up_latitude || !parcel.pick_up_longitude) {
      console.log('No pickup coordinates found:', parcel);
      return null;
    }
    const coords = { 
      lat: parseFloat(parcel.pick_up_latitude), 
      lng: parseFloat(parcel.pick_up_longitude) 
    };
    console.log('Pickup coordinates:', coords);
    return coords;
  };

  const getDestinationCoordinates = (parcel) => {
    if (!parcel || !parcel.destination_latitude || !parcel.destination_longitude) {
      console.log('No destination coordinates found:', parcel);
      return null;
    }
    const coords = { 
      lat: parseFloat(parcel.destination_latitude), 
      lng: parseFloat(parcel.destination_longitude) 
    };
    console.log('Destination coordinates:', coords);
    return coords;
  };

  const getCurrentPosition = (parcel) => {
    const pickup = getPickupCoordinates(parcel);
    const destination = getDestinationCoordinates(parcel);
    
    if (!pickup || !destination) {
      return pickup || destination || { lat: 0, lng: 0 };
    }

    const status = parcel.status;
    let progress = 0;

    switch (status) {
      case 'pending':
        progress = 0;
        break;
      case 'in_transit':
        progress = 0.5;
        break;
      case 'delivered':
        progress = 1;
        break;
      default:
        progress = 0.25;
    }

    return {
      lat: pickup.lat + (destination.lat - pickup.lat) * progress,
      lng: pickup.lng + (destination.lng - pickup.lng) * progress
    };
  };

  const createMarkerIcon = (url, size = 32) => {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      return {
        url,
        scaledSize: new window.google.maps.Size(size, size)
      };
    }
    return { url };
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onError={onError}
    >
      {/* Pickup Marker */}
      {getPickupCoordinates(parcel) && (
        <Marker 
          position={getPickupCoordinates(parcel)}
          icon={createMarkerIcon('https://maps.google.com/mapfiles/ms/icons/green-dot.png', 32)}
          label={{
            text: 'Pickup',
            className: 'marker-label'
          }}
        />
      )}

      {/* Destination Marker */}
      {getDestinationCoordinates(parcel) && (
        <Marker 
          position={getDestinationCoordinates(parcel)}
          icon={createMarkerIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png', 32)}
          label={{
            text: 'Destination',
            className: 'marker-label'
          }}
        />
      )}

      {/* Current Position Marker */}
      <Marker 
        position={getCurrentPosition(parcel)}
        icon={createMarkerIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png', 40)}
        label={{
          text: 'Parcel',
          className: 'marker-label'
        }}
      />

      {/* Route Line */}
      {(() => {
        const pickup = getPickupCoordinates(parcel);
        const destination = getDestinationCoordinates(parcel);
        
        if (pickup && destination) {
          console.log('Drawing polyline from', pickup, 'to', destination);
          return (
            <Polyline
              path={[pickup, destination]}
              options={{
                strokeColor: '#FF6B35',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                geodesic: true,
                zIndex: 1
              }}
            />
          );
        } else {
          console.log('Cannot draw polyline - missing coordinates');
          return null;
        }
      })()}
    </GoogleMap>
  );
};

export default TrackingMap; 