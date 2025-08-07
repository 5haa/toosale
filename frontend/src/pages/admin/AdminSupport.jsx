import React, { useState, useEffect, useRef } from 'react';
import apiService from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [updatingTicket, setUpdatingTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTickets();
    fetchAdmins();
    fetchStats();
  }, [currentPage, searchTerm, statusFilter, priorityFilter, assignedToFilter]);

  useEffect(() => {
    if (selectedTicket && showTicketDetails) {
      fetchTicketMessages(selectedTicket.id);
    }
  }, [selectedTicket, showTicketDetails]);

  useEffect(() => {
    scrollToBottom();
  }, [ticketMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (priorityFilter !== 'all') {
        params.priority = priorityFilter;
      }
      if (assignedToFilter !== 'all') {
        params.assignedTo = assignedToFilter;
      }

      const response = await apiService.getAdminSupportTickets(params);
      if (response.success) {
        setTickets(response.tickets);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await apiService.getAdmins();
      if (response.success) {
        setAdmins(response.admins);
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getSupportStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await apiService.getSupportTicket(ticketId);
      if (response.success) {
        setSelectedTicket(response.ticket);
        setTicketMessages(response.messages || []);
        setShowTicketDetails(true);
      }
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
      alert('Failed to load ticket details');
    }
  };

  const fetchTicketMessages = async (ticketId) => {
    try {
      setMessageLoading(true);
      const response = await apiService.getSupportTicket(ticketId);
      if (response.success) {
        setTicketMessages(response.messages || []);
        // Update ticket info in case status changed
        setSelectedTicket(prev => prev && prev.id === response.ticket.id ? { ...prev, ...response.ticket } : prev);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      setUpdatingTicket(ticketId);
      const response = await apiService.updateTicketStatus(ticketId, newStatus);
      if (response.success) {
        setTickets(tickets.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        ));
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      alert('Failed to update ticket status');
    } finally {
      setUpdatingTicket(null);
    }
  };

  const handleAssignTicket = async (ticketId, adminId) => {
    try {
      setUpdatingTicket(ticketId);
      const response = await apiService.assignTicket(ticketId, adminId);
      if (response.success) {
        const adminName = adminId ? admins.find(a => a.id === parseInt(adminId))?.first_name + ' ' + admins.find(a => a.id === parseInt(adminId))?.last_name : null;
        setTickets(tickets.map(ticket => 
          ticket.id === ticketId ? { ...ticket, assigned_admin_id: adminId, admin_name: adminName } : ticket
        ));
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, assigned_admin_id: adminId, admin_name: adminName });
        }
      }
    } catch (error) {
      console.error('Failed to assign ticket:', error);
      alert('Failed to assign ticket');
    } finally {
      setUpdatingTicket(null);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    try {
      setSendingMessage(true);
      const messageType = selectedFile ? (selectedFile.type.startsWith('image/') ? 'image' : 'file') : 'text';
      
      const response = await apiService.addSupportMessage(
        selectedTicket.id,
        newMessage,
        selectedFile,
        messageType
      );
      
      if (response.success) {
        setNewMessage('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Refresh messages
        await fetchTicketMessages(selectedTicket.id);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    const normalized = String(status).toLowerCase().replace('-', '_').replace(' ', '_');
    switch (normalized) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return 'bg-gray-100 text-gray-800';
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    switch (category.toLowerCase()) {
      case 'account': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'payment': return 'bg-yellow-100 text-yellow-800';
      case 'products': return 'bg-green-100 text-green-800';
      case 'orders': return 'bg-indigo-100 text-indigo-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      open: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryColors = {
      account: 'bg-blue-100 text-blue-800',
      technical: 'bg-purple-100 text-purple-800',
      payment: 'bg-yellow-100 text-yellow-800',
      products: 'bg-green-100 text-green-800',
      orders: 'bg-indigo-100 text-indigo-800',
      general: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  if (loading && currentPage === 1) {
    return <LoadingSpinner />;
  }

  // If a ticket is selected, show chat interface
  if (selectedTicket && showTicketDetails) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Chat Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => {
                setSelectedTicket(null);
                setShowTicketDetails(false);
              }}
              className="mr-4 p-2 text-apple-gray-600 hover:text-apple-gray-800 hover:bg-apple-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-apple-gray-900">#{selectedTicket.ticket_number}</h1>
              <p className="text-apple-gray-600">{selectedTicket.subject}</p>
              <p className="text-sm text-apple-gray-500">
                Customer: {selectedTicket.user_name} ({selectedTicket.user_email})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
              {selectedTicket.status?.replace('_', ' ')}
            </span>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
              {selectedTicket.priority} Priority
            </span>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedTicket.category)}`}>
              {selectedTicket.category}
            </span>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-sm border border-apple-gray-200 h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messageLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner />
              </div>
            ) : ticketMessages.length > 0 ? (
              ticketMessages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${message.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_role === 'admin' 
                      ? 'bg-apple-blue text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.sender_name}
                      </span>
                      {message.sender_role === 'admin' && (
                        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    {message.message && (
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    )}
                    
                    {message.file_url && (
                      <div className="mt-2">
                        {message.message_type === 'image' ? (
                          <img
                            src={apiService.buildFileUrl(message.file_url)}
                            alt="Attachment"
                            className="max-w-full h-auto rounded"
                          />
                        ) : (
                          <a
                            href={apiService.buildFileUrl(message.file_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-sm underline"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span>{message.file_name}</span>
                          </a>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No messages yet</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="space-y-3">
              {selectedFile && (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500">({formatFileSize(selectedFile.size)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your admin response..."
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent resize-none"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".png,.jpg,.jpeg,.gif,.pdf,.txt,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={(!newMessage.trim() && !selectedFile) || sendingMessage}
                    className="px-4 py-2 bg-apple-blue text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendingMessage ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-apple-gray-900">Admin Support Center</h1>
        <p className="text-apple-gray-600 mt-2">Manage customer support tickets and communications</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="card-apple p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-apple-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-apple-gray-900">{stats.total_tickets}</p>
              </div>
            </div>
          </div>

          <div className="card-apple p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-apple-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-apple-gray-900">{stats.open_tickets}</p>
              </div>
            </div>
          </div>

          <div className="card-apple p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-apple-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-apple-gray-900">{stats.in_progress_tickets}</p>
              </div>
            </div>
          </div>

          <div className="card-apple p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-apple-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-apple-gray-900">{stats.unassigned_tickets}</p>
              </div>
            </div>
          </div>

          <div className="card-apple p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-apple-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-apple-gray-900">{stats.avg_response_time}h</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card-apple p-6 mb-6">
        <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Filter Tickets</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-apple-gray-700 mb-2">
              Search Tickets
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-apple-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                placeholder="Search tickets..."
              />
            </div>
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-apple-gray-700 mb-2">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label htmlFor="priorityFilter" className="block text-sm font-medium text-apple-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label htmlFor="assignedToFilter" className="block text-sm font-medium text-apple-gray-700 mb-2">
              Assigned To
            </label>
            <select
              id="assignedToFilter"
              value={assignedToFilter}
              onChange={(e) => setAssignedToFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
            >
              <option value="all">All Admins</option>
              <option value="unassigned">Unassigned</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.first_name} {admin.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tickets Table */}
      <div className="card-apple overflow-hidden">
        <div className="px-6 py-4 border-b border-apple-gray-200">
          <h3 className="text-lg font-semibold text-apple-gray-900">
            Support Tickets ({pagination.totalItems || 0})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner />
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border border-apple-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-apple-blue">#{ticket.ticket_number}</span>
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {String(ticket.status).replace('_', ' ')}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {String(ticket.priority).charAt(0).toUpperCase() + String(ticket.priority).slice(1)} Priority
                    </span>
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(ticket.category)}`}>
                      {String(ticket.category).charAt(0).toUpperCase() + String(ticket.category).slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-apple-gray-500">Created: {formatDate(ticket.created_at)}</span>
                  </div>
                </div>
                
                <h4 className="font-semibold text-apple-gray-900 mb-2 text-lg">{ticket.subject}</h4>
                <p className="text-apple-gray-600 mb-2">Customer: <span className="font-medium">{ticket.user_name}</span> ({ticket.user_email})</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-apple-gray-600">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span>{ticket.message_count || 0} messages</span>
                    </span>
                    <span>Assigned to: {ticket.admin_name || 'Unassigned'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <select
                      value={ticket.assigned_admin_id || ''}
                      onChange={(e) => handleAssignTicket(ticket.id, e.target.value || null)}
                      disabled={updatingTicket === ticket.id}
                      className="text-sm border border-apple-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    >
                      <option value="">Assign To...</option>
                      {admins.map((admin) => (
                        <option key={admin.id} value={admin.id}>
                          {admin.first_name} {admin.last_name}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                      disabled={updatingTicket === ticket.id}
                      className="text-sm border border-apple-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    
                    <button
                      onClick={() => fetchTicketDetails(ticket.id)}
                      className="px-4 py-2 bg-apple-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Open Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-apple-gray-50 px-6 py-4 border-t border-apple-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-apple-gray-700">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-apple-gray-300 bg-white text-apple-gray-700 hover:bg-apple-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-apple-gray-300 bg-white text-apple-gray-700 hover:bg-apple-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default AdminSupport;
