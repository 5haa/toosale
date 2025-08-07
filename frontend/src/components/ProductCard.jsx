import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product, className = "" }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    console.log('Added to cart:', product.name);
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
    <Link
      to={`/product/${product.id}`}
      className={`group cursor-pointer block ${className}`}
    >
      <div className="relative bg-apple-gray-50 rounded-2xl overflow-hidden mb-4 group-hover:shadow-2xl transition-all duration-300">
        <img
          src={product.imageUrl || product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges */}
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className="bg-apple-blue text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
              {product.badge}
            </span>
          </div>
        )}
        
        {/* Discount Badge */}
        {product.originalPrice && product.price && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          </div>
        )}
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-white text-apple-gray-800 px-6 py-2 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Quick View
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {/* Category */}
        {product.category && (
          <p className="text-sm text-apple-gray-500 uppercase tracking-wide">
            {product.category}
          </p>
        )}
        
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-apple-gray-800 group-hover:text-apple-blue transition-colors leading-tight">
          {product.name}
        </h3>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-apple-gray-500">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount > 0 && (
              <span className="text-sm text-apple-gray-400">
                ({product.reviewCount} reviews)
              </span>
            )}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-apple-gray-800">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-apple-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button 
          className="w-full btn-apple mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

