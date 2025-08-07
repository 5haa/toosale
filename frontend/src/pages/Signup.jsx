import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateSignupForm } from '../utils/validation';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
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

    // Client-side validation
    const validationErrors = validateSignupForm(formData);
    
    if (!formData.agreeToTerms) {
      validationErrors.push('Please agree to the Terms of Service and Privacy Policy');
    }

    if (validationErrors.length > 0) {
      setError(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        // Handle validation errors specifically
        if (result.errors && Array.isArray(result.errors)) {
          setError(result.errors);
        } else {
          setError(result.message || 'Signup failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-apple-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-apple-blue hover:text-blue-600 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">Registration Error:</p>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-apple-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-apple-gray-300 rounded-xl shadow-sm placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition-colors duration-200"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-apple-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-apple-gray-300 rounded-xl shadow-sm placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition-colors duration-200"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

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
                  placeholder="john@example.com"
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-apple-gray-300 rounded-xl shadow-sm placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition-colors duration-200"
                  placeholder="Enter a strong password"
                />
              </div>
              <div className="mt-1 text-xs text-apple-gray-500">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter (A-Z)</li>
                  <li>One lowercase letter (a-z)</li>
                  <li>One number (0-9)</li>
                </ul>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-apple-gray-700">
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-apple-gray-300 rounded-xl shadow-sm placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition-colors duration-200"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-apple-blue focus:ring-apple-blue border-apple-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-apple-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-apple-blue hover:text-blue-600">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-apple-blue hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="subscribeNewsletter"
                  name="subscribeNewsletter"
                  type="checkbox"
                  checked={formData.subscribeNewsletter}
                  onChange={handleChange}
                  className="h-4 w-4 text-apple-blue focus:ring-apple-blue border-apple-gray-300 rounded"
                />
                <label htmlFor="subscribeNewsletter" className="ml-2 block text-sm text-apple-gray-700">
                  Subscribe to our newsletter for updates and exclusive offers
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-apple-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-apple-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>


          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

