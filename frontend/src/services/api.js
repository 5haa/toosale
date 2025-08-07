const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
      const data = await response.json();

      if (!response.ok) {
        // Create a detailed error object
        const error = new Error(data.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
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
