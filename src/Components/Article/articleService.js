import axios from 'axios';

const BASE_URL = 'http://localhost:8090/api/articles';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirect to login');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error, defaultMessage) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error || defaultMessage;
    
    switch (status) {
      case 400:
        return { success: false, message: `Validation error: ${message}` };
      case 401:
        return { success: false, message: 'Authentication required' };
      case 403:
        return { success: false, message: 'Access denied' };
      case 404:
        return { success: false, message: 'Article not found' };
      case 409:
        return { success: false, message: 'Article reference already exists' };
      case 422:
        return { success: false, message: `Invalid data: ${message}` };
      case 429:
        return { success: false, message: 'Too many requests. Please try again later.' };
      case 500:
      case 502:
      case 503:
      case 504:
        return { success: false, message: 'Server error. Please try again later.' };
      default:
        return { success: false, message: `Error: ${message}` };
    }
  } else if (error.request) {
    // Network error
    return { 
      success: false, 
      message: 'Network error. Please check your connection and try again.' 
    };
  } else if (error.code === 'ECONNABORTED') {
    // Timeout error
    return { 
      success: false, 
      message: 'Request timeout. Please try again.' 
    };
  } else {
    // Other errors
    return { 
      success: false, 
      message: defaultMessage || 'An unexpected error occurred. Please try again.' 
    };
  }
};

export const articleService = {
  // Get all articles
  getAllArticles: async () => {
    try {
      const response = await apiClient.get('/');
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return handleApiError(error, 'Failed to fetch articles');
    }
  },

  // Get article by ID
  getArticleById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return handleApiError(error, 'Failed to fetch article');
    }
  },

  // Create new article
  createArticle: async (articleData) => {
    try {
      const response = await apiClient.post('/', articleData);
      return {
        success: true,
        data: response.data,
        message: 'Article created successfully',
      };
    } catch (error) {
      return handleApiError(error, 'Failed to create article');
    }
  },

  // Update article
  updateArticle: async (id, articleData) => {
    try {
      const response = await apiClient.put(`/${id}`, articleData);
      return {
        success: true,
        data: response.data,
        message: 'Article updated successfully',
      };
    } catch (error) {
      return handleApiError(error, 'Failed to update article');
    }
  },

  // Delete article
  deleteArticle: async (id) => {
    try {
      await apiClient.delete(`/${id}`);
      return {
        success: true,
        message: 'Article deleted successfully',
      };
    } catch (error) {
      return handleApiError(error, 'Failed to delete article');
    }
  },

  // Search articles by reference or designation
  searchArticles: async (query) => {
    try {
      const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return handleApiError(error, 'Failed to search articles');
    }
  },

  // Get articles with low stock
  getLowStockArticles: async () => {
    try {
      const response = await apiClient.get('/low-stock');
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return handleApiError(error, 'Failed to fetch low stock articles');
    }
  },
};

export default articleService;