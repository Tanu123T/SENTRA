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
    { name: 'Dashboard Twin', path: '/', icon: LayoutDashboard },
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
    navItems.push({ name: 'User Management', path: '/admin', icon: Users });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={clsx(
          'fixed lg:sticky top-16 h-[calc(100vh-4rem)] z-40 w-64 bg-white/95 backdrop-blur border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 overflow-y-auto shadow-xs',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 space-y-1">
          <div className="flex items-center justify-between px-2 py-1 mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Command Modules
            </span>
            <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
              v3.4
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group select-none',
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                {({ isActive }) => {
                  const Icon = item.icon;
                  return (
                    <>
                      <Icon
                        className={clsx(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* System telemetry footer badge */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SOLVER READY
            </span>
            <span className="font-mono text-slate-400 text-[10px]">OR-TOOLS 9.15</span>
          </div>
        </div>
      </aside>
    </>
  );
};
