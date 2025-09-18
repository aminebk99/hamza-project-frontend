import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, Package, TrendingUp, TrendingDown, Calendar, Filter,
  Eye, Download, RefreshCw, MoreVertical, ArrowUp, ArrowDown,
  ShoppingCart, DollarSign, Activity, Zap, Menu, Bell, Search,
  Home, Settings, LogOut, X
} from 'lucide-react';
import Header from '../Components/Common/Header';
import Sidebar from '../Components/Common/Sidebar';

const AdminDashboard1 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('week');
  const [isLoading, setIsLoading] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  // Mock user data
  const user = {
    name: 'Hamza El Yazidi',
    email: 'john.smith@example.com',
    avatar: '/api/placeholder/40/40'
  };

  const notifications = [
    { id: 1, message: 'New user registered', time: '5 min ago', unread: true },
    { id: 2, message: 'Article published successfully', time: '10 min ago', unread: true },
    { id: 3, message: 'System backup completed', time: '1 hour ago', unread: false },
    { id: 4, message: 'New comment on article', time: '2 hours ago', unread: false },
    { id: 5, message: 'Monthly report generated', time: '1 day ago', unread: false },
  ];

  // Mock data for different time periods
  const generateData = (period) => {
    const baseData = {
      day: [
        { name: '00:00', articles: 12, clients: 8, sales: 2400, revenue: 1200 },
        { name: '04:00', articles: 15, clients: 12, sales: 1800, revenue: 1800 },
        { name: '08:00', articles: 25, clients: 18, sales: 3200, revenue: 2200 },
        { name: '12:00', articles: 35, clients: 28, sales: 4100, revenue: 3100 },
        { name: '16:00', articles: 42, clients: 32, sales: 3800, revenue: 2800 },
        { name: '20:00', articles: 28, clients: 22, sales: 2900, revenue: 1900 }
      ],
      week: [
        { name: 'Mon', articles: 120, clients: 85, sales: 12400, revenue: 8200 },
        { name: 'Tue', articles: 150, clients: 112, sales: 15800, revenue: 10500 },
        { name: 'Wed', articles: 180, clients: 128, sales: 18200, revenue: 12100 },
        { name: 'Thu', articles: 165, clients: 145, sales: 16500, revenue: 11200 },
        { name: 'Fri', articles: 195, clients: 162, sales: 19500, revenue: 13800 },
        { name: 'Sat', articles: 210, clients: 178, sales: 21000, revenue: 14500 },
        { name: 'Sun', articles: 145, clients: 125, sales: 14500, revenue: 9800 }
      ],
      month: [
        { name: 'Week 1', articles: 850, clients: 620, sales: 85000, revenue: 58000 },
        { name: 'Week 2', articles: 920, clients: 680, sales: 92000, revenue: 64000 },
        { name: 'Week 3', articles: 1050, clients: 750, sales: 105000, revenue: 72000 },
        { name: 'Week 4', articles: 980, clients: 710, sales: 98000, revenue: 68000 }
      ],
      year: [
        { name: 'Jan', articles: 3200, clients: 2400, sales: 320000, revenue: 220000 },
        { name: 'Feb', articles: 3800, clients: 2800, sales: 380000, revenue: 260000 },
        { name: 'Mar', articles: 4200, clients: 3100, sales: 420000, revenue: 290000 },
        { name: 'Apr', articles: 3900, clients: 2950, sales: 390000, revenue: 270000 },
        { name: 'May', articles: 4500, clients: 3300, sales: 450000, revenue: 310000 },
        { name: 'Jun', articles: 4800, clients: 3600, sales: 480000, revenue: 330000 }
      ]
    };
    return baseData[period] || baseData.week;
  };

  const [chartData, setChartData] = useState(generateData('week'));

  // Statistics data
  const [stats, setStats] = useState({
    totalArticles: 1265,
    totalClients: 842,
    totalRevenue: 125840,
    totalOrders: 3421,
    articlesGrowth: 12.5,
    clientsGrowth: 8.3,
    revenueGrowth: 15.7,
    ordersGrowth: -2.4
  });

  // Category distribution for pie chart
  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3B82F6' },
    { name: 'Clothing', value: 25, color: '#10B981' },
    { name: 'Home', value: 20, color: '#F59E0B' },
    { name: 'Books', value: 12, color: '#EF4444' },
    { name: 'Sports', value: 8, color: '#8B5CF6' }
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'client', message: 'New client registered', time: '2 min ago', icon: Users },
    { id: 2, type: 'article', message: 'Article "Laptop Pro" added', time: '5 min ago', icon: Package },
    { id: 3, type: 'sale', message: 'Order #1234 completed', time: '8 min ago', icon: ShoppingCart },
    { id: 4, type: 'client', message: 'Client profile updated', time: '12 min ago', icon: Users },
    { id: 5, type: 'article', message: 'Inventory updated', time: '15 min ago', icon: Package },
    { id: 6, type: 'sale', message: 'Payment received #5678', time: '18 min ago', icon: DollarSign }
  ];

  const handleFilterChange = (period) => {
    setIsLoading(true);
    setActiveFilter(period);
    
    setTimeout(() => {
      setChartData(generateData(period));
      setIsLoading(false);
    }, 500);
  };

  const refreshDashboard = () => {
    setIsLoading(true);
    setTimeout(() => {
      setChartData(generateData(activeFilter));
      setStats(prev => ({
        ...prev,
        totalArticles: prev.totalArticles + Math.floor(Math.random() * 10),
        totalClients: prev.totalClients + Math.floor(Math.random() * 5),
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 1000)
      }));
      setIsLoading(false);
    }, 1000);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {change > 0 ? (
          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last period</span>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, actions }) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 ml-2">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header> */}
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

      {/* Main Dashboard Content */}
      <main className="transition-all duration-300 lg:ml-64 pt-16">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Dashboard Header with Refresh */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}! Here's your business overview.</p>
            </div>
            {/* <button
              onClick={refreshDashboard}
              disabled={isLoading}
              className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button> */}
          </div>

          {/* Time Filter */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {[
                { key: 'day', label: 'Today' },
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' },
                { key: 'year', label: 'This Year' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterChange(filter.key)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  } disabled:opacity-50`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              title="Total Articles"
              value={stats.totalArticles.toLocaleString()}
              change={stats.articlesGrowth}
              icon={Package}
              color="bg-blue-600"
            />
            <StatCard
              title="Total Clients"
              value={stats.totalClients.toLocaleString()}
              change={stats.clientsGrowth}
              icon={Users}
              color="bg-green-600"
            />
            <StatCard
              title="Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              change={stats.revenueGrowth}
              icon={DollarSign}
              color="bg-yellow-600"
            />
            <StatCard
              title="Orders"
              value={stats.totalOrders.toLocaleString()}
              change={stats.ordersGrowth}
              icon={ShoppingCart}
              color="bg-purple-600"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Articles & Clients Chart */}
            <ChartCard
              title="Articles & Clients Overview"
              actions={
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="articlesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="clientsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="articles"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#articlesGradient)"
                    name="Articles"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="clients"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#clientsGradient)"
                    name="Clients"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Sales Revenue Chart */}
            <ChartCard
              title="Sales & Revenue"
              actions={
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', r: 4 }}
                    name="Sales"
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', r: 4 }}
                    name="Revenue"
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Category Distribution */}
            <ChartCard title="Category Distribution">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <ChartCard title="Recent Activities">
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-lg bg-blue-100 mr-3 flex-shrink-0">
                        <activity.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </div>

          {/* Performance Metrics Bar */}
          <div className="mt-6 sm:mt-8">
            <ChartCard title="Performance Metrics">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="articles"
                    fill="#3B82F6"
                    name="Articles"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar
                    dataKey="clients"
                    fill="#10B981"
                    name="Clients"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard1;