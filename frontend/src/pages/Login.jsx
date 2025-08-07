import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different types of errors
      if (err.status === 429) {
        // Rate limit error
        setError(err.message || 'Too many login attempts. Please try again later.');
      } else if (err.status === 401) {
        // Authentication error
        setError('Invalid email or password');
      } else if (err.status === 500) {
        // Server error
        setError('Server error. Please try again later.');
      } else if (!navigator.onLine) {
        // Network error
        setError('No internet connection. Please check your network and try again.');
      } else {
        // Fallback error message
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-apple-gray-800">
            TooSale
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold text-apple-gray-800">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-apple-gray-600">
            Or{' '}
            <Link
              to="/signup"
              className="font-medium text-apple-blue hover:text-blue-600 transition-colors duration-200"
            >
              create a new account
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">Login Error:</p>
              {typeof error === 'string' ? (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              ) : (
                <ul className="text-sm text-red-600 mt-1 list-disc list-inside">
                  {Array.isArray(error) ? error.map((err, index) => (
                    <li key={index}>{err.msg || err.message || err}</li>
                  )) : (
                    <li>{error.message || JSON.stringify(error)}</li>
                  )}
                </ul>
              )}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-apple-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-apple-gray-300 rounded-xl shadow-sm placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-apple-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-apple-gray-300 rounded-xl shadow-sm placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition-colors duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-apple-blue focus:ring-apple-blue border-apple-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-apple-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-apple-blue hover:text-blue-600 transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-apple-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-apple-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>


          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
