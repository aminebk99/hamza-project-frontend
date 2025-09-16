import React from 'react';

const ClientStats = ({ clients, searchTerm }) => {
  const filteredClients = clients.filter(client =>
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ice.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = clients.reduce((sum, client) => sum + parseInt(client.etat || 0), 0);
  const averageValue = clients.length > 0 ? Math.round(totalValue / clients.length) : 0;

  const stats = [
    {
      title: 'Total Clients',
      value: clients.length.toLocaleString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Value (MAD)',
      value: totalValue.toLocaleString(),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Filtered Results',
      value: filteredClients.length.toLocaleString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Value (MAD)',
      value: averageValue.toLocaleString(),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} p-4 rounded-lg shadow-sm border`}>
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {stat.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientStats;