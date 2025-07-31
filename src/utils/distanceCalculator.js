// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Calculate estimated travel time based on distance and mode of transport
export const calculateTravelTime = (distance, transportMode = 'road') => {
  let averageSpeed;
  
  switch (transportMode) {
    case 'road':
      averageSpeed = 30; // km/h for city driving
      break;
    case 'highway':
      averageSpeed = 60; // km/h for highway
      break;
    case 'bike':
      averageSpeed = 15; // km/h for cycling
      break;
    case 'walk':
      averageSpeed = 5; // km/h for walking
      break;
    default:
      averageSpeed = 30;
  }
  
  const timeInHours = distance / averageSpeed;
  const timeInMinutes = timeInHours * 60;
  
  return {
    hours: Math.floor(timeInHours),
    minutes: Math.round(timeInMinutes % 60),
    totalMinutes: Math.round(timeInMinutes)
  };
};

// Format distance for display
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// Format time for display
export const formatTime = (timeObj) => {
  const { hours, minutes } = timeObj;
  
  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}min`;
  }
};

// Calculate remaining distance and time based on current progress
export const calculateRemainingJourney = (parcel, progressPercentage) => {
  const pickup = {
    lat: parseFloat(parcel.pick_up_latitude),
    lng: parseFloat(parcel.pick_up_longitude)
  };
  
  const destination = {
    lat: parseFloat(parcel.destination_latitude),
    lng: parseFloat(parcel.destination_longitude)
  };
  
  const totalDistance = calculateDistance(
    pickup.lat, pickup.lng, 
    destination.lat, destination.lng
  );
  
  const totalTime = calculateTravelTime(totalDistance);
  
  const remainingDistance = totalDistance * (1 - progressPercentage / 100);
  const remainingTime = {
    hours: Math.floor(totalTime.hours * (1 - progressPercentage / 100)),
    minutes: Math.round(totalTime.minutes * (1 - progressPercentage / 100)),
    totalMinutes: Math.round(totalTime.totalMinutes * (1 - progressPercentage / 100))
  };
  
  return {
    totalDistance,
    totalTime,
    remainingDistance,
    remainingTime,
    progressPercentage
  };
}; 