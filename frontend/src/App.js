import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

import PublicStore from './pages/PublicStore';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Products from './pages/Products';
import Dropshipping from './pages/Dropshipping';
import Tools from './pages/Tools';
import Fees from './pages/Fees';
import Dashboard from './pages/dashboard/Dashboard';
import BrowseProducts from './pages/dashboard/BrowseProducts';
import MyStore from './pages/dashboard/MyStore';
import Orders from './pages/dashboard/Orders';
import Wallet from './pages/dashboard/Wallet';
import Notifications from './pages/dashboard/Notifications';
import Support from './pages/dashboard/Support';
import Account from './pages/dashboard/Account';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="App min-h-screen">
          <Routes>
          {/* Public Routes with Header/Footer */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />

            <Route path="electronics" element={<CategoryPage category="Electronics" />} />
            <Route path="fashion" element={<CategoryPage category="Fashion" />} />
            <Route path="home" element={<CategoryPage category="Home & Garden" />} />
            <Route path="sports" element={<CategoryPage category="Sports" />} />
            <Route path="beauty" element={<CategoryPage category="Beauty" />} />
            <Route path="accessories" element={<CategoryPage category="Accessories" />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="products" element={<Products />} />
            <Route path="dropshipping" element={<Dropshipping />} />
            <Route path="tools" element={<Tools />} />
            <Route path="fees" element={<Fees />} />
          </Route>

          {/* Public Store Route - Standalone without Header/Footer */}
          <Route path="store/:storeName" element={<PublicStore />} />

          {/* Checkout Routes - Standalone */}
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />

          {/* Dashboard Routes - Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="browse-products" element={<BrowseProducts />} />
            <Route path="my-store" element={<MyStore />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="support" element={<Support />} />
            <Route path="account" element={<Account />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
          </Routes>
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

// Public layout with header and footer
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Simple category page component
const CategoryPage = ({ category }) => (
  <div className="min-h-screen bg-white">
    <section className="bg-apple-gray-50 py-16">
      <div className="section-padding">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-apple-gray-800 mb-4">
            {category}
          </h1>
          <p className="text-xl text-apple-gray-600 max-w-2xl mx-auto">
            Discover our premium {category.toLowerCase()} collection.
          </p>
        </div>
      </div>
    </section>
    <section className="py-12">
      <div className="section-padding text-center">
        <p className="text-apple-gray-600 mb-8">Category page coming soon...</p>
        <Link to="/products" className="btn-apple">
          Browse All Products
        </Link>
      </div>
    </section>
  </div>
);





export default App;
