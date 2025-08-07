import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  const { addToCart } = useCart();

  // Mock product data with multiple images and detailed info
  const mockProductData = {
    1: {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 1243,
      category: 'Electronics',
      badge: 'Trending',
      description: 'Experience premium sound quality with our wireless headphones featuring active noise cancellation, superior comfort, and all-day battery life. Perfect for music lovers, commuters, and professionals.',
      features: [
        'Active Noise Cancellation',
        '30-hour battery life',
        'Premium comfort padding',
        'High-resolution audio',
        'Quick charge (3 hours in 15 minutes)',
        'Voice assistant compatible',
        'Foldable design for portability'
      ],
      specifications: {
        'Driver Size': '40mm',
        'Frequency Response': '20Hz - 20kHz',
        'Impedance': '32 ohms',
        'Battery Life': '30 hours (ANC on), 40 hours (ANC off)',
        'Charging Time': '2 hours full charge',
        'Weight': '250g',
        'Bluetooth': 'Version 5.0',
        'Warranty': '2 years'
      },
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop'
      ],
      colors: ['Black', 'White', 'Silver'],
      sizes: [],
      inStock: true,
      stockCount: 15,
      ratingDistribution: {
        5: 856,
        4: 287,
        3: 67,
        2: 23,
        1: 10
      }
    },
    2: {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 249,
      originalPrice: 349,
      rating: 4.6,
      reviews: 856,
      category: 'Electronics',
      badge: 'Best Seller',
      description: 'Track your fitness goals with precision using our advanced smartwatch. Features heart rate monitoring, GPS tracking, waterproof design, and week-long battery life.',
      features: [
        'Heart rate monitoring',
        'GPS tracking',
        'Waterproof (50m)',
        '7-day battery life',
        'Sleep tracking',
        'Multiple sport modes',
        'Smart notifications'
      ],
      specifications: {
        'Display': '1.4" AMOLED',
        'Battery Life': '7 days typical use',
        'Water Resistance': '5ATM (50m)',
        'Sensors': 'Heart rate, GPS, Accelerometer, Gyroscope',
        'Connectivity': 'Bluetooth 5.0, Wi-Fi',
        'Storage': '4GB',
        'Weight': '42g',
        'Warranty': '1 year'
      },
      images: [
        'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=600&fit=crop'
      ],
      colors: ['Black', 'Blue', 'Rose Gold'],
      sizes: ['38mm', '42mm'],
      inStock: true,
      stockCount: 8,
      ratingDistribution: {
        5: 567,
        4: 189,
        3: 67,
        2: 23,
        1: 10
      }
    },
    3: {
      id: 3,
      name: 'Designer Sunglasses',
      price: 159,
      originalPrice: 229,
      rating: 4.7,
      reviews: 567,
      category: 'Fashion',
      badge: 'Sale',
      description: 'Protect your eyes in style with these premium designer sunglasses. Features UV400 protection, lightweight frames, and timeless design that complements any outfit.',
      features: [
        'UV400 protection',
        'Lightweight titanium frame',
        'Polarized lenses',
        'Scratch-resistant coating',
        'Adjustable nose pads',
        'Premium case included'
      ],
      specifications: {
        'Frame Material': 'Titanium',
        'Lens Material': 'Polarized glass',
        'UV Protection': 'UV400',
        'Weight': '28g',
        'Frame Width': '145mm',
        'Lens Width': '58mm',
        'Warranty': '2 years'
      },
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&h=600&fit=crop'
      ],
      colors: ['Black', 'Tortoise', 'Gold'],
      sizes: [],
      inStock: true,
      stockCount: 25,
      ratingDistribution: {
        5: 398,
        4: 123,
        3: 34,
        2: 8,
        1: 4
      }
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const productData = mockProductData[id];
      setProduct(productData);
      setLoading(false);
      if (productData?.colors?.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
      if (productData?.sizes?.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const cartProduct = {
        ...product,
        quantity,
        selectedColor: selectedColor || undefined,
        selectedSize: selectedSize || undefined
      };
      addToCart(cartProduct);
      console.log('Added to cart:', cartProduct);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-apple-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const renderRatingDistribution = () => {
    if (!product?.ratingDistribution) return null;
    
    const total = Object.values(product.ratingDistribution).reduce((sum, count) => sum + count, 0);
    
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = product.ratingDistribution[star] || 0;
          const percentage = (count / total) * 100;
          
          return (
            <div key={star} className="flex items-center space-x-3">
              <span className="text-sm font-medium w-2">{star}</span>
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 h-2 bg-apple-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-300" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-apple-gray-500 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto mb-4"></div>
          <p className="text-apple-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-apple-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-apple-gray-900 mb-2">Product Not Found</h1>
          <p className="text-apple-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/" className="btn-apple">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-apple-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-apple-blue hover:text-blue-600">Home</Link>
            <span className="text-apple-gray-400">/</span>
            <Link to="/products" className="text-apple-blue hover:text-blue-600">Products</Link>
            <span className="text-apple-gray-400">/</span>
            <span className="text-apple-gray-600">{product.category}</span>
            <span className="text-apple-gray-400">/</span>
            <span className="text-apple-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-apple-gray-100 rounded-2xl overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-apple-gray-100 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-apple-blue shadow-lg' 
                        : 'border-transparent hover:border-apple-gray-300'
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
                <span className="text-sm font-medium text-apple-blue bg-blue-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.badge && (
                  <span className={`text-white text-sm font-medium px-3 py-1 rounded-full ${
                    product.badge === 'Best Seller' ? 'bg-green-500' :
                    product.badge === 'Trending' ? 'bg-purple-500' :
                    product.badge === 'Sale' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-apple-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg font-medium text-apple-gray-900">
                  {product.rating}
                </span>
                <span className="text-apple-gray-500">
                  ({product.reviews?.toLocaleString()} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-4xl font-bold text-apple-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-apple-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded-full">
                      Save ${product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-apple-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-apple-gray-900 mb-3">Color</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedColor === color
                          ? 'border-apple-blue bg-blue-50 text-apple-blue'
                          : 'border-apple-gray-200 text-apple-gray-700 hover:border-apple-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-apple-gray-900 mb-3">Size</h3>
                <div className="flex space-x-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-apple-blue bg-blue-50 text-apple-blue'
                          : 'border-apple-gray-200 text-apple-gray-700 hover:border-apple-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-apple-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-apple-gray-300 flex items-center justify-center hover:bg-apple-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-xl font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-apple-gray-300 flex items-center justify-center hover:bg-apple-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-apple-gray-900 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-apple-gray-800 transition-colors disabled:bg-apple-gray-300 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-apple-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-apple-gray-200">
            <nav className="flex space-x-8">
              <button className="py-4 px-1 border-b-2 border-apple-blue text-apple-blue font-medium">
                Reviews ({product.reviews})
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-apple-gray-500 hover:text-apple-gray-700">
                Specifications
              </button>
            </nav>
          </div>

          <div className="py-8">
            {/* Reviews Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="lg:col-span-1">
                <div className="bg-apple-gray-50 rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-apple-gray-900 mb-2">
                      {product.rating}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {renderStars(product.rating)}
                    </div>
                    <p className="text-apple-gray-600">
                      Based on {product.reviews?.toLocaleString()} reviews
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-apple-gray-900">Rating Distribution</h4>
                    {renderRatingDistribution()}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Sample reviews */}
                  {[
                    {
                      name: 'Sarah Johnson',
                      rating: 5,
                      date: '2 days ago',
                      review: 'Absolutely love these! The sound quality is incredible and they\'re so comfortable to wear for hours. The noise cancellation really works well.',
                      verified: true
                    },
                    {
                      name: 'Mike Chen',
                      rating: 4,
                      date: '1 week ago',
                      review: 'Great product overall. Battery life is as advertised and the build quality feels premium. Only minor complaint is that they can get a bit warm during long sessions.',
                      verified: true
                    },
                    {
                      name: 'Emily Rodriguez',
                      rating: 5,
                      date: '2 weeks ago',
                      review: 'Perfect for my daily commute. The active noise cancellation blocks out all the subway noise. Fast charging is a lifesaver too!',
                      verified: true
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-b border-apple-gray-100 pb-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-semibold text-apple-gray-900">{review.name}</h5>
                            {review.verified && (
                              <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-apple-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-apple-gray-700 leading-relaxed">{review.review}</p>
                    </div>
                  ))}
                  
                  <button className="w-full py-3 px-6 border border-apple-gray-300 rounded-xl text-apple-gray-700 font-medium hover:bg-apple-gray-50 transition-colors">
                    Load More Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
