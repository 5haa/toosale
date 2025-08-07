import { useState, useCallback } from 'react';
import { handleApiError } from '../utils/errorHandler';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { onSuccess, onError, successMessage, errorMessage } = options;
    
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      if (successMessage) {
        // You could integrate a toast notification system here
        console.log(successMessage);
      }
      
      return result;
    } catch (err) {
      const errorMsg = handleApiError(err, errorMessage);
      setError(errorMsg);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError
  };
};

export default useApi;
