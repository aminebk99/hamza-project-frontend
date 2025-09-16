import React from 'react';
import { Users, FileText, BarChart3 } from 'lucide-react';
import StatsCard from './StatsCard';
import ActivityTable from './ActivityTable';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface DashboardContentProps {
  user: User;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ user }) => {
  // Mock activity data
  const activities = [
    {
      id: 1,
      user: 'Alice Johnson',
      action: 'Created new article',
      date: '2 hours ago',
      status: 'completed' as const,
    },
    {
      id: 2,
      user: 'Bob Wilson',
      action: 'Updated client information',
      date: '4 hours ago',
      status: 'pending' as const,
    },
  ];

  return (
    <main className="lg:ml-64 pt-16">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatsCard
            title="Total Clients"
            value="1,234"
            icon={Users}
            iconColor="text-blue-600"
            change="+12% from last month"
            changeType="positive"
          />
          <StatsCard
            title="Articles"
            value="456"
            icon={FileText}
            iconColor="text-green-600"
            change="+8% from last month"
            changeType="positive"
          />
          <StatsCard
            title="Page Views"
            value="12.3K"
            icon={BarChart3}
            iconColor="text-purple-600"
            change="-2% from last month"
            changeType="negative"
          />
        </div>

        {/* Activity Table */}
        <ActivityTable activities={activities} />
      </div>
    </main>
  );
};

export default DashboardContent;