import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'Products', path: '/products' },
        { name: 'Electronics', path: '/electronics' },
        { name: 'Fashion', path: '/fashion' },
        { name: 'Home & Garden', path: '/home' },
        { name: 'Sports', path: '/sports' },
        { name: 'Beauty', path: '/beauty' },
        { name: 'Accessories', path: '/accessories' }
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'Sign In', path: '/login' },
        { name: 'Create Account', path: '/signup' },
        { name: 'Dashboard', path: '/dashboard' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', path: '/support' },
        { name: 'Contact Us', path: '/contact' }
      ]
    }
  ];

  return (
    <footer className="bg-apple-gray-100 border-t border-apple-gray-200">
      <div className="section-padding py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm font-semibold text-apple-gray-800 tracking-wide uppercase">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-sm text-apple-gray-600 hover:text-apple-blue transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-apple-gray-200">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-apple-gray-800 mb-4">
              Stay Connected
            </h3>
            <p className="text-sm text-apple-gray-600 mb-4">
              Get the latest updates on new products and exclusive offers.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
              />
              <button className="btn-apple px-6">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 flex space-x-6">
          <a href="#" className="text-apple-gray-400 hover:text-apple-blue transition-colors duration-200">
            <span className="sr-only">Facebook</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-apple-gray-400 hover:text-apple-blue transition-colors duration-200">
            <span className="sr-only">Instagram</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.927.875 1.417 2.026 1.417 3.323s-.49 2.448-1.417 3.323c-.875.807-2.026 1.218-3.323 1.218zm7.718-1.417c-.875.807-2.026 1.417-3.323 1.417s-2.448-.61-3.323-1.417c-.875-.875-1.417-2.026-1.417-3.323s.542-2.448 1.417-3.323c.875-.875 2.026-1.417 3.323-1.417s2.448.542 3.323 1.417c.875.875 1.417 2.026 1.417 3.323s-.542 2.448-1.417 3.323z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-apple-gray-400 hover:text-apple-blue transition-colors duration-200">
            <span className="sr-only">Twitter</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-8 border-t border-apple-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-apple-gray-500">
            Copyright © 2024 TooSale Inc. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="text-sm text-apple-gray-500 hover:text-apple-blue transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-apple-gray-500 hover:text-apple-blue transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

