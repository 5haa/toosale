import React, { useEffect, useMemo, useState } from 'react';
import apiService from '../../services/api';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await apiService.getNotifications({ page, limit: 25 });
        if (!isMounted) return;
        if (res.success) {
          setNotifications(res.notifications);
          setPagination(res.pagination);
          setError('');
        } else {
          setError(res.message || 'Failed to load notifications');
        }
      } catch (e) {
        if (!isMounted) return;
        setError(e.message || 'Failed to load notifications');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [page]);

  const filteredNotifications = useMemo(() => {
    const mapped = notifications.map(n => ({
      ...n,
      read: n.isRead,
      time: new Date(n.createdAt).toLocaleString(),
    }));
    switch (activeTab) {
      case 'unread':
        return mapped.filter(n => !n.read);
      case 'orders':
        return mapped.filter(n => n.type?.startsWith('order'));
      case 'payments':
        return mapped.filter(n => n.type === 'payment');
      case 'system':
        return mapped.filter(n => n.type === 'system');
      default:
        return mapped;
    }
  }, [notifications, activeTab]);

  const markAsRead = async (id) => {
    try {
      await apiService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (_) {}
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (_) {}
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
                {notifications.filter(n => !n.isRead).length}
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
                {notifications.filter(n => n.type?.startsWith('order')).length}
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
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-apple-blue mx-auto mb-4"></div>
                <p className="text-apple-gray-600">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-apple-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="text-lg font-medium text-apple-gray-900 mb-2">No notifications</h3>
                <p className="text-apple-gray-600">You're all caught up! Check back later for new updates.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 hover:bg-apple-gray-50 cursor-pointer border ${
                    !notification.read 
                      ? 'bg-blue-50 border-l-4 border-apple-blue border-t border-r border-b border-blue-200' 
                      : 'bg-white border-apple-gray-200 hover:border-apple-gray-300'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type?.startsWith('order') ? 'bg-green-100' : notification.type === 'payment' ? 'bg-blue-100' : 'bg-apple-gray-100'}`}>
                    <svg className={`w-5 h-5 ${notification.type?.startsWith('order') ? 'text-green-600' : notification.type === 'payment' ? 'text-blue-600' : 'text-apple-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-semibold ${!notification.read ? 'text-apple-gray-900' : 'text-apple-gray-700'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-apple-blue rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-apple-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-apple-gray-500">{notification.time}</p>
                          {notification.data?.orderId && (
                            <a
                              href={`/dashboard/orders`}
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

          {/* Pagination */}
          {!loading && !error && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button
                disabled={pagination.currentPage <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={`px-3 py-2 rounded-lg border ${pagination.currentPage <= 1 ? 'text-apple-gray-400 border-apple-gray-200' : 'text-apple-gray-700 hover:bg-apple-gray-50 border-apple-gray-300'}`}
              >
                Previous
              </button>
              <p className="text-sm text-apple-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
              <button
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                className={`px-3 py-2 rounded-lg border ${pagination.currentPage >= pagination.totalPages ? 'text-apple-gray-400 border-apple-gray-200' : 'text-apple-gray-700 hover:bg-apple-gray-50 border-apple-gray-300'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
