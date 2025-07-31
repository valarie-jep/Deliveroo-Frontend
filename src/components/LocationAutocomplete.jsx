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

  useEffect(() => {
    if (window.google && window.google.maps) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
    }
  }, []);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

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

  if (onLocationSelect && placesService.current) {
    placesService.current.getDetails(
      { placeId: suggestion.place_id },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          onLocationSelect({
            address: place.formatted_address || suggestion.description,
            lat,
            lng
          });
        } else {
          console.error("PlacesServiceStatus Error:", status);
        }
      }
    );
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
        className={`w-full border rounded px-3 py-2 ${className}`}
        autoComplete="off"
      />
      
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