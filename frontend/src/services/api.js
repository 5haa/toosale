const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Returns the API root without the trailing /api path, useful for static file URLs
  getApiRoot() {
    return this.baseURL.replace(/\/?api\/?$/, '');
  }

  // Builds a full URL for a server-hosted file path like /uploads/...
  buildFileUrl(relativePath) {
    if (!relativePath) return '';
    const root = this.getApiRoot();
    return `${root}${relativePath}`;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseError) {
          // If JSON parsing fails, create a fallback error object
          data = {
            success: false,
            message: `Failed to parse response as JSON: ${parseError.message}`
          };
        }
      } else {
        // Handle non-JSON responses (like plain text rate limit messages)
        const textResponse = await response.text();
        data = {
          success: false,
          message: textResponse || `HTTP error! status: ${response.status}`
        };
      }

      if (!response.ok) {
        // Create a detailed error object
        const error = new Error(data.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = data;
        
        // Add retry information for rate limit errors
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after') || data.retryAfter;
          if (retryAfter) {
            error.retryAfter = parseInt(retryAfter);
            error.message = `${data.message} Please try again in ${Math.ceil(retryAfter / 60)} minute(s).`;
          }
        }
        
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // If it's a network error or other non-HTTP error
      if (!error.status) {
        error.message = 'Network error. Please check your connection and try again.';
      }
      
      throw error;
    }
  }

  // Auth methods
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Wallet methods
  async getWallet() {
    return this.request('/wallet');
  }

  async createWallet() {
    return this.request('/wallet/create', {
      method: 'POST',
    });
  }

  async getDepositInfo() {
    return this.request('/wallet/deposit-info');
  }

  async createDeposit(amount) {
    return this.request('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async checkDeposit(intentId) {
    return this.request(`/wallet/deposit/${intentId}/check`, {
      method: 'POST',
    });
  }

  async getWalletTransactions(limit = 20, offset = 0) {
    return this.request(`/wallet/transactions?limit=${limit}&offset=${offset}`);
  }

  async addFunds(amount, description = '') {
    return this.request('/wallet/add-funds', {
      method: 'POST',
      body: JSON.stringify({ amount, description }),
    });
  }

  async submitWithdrawal(amount, method, details) {
    return this.request('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount, method, details }),
    });
  }

  // Helper methods for token management
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Store methods
  async getMyStore() {
    return this.request('/stores/my-store');
  }

  async createStore(storeData) {
    return this.request('/stores', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  }

  async updateStore(storeId, storeData) {
    return this.request(`/stores/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    });
  }

  async getPublicStore(slug) {
    return this.request(`/stores/public/${slug}`);
  }

  async getStoreProducts(storeId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/stores/${storeId}/products${queryString ? '?' + queryString : ''}`);
  }

  async addProductToStore(storeId, productData) {
    return this.request(`/stores/${storeId}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async removeProductFromStore(storeId, productId) {
    return this.request(`/stores/${storeId}/products/${productId}`, {
      method: 'DELETE',
    });
  }

  async updateStoreProduct(storeId, productId, productData) {
    return this.request(`/stores/${storeId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  // Product methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? '?' + queryString : ''}`);
  }

  async getProduct(productId) {
    return this.request(`/products/${productId}`);
  }

  async getCategories() {
    return this.request('/products/categories');
  }

  async getTrendingProducts(limit = 10) {
    return this.request(`/products/trending/list?limit=${limit}`);
  }

  async getFeaturedProducts(limit = 8) {
    return this.request(`/products/featured/list?limit=${limit}`);
  }

  async getProductsByCategory(categorySlug, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/category/${categorySlug}${queryString ? '?' + queryString : ''}`);
  }

  async searchProducts(query, params = {}) {
    const searchParams = new URLSearchParams({ q: query, ...params }).toString();
    return this.request(`/products/search/query?${searchParams}`);
  }

  // Review methods
  async getReviewsSummary(productId) {
    return this.request(`/reviews/product/${productId}/summary`);
  }

  async submitReview(productId, rating, orderId = null) {
    return this.request(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ rating, orderId }),
    });
  }

  async getUserReview(productId) {
    return this.request(`/reviews/product/${productId}/user`);
  }

  async deleteReview(productId) {
    return this.request(`/reviews/product/${productId}`, {
      method: 'DELETE',
    });
  }

  // Order methods
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders${queryString ? '?' + queryString : ''}`);
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async updateOrderStatus(orderId, status, notes = '') {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  async getOrderStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders/stats/overview${queryString ? '?' + queryString : ''}`);
  }

  // Notification methods
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications${queryString ? '?' + queryString : ''}`);
  }

  async getUnreadNotificationsCount() {
    return this.request('/notifications/unread-count');
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/mark-all-read', { method: 'POST' });
  }

  // Support methods
  async getSupportTickets(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/support/tickets${queryString ? '?' + queryString : ''}`);
  }

  async getSupportTicket(ticketId) {
    return this.request(`/support/tickets/${ticketId}`);
  }

  async createSupportTicket(ticketData) {
    return this.request('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async addSupportMessage(ticketId, message, file = null, messageType = 'text', isInternal = false) {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('messageType', messageType);
    formData.append('isInternal', isInternal);
    
    if (file) {
      formData.append('file', file);
    }

    return this.request(`/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary for FormData
      },
    });
  }

  async getSupportStats() {
    return this.request('/support/admin/stats');
  }

  async getAdminSupportTickets(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/support/admin/tickets${queryString ? '?' + queryString : ''}`);
  }

  async updateTicketStatus(ticketId, status) {
    return this.request(`/support/admin/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async assignTicket(ticketId, adminId) {
    return this.request(`/support/admin/tickets/${ticketId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ adminId }),
    });
  }

  async getAdmins() {
    return this.request('/support/admin/admins');
  }

  // Admin methods
  async getAdminDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getAdminUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users${queryString ? '?' + queryString : ''}`);
  }

  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async getAdminStores(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/stores${queryString ? '?' + queryString : ''}`);
  }

  async getAdminOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/orders${queryString ? '?' + queryString : ''}`);
  }

  async updateAdminOrderStatus(orderId, status) {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminAnalytics(period = '30d') {
    return this.request(`/admin/analytics?period=${period}`);
  }

  // Admin wallet withdrawals
  async getAdminWithdrawals(params = {}) {
    const { status = 'pending', page = 1, limit = 20 } = params;
    const queryString = new URLSearchParams({ status, page, limit }).toString();
    return this.request(`/admin/wallet/withdrawals?${queryString}`);
  }

  async approveAdminWithdrawal(withdrawalId) {
    return this.request(`/admin/wallet/withdrawals/${withdrawalId}/approve`, {
      method: 'POST',
    });
  }

  async rejectAdminWithdrawal(withdrawalId, reason) {
    return this.request(`/admin/wallet/withdrawals/${withdrawalId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // File upload helper method
  async uploadFile(file, endpoint) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary for FormData
      },
    });
  }
}

export default new ApiService();
