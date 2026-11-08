import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { RegionScopeBadge } from './RegionScopeBadge';
import { LogOut, User as UserIcon, Shield, Menu, Radio, LayoutDashboard, Map as MapIcon } from 'lucide-react';
import { formatTitleCase } from '../../utils/formatters';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const primaryRole = user?.roles?.[0]?.name || 'OPERATOR';

  return (
    <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand & Badge */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-lg tracking-wider text-slate-900">SENTRA</span>
                <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                  TWIN
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Disaster Intelligence Twin</span>
            </div>
          </div>
        </Link>

        {/* Primary Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 ml-6 bg-slate-100/80 border border-slate-200/60 p-1 rounded-full text-xs">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`
            }
          >
            <MapIcon className="w-3.5 h-3.5" />
            Live Map
          </NavLink>

          <NavLink
            to="/hazards"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`
            }
          >
            Hazards
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`
            }
          >
            Alerts
          </NavLink>
        </nav>
      </div>

      {/* Center Geographic Scope Badge */}
      <div className="hidden min-[1600px]:flex items-center">
        <RegionScopeBadge />
      </div>

      {/* Right User Profile & Actions */}
      <div className="flex items-center gap-3">
        {/* DEFCON Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          DEFCON-3 ACTIVE
        </div>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs ring-2 ring-sky-200">
            {user?.full_name?.charAt(0) || <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
              {user?.full_name || 'Col. Rajesh Verma'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono leading-tight">
              {formatTitleCase(primaryRole)}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign Out / Switch Operator"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
