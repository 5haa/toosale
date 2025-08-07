import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Cart from './Cart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);
  
  const { items: cartItems, cartCount, updateQuantity, removeFromCart } = useCart();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigationItems = [
    { name: 'Products', path: '/products' },
    { name: 'Dropshipping', path: '/dropshipping' },
    { name: 'Tools', path: '/tools' },
    { name: 'Fees', path: '/fees' }
  ];

  const isActiveLink = (path) => location.pathname === path;

  // Determine if current page should show search and cart
  const isShopPage = () => {
    const path = location.pathname;
    const shopPaths = ['/products', '/electronics', '/fashion', '/home', '/sports', '/beauty', '/accessories'];
    return shopPaths.includes(path) || path.startsWith('/product/');
  };

  const showSearchAndCart = isShopPage();

  return (
    <header className="bg-white border-b border-apple-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-apple-gray-800">
              TooSale
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-apple-blue ${
                    isActiveLink(item.path) 
                      ? 'text-apple-blue' 
                      : 'text-apple-gray-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Links & Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Button - Only show on shop pages */}
            {showSearchAndCart && (
              <button 
                className="p-2 text-apple-gray-600 hover:text-apple-blue hover:bg-apple-gray-50 rounded-lg transition-all duration-200"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            {/* Shopping Cart - Only show on shop pages */}
            {showSearchAndCart && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-apple-gray-600 hover:text-apple-blue hover:bg-apple-gray-50 rounded-lg transition-all duration-200"
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
                  <circle cx="9" cy="20" r="1"/>
                  <circle cx="15" cy="20" r="1"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-apple-blue text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className="px-3 py-2 text-sm font-medium text-apple-gray-600 hover:text-apple-blue hover:bg-apple-gray-50 rounded-lg transition-all duration-200"
            >
              Dashboard
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-apple-gray-600 hover:text-apple-blue hover:bg-apple-gray-50 rounded-lg transition-all duration-200"
              >
                <div className="w-6 h-6 bg-apple-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">U</span>
                </div>
                <span>Account</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-apple-gray-200 py-2 z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-apple-gray-700 hover:bg-apple-gray-50 hover:text-apple-blue"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/products"
                    className="block px-4 py-2 text-sm text-apple-gray-700 hover:bg-apple-gray-50 hover:text-apple-blue"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Products
                  </Link>
                  <Link
                    to="/dashboard/orders"
                    className="block px-4 py-2 text-sm text-apple-gray-700 hover:bg-apple-gray-50 hover:text-apple-blue"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <hr className="my-2 border-apple-gray-200" />
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-apple-gray-700 hover:bg-apple-gray-50 hover:text-apple-blue"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-apple-gray-600 hover:text-apple-blue transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-apple-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActiveLink(item.path)
                    ? 'text-apple-blue bg-apple-gray-50'
                    : 'text-apple-gray-600 hover:text-apple-blue hover:bg-apple-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-apple-gray-200 pt-4 pb-3 space-y-1">
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-apple-gray-600 hover:text-apple-blue hover:bg-apple-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-apple-gray-600 hover:text-apple-blue hover:bg-apple-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cart Component - Only render on shop pages */}
      {showSearchAndCart && (
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />
      )}
    </header>
  );
};

export default Header;
