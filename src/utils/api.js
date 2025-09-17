import axios from 'axios';

// Base API URL - change this to match your backend
const API_BASE_URL = 'http://localhost:8090/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Client API endpoints
export const clientAPI = {
  // Get all clients
  getAll: async () => {
    try {
      const response = await apiClient.get('/client');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Get client by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/client/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  // Create new client
  create: async (clientData) => {
    try {
      const response = await apiClient.post('/client', clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  // Update client
  update: async (id, clientData) => {
    try {
      const response = await apiClient.put(`/client/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Delete client
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/client/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  // Search clients
  search: async (searchTerm) => {
    try {
      const response = await apiClient.get(`/client/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching clients:', error);
      throw error;
    }
  }
};

// Generic API utilities
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.message;
      const status = error.response.status;
      return { message, status };
    } else if (error.request) {
      // Request was made but no response received
      return { message: 'No response from server', status: 0 };
    } else {
      // Something else happened
      return { message: error.message, status: -1 };
    }
  },

  // Format error for display
  formatError: (error) => {
    const { message, status } = apiUtils.handleError(error);
    
    switch (status) {
      case 400:
        return 'Invalid request. Please check your data.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Permission denied.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      case 0:
        return 'Unable to connect to server. Please check your internet connection.';
      default:
        return message || 'An unexpected error occurred.';
    }
  }
};

export default apiClient;