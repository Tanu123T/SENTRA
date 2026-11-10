import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { SentraLogo } from '../common/SentraLogo';
import {
  LayoutDashboard,
  Radio,
  Flame,
  ShieldCheck,
  Globe,
  Clock,
  FileText,
  Database,
  Settings,
  HelpCircle,
  ChevronDown,
  MoreHorizontal,
  Compass,
  Check,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [selectedRegion, setSelectedRegion] = useState('Southeast Asia');
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const regionOptions = [
    { name: 'Southeast Asia', code: 'SE-ASIA', activeEvents: 38 },
    { name: 'India National Command', code: 'IND-HQ', activeEvents: 24 },
    { name: 'Bay of Bengal Arc', code: 'BOB-COAST', activeEvents: 14 },
    { name: 'Arabian Sea Basin', code: 'AS-BASIN', activeEvents: 8 },
    { name: 'Indo-Pacific Joint Ops', code: 'INDO-PAC', activeEvents: 42 },
  ];

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Live Monitoring', path: '/alerts', icon: Radio, badge: '38' },
    { name: 'Hazard Intelligence', path: '/hazards', icon: Flame },
    { name: 'Risk Assessment', path: '/simulations', icon: ShieldCheck },
    { name: 'Geographic Explorer', path: '/map', icon: Globe },
    { name: 'Historical Events', path: '/observations', icon: Clock },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Data Sources', path: '/resources', icon: Database },
  ];

  const userInitials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AC';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 h-screen z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 select-none shadow-xs',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Area: Logo + Regional Command Selector + Nav */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          {/* Brand Header */}
          <div className="px-1">
            <SentraLogo size="md" variant="waveform" />
          </div>

          {/* Regional Command Selector Card */}
          <div className="relative">
            <button
              onClick={() => setRegionDropdownOpen((prev) => !prev)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-900 leading-tight truncate">
                    Regional Command
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    {selectedRegion}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-1" />
            </button>

            {/* Region Dropdown Menu */}
            {regionDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setRegionDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-30 text-xs animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Command Zone
                  </div>
                  {regionOptions.map((reg) => (
                    <button
                      key={reg.name}
                      onClick={() => {
                        setSelectedRegion(reg.name);
                        setRegionDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 text-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        {selectedRegion === reg.name ? (
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <div className="w-3.5 h-3.5" />
                        )}
                        <span className={selectedRegion === reg.name ? 'font-semibold text-blue-600' : ''}>
                          {reg.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {reg.activeEvents} events
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Navigation Section */}
          <div className="space-y-1">
            <div className="px-2 pb-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Workspace
              </span>
            </div>

            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group select-none',
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={clsx(
                              'w-4 h-4 shrink-0 transition-colors',
                              isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                            )}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 group-hover:bg-slate-200/70">
                            {item.badge}
                          </span>
                        ) : isActive ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        ) : null}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Area: System Status Card + Settings + Profile + Platform Tag */}
        <div className="p-4 border-t border-slate-100 space-y-3 shrink-0">
          {/* Operational Status Card with Mini Histogram */}
          <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[11px] font-semibold text-slate-900">
                All systems operational
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              12 data sources connected
            </p>
            {/* 15-Bar Mini Green Histogram Sparkline matching Figma design */}
            <div className="flex items-end gap-1 h-5 pt-1">
              {[6, 9, 12, 8, 14, 11, 7, 13, 10, 15, 12, 14, 9, 13, 16].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-xs bg-emerald-400/80 transition-all hover:bg-emerald-500"
                  style={{ height: `${h * 1.2}px` }}
                />
              ))}
            </div>
          </div>

          {/* Settings & Help Links */}
          <div className="space-y-0.5 pt-1">
            <button
              onClick={() => navigate('/optimization')}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Help &amp; documentation</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          {/* User Profile Pill */}
          <div className="relative pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.full_name || 'Alex Carter'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {user?.roles?.[0]?.name || 'Operations Analyst'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Account options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Logout Menu */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 text-xs">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* SENTRA Intelligence Platform v2.4 Footer */}
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400 pt-1 px-1">
            <span>Sentra Intelligence Platform</span>
            <span>v2.4</span>
          </div>
        </div>
      </aside>
    </>
  );
};
