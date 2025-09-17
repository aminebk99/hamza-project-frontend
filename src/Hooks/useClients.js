import { useState, useEffect } from 'react';
import { clientAPI } from '../utils/api';
import { mockClients } from '../data/mockData';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data for development
      // In production, replace with: const data = await clientAPI.getAll();
      const data = mockClients;
      
      setClients(data);
    } catch (err) {
      setError('Failed to fetch clients');
      console.error('Error fetching clients:', err);
      // Fallback to mock data if API fails
      setClients(mockClients);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData) => {
    try {
      setError(null);
      
      // For development, use mock implementation
      const newClient = {
        id: Math.max(...clients.map(c => c.id), 0) + 1,
        ...clientData
      };
      
      // In production, replace with: const createdClient = await clientAPI.create(clientData);
      setClients(prevClients => [...prevClients, newClient]);
      
      return newClient;
    } catch (err) {
      setError('Failed to add client');
      console.error('Error adding client:', err);
      throw err;
    }
  };

  const updateClient = async (clientId, clientData) => {
    try {
      setError(null);
      
      // For development, use mock implementation
      const updatedClient = { id: clientId, ...clientData };
      
      // In production, replace with: const updatedClient = await clientAPI.update(clientId, clientData);
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === clientId ? updatedClient : client
        )
      );
      
      return updatedClient;
    } catch (err) {
      setError('Failed to update client');
      console.error('Error updating client:', err);
      throw err;
    }
  };

  const deleteClient = async (clientId) => {
    try {
      setError(null);
      
      // In production, replace with: await clientAPI.delete(clientId);
      setClients(prevClients =>
        prevClients.filter(client => client.id !== clientId)
      );
      
      return true;
    } catch (err) {
      setError('Failed to delete client');
      console.error('Error deleting client:', err);
      throw err;
    }
  };

  const searchClients = (searchTerm) => {
    if (!searchTerm) return clients;
    
    return clients.filter(client =>
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ice.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    searchClients
  };
};