import React, { useState, useEffect, useRef } from 'react';
import apiService from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Support = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSupportTickets();
      if (response.success) {
        setTickets(response.tickets);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketMessages = async (ticketId) => {
    try {
      setMessageLoading(true);
      const response = await apiService.getSupportTicket(ticketId);
      if (response.success) {
        setMessages(response.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createSupportTicket(newTicket);
      if (response.success) {
        setShowNewTicketForm(false);
        setNewTicket({ subject: '', category: 'general', priority: 'medium', description: '' });
        await fetchTickets();
        // Select the new ticket
        setSelectedTicket(response.ticket);
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
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

  const staticTickets = [
    {
      id: '#ST-001',
      subject: 'Payment issue with order #1024',
      category: 'Payment',
      priority: 'High',
      status: 'Open',
      created: '2024-01-15 10:30 AM',
      lastReply: '2024-01-15 11:45 AM',
      agent: 'Sarah Johnson',
      description: 'Customer payment was declined but order shows as processing. Need immediate assistance.',
      messages: 3,
      attachments: 1
    },
    {
      id: '#ST-002',
      subject: 'Product listing not appearing in search results',
      category: 'Technical',
      priority: 'Medium',
      status: 'In Progress',
      created: '2024-01-14 2:15 PM',
      lastReply: '2024-01-15 9:30 AM',
      agent: 'Mike Chen',
      description: 'My newly added products are not showing up in the marketplace search despite being approved.',
      messages: 5,
      attachments: 2
    },
    {
      id: '#ST-003',
      subject: 'Commission calculation seems incorrect',
      category: 'General',
      priority: 'Low',
      status: 'Resolved',
      created: '2024-01-12 4:20 PM',
      lastReply: '2024-01-13 1:30 PM',
      agent: 'Emily Davis',
      description: 'The commission rate shown on my dashboard doesn\'t match what was promised during signup.',
      messages: 7,
      attachments: 0
    },
    {
      id: '#ST-004',
      subject: 'Unable to upload product images',
      category: 'Technical',
      priority: 'Medium',
      status: 'Open',
      created: '2024-01-11 9:00 AM',
      lastReply: '2024-01-11 9:00 AM',
      agent: 'Not assigned',
      description: 'Getting error message when trying to upload product images. Tried multiple formats.',
      messages: 1,
      attachments: 3
    }
  ];

  const faqItems = [
    {
      id: 1,
      question: 'How do I add products to my store?',
      answer: 'To add products to your store, navigate to "My Store" in the dashboard, click on "Add Product", and fill in the required information including title, description, price, and images.',
      category: 'Store Management'
    },
    {
      id: 2,
      question: 'When do I receive my commission payments?',
      answer: 'Commission payments are processed every Friday for the previous week\'s sales. Payments typically arrive in your account within 2-3 business days.',
      category: 'Payments'
    },
    {
      id: 3,
      question: 'How can I track my orders?',
      answer: 'You can track all your orders in the "Orders" section of your dashboard. Here you\'ll see order status, customer information, and shipping details.',
      category: 'Orders'
    },
    {
      id: 4,
      question: 'What are the commission rates?',
      answer: 'Commission rates vary by product category, typically ranging from 5% to 15%. You can view specific rates for each product in your store dashboard.',
      category: 'Commissions'
    },
    {
      id: 5,
      question: 'How do I withdraw money from my wallet?',
      answer: 'Go to the Wallet section, click "Withdraw", enter the amount, and select your preferred payment method. Withdrawals are processed within 24 hours.',
      category: 'Payments'
    }
  ];

  // Keep old handler name for form compatibility
  const handleSubmitTicket = handleCreateTicket;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // If a ticket is selected, show chat interface
  if (selectedTicket) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Chat Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedTicket(null)}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-apple-gray-900">{selectedTicket.ticket_number}</h1>
              <p className="text-apple-gray-600">{selectedTicket.subject}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
              {selectedTicket.status}
            </span>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
              {selectedTicket.priority} Priority
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
            ) : messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${message.sender_role === 'admin' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_role === 'admin' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-apple-blue text-white'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.sender_name}
                      </span>
                      {message.sender_role === 'admin' && (
                        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                          Support
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
                            src={`http://localhost:5000${message.file_url}`}
                            alt="Attachment"
                            className="max-w-full h-auto rounded"
                          />
                        ) : (
                          <a
                            href={`http://localhost:5000${message.file_url}`}
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
                    placeholder="Type your message..."
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-apple-gray-900">Support Center</h1>
          <p className="text-apple-gray-600 mt-2">Get help and support for your TooSale account</p>
        </div>
        <button
          onClick={() => setShowNewTicketForm(true)}
          className="btn-apple"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card-apple p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-apple-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-apple-gray-900">
                {tickets.filter(t => t.status === 'Open').length}
              </p>
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
              <p className="text-2xl font-bold text-apple-gray-900">
                {tickets.filter(t => t.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card-apple p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-apple-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-apple-gray-900">
                {tickets.filter(t => t.status === 'Resolved').length}
              </p>
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
              <p className="text-2xl font-bold text-apple-gray-900">2.4h</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-apple-gray-900">Create New Support Ticket</h3>
                  <p className="text-apple-gray-600 mt-1">Describe your issue and we'll help you resolve it quickly</p>
                </div>
                <button
                  onClick={() => setShowNewTicketForm(false)}
                  className="text-apple-gray-400 hover:text-apple-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">Category *</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                      className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="account">Account & Billing</option>
                      <option value="technical">Technical Support</option>
                      <option value="payment">Payment Issues</option>
                      <option value="products">Product Management</option>
                      <option value="orders">Order Management</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-2">Priority *</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                      required
                    >
                      <option value="">Select priority</option>
                      <option value="low">Low - General question</option>
                      <option value="medium">Medium - Issue affecting workflow</option>
                      <option value="high">High - Urgent business issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    placeholder="Brief summary of your issue (e.g., 'Unable to process payment for order #1234')"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    rows="6"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    placeholder="Please provide detailed information about your issue including:
• What you were trying to do
• What happened instead
• Any error messages you received
• Steps you've already tried"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-2">Attachments (Optional)</label>
                  <div className="border-2 border-dashed border-apple-gray-300 rounded-lg p-6 text-center hover:border-apple-gray-400 transition-colors">
                    <svg className="w-8 h-8 text-apple-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <p className="text-sm text-apple-gray-600">
                      Click to upload screenshots, error logs, or other helpful files
                    </p>
                    <p className="text-xs text-apple-gray-500 mt-1">
                      Supported formats: PNG, JPG, PDF, TXT (Max 10MB)
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept=".png,.jpg,.jpeg,.pdf,.txt"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Expected Response Times</h4>
                      <ul className="text-sm text-blue-800 mt-1">
                        <li>• High Priority: Within 2 hours</li>
                        <li>• Medium Priority: Within 24 hours</li>
                        <li>• Low Priority: Within 48 hours</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-apple flex-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Support Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewTicketForm(false)}
                    className="flex-1 px-4 py-2 border border-apple-gray-300 rounded-lg text-apple-gray-700 hover:bg-apple-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card-apple mb-6">
        <div className="border-b border-apple-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 py-4">
            {[
              { id: 'tickets', label: 'Support Tickets' },
              { id: 'faq', label: 'FAQ' },
              { id: 'contact', label: 'Contact Us' }
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

        {/* Support Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-apple-gray-900">My Support Tickets</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-1 border border-apple-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue">
                    <option>All Status</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                  <select className="px-3 py-1 border border-apple-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-apple-blue">
                    <option>All Categories</option>
                    <option>Payment</option>
                    <option>Technical</option>
                    <option>General</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {(tickets.length > 0 ? tickets : staticTickets).map((ticket) => (
                <div key={ticket.id} className="border border-apple-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-apple-blue">{ticket.id}</span>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-apple-gray-500">Created: {ticket.created}</span>
                      <br />
                      <span className="text-sm text-apple-gray-500">Last Reply: {ticket.lastReply}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-apple-gray-900 mb-2 text-lg">{ticket.subject}</h4>
                  <p className="text-apple-gray-600 mb-4 leading-relaxed">{ticket.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-apple-gray-600">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span>{ticket.messages} messages</span>
                      </span>
                      {ticket.attachments > 0 && (
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span>{ticket.attachments} files</span>
                        </span>
                      )}
                      <span>Category: {ticket.category}</span>
                      <span>Agent: {ticket.agent}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-4 py-2 bg-apple-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Open Chat
                      </button>
                      {ticket.status !== 'Resolved' && tickets.length > 0 && (
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="px-4 py-2 bg-apple-gray-100 text-apple-gray-700 rounded-lg hover:bg-apple-gray-200 transition-colors text-sm font-medium"
                        >
                          Add Reply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-apple-gray-600 mb-4">Need help with something else?</p>
              <button
                onClick={() => setShowNewTicketForm(true)}
                className="btn-apple"
              >
                Create New Support Ticket
              </button>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="p-6">
            <div className="space-y-4">
              {faqItems.map((faq) => (
                <div key={faq.id} className="border border-apple-gray-200 rounded-lg">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-apple-gray-50">
                      <h4 className="font-medium text-apple-gray-900">{faq.question}</h4>
                      <span className="ml-6 flex-shrink-0">
                        <svg className="w-5 h-5 text-apple-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-apple-gray-600">{faq.answer}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-apple-gray-100 text-apple-gray-800 mt-2">
                        {faq.category}
                      </span>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Us Tab */}
        {activeTab === 'contact' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-apple-gray-900">Get in Touch</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-apple-gray-900">Email Support</p>
                    <p className="text-apple-gray-600">support@toosale.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-apple-gray-900">Phone Support</p>
                    <p className="text-apple-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-apple-gray-900">Live Chat</p>
                    <p className="text-apple-gray-600">Available 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>
              <div className="bg-apple-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-apple-gray-900 mb-4">Business Hours</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-apple-gray-600">Monday - Friday</span>
                    <span className="text-apple-gray-900">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-apple-gray-600">Saturday</span>
                    <span className="text-apple-gray-900">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-apple-gray-600">Sunday</span>
                    <span className="text-apple-gray-900">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
