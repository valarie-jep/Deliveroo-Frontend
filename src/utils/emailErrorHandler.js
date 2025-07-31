import { BASE_URL } from '../config/api';

export const logEmailError = (action, error) => {
  console.error(`Email ${action} failed:`, error);
};

export const getEmailErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle different error types
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data?.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'You are not authorized to perform this action.';
      case 404:
        return 'Email service not found. Please contact support.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data?.message || `Server error (${status}). Please try again.`;
    }
  }
  
  if (error.request) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return error.message || 'An unexpected error occurred';
};

export const getEmailDebugInfo = () => {
  const isEmailEnabled = () => {
    return process.env.REACT_APP_EMAIL_ENABLED !== 'false';
  };

  return {
    emailEnabled: isEmailEnabled(),
    apiUrl: BASE_URL || 'Not set',
    hasToken: !!localStorage.getItem('token'),
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
}; 