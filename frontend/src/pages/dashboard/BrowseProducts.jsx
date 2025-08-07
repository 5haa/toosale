import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const BrowseProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);
  const [storeProducts, setStoreProducts] = useState(new Set());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories and store info in parallel
      const [categoriesResponse, storeResponse] = await Promise.all([
        api.getCategories(),
        api.getMyStore().catch(() => ({ success: false })) // Don't fail if no store
      ]);

      if (categoriesResponse.success) {
        const allCategories = [
          { id: 'all', name: 'All Categories', slug: 'all', icon: '🛍️' },
          ...categoriesResponse.categories
        ];
        setCategories(allCategories);
      }

      if (storeResponse.success && storeResponse.store) {
        setStore(storeResponse.store);
        // Get current store products
        const storeProductsResponse = await api.getStoreProducts(storeResponse.store.id);
        if (storeProductsResponse.success) {
          setStoreProducts(new Set(storeProductsResponse.products.map(p => p.id)));
        }
      }

      // Fetch initial products
      await fetchProducts();
      
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {
        sortBy: sortBy === 'popular' ? 'rating' : sortBy,
        sortOrder: 'DESC',
        limit: 50
      };

      // Only add search parameter if there's actually a search query
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Only add category parameter if it's not 'all'
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      const response = await api.getProducts(params);
      
      if (response.success) {
        setProducts(response.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    }
  };

  // Refetch products when filters change
  useEffect(() => {
    if (initialLoadComplete) {
      fetchProducts();
    }
  }, [searchQuery, selectedCategory, sortBy, initialLoadComplete]);

  const handleAddToStore = async (productId) => {
    if (!store) {
      setError('You need to create a store first');
      return;
    }

    try {
      const isInStore = storeProducts.has(productId);
      
      if (isInStore) {
        await api.removeProductFromStore(store.id, productId);
        setStoreProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await api.addProductToStore(store.id, { productId });
        setStoreProducts(prev => new Set([...prev, productId]));
      }
    } catch (err) {
      console.error('Failed to update store product:', err);
      setError('Failed to update product in store');
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
            <p className="text-apple-gray-600">Loading products...</p>
          </div>
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
          <button 
            onClick={() => setError(null)}
            className="text-red-700 underline text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-apple-gray-900">Browse Products</h1>
        <p className="text-apple-gray-600 mt-2">
          Discover products to add to your store
          {store ? ` (${storeProducts.size} products in your store)` : ' (Create a store to start adding products)'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card-apple p-6 mb-8">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-apple"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue"
          >
            <option value="rating">Highest Rated</option>
            <option value="review_count">Most Reviews</option>
            <option value="price">Price: Low to High</option>
            <option value="created_at">Newest First</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-apple-gray-900 mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {categories.map((category) => (
            <button
              key={category.id || category.slug}
              onClick={() => setSelectedCategory(category.slug || category.id)}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                selectedCategory === (category.slug || category.id)
                  ? 'bg-apple-blue text-white shadow-lg transform scale-105'
                  : 'bg-white border border-apple-gray-200 hover:bg-apple-gray-50 hover:shadow-md'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-xs font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
          const isInStore = storeProducts.has(product.id);
          
          return (
            <div key={product.id} className="card-apple overflow-hidden group">
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.trending && (
                    <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      🔥 Trending
                    </span>
                  )}
                  {product.fastShipping && (
                    <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      🚀 Fast Ship
                    </span>
                  )}
                </div>

                {/* Store Status */}
                <div className="absolute top-3 right-3">
                  {isInStore && (
                    <span className="bg-apple-blue text-white text-xs font-medium px-2 py-1 rounded-full">
                      ✓ In Store
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-apple-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                                      <span className="text-sm text-apple-gray-500">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-apple-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-apple-gray-500 line-through ml-2">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-green-600 font-medium">
                      ${(parseFloat(product.commissionAmount) || 0).toFixed(2)} commission
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToStore(product.id)}
                  disabled={!store}
                  className={`w-full py-2 px-4 rounded-xl font-medium transition-colors ${
                    !store
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isInStore
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-apple-blue text-white hover:bg-blue-600'
                  }`}
                >
                  {!store ? 'Create Store First' : isInStore ? 'Remove from Store' : 'Add to Store'}
                </button>
              </div>
            </div>
          );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-apple-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-apple-gray-900 mb-2">No products found</h3>
          <p className="text-apple-gray-600 mb-6">
            {searchQuery ? 'Try adjusting your search or filters' : 'No products available in this category'}
          </p>
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn-apple-outline"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Load More - Only show if we have products */}
      {products.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-apple-gray-600 text-sm">
            Showing {products.length} products. More features coming soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default BrowseProducts;

