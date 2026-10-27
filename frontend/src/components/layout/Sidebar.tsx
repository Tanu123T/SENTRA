import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map as MapIcon,
  Flame,
  AlertTriangle,
  Radio,
  HeartPulse,
  Truck,
  Cpu,
  Layers,
  FileBarChart2,
  Users,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../../stores/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.some((r) => r.name === 'ADMINISTRATOR');

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Live Map', path: '/map', icon: MapIcon },
    { name: 'Disaster Hazards', path: '/hazards', icon: Flame },
    { name: 'Incidents & Alerts', path: '/alerts', icon: AlertTriangle },
    { name: 'Sensor Telemetry', path: '/observations', icon: Radio },
    { name: 'Health Impacts', path: '/health', icon: HeartPulse },
    { name: 'Emergency Resources', path: '/resources', icon: Truck },
    { name: 'Resource Solver (MIP)', path: '/optimization', icon: Cpu },
    { name: 'Scenario Simulation', path: '/simulations', icon: Layers },
    { name: 'Impact Reports', path: '/reports', icon: FileBarChart2 },
  ];

  if (isAdmin) {
    navItems.push({ name: 'System Admin', path: '/admin', icon: Users });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sentra-sidebar-backdrop fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={clsx(
          'sentra-sidebar-glass fixed lg:sticky top-16 h-[calc(100vh-4rem)] z-40 w-64 border-r flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-3.5 space-y-1">
          <div className="sentra-nav-section px-3 py-2">
            Command Modules
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'sentra-nav-item flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium group select-none',
                    isActive && 'is-active'
                  )
                }
              >
                {() => {
                  const Icon = item.icon;
                  return (
                    <>
                      <Icon className="sentra-nav-icon w-4 h-4 shrink-0 transition-colors" />
                      <span className="truncate">{item.name}</span>
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* System telemetry footer badge */}
        <div className="sentra-sidebar-footer p-3.5 border-t">
          <div className="flex items-center justify-between text-[11px]">
            <span className="sentra-footer-label flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#a9b98e] animate-pulse" />
              SOLVER READY
            </span>
            <span className="sentra-footer-meta font-mono">OR-TOOLS 9.15</span>
          </div>
        </div>
      </aside>
    </>
  );
};
