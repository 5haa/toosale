// Error handling utilities

export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || 'Server error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Unable to connect to server. Please check your internet connection.';
  } else if (error.message) {
    // Something else happened
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isServerError = (error) => {
  return error.response && error.response.status >= 500;
};

export const isAuthError = (error) => {
  return error.response && (error.response.status === 401 || error.response.status === 403);
};

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  if (isNetworkError(error)) {
    return 'Unable to connect to server. Please check your internet connection.';
  }
  
  if (isAuthError(error)) {
    return 'Your session has expired. Please log in again.';
  }
  
  if (isServerError(error)) {
    return 'Server error. Please try again later.';
  }
  
  return getErrorMessage(error) || defaultMessage;
};
