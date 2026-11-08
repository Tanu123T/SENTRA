import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Sidebar } from './Sidebar';
import { clsx } from 'clsx';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMapDominant = location.pathname === '/' || location.pathname === '/map';

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-slate-800 flex flex-col font-sans select-none">
      <TopNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main
          className={clsx(
            'flex-1 min-w-0 bg-[#f3f6fa]',
            isMapDominant ? 'overflow-hidden' : 'p-4 sm:p-6 lg:p-8 overflow-y-auto'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
