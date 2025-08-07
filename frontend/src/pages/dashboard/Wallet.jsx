import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('balance');
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load wallet info and transactions in parallel
      const [walletResponse, transactionsResponse] = await Promise.all([
        apiService.getWallet(),
        apiService.getWalletTransactions(10, 0)
      ]);

      if (walletResponse.success) {
        setWallet(walletResponse.wallet);
      }

      if (transactionsResponse.success) {
        setTransactions(transactionsResponse.transactions);
      }
    } catch (err) {
      console.error('Error loading wallet data:', err);
      setError(err.message || 'Failed to load wallet data');
      
      // If wallet doesn't exist, try to create one
      if (err.status === 404) {
        try {
          const createResponse = await apiService.createWallet();
          if (createResponse.success) {
            setWallet(createResponse.wallet);
          }
        } catch (createErr) {
          console.error('Error creating wallet:', createErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !wallet) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Wallet</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadWalletData}
            className="btn-apple"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'sale':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      case 'withdrawal':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'pending':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-apple-gray-900">Wallet</h1>
        <p className="text-apple-gray-600 mt-2">Manage your earnings and withdrawals</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-apple p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-apple-blue rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-apple-gray-600">Available Balance</p>
              <p className="text-3xl font-bold text-apple-gray-900">${wallet?.balance?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button 
              onClick={() => navigate('/dashboard/wallet/deposit')} 
              className="btn-apple flex-1 bg-green-600 hover:bg-green-700"
            >
              Deposit
            </button>
            <button 
              onClick={() => navigate('/dashboard/wallet/withdraw')} 
              className="btn-apple flex-1"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="card-apple p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-apple-gray-600">Wallet Address</p>
              <p className="text-sm font-bold text-apple-gray-900 font-mono break-all">
                {wallet?.address ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-8)}` : 'Not available'}
              </p>
            </div>
          </div>
        </div>

        <div className="card-apple p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-apple-gray-600">Total Transactions</p>
              <p className="text-3xl font-bold text-apple-gray-900">{transactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-apple mb-6">
        <div className="border-b border-apple-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 py-4">
            <button
              onClick={() => setActiveTab('balance')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'balance'
                  ? 'border-apple-blue text-apple-blue'
                  : 'border-transparent text-apple-gray-500 hover:text-apple-gray-700 hover:border-apple-gray-300'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('withdrawal')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'withdrawal'
                  ? 'border-apple-blue text-apple-blue'
                  : 'border-transparent text-apple-gray-500 hover:text-apple-gray-700 hover:border-apple-gray-300'
              }`}
            >
              Withdrawal Methods
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'analytics'
                  ? 'border-apple-blue text-apple-blue'
                  : 'border-transparent text-apple-gray-500 hover:text-apple-gray-700 hover:border-apple-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Transactions Tab */}
        {activeTab === 'balance' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-apple-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-apple-gray-500">No transactions yet</p>
                  <p className="text-sm text-apple-gray-400 mt-1">Your transaction history will appear here</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-apple-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-apple-gray-900">{transaction.description || `${transaction.type} transaction`}</p>
                        <p className="text-sm text-apple-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()} • ID: {transaction.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount || 0).toFixed(2)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Withdrawal Methods Tab */}
        {activeTab === 'withdrawal' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Withdrawal Methods</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-apple-gray-300 rounded-xl p-8 text-center">
                <svg className="w-12 h-12 text-apple-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h4 className="text-lg font-medium text-apple-gray-900 mb-2">Add Payment Method</h4>
                <p className="text-apple-gray-600 mb-4">Add a bank account or PayPal to withdraw your earnings</p>
                <button className="btn-apple">
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Earnings Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-apple-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-apple-gray-900 mb-2">This Month</h4>
                <p className="text-3xl font-bold text-apple-gray-900">$1,247.83</p>
                <p className="text-sm text-green-600 mt-1">+23% from last month</p>
              </div>
              <div className="bg-apple-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-apple-gray-900 mb-2">Average Order Value</h4>
                <p className="text-3xl font-bold text-apple-gray-900">$89.50</p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;

