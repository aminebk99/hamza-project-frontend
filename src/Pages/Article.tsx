import React, { useEffect, useState } from "react";
import { Plus, Eye, Edit, Trash2, X, Menu } from "lucide-react";
import axios from "axios";
import Header from "../Components/Common/Header";
import HeaderBar from "../Components/HeaderBar";
import ArticleForm from "../Components/Article/ArticleForm";
import ArticleView from "../Components/Article/ArticleView";
import DeleteConfirmModal from "../Components/Article/DeleteConfirmModal";
import Sidebar from "../Components/Common/Sidebar";

interface Article {
  id: number;
  reference: string;
  designation: string;
  stockSecurite: number;
  prixDAchatHT: number;
  prixDeVenteHT: number;
  tva: number;
  // image?: string; // Uncomment if image handling is added
}

const Article = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeItem, setActiveItem] = useState("client");

  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("http://localhost:8090/api/articles", {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      setArticles(response.data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      if (error.code === "ECONNABORTED") {
        setError("Request timeout. Please check your connection.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (error.response?.status === 404) {
        setError("Articles endpoint not found.");
      } else {
        setError("Failed to load articles. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  const deleteArticle = async (id) => {
    try {
      setDeleteLoading(true);

      await axios.delete(`http://localhost:8090/api/articles/${id}`, {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setArticles(articles.filter((article) => article.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting article:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete article",
      };
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddArticle = () => {
    setSelectedArticle(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setShowViewModal(true);
  };

  const handleDeleteClick = (article) => {
    setSelectedArticle(article);
    setShowDeleteModal(true);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/api/placeholder/40/40",
  };

  const notifications = [
    { id: 1, message: "New user registered", time: "5 min ago", unread: true },
    {
      id: 2,
      message: "Article published successfully",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 3,
      message: "System backup completed",
      time: "1 hour ago",
      unread: false,
    },
    {
      id: 4,
      message: "New comment on article",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 5,
      message: "Monthly report generated",
      time: "1 day ago",
      unread: false,
    },
  ];
  
  const handleFormSuccess = (articleData) => {
    if (isEditing && selectedArticle) {
      setArticles(
        articles.map((article) =>
          article.id === selectedArticle.id ? { ...articleData } : article
        )
      );
    } else {
      setArticles([...articles, articleData]);
    }
    setShowForm(false);
    setSelectedArticle(null);
    setIsEditing(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedArticle(null);
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedArticle) return;

    const result = await deleteArticle(selectedArticle.id);
    if (result.success) {
      setShowDeleteModal(false);
      setSelectedArticle(null);
    } else {
      alert(result.message || "Failed to delete article");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedArticle(null);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          user={user}
          notifications={notifications}
        />
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        notifications={notifications}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      
      <main className="transition-all duration-300 lg:ml-64 pt-16">
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Articles</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your article inventory</p>
            </div>
            <button
              onClick={handleAddArticle}
              className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Article
            </button>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-red-600 text-sm sm:text-base">{error}</p>
                <button
                  onClick={fetchArticles}
                  className="text-red-600 hover:text-red-800 underline text-sm self-start sm:self-auto"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {articles.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-10 w-10 sm:h-12 sm:w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                  Get started by creating your first article.
                </p>
                <button
                  onClick={handleAddArticle}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Article
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="block sm:hidden">
                  {articles.map((article) => (
                    <div key={article.id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <img
                          src={article.image || "https://via.placeholder.com/40x40?text=IMG"}
                          alt={article.designation}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/40x40?text=IMG";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {article.reference}
                              </p>
                              <p className="text-sm text-gray-500 truncate mt-1">
                                {article.designation}
                              </p>
                            </div>
                            <div className="flex space-x-1 ml-2 flex-shrink-0">
                              <button
                                onClick={() => handleViewArticle(article)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditArticle(article)}
                                className="text-green-600 hover:text-green-800 p-1 rounded-md hover:bg-green-50 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(article)}
                                className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div>Stock: {article.stockSecurite}</div>
                            <div>TVA: {article.tva}%</div>
                            <div>Achat: {Number(article.prixDAchatHT).toFixed(2)} MAD</div>
                            <div>Vente: {Number(article.prixDeVenteHT).toFixed(2)} MAD</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <table className="hidden sm:table min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Désignation
                      </th>
                      <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Sécurité
                      </th>
                      <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix d'Achat HT
                      </th>
                      <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix de Vente HT
                      </th>
                      <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TVA
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-4 whitespace-nowrap">
                          {/* <img
                            src={article.image || "https://via.placeholder.com/40x40?text=IMG"}
                            alt={article.designation}
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/40x40?text=IMG";
                            }}
                          /> */}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-gray-900">
                          <div className="max-w-20 lg:max-w-none truncate" title={article.reference}>
                            {article.reference}
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                          <div className="max-w-24 lg:max-w-32 truncate" title={article.designation}>
                            {article.designation}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {article.stockSecurite}
                        </td>
                        <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Number(article.prixDAchatHT).toFixed(2)} MAD
                        </td>
                        <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Number(article.prixDeVenteHT).toFixed(2)} MAD
                        </td>
                        <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {article.tva}%
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleViewArticle(article)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition-colors"
                              title="View details"
                            >
                              <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                            </button>
                            <button
                              onClick={() => handleEditArticle(article)}
                              className="text-green-600 hover:text-green-800 p-1 rounded-md hover:bg-green-50 transition-colors"
                              title="Edit article"
                            >
                              <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(article)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                              title="Delete article"
                            >
                              <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">
                {isEditing ? "Edit Article" : "Add New Article"}
              </h2>
              <button
                onClick={handleFormCancel}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <ArticleForm
                article={selectedArticle}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedArticle && (
        <ArticleView
          article={selectedArticle}
          onEdit={handleEditArticle}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showDeleteModal && selectedArticle && (
        <DeleteConfirmModal
          title="Delete Article"
          message={`Are you sure you want to delete "${selectedArticle.designation}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={deleteLoading}
        />
      )}
    </div>
  );
};

export default Article;