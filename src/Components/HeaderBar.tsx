import { useState } from 'react'
import { 
  Menu, 
  X, 
  Bell, 
  User, 
 
  ChevronDown,
  LogOut,
  Settings,
  UserCircle
} from 'lucide-react';

function HeaderBar() {
    
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
      const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

      const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const user = {
    name: 'John Smith',
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
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationDropdownOpen(false);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false);
  };
  return (
    <header className="bg-blue-600 shadow-lg fixed w-full top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Menu toggle and Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-white hover:bg-blue-700 p-2 rounded-md transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="text-white font-bold text-xl hidden sm:block">
              Admin Panel
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotificationDropdown}
                className="text-white hover:bg-blue-700 p-2 rounded-md transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Show More
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                <ChevronDown size={16} />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserCircle size={16} className="mr-3" />
                      Account Information
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} className="mr-3" />
                      Settings
                    </a>
                    <div className="border-t border-gray-200"></div>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
  )
}

export default HeaderBar