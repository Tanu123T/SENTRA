import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Sidebar } from './Sidebar';
import { clsx } from 'clsx';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMapDominant = location.pathname === '/';

  return (
    <div className="sentra-app-shell min-h-screen text-[#E8EEF5] flex flex-col font-sans">
      <TopNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main
          className={clsx(
            'flex-1 min-w-0',
            isMapDominant ? 'overflow-y-auto 2xl:overflow-hidden' : 'p-4 sm:p-6 lg:p-8 overflow-y-auto'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
