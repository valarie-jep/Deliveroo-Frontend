import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, Polyline } from '@react-google-maps/api';

const TrackingMap = ({ parcel, center, zoom, isDemoMode = false }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [routePath, setRoutePath] = useState([]);

  // Calculate current position based on parcel status
  const calculateCurrentPosition = useCallback((parcelData) => {
    if (!parcelData) return null;

    try {
      const pickupCoords = parcelData.pickup_location_coordinates ? 
        JSON.parse(parcelData.pickup_location_coordinates) : null;
      const destinationCoords = parcelData.destination_location_coordinates ? 
        JSON.parse(parcelData.destination_location_coordinates) : null;

      if (!pickupCoords || !destinationCoords) return null;

      // Calculate progress based on status
      let progress = 0;
      switch (parcelData.status) {
        case 'pending':
          progress = 0.1; // Just started
          break;
        case 'in_transit':
          progress = 0.5; // Halfway
          break;
        case 'delivered':
          progress = 1.0; // Completed
          break;
        default:
          progress = 0.1;
      }

      // Calculate current position along the route
      const lat = pickupCoords.lat + (destinationCoords.lat - pickupCoords.lat) * progress;
      const lng = pickupCoords.lng + (destinationCoords.lng - pickupCoords.lng) * progress;

      // Add small random offset for more realistic movement
      const randomOffset = (Math.random() - 0.5) * 0.001;
      
      return {
        lat: lat + randomOffset,
        lng: lng + randomOffset
      };
    } catch (error) {
      console.error('Error calculating current position:', error);
      return null;
    }
  }, []);

  // Generate route path with intermediate points
  const generateRoutePath = useCallback((parcelData) => {
    if (!parcelData) return [];

    try {
      const pickupCoords = parcelData.pickup_location_coordinates ? 
        JSON.parse(parcelData.pickup_location_coordinates) : null;
      const destinationCoords = parcelData.destination_location_coordinates ? 
        JSON.parse(parcelData.destination_location_coordinates) : null;

      if (!pickupCoords || !destinationCoords) return [];

      // Create intermediate points for smoother route
      const points = [];
      const steps = 10;
      
      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const lat = pickupCoords.lat + (destinationCoords.lat - pickupCoords.lat) * progress;
        const lng = pickupCoords.lng + (destinationCoords.lng - pickupCoords.lng) * progress;
        points.push({ lat, lng });
      }

      return points;
    } catch (error) {
      console.error('Error generating route path:', error);
      return [];
    }
  }, []);

  // Create custom marker icon
  const createMarkerIcon = (color = 'blue', label = '') => {
    return {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      scale: 1.5,
      anchor: { x: 12, y: 24 }
    };
  };

  // Get marker icon based on type
  const getMarkerIcon = (type) => {
    switch (type) {
      case 'pickup':
        return createMarkerIcon('#10B981'); // Green
      case 'destination':
        return createMarkerIcon('#EF4444'); // Red
      case 'current':
        return createMarkerIcon('#3B82F6'); // Blue
      default:
        return createMarkerIcon('#6B7280'); // Gray
    }
  };

  // Get marker label
  const getMarkerLabel = (type) => {
    switch (type) {
      case 'pickup':
        return 'P';
      case 'destination':
        return 'D';
      case 'current':
        return '📍';
      default:
        return '';
    }
  };

  // Get info window content
  const getInfoWindowContent = (type, parcelData) => {
    switch (type) {
      case 'pickup':
        return `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 4px 0; color: #10B981; font-weight: bold;">Pickup Location</h3>
            <p style="margin: 0; font-size: 12px;">${parcelData?.pickup_location_text || 'Location not specified'}</p>
          </div>
        `;
      case 'destination':
        return `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 4px 0; color: #EF4444; font-weight: bold;">Destination</h3>
            <p style="margin: 0; font-size: 12px;">${parcelData?.destination_location_text || 'Location not specified'}</p>
          </div>
        `;
      case 'current':
        return `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 4px 0; color: #3B82F6; font-weight: bold;">Current Position</h3>
            <p style="margin: 0; font-size: 12px;">Status: ${parcelData?.status?.replace('_', ' ').toUpperCase() || 'Unknown'}</p>
            <p style="margin: 0; font-size: 12px;">${parcelData?.current_location || 'Location not specified'}</p>
          </div>
        `;
      default:
        return '';
    }
  };

  // Update current position periodically for in_transit parcels
  useEffect(() => {
    if (parcel?.status === 'in_transit' || isDemoMode) {
      const interval = setInterval(() => {
        const newPosition = calculateCurrentPosition(parcel);
        if (newPosition) {
          // setCurrentPosition(newPosition); // This line was removed as per the edit hint
          // setIsAnimating(true); // This line was removed as per the edit hint
          // setTimeout(() => setIsAnimating(false), 1000); // This line was removed as per the edit hint
        }
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [parcel, isDemoMode, calculateCurrentPosition]);

  // Generate route path when parcel changes
  useEffect(() => {
    const path = generateRoutePath(parcel);
    setRoutePath(path);
  }, [parcel, generateRoutePath]);

  // Calculate current position when parcel changes
  useEffect(() => {
    // Update current position when parcel changes
    if (parcel?.status === 'in_transit' || isDemoMode) {
      // Current position calculation temporarily disabled
    }
  }, [parcel, isDemoMode]);

  // Get coordinates from parcel
  const getPickupCoordinates = () => {
    if (!parcel?.pickup_location_coordinates) return null;
    try {
      return JSON.parse(parcel.pickup_location_coordinates);
    } catch (error) {
      console.error('Error parsing pickup coordinates:', error);
      return null;
    }
  };

  const getDestinationCoordinates = () => {
    if (!parcel?.destination_location_coordinates) return null;
    try {
      return JSON.parse(parcel.destination_location_coordinates);
    } catch (error) {
      console.error('Error parsing destination coordinates:', error);
      return null;
    }
  };

  const pickupCoords = getPickupCoordinates();
  const destinationCoords = getDestinationCoordinates();

  // Map options for better styling
  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  return (
    <div className="relative h-full">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center || { lat: -1.286389, lng: 36.817223 }}
        zoom={zoom || 12}
        options={options}
      >
        {/* Pickup Marker */}
        {pickupCoords && (
          <Marker
            position={pickupCoords}
            icon={getMarkerIcon('pickup')}
            label={getMarkerLabel('pickup')}
            onClick={() => setSelectedMarker({ type: 'pickup', position: pickupCoords })}
          />
        )}

        {/* Destination Marker */}
        {destinationCoords && (
          <Marker
            position={destinationCoords}
            icon={getMarkerIcon('destination')}
            label={getMarkerLabel('destination')}
            onClick={() => setSelectedMarker({ type: 'destination', position: destinationCoords })}
          />
        )}

        {/* Current Position Marker */}
        {/* Current position marker temporarily disabled */}
        {/* {currentPosition && (
          <Marker
            position={currentPosition}
            icon={createMarkerIcon('blue', '🚚')}
            label="Current"
            onClick={() => setSelectedMarker({ type: 'current', position: currentPosition })}
          />
        )} */}

        {/* Route Path */}
        {routePath.length > 1 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: '#3B82F6',
              strokeOpacity: 0.8,
              strokeWeight: 3,
            }}
          />
        )}

        {/* Progress Line (completed portion) */}
        {routePath.length > 1 && (
          <Polyline
            path={routePath.filter((_, index) => {
              // Placeholder for progress calculation
              return index <= Math.floor(routePath.length * 0.5);
            })}
            options={{
              strokeColor: '#10B981',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}

        {/* Info Windows */}
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

      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          🎬 Demo Mode
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-medium text-gray-900 mb-2">Map Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Pickup</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Destination</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Current Position</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Progress Line</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingMap; 