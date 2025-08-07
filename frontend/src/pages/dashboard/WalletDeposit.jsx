import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const WalletDeposit = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [depositInfo, setDepositInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [walletResponse, depositResponse] = await Promise.all([
        apiService.getWallet(),
        apiService.getDepositInfo()
      ]);

      if (walletResponse.success) {
        setWallet(walletResponse.wallet);
      }

      if (depositResponse.success) {
        setDepositInfo(depositResponse.depositInfo);
      }
    } catch (err) {
      console.error('Error loading wallet data:', err);
      setError(err.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      setShowPaymentForm(true);
    }
  };

  const handlePaymentComplete = async () => {
    if (paymentMethod === 'demo') {
      try {
        setLoading(true);
        const response = await apiService.addFunds(parseFloat(amount), 'Demo deposit');
        if (response.success) {
          setPaymentCompleted(true);
          // Update wallet balance
          setWallet(prev => ({ ...prev, balance: response.newBalance }));
        }
      } catch (err) {
        console.error('Error adding demo funds:', err);
        setError(err.message || 'Failed to add funds');
      } finally {
        setLoading(false);
      }
    } else {
      setPaymentCompleted(true);
      // For crypto deposits, just show instructions
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert('Copied to clipboard!');
  };

  const predefinedAmounts = [50, 100, 250, 500, 1000];

  if (loading && !wallet) {
    return <LoadingSpinner />;
  }

  if (error && !wallet) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Wallet</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadWalletData} className="btn-apple">
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                <span className="font-semibold text-apple-gray-900">${wallet?.balance?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="border-t border-apple-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-apple-gray-900">New Balance:</span>
                  <span className="font-bold text-green-600">${wallet?.balance?.toFixed(2) || '0.00'}</span>
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

            {/* Payment Methods */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 p-4 border border-apple-gray-200 rounded-xl">
                <input
                  type="radio"
                  id="crypto"
                  name="payment"
                  value="crypto"
                  checked={paymentMethod === 'crypto'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-apple-blue"
                />
                <label htmlFor="crypto" className="flex items-center flex-1">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <span className="font-medium">USDT (ERC-20) Crypto Deposit</span>
                </label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border border-apple-gray-200 rounded-xl">
                <input
                  type="radio"
                  id="demo"
                  name="payment"
                  value="demo"
                  checked={paymentMethod === 'demo'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-apple-blue"
                />
                <label htmlFor="demo" className="flex items-center flex-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">Demo Mode (Instant Credit)</span>
                </label>
              </div>
            </div>

            {/* Crypto Deposit Information */}
            {paymentMethod === 'crypto' && depositInfo && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-green-800 mb-3">USDT (ERC-20) Deposit Instructions</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-green-700">Your Wallet Address:</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 p-2 bg-white border border-green-200 rounded text-xs font-mono break-all">
                        {depositInfo.walletAddress}
                      </code>
                      <button
                        onClick={() => copyToClipboard(depositInfo.walletAddress)}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-green-700">Your Private Key:</label>
                      <button
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        className="text-xs text-green-600 hover:text-green-700"
                      >
                        {showPrivateKey ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {showPrivateKey && (
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="flex-1 p-2 bg-white border border-green-200 rounded text-xs font-mono break-all">
                          {depositInfo.privateKey}
                        </code>
                        <button
                          onClick={() => copyToClipboard(depositInfo.privateKey)}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-green-800 mb-2">Important Warnings:</p>
                    <ul className="text-xs text-green-700 space-y-1">
                      {depositInfo.warnings?.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Demo Mode Information */}
            {paymentMethod === 'demo' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Demo Mode</p>
                    <p className="text-sm text-blue-700">
                      This will instantly add demo funds to your wallet for testing purposes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handlePaymentComplete}
              disabled={loading}
              className="btn-apple w-full disabled:opacity-50"
            >
              {loading ? 'Processing...' : paymentMethod === 'demo' ? 'Add Demo Funds' : 'I Have Sent the Crypto'}
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
              <p className="text-3xl font-bold text-apple-gray-900">${wallet?.balance?.toFixed(2) || '0.00'}</p>
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
                  <span className="font-semibold text-apple-gray-900">${wallet?.balance?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="border-t border-apple-gray-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-apple-gray-900">New balance (if demo):</span>
                    <span className="font-bold text-green-600">${((wallet?.balance || 0) + parseFloat(amount)).toFixed(2)}</span>
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
