import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cartItems, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    walletAddress: '',
    transactionHash: '',
    paymentStatus: 'pending' // pending, processing, confirmed, failed
  });

  const [usdtWalletAddress] = useState('TQrZ8tKfjpras94FpdaNmNfotMABz7j6rq'); // Mock USDT wallet address
  const [qrCodeData, setQrCodeData] = useState('');

  const shipping = cartTotal > 100 ? 0 : 9.99;
  const tax = cartTotal * 0.08; // 8% tax
  const total = cartTotal + shipping + tax;
  const usdtAmount = (total * 0.999).toFixed(6); // Mock USDT conversion rate

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      navigate('/store/my-awesome-store');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    // Generate QR code data for USDT payment
    setQrCodeData(`tron:${usdtWalletAddress}?amount=${usdtAmount}&token=USDT`);
  }, [usdtWalletAddress, usdtAmount]);

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const validateCustomerInfo = () => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => customerInfo[field].trim() !== '');
  };

  const handleStepNext = () => {
    if (currentStep === 1 && validateCustomerInfo()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      // Simulate payment initiation
      setPaymentInfo(prev => ({ ...prev, paymentStatus: 'processing' }));
    }
  };

  const handlePaymentSubmit = () => {
    if (!paymentInfo.transactionHash.trim()) {
      alert('Please enter your transaction hash');
      return;
    }
    
    // Simulate payment verification
    setPaymentInfo(prev => ({ ...prev, paymentStatus: 'processing' }));
    
    setTimeout(() => {
      setPaymentInfo(prev => ({ ...prev, paymentStatus: 'confirmed' }));
      setTimeout(() => {
        clearCart();
        navigate('/order-success', { 
          state: { 
            orderNumber: 'ORD-' + Date.now(),
            total: total,
            usdtAmount: usdtAmount,
            transactionHash: paymentInfo.transactionHash
          }
        });
      }, 2000);
    }, 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (cartItems.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-apple-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-apple-gray-600 hover:text-apple-blue transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-apple-gray-900">Checkout</h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-center space-x-8 mb-8">
            {[
              { num: 1, label: 'Information' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Confirmation' }
            ].map((step) => (
              <div key={step.num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.num 
                    ? 'bg-apple-blue text-white' 
                    : 'bg-apple-gray-200 text-apple-gray-600'
                }`}>
                  {step.num}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step.num ? 'text-apple-blue' : 'text-apple-gray-600'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-apple-gray-200 p-6">
                <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Customer Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={customerInfo.firstName}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue"
                      placeholder="John"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={customerInfo.lastName}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue"
                      placeholder="Doe"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue"
                      placeholder="123 Main Street"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue"
                      placeholder="New York"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={customerInfo.state}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue"
                      placeholder="NY"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={customerInfo.zipCode}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue"
                      placeholder="10001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={customerInfo.country}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleStepNext}
                    disabled={!validateCustomerInfo()}
                    className="px-8 py-3 bg-apple-blue text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors disabled:bg-apple-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: USDT Payment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-apple-gray-200 p-6">
                <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">USDT Payment</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-blue-800 text-sm">
                      Pay with USDT (TRC-20) on the Tron network. Make sure to send the exact amount to avoid delays.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Payment Amount */}
                  <div className="bg-apple-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-apple-gray-600">Amount to Pay:</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-apple-gray-900">{usdtAmount} USDT</div>
                        <div className="text-sm text-apple-gray-600">≈ ${total.toFixed(2)} USD</div>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      Send USDT (TRC-20) to this address:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={usdtWalletAddress}
                        readOnly
                        className="flex-1 px-4 py-3 border border-apple-gray-300 rounded-xl bg-apple-gray-50 text-apple-gray-900 font-mono text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(usdtWalletAddress)}
                        className="px-4 py-3 bg-apple-gray-100 hover:bg-apple-gray-200 text-apple-gray-700 rounded-xl transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white border border-apple-gray-300 rounded-xl shadow-sm">
                      <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center relative border">
                        {/* Simple QR Code Pattern */}
                        <div className="grid grid-cols-8 gap-1 w-40 h-40">
                          {Array.from({ length: 64 }, (_, i) => {
                            // Create a pseudo-random pattern based on the index and wallet address
                            const isBlack = (i * 7 + usdtWalletAddress.charCodeAt(i % usdtWalletAddress.length)) % 3 !== 0;
                            return (
                              <div
                                key={i}
                                className={`w-full h-full ${isBlack ? 'bg-black' : 'bg-white'}`}
                              />
                            );
                          })}
                        </div>
                        {/* Corner squares */}
                        <div className="absolute top-2 left-2 w-6 h-6 border-2 border-black">
                          <div className="w-full h-full bg-black m-1"></div>
                        </div>
                        <div className="absolute top-2 right-2 w-6 h-6 border-2 border-black">
                          <div className="w-full h-full bg-black m-1"></div>
                        </div>
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-2 border-black">
                          <div className="w-full h-full bg-black m-1"></div>
                        </div>
                      </div>
                      <p className="text-sm text-apple-gray-600 mt-2 font-medium">Scan to Pay {usdtAmount} USDT</p>
                      <p className="text-xs text-apple-gray-500">TRC-20 Network</p>
                    </div>
                  </div>

                  {/* Transaction Hash Input */}
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                      Transaction Hash (after sending payment):
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.transactionHash}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, transactionHash: e.target.value }))}
                      className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue font-mono text-sm"
                      placeholder="Enter transaction hash after payment..."
                    />
                    <p className="text-xs text-apple-gray-600 mt-1">
                      You can find this in your wallet's transaction history after sending the payment.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border border-apple-gray-300 text-apple-gray-700 font-semibold rounded-xl hover:bg-apple-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleStepNext}
                      className="px-8 py-3 bg-apple-blue text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Verify Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Confirmation */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-apple-gray-200 p-6">
                <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Payment Confirmation</h2>
                
                {paymentInfo.paymentStatus === 'processing' && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto mb-4"></div>
                    <h3 className="text-lg font-medium text-apple-gray-900 mb-2">Verifying Payment...</h3>
                    <p className="text-apple-gray-600">
                      We're confirming your USDT transaction on the blockchain. This may take a few moments.
                    </p>
                  </div>
                )}

                {paymentInfo.paymentStatus === 'confirmed' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-green-600 mb-2">Payment Confirmed!</h3>
                    <p className="text-apple-gray-600 mb-6">
                      Your USDT payment has been successfully verified. Redirecting to order confirmation...
                    </p>
                  </div>
                )}

                {paymentInfo.paymentStatus === 'pending' && (
                  <div className="text-center py-8">
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={!paymentInfo.transactionHash.trim()}
                      className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:bg-apple-gray-300 disabled:cursor-not-allowed"
                    >
                      Confirm Payment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-apple-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-apple-gray-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-sm text-apple-gray-600">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-apple-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-apple-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-apple-gray-600">Subtotal</span>
                  <span className="text-apple-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-apple-gray-600">Shipping</span>
                  <span className="text-apple-gray-900">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-apple-gray-600">Tax</span>
                  <span className="text-apple-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-apple-gray-200 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-apple-gray-900">Total</span>
                    <span className="text-apple-gray-900">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-apple-gray-600 mt-1">
                    <span>≈ {usdtAmount} USDT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
