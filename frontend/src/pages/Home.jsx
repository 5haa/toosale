import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: '$299',
      originalPrice: '$399',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: '$249',
      originalPrice: '$349',
      image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&h=600&fit=crop',
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Designer Sunglasses',
      price: '$159',
      originalPrice: '$229',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
      category: 'Fashion'
    },
    {
      id: 4,
      name: 'Minimalist Backpack',
      price: '$89',
      originalPrice: '$129',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
      category: 'Accessories'
    }
  ];

  const categories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop',
      path: '/electronics'
    },
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop',
      path: '/fashion'
    },
    {
      name: 'Home & Garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
      path: '/home'
    },
    {
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      path: '/sports'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-apple-gray-50 to-white py-20 lg:py-32">
        <div className="section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-apple-headline mb-6">
              The best way to buy the products you love.
            </h1>
            <p className="text-apple-subheadline mb-8 max-w-2xl mx-auto">
              Discover premium products at unbeatable prices. Fast shipping, easy returns, and exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-apple text-lg px-8 py-4">
                Shop Now
              </Link>
              <Link to="/about" className="btn-apple-outline text-lg px-8 py-4">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-8 bg-white border-b border-apple-gray-200">
        <div className="section-padding">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/new-arrivals" className="text-apple-blue hover:underline">
              New Arrivals
            </Link>
            <Link to="/best-sellers" className="text-apple-blue hover:underline">
              Best Sellers
            </Link>
            <Link to="/deals" className="text-apple-blue hover:underline">
              Today's Deals
            </Link>
            <Link to="/shipping" className="text-apple-blue hover:underline">
              Free Shipping
            </Link>
            <Link to="/returns" className="text-apple-blue hover:underline">
              Easy Returns
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-apple-gray-600 max-w-2xl mx-auto">
              Carefully curated selection of premium products at exceptional prices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-square bg-apple-gray-100 rounded-2xl overflow-hidden mb-4 group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-apple-gray-500 mb-1">{product.category}</p>
                  <h3 className="text-lg font-semibold text-apple-gray-800 mb-2 group-hover:text-apple-blue transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl font-bold text-apple-gray-800">{product.price}</span>
                    <span className="text-sm text-apple-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-apple-gray-50">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-apple-gray-600">
              Find exactly what you're looking for in our diverse product categories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={category.path} className="group">
                <div className="relative h-64 bg-apple-gray-200 rounded-2xl overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
              Why Choose TooSale?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-apple-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-apple-gray-800 mb-4">Fast Shipping</h3>
              <p className="text-apple-gray-600">
                Free shipping on orders over $50. Most orders arrive within 2-3 business days.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-apple-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-apple-gray-800 mb-4">Quality Guarantee</h3>
              <p className="text-apple-gray-600">
                All products are carefully vetted for quality. 30-day money-back guarantee on all purchases.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-apple-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 00-9.75 9.75c0 5.384 4.365 9.75 9.75 9.75s9.75-4.366 9.75-9.75S17.635 2.25 12 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-apple-gray-800 mb-4">24/7 Support</h3>
              <p className="text-apple-gray-600">
                Our customer support team is available around the clock to help with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-apple-gray-800">
        <div className="section-padding text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Stay in the loop
          </h2>
          <p className="text-xl text-apple-gray-300 mb-8 max-w-2xl mx-auto">
            Be the first to know about new products, exclusive offers, and special deals.
          </p>
          <div className="max-w-md mx-auto flex space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-apple-blue"
            />
            <button className="btn-apple px-8 py-4 rounded-full">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
