import React, { useState } from 'react';
import axios from 'axios';

const ArticleForm = ({ article, onSuccess, onCancel }) => {
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

    // Reference validation
    if (!formData.reference.trim()) {
      newErrors.reference = 'Reference is required';
    }

    // Designation validation
    if (!formData.designation.trim()) {
      newErrors.designation = 'Désignation is required';
    }

    // Stock securite validation
    if (formData.stockSecurite === '' || formData.stockSecurite === null || formData.stockSecurite === undefined) {
      newErrors.stockSecurite = 'Stock sécurité is required';
    } else if (isNaN(formData.stockSecurite) || parseInt(formData.stockSecurite) < 0) {
      newErrors.stockSecurite = 'Stock sécurité must be a positive number';
    }

    // Prix d'achat validation
    if (formData.prixDAchatHT === '' || formData.prixDAchatHT === null || formData.prixDAchatHT === undefined) {
      newErrors.prixDAchatHT = 'Prix d\'achat HT is required';
    } else if (isNaN(formData.prixDAchatHT) || parseFloat(formData.prixDAchatHT) < 0) {
      newErrors.prixDAchatHT = 'Prix d\'achat HT must be a positive number';
    }

    // Prix de vente validation
    if (formData.prixDeVenteHT === '' || formData.prixDeVenteHT === null || formData.prixDeVenteHT === undefined) {
      newErrors.prixDeVenteHT = 'Prix de vente HT is required';
    } else if (isNaN(formData.prixDeVenteHT) || parseFloat(formData.prixDeVenteHT) < 0) {
      newErrors.prixDeVenteHT = 'Prix de vente HT must be a positive number';
    }

    // TVA validation
    if (formData.tva === '' || formData.tva === null || formData.tva === undefined) {
      newErrors.tva = 'TVA is required';
    } else if (isNaN(formData.tva) || parseFloat(formData.tva) < 0 || parseFloat(formData.tva) > 100) {
      newErrors.tva = 'TVA must be a number between 0 and 100';
    }

    // Image URL validation (optional)
    if (formData.image && formData.image.trim()) {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = 'Image must be a valid URL';
      }
    }

    // Business logic validation
    if (formData.prixDAchatHT && formData.prixDeVenteHT) {
      if (parseFloat(formData.prixDAchatHT) >= parseFloat(formData.prixDeVenteHT)) {
        newErrors.prixDeVenteHT = 'Prix de vente must be higher than prix d\'achat';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveArticle = async (articleData) => {
    try {
      setIsLoading(true);
      
      const config = {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
      };

      const requestData = {
        reference: articleData.reference.trim(),
        designation: articleData.designation.trim(),
        stockSecurite: parseInt(articleData.stockSecurite),
        prixDAchatHT: parseFloat(articleData.prixDAchatHT),
        prixDeVenteHT: parseFloat(articleData.prixDeVenteHT),
        tva: parseFloat(articleData.tva),
      };

      // Only include image if provided
      if (articleData.image && articleData.image.trim()) {
        requestData.image = articleData.image.trim();
      }

      const url = article 
        ? `http://localhost:8090/api/articles/${article.id}` 
        : 'http://localhost:8090/api/articles';
      
      const method = article ? 'put' : 'post';
      const response = await axios[method](url, requestData, config);

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          data: response.data,
          message: article ? 'Article updated successfully' : 'Article created successfully'
        };
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error saving article:', error);
      
      if (error.response) {
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
        } else if (status === 404) {
          return { success: false, message: 'Article not found' };
        } else if (status >= 500) {
          return { success: false, message: 'Server error. Please try again later.' };
        } else {
          return { success: false, message: `Error: ${message}` };
        }
      } else if (error.request) {
        return { 
          success: false, 
          message: 'Network error. Please check your connection and try again.' 
        };
      } else if (error.code === 'ECONNABORTED') {
        return { 
          success: false, 
          message: 'Request timeout. Please try again.' 
        };
      } else {
        return { 
          success: false, 
          message: 'An unexpected error occurred. Please try again.' 
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const result = await saveArticle(formData);
      
      if (result.success) {
        onSuccess(result.data);
      } else {
        setErrors({
          submit: result.message
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear submit error when user makes changes
    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Reference */}
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
            errors.reference ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter unique article reference"
        />
        {errors.reference && (
          <p className="mt-1 text-sm text-red-600">{errors.reference}</p>
        )}
      </div>

      {/* Designation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Désignation <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.designation ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter article name/description"
        />
        {errors.designation && (
          <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
        )}
      </div>

      {/* Stock Securite */}
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
          step="1"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.stockSecurite ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="Minimum stock level"
        />
        {errors.stockSecurite && (
          <p className="mt-1 text-sm text-red-600">{errors.stockSecurite}</p>
        )}
      </div>

      {/* Prix d'Achat HT */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prix d'Achat HT (MAD) <span className="text-red-500">*</span>
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
            errors.prixDAchatHT ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="Purchase price excluding tax"
        />
        {errors.prixDAchatHT && (
          <p className="mt-1 text-sm text-red-600">{errors.prixDAchatHT}</p>
        )}
      </div>

      {/* Prix de Vente HT */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prix de Vente HT (MAD) <span className="text-red-500">*</span>
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
            errors.prixDeVenteHT ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="Selling price excluding tax"
        />
        {errors.prixDeVenteHT && (
          <p className="mt-1 text-sm text-red-600">{errors.prixDeVenteHT}</p>
        )}
      </div>

      {/* TVA */}
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
            errors.tva ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="Tax percentage (e.g., 20)"
        />
        {errors.tva && (
          <p className="mt-1 text-sm text-red-600">{errors.tva}</p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL (Optional)
        </label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.image ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="https://example.com/image.jpg"
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image}</p>
        )}
        {formData.image && (
          <div className="mt-2">
            <img
              src={formData.image}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 py-2 px-4 rounded-md transition-colors font-medium flex items-center justify-center ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {article ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            `${article ? 'Update' : 'Create'} Article`
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={`flex-1 py-2 px-4 rounded-md transition-colors font-medium ${
            isLoading
              ? 'bg-gray-200 cursor-not-allowed text-gray-400'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;