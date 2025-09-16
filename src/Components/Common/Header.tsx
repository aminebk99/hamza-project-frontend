import React from 'react';
import { Menu, X } from 'lucide-react';
import NotificationDropdown from '../NotificationDropdown';
import ProfileDropdown from '../ProfileDropdown';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  unread: boolean;
}

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  user: User;
  notifications: Notification[];
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  toggleSidebar,
  user,
  notifications,
}) => {
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
          <NotificationDropdown notifications={notifications} />
          <ProfileDropdown user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;