export const handleEmailError = (error, action) => {
  console.error(`Email ${action} failed:`, error);
  
  // Don't break the main functionality if email fails
  // Just log the error and continue
  return {
    success: false,
    error: `Email ${action} failed, but operation completed`
  };
};

export const isEmailEnabled = () => {
  return process.env.REACT_APP_EMAIL_ENABLED !== 'false';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getEmailErrorMessage = (error) => {
  console.log('Processing email error:', error);
  
  // Check for network errors
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Check for authentication errors
  if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
    return 'Authentication failed. Please log in again.';
  }
  
  // Check for server errors
  if (error.message?.includes('500') || error.message?.includes('Internal Server Error')) {
    return 'Server error. The email service is temporarily unavailable.';
  }
  
  // Check for service unavailable
  if (error.message?.includes('503') || error.message?.includes('Service Unavailable')) {
    return 'Email service is temporarily unavailable. Please try again later.';
  }
  
  // Check for rate limiting
  if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
    return 'Too many email requests. Please wait a moment before trying again.';
  }
  
  // Check for specific backend errors
  if (error.message?.includes('Email service unavailable')) {
    return 'Email service is not configured on the server. Please contact support.';
  }
  
  // Check for API endpoint not found
  if (error.message?.includes('404') || error.message?.includes('Not Found')) {
    return 'Email service endpoint not found. The server may not support email functionality.';
  }
  
  // Default error message
  return 'Email operation failed. Please try again or contact support if the problem persists.';
};

export const getEmailDebugInfo = () => {
  return {
    emailEnabled: isEmailEnabled(),
    apiUrl: process.env.REACT_APP_API_URL || 'Not set',
    hasToken: !!localStorage.getItem('token'),
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
}; 