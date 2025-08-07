import React, { useState, useEffect } from 'react';
import api from '../services/api';

const StoreSettings = ({ isOpen, onClose, store, onStoreUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    slug: '',
    themeColor: '#007AFF'
  });

  // Initialize form data when store changes
  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || '',
        description: store.description || '',
        isPublic: store.isPublic || true,
        slug: store.slug || '',
        themeColor: store.themeColor || '#007AFF'
      });
    }
  }, [store]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const validateSlug = (slug) => {
    if (!slug) return { isValid: false, message: 'Store URL is required' };
    
    // Check length
    if (slug.length < 3) return { isValid: false, message: 'Store URL must be at least 3 characters' };
    if (slug.length > 50) return { isValid: false, message: 'Store URL must be less than 50 characters' };
    
    // Check format: only lowercase letters, numbers, and hyphens
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return { isValid: false, message: 'Store URL can only contain lowercase letters, numbers, and hyphens' };
    }
    
    // Check that it doesn't start or end with hyphen
    if (slug.startsWith('-') || slug.endsWith('-')) {
      return { isValid: false, message: 'Store URL cannot start or end with a hyphen' };
    }
    
    // Check for consecutive hyphens
    if (slug.includes('--')) {
      return { isValid: false, message: 'Store URL cannot contain consecutive hyphens' };
    }
    
    return { isValid: true, message: '' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate slug before submitting
    const slugValidation = validateSlug(formData.slug);
    if (!slugValidation.isValid) {
      setError(slugValidation.message);
      setLoading(false);
      return;
    }

    try {
      const response = await api.updateStore(store.id, formData);
      
      if (response.success) {
        setSuccess(true);
        onStoreUpdate(response.store);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError(response.message || 'Failed to update store settings');
      }
    } catch (err) {
      console.error('Failed to update store:', err);
      setError(err.message || 'Failed to update store settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const themeColors = [
    { name: 'Blue', value: '#007AFF' },
    { name: 'Purple', value: '#5856D6' },
    { name: 'Green', value: '#34C759' },
    { name: 'Orange', value: '#FF9500' },
    { name: 'Red', value: '#FF3B30' },
    { name: 'Pink', value: '#FF2D92' },
    { name: 'Teal', value: '#5AC8FA' },
    { name: 'Indigo', value: '#5856D6' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-apple-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-apple-gray-900">Store Settings</h2>
          <button
            onClick={onClose}
            className="text-apple-gray-400 hover:text-apple-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-600 font-medium">Store settings updated successfully!</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-apple"
                placeholder="Enter your store name"
                maxLength="255"
              />
              <p className="text-xs text-apple-gray-500 mt-1">
                This will be your store's display name
              </p>
            </div>

            {/* Store URL */}
            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                Store URL *
              </label>
              <div className="flex items-center">
                <span className="text-sm text-apple-gray-500 bg-apple-gray-50 border border-apple-gray-200 rounded-l-xl px-3 py-2 border-r-0">
                  toosale.com/store/
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase())}
                  className="input-apple rounded-l-none flex-1"
                  placeholder="your-store-url"
                  maxLength="50"
                  pattern="^[a-z0-9-]+$"
                />
              </div>
              {formData.slug && (() => {
                const validation = validateSlug(formData.slug);
                return (
                  <p className={`text-xs mt-1 ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.isValid ? '✓ Valid store URL' : validation.message}
                  </p>
                );
              })()}
              <p className="text-xs text-apple-gray-500 mt-1">
                Choose a unique URL for your store. Use only lowercase letters, numbers, and hyphens.
              </p>
            </div>

            {/* Store Description */}
            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                Store Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input-apple"
                rows="3"
                placeholder="Describe what your store offers"
                maxLength="1000"
              />
              <p className="text-xs text-apple-gray-500 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>



            {/* Theme Color */}
            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-3">
                Theme Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleInputChange('themeColor', color.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.themeColor === color.value
                        ? 'border-apple-gray-900 shadow-md'
                        : 'border-apple-gray-200 hover:border-apple-gray-300'
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded-lg"
                      style={{ backgroundColor: color.value }}
                    />
                    <p className="text-xs text-apple-gray-600 mt-2">{color.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Store Visibility */}
            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-3">
                Store Visibility
              </label>
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.isPublic}
                    onChange={() => handleInputChange('isPublic', true)}
                    className="mt-1 text-apple-blue focus:ring-apple-blue"
                  />
                  <div>
                    <p className="font-medium text-apple-gray-900">🌐 Public</p>
                    <p className="text-sm text-apple-gray-600">
                      Anyone can discover and visit your store
                    </p>
                  </div>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!formData.isPublic}
                    onChange={() => handleInputChange('isPublic', false)}
                    className="mt-1 text-apple-blue focus:ring-apple-blue"
                  />
                  <div>
                    <p className="font-medium text-apple-gray-900">🔒 Private</p>
                    <p className="text-sm text-apple-gray-600">
                      Only people with the direct link can access your store
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8 pt-6 border-t border-apple-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-apple-outline flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.slug.trim() || !validateSlug(formData.slug).isValid}
              className="btn-apple flex-1"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreSettings;
