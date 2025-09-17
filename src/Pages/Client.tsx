import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import Header from '../Components/Common/Header';
import Sidebar from '../Components/Common/Sidebar';
import ClientTable from '../Components/Client/ClientTable';
import ClientForm from '../Components/Client/ClientForm';
import ClientStats from '../Components/Client/ClientStats';
import { Modal } from '../Components/Modal';
import { useClients } from '../Hooks/useClients';


const Client = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('client');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient
  } = useClients();

  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/api/placeholder/40/40",
  };

  const notifications = [
    { id: 1, message: "New user registered", time: "5 min ago", unread: true },
    { id: 2, message: "Article published successfully", time: "10 min ago", unread: true },
    { id: 3, message: "System backup completed", time: "1 hour ago", unread: false },
    { id: 4, message: "New comment on article", time: "2 hours ago", unread: false },
    { id: 5, message: "Monthly report generated", time: "1 day ago", unread: false },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleAddClient = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(clientId);
    }
  };

  const handleSubmitClient = async (formData) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData);
      } else {
        await addClient(formData);
      }
      setShowModal(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error saving client. Please try again.');
    }
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="lg:ml-64 pt-16">
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Client Management</h1>
            
            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleAddClient}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <Plus size={20} />
                <span>Add Client</span>
              </button>
            </div>

            {/* Client Stats */}
            <ClientStats clients={clients} searchTerm={searchTerm} />
          </div>

          {/* Client Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ClientTable
              clients={clients}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </main>

      {/* Add/Edit Client Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCancelModal}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
      >
        <ClientForm
          client={editingClient}
          onSubmit={handleSubmitClient}
          onCancel={handleCancelModal}
        />
      </Modal>
    </div>
  );
};

export default Client;