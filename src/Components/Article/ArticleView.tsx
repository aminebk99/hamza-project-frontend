import React from 'react';
import { X, Edit } from 'lucide-react';

const ArticleView = ({ article, onEdit, onClose }) => {
  if (!article) return null;

  const calculateProfitMargin = () => {
    if (!article.prixDAchatHT || !article.prixDeVenteHT || article.prixDAchatHT === 0) {
      return '0.00';
    }
    const margin = ((article.prixDeVenteHT - article.prixDAchatHT) / article.prixDAchatHT) * 100;
    return margin.toFixed(2);
  };

  const calculatePriceWithTVA = (price) => {
    if (!price || !article.tva) return '0.00';
    return (price + (price * article.tva / 100)).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">Article Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Article Image */}
          <div className="text-center mb-6">
            <div className="inline-block">
              <img
                src={article.image || "https://via.placeholder.com/150x150?text=No+Image"}
                alt={article.designation}
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/150x150?text=No+Image";
                }}
              />
            </div>
          </div>

          {/* Article Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Reference</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-2 rounded-md">
                  {article.reference || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Désignation</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                  {article.designation || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Stock Sécurité</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                  {article.stockSecurite || 0} units
                </p>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Pricing Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Prix d'Achat HT</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                  {Number(article.prixDAchatHT || 0).toFixed(2)} MAD
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Prix de Vente HT</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                  {Number(article.prixDeVenteHT || 0).toFixed(2)} MAD
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">TVA</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                  {article.tva || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Calculated Values */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Calculated Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700">Prix d'Achat TTC</p>
                <p className="text-lg font-bold text-blue-900">
                  {calculatePriceWithTVA(article.prixDAchatHT)} MAD
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700">Prix de Vente TTC</p>
                <p className="text-lg font-bold text-blue-900">
                  {calculatePriceWithTVA(article.prixDeVenteHT)} MAD
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700">Profit Margin</p>
                <p className={`text-lg font-bold ${
                  parseFloat(calculateProfitMargin()) > 0 
                    ? 'text-green-600' 
                    : parseFloat(calculateProfitMargin()) < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}>
                  {calculateProfitMargin()}%
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {article.image && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Image URL</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md break-all">
                {article.image}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t mt-6">
            <button
              onClick={() => {
                onClose();
                onEdit(article);
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Article
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;