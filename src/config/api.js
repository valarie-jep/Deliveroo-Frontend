export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || '',
  EMAIL_ENABLED: process.env.REACT_APP_EMAIL_ENABLED !== 'false'
};

export const EMAIL_ENDPOINTS = {
  PARCEL_CREATED: '/email/parcel-created',
  STATUS_UPDATE: '/email/status-update',
  LOCATION_UPDATE: '/email/location-update',
  PARCEL_CANCELLED: '/email/parcel-cancelled',
  WELCOME: '/email/welcome',
  PASSWORD_RESET: '/email/password-reset',
  TEST: '/email/test',
  PREFERENCES: '/email/preferences'
};

export const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getBaseHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
}; 