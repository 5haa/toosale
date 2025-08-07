import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const WalletDeposit = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const currentBalance = 2547.83;

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      setShowPaymentForm(true);
    }
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    // Here you would typically make an API call to verify the payment
    // For now, it's just UI simulation
  };

  const predefinedAmounts = [50, 100, 250, 500, 1000];

  if (paymentCompleted) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              to="/dashboard/wallet"
              className="inline-flex items-center text-apple-blue hover:text-blue-700 mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Wallet
            </Link>
            <h1 className="text-3xl font-bold text-apple-gray-900">Payment Verification</h1>
            <p className="text-apple-gray-600 mt-2">Checking your payment status</p>
          </div>

          {/* Success Message */}
          <div className="card-apple p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-apple-gray-900 mb-2">Payment Verification in Progress</h3>
            <p className="text-apple-gray-600 mb-6">
              We're verifying your payment of ${parseFloat(amount).toFixed(2)}. This usually takes a few minutes.
            </p>
            
            <div className="bg-apple-gray-50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-apple-gray-600">Amount Deposited:</span>
                <span className="font-semibold text-apple-gray-900">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-apple-gray-600">Current Balance:</span>
                <span className="font-semibold text-apple-gray-900">${currentBalance.toFixed(2)}</span>
              </div>
              <div className="border-t border-apple-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-apple-gray-900">New Balance (pending):</span>
                  <span className="font-bold text-green-600">${(currentBalance + parseFloat(amount)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setPaymentCompleted(false)}
              className="btn-apple mr-4"
            >
              Mark as Completed
            </button>
            <Link to="/dashboard/wallet" className="btn-apple-secondary">
              Back to Wallet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showPaymentForm) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => setShowPaymentForm(false)}
              className="inline-flex items-center text-apple-blue hover:text-blue-700 mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Amount
            </button>
            <h1 className="text-3xl font-bold text-apple-gray-900">Complete Payment</h1>
            <p className="text-apple-gray-600 mt-2">Deposit ${parseFloat(amount).toFixed(2)} to your wallet</p>
          </div>

          {/* Payment Form */}
          <div className="card-apple p-6">
            <div className="mb-6 p-4 bg-apple-gray-50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-apple-gray-600">Amount to deposit:</span>
                <span className="text-2xl font-bold text-apple-gray-900">${parseFloat(amount).toFixed(2)}</span>
              </div>
            </div>

            {/* Mock Payment Methods */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 p-4 border border-apple-gray-200 rounded-xl">
                <input
                  type="radio"
                  id="card"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-apple-blue"
                />
                <label htmlFor="card" className="flex items-center flex-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="font-medium">Credit/Debit Card</span>
                </label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border border-apple-gray-200 rounded-xl">
                <input
                  type="radio"
                  id="paypal"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-apple-blue"
                />
                <label htmlFor="paypal" className="flex items-center flex-1">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">PayPal</span>
                </label>
              </div>
            </div>

            {/* Mock Payment Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Demo Mode</p>
                  <p className="text-sm text-yellow-700">
                    This is a demo payment form. Click "Proceed to Payment" to simulate the payment process.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePaymentComplete}
              className="btn-apple w-full"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard/wallet"
            className="inline-flex items-center text-apple-blue hover:text-blue-700 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Wallet
          </Link>
          <h1 className="text-3xl font-bold text-apple-gray-900">Deposit Funds</h1>
          <p className="text-apple-gray-600 mt-2">Add money to your wallet to start purchasing</p>
        </div>

        {/* Current Balance */}
        <div className="card-apple p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-apple-gray-600">Current Balance</p>
              <p className="text-3xl font-bold text-apple-gray-900">${currentBalance.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-apple-blue rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Deposit Form */}
        <div className="card-apple p-6">
          <form onSubmit={handleAmountSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                Amount to Deposit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray-500 text-lg">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-8 pr-3 py-3 text-lg border border-apple-gray-300 rounded-xl focus:ring-apple-blue focus:border-apple-blue"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="mb-6">
              <p className="text-sm font-medium text-apple-gray-700 mb-3">Quick amounts</p>
              <div className="grid grid-cols-5 gap-2">
                {predefinedAmounts.map((preAmount) => (
                  <button
                    key={preAmount}
                    type="button"
                    onClick={() => setAmount(preAmount.toString())}
                    className="py-2 px-3 text-sm font-medium text-apple-gray-700 bg-apple-gray-100 hover:bg-apple-gray-200 rounded-lg transition-colors"
                  >
                    ${preAmount}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {amount && parseFloat(amount) > 0 && (
              <div className="mb-6 p-4 bg-apple-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-apple-gray-600">Deposit amount:</span>
                  <span className="font-semibold text-apple-gray-900">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-apple-gray-600">Current balance:</span>
                  <span className="font-semibold text-apple-gray-900">${currentBalance.toFixed(2)}</span>
                </div>
                <div className="border-t border-apple-gray-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-apple-gray-900">New balance:</span>
                    <span className="font-bold text-green-600">${(currentBalance + parseFloat(amount)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className="btn-apple w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WalletDeposit;
