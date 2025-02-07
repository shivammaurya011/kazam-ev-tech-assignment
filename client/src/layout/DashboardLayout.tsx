import React, { ReactNode, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSidebarToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
