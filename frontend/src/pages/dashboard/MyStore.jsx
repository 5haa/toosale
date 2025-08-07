import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MyStore = () => {
  const [storeSettings] = useState({
    storeName: 'My Awesome Store',
    storeDescription: 'Premium products at unbeatable prices',
    isPublic: true,
    customDomain: ''
  });

  const storeProducts = [
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
      sales: 23,
      addedDate: '2024-01-10'
    }
  ];

  const storeStats = {
    totalProducts: storeProducts.length,
    totalViews: 1247,
    totalSales: 23,
    revenue: 874.00,
    conversionRate: 1.8
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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
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
            href={`/store/${storeSettings.storeName.toLowerCase().replace(/\s+/g, '-')}`}
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
            <h2 className="text-2xl font-bold text-apple-gray-900">{storeSettings.storeName}</h2>
            <p className="text-apple-gray-600">{storeSettings.storeDescription}</p>
            <div className="flex items-center mt-2">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                storeSettings.isPublic 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {storeSettings.isPublic ? '🌐 Public' : '🔒 Private'}
              </span>
              <span className="ml-3 text-sm text-apple-gray-500">
                toosale.com/store/{storeSettings.storeName.toLowerCase().replace(/\s+/g, '-')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-gradient-to-r from-apple-blue to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {storeSettings.storeName.charAt(0)}
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
              <p className="text-2xl font-bold text-apple-gray-900">{storeStats.totalProducts}</p>
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
              <p className="text-2xl font-bold text-apple-gray-900">{storeStats.totalViews}</p>
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
              <p className="text-2xl font-bold text-apple-gray-900">{storeStats.totalSales}</p>
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
              <p className="text-sm font-medium text-apple-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-apple-gray-900">${storeStats.revenue}</p>
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
              <p className="text-2xl font-bold text-apple-gray-900">{storeStats.conversionRate}%</p>
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
              to="/dashboard/products"
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
                    src={product.image}
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
                        ({product.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-apple-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        {product.sales} sales
                      </span>
                    </div>
                    
                    <div className="text-sm text-apple-gray-500">
                      Added {product.addedDate}
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
              to="/dashboard/products"
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
