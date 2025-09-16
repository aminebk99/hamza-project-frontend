import { useState } from "react";
import Header from "../Components/Common/Header";
import Sidebar from "../Components/Common/Sidebar";
import ClientTable from "../Components/Client/ClientTable";

function Client() {
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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
      <ClientTable />
    </div>
  );
}

export default Client;
