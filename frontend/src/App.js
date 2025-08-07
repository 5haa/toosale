import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import NotFound from './components/NotFound';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Store from './pages/Store';
import PublicStore from './pages/PublicStore';
import Dashboard from './pages/dashboard/Dashboard';
import BrowseProducts from './pages/dashboard/BrowseProducts';
import MyStore from './pages/dashboard/MyStore';
import Orders from './pages/dashboard/Orders';
import Wallet from './pages/dashboard/Wallet';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { CartProvider } from './contexts/CartContext';
import './index.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App min-h-screen">
          <Routes>
          {/* Public Routes with Header/Footer */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="store" element={<Store />} />
            <Route path="electronics" element={<CategoryPage category="Electronics" />} />
            <Route path="fashion" element={<CategoryPage category="Fashion" />} />
            <Route path="home" element={<CategoryPage category="Home & Garden" />} />
            <Route path="sports" element={<CategoryPage category="Sports" />} />
            <Route path="beauty" element={<CategoryPage category="Beauty" />} />
            <Route path="accessories" element={<CategoryPage category="Accessories" />} />
            <Route path="product/:id" element={<ProductDetail />} />
          </Route>

          {/* Public Store Route - Standalone without Header/Footer */}
          <Route path="store/:storeName" element={<PublicStore />} />

          {/* Checkout Routes - Standalone */}
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<BrowseProducts />} />
            <Route path="my-store" element={<MyStore />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wallet" element={<Wallet />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
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
        <Link to="/store" className="btn-apple">
          Browse All Products
        </Link>
      </div>
    </section>
  </div>
);

// Simple product detail component
const ProductDetail = () => (
  <div className="min-h-screen bg-white">
    <section className="py-16">
      <div className="section-padding text-center">
        <h1 className="text-4xl font-bold text-apple-gray-800 mb-4">
          Product Details
        </h1>
        <p className="text-apple-gray-600 mb-8">Product detail page coming soon...</p>
        <Link to="/store" className="btn-apple">
          Back to Store
        </Link>
      </div>
    </section>
  </div>
);



export default App;
