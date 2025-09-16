import React, { useState } from 'react';
import { User, ChevronDown, UserCircle, Settings, LogOut } from 'lucide-react';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileDropdownProps {
  user: User;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <User size={16} />
        </div>
        <span className="hidden sm:block text-sm font-medium">{user.name}</span>
        <ChevronDown size={16} />
      </button>

      {/* Profile Dropdown */}
      {isOpen && (
        <>
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
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;