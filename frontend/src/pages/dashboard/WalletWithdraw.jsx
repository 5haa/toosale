import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const WalletWithdraw = () => {
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: ''
  });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [withdrawalSubmitted, setWithdrawalSubmitted] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawalId, setWithdrawalId] = useState(null);

  const minimumWithdrawal = 10.00;

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError(null);

      const walletResponse = await apiService.getWallet();

      if (walletResponse.success) {
        setWallet(walletResponse.wallet);
      }
    } catch (err) {
      console.error('Error loading wallet data:', err);
      setError(err.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < minimumWithdrawal || parseFloat(amount) > wallet?.balance) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Prepare withdrawal details based on method
      let details = {};
      if (withdrawalMethod === 'bank') {
        details = bankDetails;
      } else if (withdrawalMethod === 'paypal') {
        details = { email: paypalEmail };
      }

      const response = await apiService.submitWithdrawal(
        parseFloat(amount),
        withdrawalMethod,
        details
      );

      if (response.success) {
        setWithdrawalSubmitted(true);
        setWithdrawalId(response.transaction?.id);
      }
    } catch (err) {
      console.error('Error submitting withdrawal:', err);
      setError(err.message || 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
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

  if (withdrawalSubmitted) {
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
            <h1 className="text-3xl font-bold text-apple-gray-900">Withdrawal Request Submitted</h1>
            <p className="text-apple-gray-600 mt-2">Your withdrawal request is being processed</p>
          </div>

          {/* Success Message */}
          <div className="card-apple p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-apple-gray-900 mb-2">Withdrawal Request Submitted</h3>
            <p className="text-apple-gray-600 mb-6">
              Your withdrawal request for ${parseFloat(amount).toFixed(2)} has been submitted successfully. 
              We'll process it within 1-3 business days.
            </p>
            
            <div className="bg-apple-gray-50 rounded-xl p-6 mb-6">
              <div className="text-left space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-apple-gray-600">Request ID:</span>
                  <span className="font-mono text-sm text-apple-gray-900">WD{withdrawalId || Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-apple-gray-600">Amount:</span>
                  <span className="font-semibold text-apple-gray-900">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-apple-gray-600">Method:</span>
                  <span className="font-semibold text-apple-gray-900 capitalize">{withdrawalMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-apple-gray-600">Status:</span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    Pending Review
                  </span>
                </div>
                <div className="border-t border-apple-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-apple-gray-900">Remaining Balance:</span>
                    <span className="font-bold text-apple-blue">${((wallet?.balance || 0) - parseFloat(amount)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">What happens next?</p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Our team will review your withdrawal request</li>
                    <li>• Processing typically takes 1-3 business days</li>
                    <li>• You'll receive an email confirmation when processed</li>
                    <li>• Funds will appear in your selected account within 5-7 business days</li>
                  </ul>
                </div>
              </div>
            </div>

            <Link to="/dashboard/wallet" className="btn-apple">
              Back to Wallet
            </Link>
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
          <h1 className="text-3xl font-bold text-apple-gray-900">Withdraw Funds</h1>
          <p className="text-apple-gray-600 mt-2">Request a withdrawal from your wallet</p>
        </div>

        {/* Current Balance */}
        <div className="card-apple p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-apple-gray-600">Available Balance</p>
              <p className="text-3xl font-bold text-apple-gray-900">${(wallet?.balance || 0).toFixed(2)}</p>
              <p className="text-sm text-apple-gray-500 mt-1">Minimum withdrawal: ${minimumWithdrawal.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-apple-blue rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="card-apple p-6">
          <form onSubmit={handleWithdrawalSubmit}>
            {/* Amount Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray-500 text-lg">$</span>
                <input
                  type="number"
                  step="0.01"
                  min={minimumWithdrawal}
                  max={wallet?.balance || 0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-8 pr-3 py-3 text-lg border border-apple-gray-300 rounded-xl focus:ring-apple-blue focus:border-apple-blue"
                  placeholder="0.00"
                  required
                />
              </div>
              {amount && parseFloat(amount) > (wallet?.balance || 0) && (
                <p className="text-red-500 text-sm mt-1">Amount exceeds available balance</p>
              )}
              {amount && parseFloat(amount) < minimumWithdrawal && parseFloat(amount) > 0 && (
                <p className="text-red-500 text-sm mt-1">Minimum withdrawal amount is ${minimumWithdrawal.toFixed(2)}</p>
              )}
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
                    disabled={preAmount > (wallet?.balance || 0)}
                    className="py-2 px-3 text-sm font-medium text-apple-gray-700 bg-apple-gray-100 hover:bg-apple-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ${preAmount}
                  </button>
                ))}
              </div>
            </div>

            {/* Withdrawal Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-apple-gray-700 mb-3">
                Withdrawal Method
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border border-apple-gray-200 rounded-xl">
                  <input
                    type="radio"
                    id="bank"
                    name="withdrawal-method"
                    value="bank"
                    checked={withdrawalMethod === 'bank'}
                    onChange={(e) => setWithdrawalMethod(e.target.value)}
                    className="w-4 h-4 text-apple-blue"
                  />
                  <label htmlFor="bank" className="flex items-center flex-1">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="font-medium">Bank Transfer</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-3 p-4 border border-apple-gray-200 rounded-xl">
                  <input
                    type="radio"
                    id="paypal"
                    name="withdrawal-method"
                    value="paypal"
                    checked={withdrawalMethod === 'paypal'}
                    onChange={(e) => setWithdrawalMethod(e.target.value)}
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
            </div>

            {/* Bank Details Form */}
            {withdrawalMethod === 'bank' && (
              <div className="mb-6 space-y-4">
                <h4 className="font-medium text-apple-gray-900">Bank Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                      className="block w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:ring-apple-blue focus:border-apple-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      className="block w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:ring-apple-blue focus:border-apple-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                      className="block w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:ring-apple-blue focus:border-apple-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-1">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.routingNumber}
                      onChange={(e) => setBankDetails({...bankDetails, routingNumber: e.target.value})}
                      className="block w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:ring-apple-blue focus:border-apple-blue"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Email Form */}
            {withdrawalMethod === 'paypal' && (
              <div className="mb-6">
                <h4 className="font-medium text-apple-gray-900 mb-3">PayPal Details</h4>
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-1">
                    PayPal Email Address
                  </label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:ring-apple-blue focus:border-apple-blue"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            )}

            {/* Preview */}
            {amount && parseFloat(amount) >= minimumWithdrawal && parseFloat(amount) <= (wallet?.balance || 0) && (
              <div className="mb-6 p-4 bg-apple-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-apple-gray-600">Withdrawal amount:</span>
                  <span className="font-semibold text-apple-gray-900">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-apple-gray-600">Processing fee:</span>
                  <span className="font-semibold text-apple-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-apple-gray-600">Current balance:</span>
                  <span className="font-semibold text-apple-gray-900">${(wallet?.balance || 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-apple-gray-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-apple-gray-900">Remaining balance:</span>
                    <span className="font-bold text-apple-blue">${((wallet?.balance || 0) - parseFloat(amount)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
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
              type="submit"
              disabled={
                submitting ||
                !amount || 
                parseFloat(amount) < minimumWithdrawal || 
                parseFloat(amount) > (wallet?.balance || 0) ||
                (withdrawalMethod === 'bank' && (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName || !bankDetails.routingNumber)) ||
                (withdrawalMethod === 'paypal' && !paypalEmail)
              }
              className="btn-apple w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>

        {/* Important Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Important Information</p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Withdrawal requests are processed within 1-3 business days</li>
                <li>• Bank transfers may take an additional 5-7 business days to appear in your account</li>
                <li>• PayPal transfers are usually instant once processed</li>
                <li>• Minimum withdrawal amount is ${minimumWithdrawal.toFixed(2)}</li>
                <li>• You'll receive an email confirmation once your request is processed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletWithdraw;
