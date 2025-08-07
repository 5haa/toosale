import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state || {};
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const {
    orderNumber = 'ORD-' + Date.now(),
    orderId,
    total = 0,
    usdtAmount = '0.000000',
    transactionHash = 'N/A',
    customerInfo
  } = orderData;

  // If we have an orderId, fetch the full order details
  useEffect(() => {
    if (orderId && apiService.isAuthenticated()) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrder(orderId);
      if (response.success) {
        setOrderDetails(response.order);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      // Don't show error to user, just continue with the data we have
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-apple-gray-900 mb-4">
            Order Confirmed! 🎉
          </h1>
          <p className="text-lg text-apple-gray-600 mb-8 max-w-2xl mx-auto">
            Thank you for your purchase! Your USDT payment has been successfully processed and your order is confirmed.
          </p>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-apple-gray-200 p-8 mb-8 text-left">
            <h2 className="text-xl font-semibold text-apple-gray-900 mb-6 text-center">Order Details</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 mb-1">Order Number</label>
                    <p className="text-lg font-semibold text-apple-gray-900 font-mono">
                      {orderDetails?.orderNumber || orderNumber}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 mb-1">Order Date</label>
                    <p className="text-apple-gray-900">
                      {orderDetails 
                        ? new Date(orderDetails.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                      }
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 mb-1">Total Amount</label>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-apple-gray-900">
                        ${(orderDetails?.totals?.total || total).toFixed(2)} USD
                      </p>
                      <p className="text-sm text-apple-gray-600">Paid: {usdtAmount} USDT</p>
                    </div>
                  </div>

                  {orderDetails?.customerName && (
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-600 mb-1">Customer</label>
                      <p className="text-apple-gray-900">{orderDetails.customerName}</p>
                      <p className="text-sm text-apple-gray-600">{orderDetails.customerEmail}</p>
                    </div>
                  )}
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 mb-1">Payment Method</label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-apple-gray-900 font-medium">
                        {orderDetails?.payment?.method || 'USDT'} (TRC-20)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 mb-1">Transaction Hash</label>
                    <div className="bg-apple-gray-50 rounded-lg p-3">
                      <p className="text-sm font-mono text-apple-gray-900 break-all">
                        {orderDetails?.payment?.transactionHash || transactionHash}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 mb-1">Payment Status</label>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">
                        {orderDetails?.payment?.status === 'paid' ? 'Confirmed' : 'Confirmed'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 mb-1">Order Status</label>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-600 font-medium capitalize">
                        {orderDetails?.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items (if available) */}
            {orderDetails?.items && orderDetails.items.length > 0 && (
              <div className="mt-8 pt-6 border-t border-apple-gray-200">
                <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-apple-gray-50 rounded-lg">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-apple-gray-900">{item.name}</h4>
                        <p className="text-sm text-apple-gray-600">
                          Quantity: {item.quantity} × ${(item.unitPrice || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-apple-gray-900">
                          ${(item.totalPrice || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
            <div className="text-left space-y-2 text-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-800 text-sm font-bold">1</span>
                </div>
                <p>You'll receive an order confirmation email with tracking details within 24 hours.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-800 text-sm font-bold">2</span>
                </div>
                <p>Your order will be processed and shipped within 2-3 business days.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-800 text-sm font-bold">3</span>
                </div>
                <p>You can track your order status in your account dashboard.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard/orders"
              className="px-8 py-3 bg-apple-blue text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
            >
              View Order Status
            </Link>
            <Link
              to="/store/my-awesome-store"
              className="px-8 py-3 border border-apple-gray-300 text-apple-gray-700 font-semibold rounded-xl hover:bg-apple-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-12 pt-8 border-t border-apple-gray-200">
            <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Need Help?</h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-apple-gray-600">support@toosale.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-apple-gray-600">1-800-TOOSALE</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-apple-gray-600">Live Chat Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
