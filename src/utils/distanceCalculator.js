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
      averageSpeed = 25; // km/h for city driving (more realistic)
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
    case 'delivery':
      averageSpeed = 20; // km/h for delivery vehicles
      break;
    default:
      averageSpeed = 25;
  }
  
  const timeInHours = distance / averageSpeed;
  const timeInMinutes = timeInHours * 60;
  
  return {
    hours: Math.floor(timeInHours),
    minutes: Math.round(timeInMinutes % 60),
    totalMinutes: Math.round(timeInMinutes)
  };
};

// Calculate current position based on progress percentage
export const calculateCurrentPosition = (pickup, destination, progressPercentage) => {
  if (!pickup || !destination) return null;
  
  const progress = progressPercentage / 100;
  
  return {
    lat: pickup.lat + (destination.lat - pickup.lat) * progress,
    lng: pickup.lng + (destination.lng - pickup.lng) * progress
  };
};

// Calculate progress percentage based on status or parcel object
export const calculateProgressPercentage = (parcelOrStatus) => {
  // If it's a parcel object, use the progress field or status
  if (typeof parcelOrStatus === 'object' && parcelOrStatus !== null) {
    // Use the progress field if available (from tracking updates)
    if (parcelOrStatus.progress !== undefined) {
      return parcelOrStatus.progress;
    }
    // Fallback to status-based progress
    return calculateProgressPercentage(parcelOrStatus.status);
  }
  
  // If it's just a status string
  const status = parcelOrStatus;
  switch (status) {
    case 'pending':
      return 0;
    case 'in_transit':
      return 50;
    case 'delivered':
      return 100;
    case 'cancelled':
      return 0;
    default:
      return 25;
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
  
  const totalTime = calculateTravelTime(totalDistance, 'delivery');
  
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
    progressPercentage,
    pickup,
    destination
  };
};

// Calculate estimated arrival time
export const calculateEstimatedArrival = (parcel) => {
  if (!parcel || parcel.status === 'delivered') return null;
  
  const now = new Date();
  
  let estimatedHours = 48; // Default 48 hours
  
  if (parcel.status === 'in_transit') {
    estimatedHours = 24; // 24 hours remaining when in transit
  } else if (parcel.status === 'pending') {
    estimatedHours = 48; // 48 hours total for pending
  }
  
  const estimatedDate = new Date(now.getTime() + (estimatedHours * 60 * 60 * 1000));
  return estimatedDate;
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

// Format time remaining for display
export const formatTimeRemaining = (estimatedDate) => {
  if (!estimatedDate) return 'Calculating...';
  
  const now = new Date();
  const timeDiff = estimatedDate - now;
  
  if (timeDiff <= 0) return 'Overdue';
  
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Generate route path with intermediate points
export const generateRoutePath = (pickup, destination, steps = 20) => {
  if (!pickup || !destination) return [];
  
  const points = [];
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const lat = pickup.lat + (destination.lat - pickup.lat) * progress;
    const lng = pickup.lng + (destination.lng - pickup.lng) * progress;
    points.push({ lat, lng });
  }
  
  return points;
};

// Calculate bearing between two points
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

// Calculate midpoint between two coordinates
export const calculateMidpoint = (lat1, lon1, lat2, lon2) => {
  const lat1Rad = lat1 * Math.PI / 180;
  const lon1Rad = lon1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const lon2Rad = lon2 * Math.PI / 180;
  
  const Bx = Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad);
  const By = Math.cos(lat2Rad) * Math.sin(lon2Rad - lon1Rad);
  
  const midLat = Math.atan2(
    Math.sin(lat1Rad) + Math.sin(lat2Rad),
    Math.sqrt((Math.cos(lat1Rad) + Bx) * (Math.cos(lat1Rad) + Bx) + By * By)
  );
  
  const midLon = lon1Rad + Math.atan2(By, Math.cos(lat1Rad) + Bx);
  
  return {
    lat: midLat * 180 / Math.PI,
    lng: midLon * 180 / Math.PI
  };
}; 