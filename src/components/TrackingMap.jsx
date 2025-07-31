import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, Polyline, useLoadScript } from '@react-google-maps/api';

const TrackingMap = ({ parcel, center, zoom, isDemoMode = false }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  // Check if Google Maps is loaded
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  // Calculate current position based on parcel status and progress
  const calculateCurrentPosition = useCallback((parcelData) => {
    if (!parcelData) return null;

    try {
      const pickupCoords = getPickupCoordinates();
      const destinationCoords = getDestinationCoordinates();

      if (!pickupCoords || !destinationCoords) return null;

      // Use progress from parcel data if available, otherwise calculate from status
      let progress = 0;
      if (parcelData.progress !== undefined) {
        progress = parcelData.progress / 100; // Convert percentage to decimal
      } else {
        // Calculate progress based on status
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
      }

      // Calculate current position along the route
      const lat = pickupCoords.lat + (destinationCoords.lat - pickupCoords.lat) * progress;
      const lng = pickupCoords.lng + (destinationCoords.lng - pickupCoords.lng) * progress;

      // Add small random offset for more realistic movement in demo mode
      let randomOffset = 0;
      if (isDemoMode) {
        randomOffset = (Math.random() - 0.5) * 0.0005; // Smaller offset for smoother movement
      }
      
      return {
        lat: lat + randomOffset,
        lng: lng + randomOffset
      };
    } catch (error) {
      console.error('Error calculating current position:', error);
      return null;
    }
  }, [isDemoMode]);

  // Get coordinates from parcel
  const getPickupCoordinates = useCallback(() => {
    try {
      // Try pickup_location_coordinates first
      if (parcel?.pickup_location_coordinates) {
        return JSON.parse(parcel.pickup_location_coordinates);
      }
      // Fallback to individual lat/lng fields
      else if (parcel?.pick_up_latitude && parcel?.pick_up_longitude) {
        return {
          lat: parseFloat(parcel.pick_up_latitude),
          lng: parseFloat(parcel.pick_up_longitude)
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing pickup coordinates:', error);
      return null;
    }
  }, [parcel]);

  const getDestinationCoordinates = useCallback(() => {
    try {
      // Try destination_location_coordinates first
      if (parcel?.destination_location_coordinates) {
        return JSON.parse(parcel.destination_location_coordinates);
      }
      // Fallback to individual lat/lng fields
      else if (parcel?.destination_latitude && parcel?.destination_longitude) {
        return {
          lat: parseFloat(parcel.destination_latitude),
          lng: parseFloat(parcel.destination_longitude)
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing destination coordinates:', error);
      return null;
    }
  }, [parcel]);

  // Generate route path with intermediate points
  const generateRoutePath = useCallback((parcelData) => {
    if (!parcelData) return [];

    try {
      const pickupCoords = getPickupCoordinates();
      const destinationCoords = getDestinationCoordinates();

      if (!pickupCoords || !destinationCoords) {
        console.log('Missing coordinates:', { pickupCoords, destinationCoords });
        return [];
      }

      console.log('Generating route path:', { pickupCoords, destinationCoords });

      // Create intermediate points for smoother route
      const points = [];
      const steps = 50; // More points for smoother line
      
      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const lat = pickupCoords.lat + (destinationCoords.lat - pickupCoords.lat) * progress;
        const lng = pickupCoords.lng + (destinationCoords.lng - pickupCoords.lng) * progress;
        points.push({ lat, lng });
      }

      console.log('Generated route path with', points.length, 'points');
      return points;
    } catch (error) {
      console.error('Error generating route path:', error);
      return [];
    }
  }, [getPickupCoordinates, getDestinationCoordinates]);

  // Update current position and route path when parcel data changes
  useEffect(() => {
    if (parcel) {
      const newRoutePath = generateRoutePath(parcel);
      setRoutePath(newRoutePath);
      
      const newCurrentPosition = calculateCurrentPosition(parcel);
      setCurrentPosition(newCurrentPosition);
      
      console.log('🗺️ Map updated:', {
        routePath: newRoutePath.length,
        currentPosition: newCurrentPosition,
        parcelProgress: parcel.progress
      });
    }
  }, [parcel, generateRoutePath, calculateCurrentPosition]);



  // Show loading state if Google Maps is not loaded
  if (loadError) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Map Loading Error</h3>
        <p className="text-gray-600">Unable to load the map. Please check your internet connection.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

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
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#7c7c7c' }]
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
        onLoad={(map) => {
          console.log('Map loaded successfully');
        }}
        onError={(error) => {
          console.error('Map loading error:', error);
        }}
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
        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={createMarkerIcon('blue', '🚚')}
            label="Current"
            onClick={() => setSelectedMarker({ 
              type: 'current', 
              position: currentPosition 
            })}
          />
        )}

        {/* Route Path */}
        {routePath.length > 1 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: '#3B82F6',
              strokeOpacity: 1.0,
              strokeWeight: 4,
              geodesic: true,
            }}
          />
        )}

        {/* Progress Line (completed portion) */}
        {routePath.length > 1 && (
          <Polyline
            path={routePath.filter((_, index) => {
              // Use actual progress from parcel data
              const progress = parcel?.progress !== undefined ? 
                parcel.progress / 100 : 
                parcel?.status === 'delivered' ? 1.0 :
                parcel?.status === 'in_transit' ? 0.7 :
                parcel?.status === 'pending' ? 0.2 : 0.1;
              return index <= Math.floor(routePath.length * progress);
            })}
            options={{
              strokeColor: '#10B981',
              strokeOpacity: 1.0,
              strokeWeight: 6,
              geodesic: true,
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
        <div className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          🎬 Demo Mode
          {parcel?.progress !== undefined && (
            <span className="ml-2 text-xs bg-purple-600 px-2 py-1 rounded">
              {parcel.progress}%
            </span>
          )}
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg border">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Map Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📦</span>
            </div>
            <span className="text-gray-700 font-medium">Pickup Location</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🏠</span>
            </div>
            <span className="text-gray-700 font-medium">Destination</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🚚</span>
            </div>
            <span className="text-gray-700 font-medium">Current Position</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-1 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">Route Path</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-1 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">Progress Line</span>
          </div>
          {parcel?.progress !== undefined && (
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-semibold text-green-600">{parcel.progress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingMap; 