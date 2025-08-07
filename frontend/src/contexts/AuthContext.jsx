import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (apiService.isAuthenticated()) {
        const response = await apiService.getCurrentUser();
        if (response.success) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear it
          apiService.removeAuthToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiService.removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      if (response.success) {
        apiService.setAuthToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await apiService.signup(userData);
      if (response.success) {
        apiService.setAuthToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message, errors: response.errors };
    } catch (error) {
      console.error('Signup failed:', error);
      // Return the full error structure for better error handling
      return { 
        success: false, 
        message: error.message || 'Signup failed',
        errors: error.data?.errors || null
      };
    }
  };

  const logout = () => {
    apiService.removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
