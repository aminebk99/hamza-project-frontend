import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ 
  title = 'Confirm Delete', 
  message = 'Are you sure you want to delete this item? This action cannot be undone.', 
  onConfirm, 
  onCancel, 
  isLoading = false 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                {title}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex space-x-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 rounded-md transition-colors font-medium flex items-center justify-center ${
                isLoading
                  ? 'bg-red-400 cursor-not-allowed text-white'
                  : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
            <button
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
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;