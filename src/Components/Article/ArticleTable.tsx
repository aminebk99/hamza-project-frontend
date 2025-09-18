import { Edit2, Trash2, Package } from 'lucide-react';

const ArticleTable = ({ articles, onEdit, onDelete, searchTerm }) => {
  const filteredArticles = articles.filter(article =>
    article.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.prixDAchatHT?.toString().includes(searchTerm) ||
    article.prixDeVenteHT?.toString().includes(searchTerm) ||
    article.tva?.toString().includes(searchTerm)
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(price || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-MA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (filteredArticles.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding a new article.'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Article
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Sécurité
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Prix d'achat HT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Prix de vente HT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              TVA
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
              Créé le
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredArticles.map((article) => (
            <tr key={article.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {/* {article.image ? (
                      <img 
                        className="h-10 w-10 rounded-lg object-cover" 
                        src={article.image} 
                        alt={article.designation}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null} */}
                    <div 
                      className={`h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center ${article.image ? 'hidden' : ''}`}
                    >
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{article.designation}</div>
                    <div className="text-sm text-gray-500">Ref: {article.reference}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{article.stockSecurite || 0}</div>
                <div className="text-xs text-gray-500">unités</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                {formatPrice(article.prixDAchatHT)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                {formatPrice(article.prixDeVenteHT)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                {formatPercentage(article.tva)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                {article.createdAt ? formatDate(article.createdAt) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(article)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                    title="Edit article"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(article.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete article"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleTable;