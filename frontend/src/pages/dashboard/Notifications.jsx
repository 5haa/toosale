import React, { useState } from 'react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'You have received a new order #1024 for $156.99 from customer Sarah Johnson',
      time: '2 minutes ago',
      timestamp: '2024-01-15T10:30:00',
      read: false,
      priority: 'high',
      actionUrl: '/dashboard/orders',
      icon: (
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      )
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $89.50 has been added to your wallet from order #1023',
      time: '1 hour ago',
      timestamp: '2024-01-15T09:30:00',
      read: false,
      priority: 'medium',
      actionUrl: '/dashboard/wallet',
      icon: (
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      )
    },
    {
      id: 3,
      type: 'order',
      title: 'Low Inventory Alert',
      message: 'Product "Wireless Headphones" is running low on stock (only 3 items left)',
      time: '2 hours ago',
      timestamp: '2024-01-15T08:30:00',
      read: false,
      priority: 'high',
      actionUrl: '/dashboard/my-store',
      icon: (
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      )
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      message: 'New dashboard features have been added: Enhanced analytics and improved search functionality',
      time: '3 hours ago',
      timestamp: '2024-01-15T07:30:00',
      read: true,
      priority: 'low',
      actionUrl: '/dashboard',
      icon: (
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
    },
    {
      id: 5,
      type: 'order',
      title: 'Order Shipped',
      message: 'Order #1019 has been shipped via FedEx. Tracking number: FDX123456789',
      time: '1 day ago',
      timestamp: '2024-01-14T15:30:00',
      read: true,
      priority: 'medium',
      actionUrl: '/dashboard/orders',
      icon: (
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      )
    },
    {
      id: 6,
      type: 'payment',
      title: 'Withdrawal Processed',
      message: 'Your withdrawal request of $500.00 has been processed and sent to your bank account',
      time: '1 day ago',
      timestamp: '2024-01-14T12:00:00',
      read: true,
      priority: 'medium',
      actionUrl: '/dashboard/wallet',
      icon: (
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      )
    },
    {
      id: 7,
      type: 'system',
      title: 'Weekly Report Available',
      message: 'Your weekly sales report for January 8-14 is ready. Total sales: $1,247.83',
      time: '2 days ago',
      timestamp: '2024-01-13T09:00:00',
      read: true,
      priority: 'low',
      actionUrl: '/dashboard/wallet',
      icon: (
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      )
    }
  ];

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'orders':
        return notifications.filter(n => n.type === 'order');
      case 'payments':
        return notifications.filter(n => n.type === 'payment');
      case 'system':
        return notifications.filter(n => n.type === 'system');
      default:
        return notifications;
    }
  };

  const markAsRead = (id) => {
    // In a real app, this would update the backend
    console.log(`Marking notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // In a real app, this would update the backend
    console.log('Marking all notifications as read');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-apple-gray-900">Notifications</h1>
          <p className="text-apple-gray-600 mt-2">Stay updated with your business activities</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="btn-apple bg-apple-gray-100 text-apple-gray-700 hover:bg-apple-gray-200"
        >
          Mark All Read
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card-apple p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            </div>
            <div>
              <p className="text-sm text-apple-gray-600">Unread</p>
              <p className="text-xl font-bold text-apple-gray-900">
                {notifications.filter(n => !n.read).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-apple p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-apple-gray-600">Orders</p>
              <p className="text-xl font-bold text-apple-gray-900">
                {notifications.filter(n => n.type === 'order').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card-apple p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-apple-gray-600">Payments</p>
              <p className="text-xl font-bold text-apple-gray-900">
                {notifications.filter(n => n.type === 'payment').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card-apple p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-apple-gray-600">System</p>
              <p className="text-xl font-bold text-apple-gray-900">
                {notifications.filter(n => n.type === 'system').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-apple mb-6">
        <div className="border-b border-apple-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 py-4">
            {[
              { id: 'all', label: 'All Notifications' },
              { id: 'unread', label: 'Unread' },
              { id: 'orders', label: 'Orders' },
              { id: 'payments', label: 'Payments' },
              { id: 'system', label: 'System' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-apple-blue text-apple-blue'
                    : 'border-transparent text-apple-gray-500 hover:text-apple-gray-700 hover:border-apple-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Notifications List */}
        <div className="p-6">
          <div className="space-y-4">
            {getFilteredNotifications().length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-apple-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="text-lg font-medium text-apple-gray-900 mb-2">No notifications</h3>
                <p className="text-apple-gray-600">You're all caught up! Check back later for new updates.</p>
              </div>
            ) : (
              getFilteredNotifications().map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 hover:bg-apple-gray-50 cursor-pointer border ${
                    !notification.read 
                      ? 'bg-blue-50 border-l-4 border-apple-blue border-t border-r border-b border-blue-200' 
                      : 'bg-white border-apple-gray-200 hover:border-apple-gray-300'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {notification.icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-semibold ${!notification.read ? 'text-apple-gray-900' : 'text-apple-gray-700'}`}>
                            {notification.title}
                          </p>
                          {notification.priority === 'high' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              High
                            </span>
                          )}
                          {!notification.read && (
                            <span className="w-2 h-2 bg-apple-blue rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-apple-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-apple-gray-500">{notification.time}</p>
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="text-xs text-apple-blue hover:text-blue-700 font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Details →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-apple-blue text-white">
                          New
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-xs text-apple-blue hover:text-blue-700 font-medium"
                        >
                          Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
