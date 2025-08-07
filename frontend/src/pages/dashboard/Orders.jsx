import React, { useState } from 'react';

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const orders = [
    {
      id: '#1001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'JD'
      },
      date: '2024-01-15',
      status: 'completed',
      total: 549.99,
      items: 2,
      products: ['Wireless Headphones', 'Smart Watch'],
      paymentStatus: 'paid',
      shippingAddress: '123 Main St, New York, NY'
    },
    {
      id: '#1002',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'JS'
      },
      date: '2024-01-15',
      status: 'processing',
      total: 299.99,
      items: 1,
      products: ['Premium Headphones'],
      paymentStatus: 'paid',
      shippingAddress: '456 Oak Ave, Los Angeles, CA'
    },
    {
      id: '#1003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: 'MJ'
      },
      date: '2024-01-14',
      status: 'shipped',
      total: 159.99,
      items: 1,
      products: ['Designer Sunglasses'],
      paymentStatus: 'paid',
      shippingAddress: '789 Pine St, Chicago, IL'
    },
    {
      id: '#1004',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: 'SW'
      },
      date: '2024-01-14',
      status: 'pending',
      total: 89.99,
      items: 1,
      products: ['Minimalist Backpack'],
      paymentStatus: 'pending',
      shippingAddress: '321 Elm Dr, Miami, FL'
    },
    {
      id: '#1005',
      customer: {
        name: 'David Brown',
        email: 'david@example.com',
        avatar: 'DB'
      },
      date: '2024-01-13',
      status: 'cancelled',
      total: 199.99,
      items: 1,
      products: ['Wireless Speaker'],
      paymentStatus: 'refunded',
      shippingAddress: '654 Maple Ave, Seattle, WA'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length 
        ? [] 
        : orders.map(o => o.id)
    );
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const stats = [
    {
      name: 'Total Orders',
      value: orders.length,
      icon: (
        <svg className="w-8 h-8 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      name: 'Processing',
      value: orders.filter(o => o.status === 'processing').length,
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Shipped',
      value: orders.filter(o => o.status === 'shipped').length,
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H15a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      name: 'Revenue',
      value: `$${orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0).toFixed(2)}`,
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-apple-gray-900">Orders</h1>
        <p className="text-apple-gray-600 mt-2">Manage your customer orders and track fulfillment</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card-apple p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-apple-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-apple-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="card-apple p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue"
            >
              <option value="date">Date</option>
              <option value="total">Total</option>
              <option value="customer">Customer</option>
              <option value="status">Status</option>
            </select>
          </div>

          {selectedOrders.length > 0 && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-apple-gray-600">
                {selectedOrders.length} selected
              </span>
              <button className="text-apple-blue hover:text-blue-600 text-sm font-medium">
                Export
              </button>
              <button className="text-apple-blue hover:text-blue-600 text-sm font-medium">
                Mark as Shipped
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card-apple overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-apple-gray-200">
            <thead className="bg-apple-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-apple-blue focus:ring-apple-blue border-apple-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-apple-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-apple-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="h-4 w-4 text-apple-blue focus:ring-apple-blue border-apple-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-apple-gray-900">{order.id}</div>
                      <div className="text-sm text-apple-gray-500">{order.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-apple-blue rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-medium">{order.customer.avatar}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-apple-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-apple-gray-500">{order.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-apple-gray-900">
                    ${order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-gray-900">{order.items} items</div>
                    <div className="text-xs text-apple-gray-500 truncate max-w-32">
                      {order.products.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-apple-blue hover:text-blue-600">View</button>
                      <button className="text-apple-gray-600 hover:text-apple-gray-800">Edit</button>
                    </div>
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

export default Orders;
