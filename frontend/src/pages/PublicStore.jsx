import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Cart from '../components/Cart';

const PublicStore = () => {
  const { storeName } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { items: cartItems, cartCount, addToCart, updateQuantity, removeFromCart } = useCart();

  // Mock store data - in real app, this would come from API
  const mockStoreData = {
    'my-awesome-store': {
      name: 'My Awesome Store',
      description: 'Premium products at unbeatable prices',
      owner: 'John Doe',
      logo: null,
      products: [
        {
          id: 2,
          name: 'Smart Fitness Watch',
          price: 249,
          originalPrice: 349,
          rating: 4.6,
          reviews: 856,
          image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
          category: 'Electronics',
          description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and 7-day battery life.',
          badge: 'Best Seller'
        },
        {
          id: 1,
          name: 'Wireless Bluetooth Headphones',
          price: 299,
          originalPrice: 399,
          rating: 4.8,
          reviews: 1243,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          category: 'Electronics',
          description: 'Premium wireless headphones with active noise cancellation and superior sound quality.',
          badge: 'Trending'
        },
        {
          id: 3,
          name: 'Designer Sunglasses',
          price: 159,
          originalPrice: 229,
          rating: 4.7,
          reviews: 567,
          image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
          category: 'Fashion',
          description: 'Stylish designer sunglasses with UV protection and premium build quality.',
          badge: 'Sale'
        },
        {
          id: 4,
          name: 'Minimalist Backpack',
          price: 89,
          originalPrice: 129,
          rating: 4.5,
          reviews: 342,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
          category: 'Fashion',
          description: 'Clean, minimalist design backpack perfect for work, travel, or everyday use.'
        },
        {
          id: 5,
          name: 'Wireless Speaker',
          price: 199,
          originalPrice: 279,
          rating: 4.9,
          reviews: 1876,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
          category: 'Electronics',
          description: 'Portable wireless speaker with rich sound and long battery life.'
        },
        {
          id: 6,
          name: 'Ceramic Plant Pot Set',
          price: 45,
          originalPrice: 69,
          rating: 4.4,
          reviews: 234,
          image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
          category: 'Home',
          description: 'Beautiful ceramic plant pots to brighten up your living space.'
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const storeData = mockStoreData[storeName];
      setStore(storeData);
      setLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeName]);

  const handleAddToCart = (product) => {
    addToCart(product);
    console.log('Added to cart:', product.name);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
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

  const filteredProducts = store?.products.filter(product => 
    searchQuery === '' || 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto mb-4"></div>
          <p className="text-apple-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-apple-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-apple-gray-900 mb-2">Store Not Found</h1>
          <p className="text-apple-gray-600 mb-6">The store you're looking for doesn't exist.</p>
          <a href="/" className="btn-apple">
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Store Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-apple-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Store Logo/Name */}
            <div className="flex items-center space-x-3">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={`${store.name} logo`}
                  className="w-8 h-8 rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {store.name.charAt(0)}
                  </span>
                </div>
              )}
              <h1 className="text-lg font-semibold text-apple-gray-900">{store.name}</h1>
            </div>

            {/* Search and Cart */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64 pl-8 pr-4 py-2 text-sm border border-apple-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue"
                />
                <svg className="absolute left-2.5 top-2 w-4 h-4 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Mobile Search Button */}
              <button className="sm:hidden p-2 text-apple-gray-600 hover:text-apple-blue rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart */}
              <button 
                onClick={handleOpenCart}
                className="relative p-2 text-apple-gray-600 hover:text-apple-blue rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
                  <circle cx="9" cy="20" r="1"/>
                  <circle cx="15" cy="20" r="1"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-apple-blue text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="sm:hidden bg-white border-b border-apple-gray-100 px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-apple-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-apple-blue"
          />
          <svg className="absolute left-2.5 top-2 w-4 h-4 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Products Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Info */}
        <div className="text-center mb-8">
          <p className="text-apple-gray-600 max-w-2xl mx-auto">
            {store.description}
          </p>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-apple-gray-500">
            <span>{store.products.length} Products</span>
            <span>•</span>
            <span>Free Shipping</span>
            <span>•</span>
            <span>Easy Returns</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-apple-gray-100">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {product.originalPrice && (
                      <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                    {product.badge && (
                      <span className={`text-white text-xs font-medium px-2 py-1 rounded-full ${
                        product.badge === 'Best Seller' ? 'bg-green-500' :
                        product.badge === 'Trending' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Quick Add Button */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="opacity-0 group-hover:opacity-100 bg-white text-apple-gray-900 px-4 py-2 rounded-full font-medium transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="mb-3">
                    <span className="text-xs font-medium text-apple-blue bg-blue-50 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-apple-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-apple-gray-500">
                      ({product.reviews.toLocaleString()})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-apple-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-apple-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-apple-gray-900 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-apple-gray-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-apple-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-apple-gray-900 mb-2">No products found</h3>
            <p className="text-apple-gray-600">Try adjusting your search or browse all products</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-apple-blue hover:text-blue-600 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Cart Component */}
      <Cart
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
};

export default PublicStore;