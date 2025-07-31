import React, { useState, useEffect, useRef } from 'react';

const LocationAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Enter location...",
  className = "",
  onLocationSelect = null 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const [isValidLocation, setIsValidLocation] = useState(false);

  useEffect(() => {
    const initializeGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        try {
          console.log('Google Maps API loaded, initializing Places service...');
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          placesService.current = new window.google.maps.places.PlacesService(
            document.createElement('div')
          );
          console.log('Google Maps Places API initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Google Maps Places API:', error);
        }
      } else {
        console.log('Google Maps API not ready yet, retrying in 1 second...');
        setTimeout(initializeGoogleMaps, 1000);
      }
    };

    initializeGoogleMaps();
  }, []);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsValidLocation(false); // Reset validation when user types

    if (newValue.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: newValue,
          componentRestrictions: { country: 'ke' },
          types: ['establishment', 'geocode']
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else if (newValue.length > 2) {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.description);
    onChange(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
    setIsValidLocation(true);

    if (onLocationSelect && placesService.current) {
      // Get detailed place information including coordinates
      placesService.current.getDetails(
        {
          placeId: suggestion.place_id,
          fields: ['geometry', 'formatted_address']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const location = place.geometry?.location;
            if (location) {
              onLocationSelect({
                ...suggestion,
                lat: location.lat(),
                lng: location.lng(),
                formatted_address: place.formatted_address
              });
            } else {
              onLocationSelect(suggestion);
            }
          } else {
            console.warn('Failed to get place details:', status);
            onLocationSelect(suggestion);
          }
        }
      );
    } else if (onLocationSelect) {
      onLocationSelect(suggestion);
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full border rounded px-3 py-2 ${className} ${
          inputValue && !isValidLocation ? 'border-yellow-500' : ''
        }`}
        autoComplete="off"
      />
      {!autocompleteService.current && (
        <div className="text-xs text-gray-500 mt-1">
          💡 Google Maps suggestions not available. You can still enter locations manually.
          <button 
            onClick={() => console.log('API Status:', { 
              google: !!window.google, 
              maps: !!window.google?.maps, 
              places: !!window.google?.maps?.places,
              autocompleteService: !!autocompleteService.current 
            })}
            className="ml-2 text-blue-500 underline"
          >
            Debug API
          </button>
        </div>
      )}
      {inputValue && !isValidLocation && (
        <div className="text-xs text-yellow-600 mt-1">
          {autocompleteService.current 
            ? "Please select a location from the suggestions for better accuracy"
            : "Google Maps API not available. You can still enter a location manually."
          }
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium">{suggestion.structured_formatting?.main_text || suggestion.description}</div>
              {suggestion.structured_formatting?.secondary_text && (
                <div className="text-gray-500 text-xs">
                  {suggestion.structured_formatting.secondary_text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete; 