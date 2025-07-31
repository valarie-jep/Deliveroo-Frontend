import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, Polyline, InfoWindow } from '@react-google-maps/api';

const TrackingMap = ({ parcel, containerStyle, center, zoom, onLoad, onError }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const calculateCurrentPosition = useCallback((parcel) => {
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

    // Add some randomness to simulate real movement
    const randomOffset = (Math.random() - 0.5) * 0.001;
    
    return {
      lat: pickup.lat + (destination.lat - pickup.lat) * progress + randomOffset,
      lng: pickup.lng + (destination.lng - pickup.lng) * progress + randomOffset
    };
  }, []);

  const generateRoutePath = useCallback((pickup, destination) => {
    if (!pickup || !destination) return [];
    
    // Generate intermediate points for smoother route
    const points = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const lat = pickup.lat + (destination.lat - pickup.lat) * progress;
      const lng = pickup.lng + (destination.lng - pickup.lng) * progress;
      points.push({ lat, lng });
    }
    
    return points;
  }, []);

  const createMarkerIcon = (url, size = 32, color = null) => {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      return {
        url,
        scaledSize: new window.google.maps.Size(size, size),
        ...(color && { fillColor: color })
      };
    }
    return { url };
  };

  const getMarkerIcon = (type) => {
    switch (type) {
      case 'pickup':
        return createMarkerIcon('https://maps.google.com/mapfiles/ms/icons/green-dot.png', 32);
      case 'destination':
        return createMarkerIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png', 32);
      case 'current':
        return createMarkerIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png', 40);
      default:
        return createMarkerIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png', 32);
    }
  };

  const getMarkerLabel = (type) => {
    switch (type) {
      case 'pickup':
        return { text: '📦 Pickup', className: 'marker-label pickup' };
      case 'destination':
        return { text: '🏠 Destination', className: 'marker-label destination' };
      case 'current':
        return { text: '🚚 Parcel', className: 'marker-label current' };
      default:
        return { text: '📍', className: 'marker-label' };
    }
  };

  const getInfoWindowContent = (type, parcel) => {
    switch (type) {
      case 'pickup':
        return `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #059669; font-weight: bold;">📦 Pickup Location</h3>
            <p style="margin: 0; font-size: 14px; color: #374151;">${parcel.pickup_location_text || 'Location not specified'}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6B7280;">Status: ${parcel.status.replace('_', ' ').toUpperCase()}</p>
          </div>
        `;
      case 'destination':
        return `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #DC2626; font-weight: bold;">🏠 Destination</h3>
            <p style="margin: 0; font-size: 14px; color: #374151;">${parcel.destination_location_text || 'Location not specified'}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6B7280;">Parcel ID: ${parcel.id}</p>
          </div>
        `;
      case 'current':
        return `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #2563EB; font-weight: bold;">🚚 Your Parcel</h3>
            <p style="margin: 0; font-size: 14px; color: #374151;">Status: ${parcel.status.replace('_', ' ').toUpperCase()}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6B7280;">Estimated arrival: 24-48 hours</p>
          </div>
        `;
      default:
        return '';
    }
  };

  // Update current position periodically for in-transit parcels
  useEffect(() => {
    if (parcel.status === 'in_transit') {
      const interval = setInterval(() => {
        setCurrentPosition(calculateCurrentPosition(parcel));
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    } else {
      setCurrentPosition(calculateCurrentPosition(parcel));
    }
  }, [parcel, calculateCurrentPosition]);

  // Generate route path when coordinates change
  useEffect(() => {
    const pickup = getPickupCoordinates(parcel);
    const destination = getDestinationCoordinates(parcel);
    setRoutePath(generateRoutePath(pickup, destination));
  }, [parcel, generateRoutePath]);

  const pickupCoords = getPickupCoordinates(parcel);
  const destinationCoords = getDestinationCoordinates(parcel);
  const currentCoords = currentPosition || calculateCurrentPosition(parcel);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onError={onError}
      options={{
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      }}
    >
      {/* Pickup Marker */}
      {pickupCoords && (
        <Marker 
          position={pickupCoords}
          icon={getMarkerIcon('pickup')}
          label={getMarkerLabel('pickup')}
          onClick={() => setSelectedMarker({ type: 'pickup', position: pickupCoords })}
          animation={window.google?.maps?.Animation?.DROP}
        />
      )}

      {/* Destination Marker */}
      {destinationCoords && (
        <Marker 
          position={destinationCoords}
          icon={getMarkerIcon('destination')}
          label={getMarkerLabel('destination')}
          onClick={() => setSelectedMarker({ type: 'destination', position: destinationCoords })}
          animation={window.google?.maps?.Animation?.DROP}
        />
      )}

      {/* Current Position Marker */}
      <Marker 
        position={currentCoords}
        icon={getMarkerIcon('current')}
        label={getMarkerLabel('current')}
        onClick={() => setSelectedMarker({ type: 'current', position: currentCoords })}
        animation={isAnimating ? window.google?.maps?.Animation?.BOUNCE : null}
      />

      {/* Route Line */}
      {routePath.length > 1 && (
        <Polyline
          path={routePath}
          strokeColor="#FF6B35"
          strokeOpacity={0.8}
          strokeWeight={4}
          geodesic={true}
          options={{
            strokeColor: "#FF6B35",
            strokeOpacity: 0.8,
            strokeWeight: 4,
            geodesic: true,
            icons: [{
              icon: {
                path: window.google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW
              },
              offset: '50%',
              repeat: '100px'
            }]
          }}
        />
      )}

      {/* Progress Line (from pickup to current position) */}
      {pickupCoords && currentCoords && (
        <Polyline
          path={[pickupCoords, currentCoords]}
          strokeColor="#3B82F6"
          strokeOpacity={1.0}
          strokeWeight={6}
          geodesic={true}
          options={{
            strokeColor: "#3B82F6",
            strokeOpacity: 1.0,
            strokeWeight: 6,
            geodesic: true
          }}
        />
      )}

      {/* Info Window */}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.position}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div 
            dangerouslySetInnerHTML={{ 
              __html: getInfoWindowContent(selectedMarker.type, parcel) 
            }}
          />
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default TrackingMap; 