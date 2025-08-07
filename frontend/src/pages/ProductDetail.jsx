import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Load product and reviews data
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.getProduct(id);
      if (response.success) {
        setProduct(response.product);
        // Set default selections
        if (response.product?.colors?.length > 0) {
          setSelectedColor(response.product.colors[0]);
        }
        if (response.product?.sizes?.length > 0) {
          setSelectedSize(response.product.sizes[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await api.getReviewsSummary(id);
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchUserReview = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.getUserReview(id);
      if (response.success) {
        setUserReview(response.data);
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) return;
    
    try {
      setSubmittingReview(true);
      const response = await api.submitReview(id, newRating);
      if (response.success) {
        setUserReview(response.data);
        setShowReviewForm(false);
        // Refresh reviews summary
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    try {
      const response = await api.deleteReview(id);
      if (response.success) {
        setUserReview(null);
        // Refresh reviews summary
        fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
      fetchUserReview();
    }
  }, [id, isAuthenticated]);

  const handleAddToCart = () => {
    if (product) {
      const cartProduct = {
        ...product,
        quantity,
        selectedColor: selectedColor || undefined,
        selectedSize: selectedSize || undefined
      };
      addToCart(cartProduct);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${interactive ? 'cursor-pointer' : ''} ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        onClick={interactive && onRatingChange ? () => onRatingChange(i + 1) : undefined}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const renderRatingDistribution = () => {
    if (!reviews?.distribution) return null;
    
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const data = reviews.distribution[star] || { count: 0, percentage: 0 };
          
          return (
            <div key={star} className="flex items-center space-x-3">
              <span className="text-sm font-medium w-2">{star}</span>
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-300" 
                  style={{ width: `${data.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 w-8">{data.count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/products" className="text-blue-600 hover:text-blue-500">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-700">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
              <img
                src={product.imageUrls?.[selectedImage] || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex space-x-2">
                {product.imageUrls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.trending && (
                  <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-purple-500">
                    Trending
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg font-medium text-gray-900">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({product.reviewCount?.toLocaleString()} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Color: {selectedColor}
                  </label>
                  <div className="flex space-x-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg text-sm ${
                          selectedColor === color
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Size: {selectedSize}
                  </label>
                  <div className="flex space-x-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
              
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2 mb-1">
                  <span>✓</span>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6">
                {reviewsLoading ? (
                  <div className="text-center">Loading reviews...</div>
                ) : reviews ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {reviews.averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        {renderStars(reviews.averageRating)}
                      </div>
                      <p className="text-gray-600">
                        Based on {reviews.totalReviews?.toLocaleString()} reviews
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Rating Distribution</h4>
                      {renderRatingDistribution()}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500">No reviews yet</div>
                )}
              </div>
              
              {/* User Review Form */}
              {isAuthenticated && (
                <div className="mt-6">
                  {userReview ? (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Your Review</h4>
                        <button
                          onClick={handleDeleteReview}
                          className="text-red-600 text-sm hover:text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="flex items-center">
                        {renderStars(userReview.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          {new Date(userReview.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {!showReviewForm ? (
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                          Write a Review
                        </button>
                      ) : (
                        <div className="bg-white border border-gray-300 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Rate this product</h4>
                          <div className="flex items-center space-x-2 mb-4">
                            {renderStars(newRating, true, setNewRating)}
                            <span className="text-sm text-gray-600">({newRating} stars)</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSubmitReview}
                              disabled={submittingReview}
                              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                              {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button
                              onClick={() => setShowReviewForm(false)}
                              className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Features and Specifications */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-green-500">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="font-medium text-gray-700">{key}:</span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;