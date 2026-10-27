import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { RegionScopeBadge } from './RegionScopeBadge';
import { LogOut, User as UserIcon, Shield, Menu } from 'lucide-react';
import { formatTitleCase } from '../../utils/formatters';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const primaryRole = user?.roles?.[0]?.name || 'OPERATOR';

  return (
    <header className="sentra-header-glass h-16 border-b sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="sentra-header-icon-btn lg:hidden p-2 rounded-md border border-transparent transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="sentra-header-brand-mark w-8 h-8 rounded flex items-center justify-center p-1.5">
              <img src="/sentra-radar.svg" alt="SENTRA Radar" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="sentra-header-title font-bold text-base tracking-wider">SENTRA</span>
                <span className="sentra-ops-badge text-[10px] font-semibold tracking-widest px-1.5 py-0.2 rounded">
                  OPS
                </span>
              </div>
              <p className="sentra-header-subtitle text-[10px] tracking-wider uppercase font-mono hidden sm:block">
                Disaster Intelligence & Management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Center Geographic Scope Badge */}
      <div className="hidden min-[1600px]:flex items-center">
        <RegionScopeBadge />
      </div>

      {/* Right User Profile & Actions */}
      <div className="flex items-center gap-3">
        <div className="sentra-header-divider flex items-center gap-2.5 pl-3 border-l">
          <div className="sentra-header-avatar w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs">
            {user?.full_name?.charAt(0) || <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden md:block text-left">
            <p className="sentra-header-name text-xs font-semibold leading-tight truncate max-w-[140px]">
              {user?.full_name || 'Administrator'}
            </p>
            <div className="sentra-header-role flex items-center gap-1 text-[10px] font-medium leading-tight">
              <Shield className="w-2.5 h-2.5 text-[#d9a441] shrink-0" />
              <span>{formatTitleCase(primaryRole)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="sentra-header-logout p-2 rounded-md border border-transparent transition-all ml-1"
          title="Sign out of SENTRA"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
