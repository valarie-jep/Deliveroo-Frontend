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
  if (error.message?.includes('network')) {
    return 'Network error. Please check your connection.';
  }
  if (error.message?.includes('401')) {
    return 'Authentication failed. Please log in again.';
  }
  if (error.message?.includes('500')) {
    return 'Server error. Please try again later.';
  }
  return 'Email operation failed. Please try again.';
}; 