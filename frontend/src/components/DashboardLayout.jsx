import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
        </svg>
      )
    }
  ];

  const storeNavigation = [
    {
      name: 'Browse Products',
      path: '/dashboard/browse-products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      name: 'My Store',
      path: '/dashboard/my-store',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      name: 'Orders',
      path: '/dashboard/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      name: 'Wallet',
      path: '/dashboard/wallet',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  // Fetch counters
  useEffect(() => {
    let isMounted = true;

    async function loadCounts() {
      try {
        if (!user) return;
        const [unreadRes, statsRes] = await Promise.all([
          apiService.getUnreadNotificationsCount().catch(() => ({ success: true, unreadCount: 0 })),
          apiService.getOrderStats().catch(() => ({ success: true, stats: { pendingOrders: 0 } }))
        ]);
        if (!isMounted) return;
        setUnreadNotifications(unreadRes?.unreadCount || 0);
        setPendingOrders(statsRes?.stats?.pendingOrders || 0);
      } catch (_e) {
        if (!isMounted) return;
        setUnreadNotifications(0);
        setPendingOrders(0);
      }
    }

    loadCounts();

    // Poll periodically for updates
    const interval = setInterval(loadCounts, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-apple-gray-50 lg:flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-apple-gray-200">
          <Link to="/dashboard" className="text-2xl font-bold text-apple-gray-800">
            TooSale Pro
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-apple-gray-500 hover:text-apple-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wallet Balance Display */}
        <div className="mt-6 mx-4 bg-gradient-to-r from-apple-blue to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Wallet Balance</p>
              <p className="text-xl font-bold">$2,547.83</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>

        <nav className="mt-8 px-4 space-y-2 flex-1 flex flex-col">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-apple-blue text-white shadow-lg'
                    : 'text-apple-gray-700 hover:bg-apple-gray-100 hover:text-apple-blue'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Store Section */}
          <div className="pt-6">
            <h3 className="px-4 text-xs font-semibold text-apple-gray-500 uppercase tracking-wider mb-3">
              Store
            </h3>
            <div className="space-y-1">
              {storeNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-apple-blue text-white shadow-lg'
                      : 'text-apple-gray-700 hover:bg-apple-gray-100 hover:text-apple-blue'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                  {item.name === 'Orders' && pendingOrders > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center rounded-full bg-apple-blue text-white text-xs font-semibold h-5 px-2">
                      {pendingOrders}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>


          {/* Account Section */}
          <div className="pt-6">
            <h3 className="px-4 text-xs font-semibold text-apple-gray-500 uppercase tracking-wider mb-3">
              Account
            </h3>
            <div className="space-y-1">
              <Link
                to="/dashboard/notifications"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                  isActivePath('/dashboard/notifications')
                    ? 'bg-apple-blue text-white shadow-lg'
                    : 'text-apple-gray-700 hover:bg-apple-gray-100 hover:text-apple-blue'
                }`}
              >
                <span className="mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </span>
                Notifications
              </Link>
              <Link
                to="/dashboard/support"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                  isActivePath('/dashboard/support')
                    ? 'bg-apple-blue text-white shadow-lg'
                    : 'text-apple-gray-700 hover:bg-apple-gray-100 hover:text-apple-blue'
                }`}
              >
                <span className="mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                Support
              </Link>
              <Link
                to="/dashboard/account"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                  isActivePath('/dashboard/account')
                    ? 'bg-apple-blue text-white shadow-lg'
                    : 'text-apple-gray-700 hover:bg-apple-gray-100 hover:text-apple-blue'
                }`}
              >
                <span className="mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Account
              </Link>
              
              {/* Admin Panel Link - Only visible to admins */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors duration-200"
                >
                  <span className="mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-6 mt-auto">
            <div className="px-4">
              <button
                onClick={() => {
                  // In a real app, this would handle logout logic
                  console.log('Logging out...');
                  window.location.href = '/login';
                }}
                className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              >
                <span className="mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
                Logout
              </button>
            </div>
          </div>

        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-x-4 border-b border-apple-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-apple-gray-700 lg:hidden hover:bg-apple-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-3 lg:gap-x-4">
              {/* Notifications */}
              <Link
                to="/dashboard/notifications"
                className="relative p-2 text-apple-gray-500 hover:text-apple-gray-700 hover:bg-apple-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification badge */}
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </span>
                )}
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-apple-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-apple-blue rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-apple-gray-700">User</span>
                  <svg className="w-4 h-4 text-apple-gray-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Back to Store */}
              <Link
                to="/"
                className="hidden lg:flex items-center px-3 py-2 text-sm font-medium text-apple-gray-600 hover:text-apple-blue hover:bg-apple-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Store
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
