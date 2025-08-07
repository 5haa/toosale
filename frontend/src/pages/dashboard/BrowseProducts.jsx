import React, { useState } from 'react';

const BrowseProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🛍️' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'home', name: 'Home & Garden', icon: '🏡' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'toys', name: 'Toys', icon: '🧸' },
    { id: 'books', name: 'Books', icon: '📚' }
  ];

  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 299,
      originalPrice: 399,
      commission: 45,
      rating: 4.8,
      reviews: 1243,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      category: 'electronics',
      inStore: false,
      trending: true,
      fastShipping: true
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 249,
      originalPrice: 349,
      commission: 38,
      rating: 4.6,
      reviews: 856,
      image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=300&h=300&fit=crop',
      category: 'electronics',
      inStore: true,
      trending: false,
      fastShipping: true
    },
    {
      id: 3,
      name: 'Designer Sunglasses',
      price: 159,
      originalPrice: 229,
      commission: 24,
      rating: 4.7,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
      category: 'fashion',
      inStore: false,
      trending: true,
      fastShipping: false
    },
    {
      id: 4,
      name: 'Minimalist Backpack',
      price: 89,
      originalPrice: 129,
      commission: 13,
      rating: 4.5,
      reviews: 342,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      category: 'fashion',
      inStore: false,
      trending: false,
      fastShipping: true
    },
    {
      id: 5,
      name: 'Wireless Speaker',
      price: 199,
      originalPrice: 279,
      commission: 30,
      rating: 4.9,
      reviews: 1876,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
      category: 'electronics',
      inStore: false,
      trending: true,
      fastShipping: true
    },
    {
      id: 6,
      name: 'Ceramic Plant Pot Set',
      price: 45,
      originalPrice: 69,
      commission: 7,
      rating: 4.4,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop',
      category: 'home',
      inStore: false,
      trending: false,
      fastShipping: false
    }
  ];

  const [storeProducts, setStoreProducts] = useState(
    products.filter(p => p.inStore).map(p => p.id)
  );

  const handleAddToStore = (productId) => {
    setStoreProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
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

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-apple-gray-900">Browse Products</h1>
        <p className="text-apple-gray-600 mt-2">Discover products to add to your store</p>
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
            <option value="popular">Most Popular</option>
            <option value="commission">Highest Commission</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-apple-gray-900 mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                selectedCategory === category.id
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isInStore = storeProducts.includes(product.id);
          
          return (
            <div key={product.id} className="card-apple overflow-hidden group">
              <div className="relative">
                <img
                  src={product.image}
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
                    {product.rating} ({product.reviews})
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
                      ${product.commission} commission
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToStore(product.id)}
                  className={`w-full py-2 px-4 rounded-xl font-medium transition-colors ${
                    isInStore
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-apple-blue text-white hover:bg-blue-600'
                  }`}
                >
                  {isInStore ? 'Remove from Store' : 'Add to Store'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div className="mt-12 text-center">
        <button className="btn-apple-outline px-8 py-3">
          Load More Products
        </button>
      </div>
    </div>
  );
};

export default BrowseProducts;

