import { useState } from 'react';
import axios from 'axios';

const ArticleForm = ({ article, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    reference: article?.reference || '',
    designation: article?.designation || '',
    stockSecurite: article?.stockSecurite || '',
    prixDAchatHT: article?.prixDAchatHT || '',
    prixDeVenteHT: article?.prixDeVenteHT || '',
    tva: article?.tva || '',
    image: article?.image || ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.reference.trim()) {
      newErrors.reference = 'Reference is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.stockSecurite || formData.stockSecurite < 0) {
      newErrors.stockSecurite = 'Stock sécurité must be a positive number';
    }

    if (!formData.prixDAchatHT || isNaN(parseFloat(formData.prixDAchatHT)) || parseFloat(formData.prixDAchatHT) < 0) {
      newErrors.prixDAchatHT = 'Prix d\'achat HT must be a valid positive number';
    }

    if (!formData.prixDeVenteHT || isNaN(parseFloat(formData.prixDeVenteHT)) || parseFloat(formData.prixDeVenteHT) < 0) {
      newErrors.prixDeVenteHT = 'Prix de vente HT must be a valid positive number';
    }

    if (!formData.tva || isNaN(parseFloat(formData.tva)) || parseFloat(formData.tva) < 0 || parseFloat(formData.tva) > 100) {
      newErrors.tva = 'TVA must be a valid percentage between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveArticleToDatabase = async (articleData) => {
    try {
      setIsLoading(true);
      
      // Configure axios with security headers and timeout
      const config = {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add CSRF token if your backend requires it
          // 'X-CSRF-Token': getCsrfToken(),
          // Add authorization header if using authentication
          // 'Authorization': `Bearer ${getAuthToken()}`,
        },
        withCredentials: true, // Include cookies for session-based auth
      };

      const response = await axios.post(
        'http://localhost:8090/api/article',
        {
          reference: articleData.reference.trim(),
          designation: articleData.designation.trim(),
          stockSecurite: parseInt(articleData.stockSecurite),
          prixDAchatHT: parseFloat(articleData.prixDAchatHT),
          prixDeVenteHT: parseFloat(articleData.prixDeVenteHT),
          tva: parseFloat(articleData.tva),
          image: articleData.image.trim() || null
        },
        config
      );

      // Handle successful response
      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          data: response.data,
          message: 'Article saved successfully'
        };
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error saving article:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Server error';
        
        if (status === 400) {
          return { success: false, message: `Validation error: ${message}` };
        } else if (status === 401) {
          return { success: false, message: 'Authentication required' };
        } else if (status === 403) {
          return { success: false, message: 'Access denied' };
        } else if (status === 409) {
          return { success: false, message: 'Article reference already exists' };
        } else if (status >= 500) {
          return { success: false, message: 'Server error. Please try again later.' };
        } else {
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
          message: 'An unexpected error occurred. Please try again.' 
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const result = await saveArticleToDatabase(formData);
      
      if (result.success) {
        // Call the parent component's onSubmit with the result
        onSubmit({
          ...formData,
          ...result.data,
          _saved: true,
          _message: result.message
        });
      } else {
        // Display error message
        setErrors({
          submit: result.message
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Clear submit error when user makes changes
    if (errors.submit) {
      setErrors({
        ...errors,
        submit: ''
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Display submit error if any */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reference <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.reference ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter article reference"
        />
        {errors.reference && (
          <p className="mt-1 text-sm text-red-600">{errors.reference}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Designation <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.designation ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter article designation"
        />
        {errors.designation && (
          <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock Sécurité <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="stockSecurite"
          value={formData.stockSecurite}
          onChange={handleChange}
          disabled={isLoading}
          min="0"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.stockSecurite ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter security stock quantity"
        />
        {errors.stockSecurite && (
          <p className="mt-1 text-sm text-red-600">{errors.stockSecurite}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix d'achat HT (MAD) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="prixDAchatHT"
            value={formData.prixDAchatHT}
            onChange={handleChange}
            disabled={isLoading}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.prixDAchatHT ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.prixDAchatHT && (
            <p className="mt-1 text-sm text-red-600">{errors.prixDAchatHT}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix de vente HT (MAD) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="prixDeVenteHT"
            value={formData.prixDeVenteHT}
            onChange={handleChange}
            disabled={isLoading}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.prixDeVenteHT ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.prixDeVenteHT && (
            <p className="mt-1 text-sm text-red-600">{errors.prixDeVenteHT}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          TVA (%) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="tva"
          value={formData.tva}
          onChange={handleChange}
          disabled={isLoading}
          min="0"
          max="100"
          step="0.01"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.tva ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="20.00"
        />
        {errors.tva && (
          <p className="mt-1 text-sm text-red-600">{errors.tva}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.image ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="https://example.com/image.jpg"
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image}</p>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`flex-1 py-2 px-4 rounded-md transition-colors font-medium flex items-center justify-center ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            `${article ? 'Update' : 'Add'} Article`
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className={`flex-1 py-2 px-4 rounded-md transition-colors font-medium ${
            isLoading
              ? 'bg-gray-200 cursor-not-allowed text-gray-400'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ArticleForm;