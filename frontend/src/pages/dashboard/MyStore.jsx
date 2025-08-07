import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const MyStore = () => {
  const [store, setStore] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [storeForm, setStoreForm] = useState({
    name: '',
    description: '',
    isPublic: true,
    themeColor: '#007AFF'
  });

  // Fetch store data
  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const response = await api.getMyStore();
      
      if (response.success && response.store) {
        setStore(response.store);
        // Fetch store products if store exists
        const productsResponse = await api.getStoreProducts(response.store.id);
        if (productsResponse.success) {
          setStoreProducts(productsResponse.products || []);
        }
      } else {
        setStore(null);
        setStoreProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch store data:', err);
      setError('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.createStore(storeForm);
      
      if (response.success) {
        setStore(response.store);
        setShowCreateStore(false);
        setStoreForm({ name: '', description: '', isPublic: true, themeColor: '#007AFF' });
      } else {
        setError(response.message || 'Failed to create store');
      }
    } catch (err) {
      console.error('Failed to create store:', err);
      setError('Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await api.removeProductFromStore(store.id, productId);
      setStoreProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Failed to remove product:', err);
      setError('Failed to remove product');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-apple-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto mb-4"></div>
            <p className="text-apple-gray-600">Loading your store...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!store && !showCreateStore) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-apple-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-apple-gray-900 mb-4">Create Your Store</h1>
          <p className="text-apple-gray-600 mb-8 max-w-md mx-auto">
            Start selling by creating your own store. Add products, customize your brand, and start earning commissions.
          </p>
          <button 
            onClick={() => setShowCreateStore(true)}
            className="btn-apple px-8 py-3"
          >
            Create Store
          </button>
        </div>
      </div>
    );
  }

  if (showCreateStore) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-apple-gray-900 mb-4">Create Your Store</h1>
            <p className="text-apple-gray-600">Fill in the details below to set up your store</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleCreateStore} className="card-apple p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={storeForm.name}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input-apple"
                  placeholder="Enter your store name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                  Store Description
                </label>
                <textarea
                  value={storeForm.description}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-apple"
                  rows="3"
                  placeholder="Describe what your store offers"
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={storeForm.isPublic}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="h-4 w-4 text-apple-blue focus:ring-apple-blue border-apple-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-apple-gray-700">
                  Make store public (customers can discover and visit your store)
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateStore(false)}
                  className="btn-apple-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !storeForm.name}
                  className="btn-apple flex-1"
                >
                  {loading ? 'Creating...' : 'Create Store'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-apple-gray-900">My Store</h1>
          <p className="text-apple-gray-600 mt-2">Manage your store and track performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-apple-outline">
            Store Settings
          </button>
          <a
            href={`/store/${store.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-apple"
          >
            View Store
          </a>
        </div>
      </div>

      {/* Store Overview */}
      <div className="card-apple p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-apple-gray-900">{store.name}</h2>
            <p className="text-apple-gray-600">{store.description || 'No description set'}</p>
            <div className="flex items-center mt-2">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                store.isPublic 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {store.isPublic ? '🌐 Public' : '🔒 Private'}
              </span>
              <span className="ml-3 text-sm text-apple-gray-500">
                toosale.com/store/{store.slug}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-gradient-to-r from-apple-blue to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {store.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="card-apple p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-apple-gray-600">Products</p>
              <p className="text-2xl font-bold text-apple-gray-900">{store.productCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="card-apple p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-apple-gray-600">Views</p>
              <p className="text-2xl font-bold text-apple-gray-900">{store.analytics?.totalViews || 0}</p>
            </div>
          </div>
        </div>

        <div className="card-apple p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-apple-gray-600">Sales</p>
              <p className="text-2xl font-bold text-apple-gray-900">{store.totalSales || 0}</p>
            </div>
          </div>
        </div>

        <div className="card-apple p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-apple-gray-600">Earnings</p>
              <p className="text-2xl font-bold text-apple-gray-900">${store.totalEarnings?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        <div className="card-apple p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-apple-gray-600">Conversion</p>
              <p className="text-2xl font-bold text-apple-gray-900">{store.analytics?.conversionRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Products */}
      <div className="card-apple">
        <div className="px-6 py-4 border-b border-apple-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-apple-gray-900">Store Products</h3>
            <Link
              to="/dashboard/browse-products"
              className="text-apple-blue hover:text-blue-600 font-medium text-sm transition-colors"
            >
              Browse More Products
            </Link>
          </div>
        </div>
        
        {storeProducts.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {storeProducts.map((product) => (
                <div key={product.id} className="border border-apple-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-apple-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm text-apple-gray-500">
                        ({product.reviewCount})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-apple-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        ${(parseFloat(product.commissionAmount) || 0).toFixed(2)} commission
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-apple-gray-500">
                        Added {new Date(product.addedAt).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-apple-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
            </svg>
            <h3 className="text-lg font-medium text-apple-gray-900 mb-2">No products in your store yet</h3>
            <p className="text-apple-gray-600 mb-4">Start by browsing our product catalog and adding items to your store</p>
            <Link
              to="/dashboard/browse-products"
              className="btn-apple"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStore;
