import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-32 w-32 text-apple-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-apple-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-apple-gray-600 mb-4">
          Page not found
        </h2>
        <p className="text-apple-gray-500 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-x-4">
          <Link
            to="/"
            className="btn-apple"
          >
            Go back home
          </Link>
          <Link
            to="/store"
            className="btn-apple-outline"
          >
            Visit Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

