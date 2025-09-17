// Mock data for development and testing
export const mockClients = [
  {
    id: 1,
    lastName: "John Doe",
    email: "john.doe@example.com",
    phone: "+212612345678",
    address: "123 Avenue Mohammed V, Casablanca",
    etat: "5000",
    ice: "ICE123456789"
  },
  {
    id: 2,
    lastName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+212623456789",
    address: "456 Boulevard Zerktouni, Casablanca",
    etat: "7500",
    ice: "ICE234567890"
  },
  {
    id: 3,
    lastName: "Ahmed El Mansouri",
    email: "ahmed.mansouri@example.com",
    phone: "+212634567890",
    address: "789 Rue des FAR, Rabat",
    etat: "3200",
    ice: "ICE345678901"
  },
  {
    id: 4,
    lastName: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+212645678901",
    address: "321 Avenue Hassan II, Marrakech",
    etat: "9800",
    ice: "ICE456789012"
  },
  {
    id: 5,
    lastName: "Mohamed Alami",
    email: "mohamed.alami@example.com",
    phone: "+212656789012",
    address: "654 Boulevard Moulay Youssef, Tangier",
    etat: "4300",
    ice: "ICE567890123"
  },
  {
    id: 6,
    lastName: "Fatima Benali",
    email: "fatima.benali@example.com",
    phone: "+212667890123",
    address: "987 Rue Abdelmoumen, Casablanca",
    etat: "6700",
    ice: "ICE678901234"
  },
  {
    id: 7,
    lastName: "David Brown",
    email: "david.brown@example.com",
    phone: "+212678901234",
    address: "147 Avenue des Nations Unies, Rabat",
    etat: "2100",
    ice: "ICE789012345"
  },
  {
    id: 8,
    lastName: "Aicha Tahiri",
    email: "aicha.tahiri@example.com",
    phone: "+212689012345",
    address: "258 Boulevard Al Massira, Agadir",
    etat: "8900",
    ice: "ICE890123456"
  }
];

// Mock notifications
export const mockNotifications = [
  {
    id: 1,
    message: "New client registered: John Doe",
    time: "5 min ago",
    unread: true,
    type: "client"
  },
  {
    id: 2,
    message: "Client payment received: Sarah Wilson - 9800 MAD",
    time: "15 min ago",
    unread: true,
    type: "payment"
  },
  {
    id: 3,
    message: "System backup completed successfully",
    time: "1 hour ago",
    unread: false,
    type: "system"
  },
  {
    id: 4,
    message: "Monthly report generated and sent",
    time: "2 hours ago",
    unread: false,
    type: "report"
  },
  {
    id: 5,
    message: "Client profile updated: Ahmed El Mansouri",
    time: "1 day ago",
    unread: false,
    type: "client"
  }
];

// Mock user data
export const mockUser = {
  id: 1,
  name: "John Smith",
  email: "john.smith@company.com",
  avatar: "/api/placeholder/40/40",
  role: "Admin",
  lastLogin: "2024-01-15T10:30:00Z"
};

// Mock statistics
export const mockStats = {
  totalClients: 125,
  totalRevenue: 875000,
  averageClientValue: 7000,
  newClientsThisMonth: 15,
  revenueGrowth: 12.5,
  clientGrowth: 8.3
};

// Utility functions for mock data
export const mockUtils = {
  // Generate a random client
  generateRandomClient: () => {
    const firstNames = ['Ahmed', 'Fatima', 'Mohamed', 'Aicha', 'Youssef', 'Khadija', 'Omar', 'Zineb'];
    const lastNames = ['Alami', 'Benali', 'Tahiri', 'El Mansouri', 'Benjelloun', 'Fassi', 'Chraibi', 'Sefrioui'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    return {
      id: Date.now() + Math.random(),
      lastName: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+21260${Math.floor(Math.random() * 9000000) + 1000000}`,
      address: `${Math.floor(Math.random() * 999) + 1} Avenue Hassan II, Casablanca`,
      etat: (Math.floor(Math.random() * 50000) + 1000).toString(),
      ice: `ICE${Math.floor(Math.random() * 900000000) + 100000000}`
    };
  },

  // Search clients by term
  searchClients: (clients, searchTerm) => {
    if (!searchTerm) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client =>
      client.lastName.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.includes(term) ||
      client.address.toLowerCase().includes(term) ||
      client.ice.toLowerCase().includes(term)
    );
  },

  // Sort clients
  sortClients: (clients, sortBy, sortOrder = 'asc') => {
    return [...clients].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'etat') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
};