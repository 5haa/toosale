import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      name: 'Store Products',
      value: '1',
      change: '+1 this week',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: 'Store Views',
      value: '1,247',
      change: '+18% this week',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      name: 'Total Earnings',
      value: '$874',
      change: '+$247 this week',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      name: 'Orders',
      value: '23',
      change: '+8 this week',
      changeType: 'positive',
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    }
  ];

  const recentOrders = [
    { id: '1', customer: 'John Doe', product: 'Wireless Headphones', amount: '$299', status: 'completed', date: '2024-01-15' },
    { id: '2', customer: 'Jane Smith', product: 'Smart Watch', amount: '$249', status: 'processing', date: '2024-01-15' },
    { id: '3', customer: 'Mike Johnson', product: 'Designer Sunglasses', amount: '$159', status: 'shipped', date: '2024-01-14' },
    { id: '4', customer: 'Sarah Wilson', product: 'Minimalist Backpack', amount: '$89', status: 'pending', date: '2024-01-14' },
  ];

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Find products to add to your store',
      icon: (
        <svg className="w-8 h-8 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      link: '/dashboard/products',
      color: 'from-apple-blue to-blue-600'
    },
    {
      title: 'My Store',
      description: 'Manage your store and products',
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      link: '/dashboard/my-store',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Wallet',
      description: 'View earnings and withdraw funds',
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      link: '/dashboard/wallet',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="mb-8 bg-gradient-to-r from-apple-blue to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-2xl font-bold mb-2">Welcome to TooSale!</h2>
              <p className="text-blue-100 mb-4">Start building your store by browsing our product catalog</p>
              <Link to="/dashboard/products" className="bg-white text-apple-blue px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-block">
                Browse Products →
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="text-center">
                <div className="text-sm text-blue-100 mb-1">YOUR STORE</div>
                <div className="text-3xl font-bold">READY</div>
                <div className="text-sm text-blue-100">Add products to start</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card-apple p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-apple-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-apple-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="bg-apple-gray-50 p-3 rounded-xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-apple-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group card-apple p-6"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-4`}>
                {action.icon}
              </div>
              <h4 className="text-lg font-semibold text-apple-gray-900 mb-2 group-hover:text-apple-blue transition-colors">
                {action.title}
              </h4>
              <p className="text-apple-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card-apple">
        <div className="px-6 py-4 border-b border-apple-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-apple-gray-900">Recent Orders</h3>
            <Link
              to="/dashboard/orders"
              className="text-apple-blue hover:text-blue-600 font-medium text-sm transition-colors"
            >
              View all orders
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-apple-gray-200">
            <thead className="bg-apple-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-apple-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-apple-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-apple-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-apple-gray-600">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-apple-gray-900">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-apple-gray-600">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
