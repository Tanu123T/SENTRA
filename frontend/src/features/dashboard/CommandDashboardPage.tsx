import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '../../api/alerts.api';
import { resourcesApi } from '../../api/resources.api';
import { reportsApi } from '../../api/reports.api';
import { hazardsApi } from '../../api/hazards.api';
import { IndiaMap } from '../../components/map/IndiaMap';
import { useMapStore } from '../../stores/mapStore';
import { useAuthStore } from '../../stores/authStore';
import {
  Shield,
  Radio,
  Search,
  ChevronDown,
  ChevronRight,
  Wind,
  Droplets,
  Activity,
  Radar,
  Users,
  Truck,
  HeartPulse,
  Satellite,
  Mountain,
  Waves,
  RefreshCw,
  Bell,
  AlertTriangle,
  Sparkles,
  Download,
  Sliders,
  Check,
  Ship,
  Compass,
} from 'lucide-react';

export const CommandDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { viewMode: storeViewMode, setViewMode: setStoreViewMode, setFlyTo, activeLayers, toggleLayer } = useMapStore();

  const [activeTab, setActiveTab] = useState<'Overview' | 'Incidents' | 'Risk' | 'Weather' | 'Fleet'>('Overview');
  const [navTab, setNavTab] = useState('Live Map');
  const [viewMode, setViewMode] = useState<'insat' | 'topo' | 'inundation'>('insat');
  const [projection, setProjection] = useState<'2d' | '3d'>('2d');
  const [selectedBoundary, setSelectedBoundary] = useState('Odisha Coastal Arc (Bay of Bengal)');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveTime, setLiveTime] = useState('');

  // Live IST Clock formatted matching Stitch screen
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ' • ' + now.toLocaleTimeString('en-IN', { hour12: true }) + ' IST';
      setLiveTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real data queries with seed fallbacks
  const { data: alertsData } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: () => alertsApi.getAlerts({ page_size: 100 }),
    refetchInterval: 15000,
  });

  const { data: resourcesData } = useQuery({
    queryKey: ['dashboard-resources'],
    queryFn: () => resourcesApi.getResources({ page_size: 100 }),
    refetchInterval: 30000,
  });

  const { data: summary } = useQuery({
    queryKey: ['system-summary'],
    queryFn: reportsApi.getSystemSummary,
    refetchInterval: 30000,
  });

  const alerts = alertsData?.items || [];
  const resources = resourcesData?.items || [];

  // Local layer toggle states
  const [layers, setLayers] = useState({
    cycloneSurge: true,
    floodInundation: true,
    earthquakeSeismic: false,
    dopplerRadar: true,
    populationDensity: false,
    ndrfAssets: true,
    healthImpact: false,
  });

  const handleToggle = (key: keyof typeof layers) => {
    setLayers(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Sync with global mapStore
      if (key === 'cycloneSurge') toggleLayer('cyclone');
      if (key === 'floodInundation') toggleLayer('flood');
      if (key === 'earthquakeSeismic') toggleLayer('earthquake');
      if (key === 'ndrfAssets') toggleLayer('resources');
      return updated;
    });
  };

  const handleResetLayers = () => {
    setLayers({
      cycloneSurge: true,
      floodInundation: true,
      earthquakeSeismic: false,
      dopplerRadar: true,
      populationDensity: false,
      ndrfAssets: true,
      healthImpact: false,
    });
  };

  const handleNavClick = (tab: string) => {
    setNavTab(tab);
    if (tab === 'Reports') navigate('/reports');
    if (tab === 'Risk Analysis') navigate('/hazards');
    if (tab === 'Resource Allocation') navigate('/resources');
    if (tab === 'Forecasting') navigate('/simulations');
    if (tab === 'Live Map' || tab === 'Dashboard') navigate('/');
  };

  const handleFocusOdisha = () => {
    setFlyTo(19.8135, 85.8312, 7.5);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f3f6fa] text-slate-800 font-sans select-none overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          TOP COMMAND NAVBAR (Google Stitch Bright Theme)
      ───────────────────────────────────────────────────────────── */}
      <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-6 flex items-center justify-between z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
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

          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60 ml-4">
            {['Dashboard', 'Live Map', 'Risk Analysis', 'Resource Allocation', 'Forecasting', 'Reports'].map(tab => {
              const isActive = navTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleNavClick(tab)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {tab === 'Live Map' && <Radio className="w-3 h-3 inline mr-1.5 animate-pulse text-sky-200" />}
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            DEFCON-3 ACTIVE
          </div>

          <button
            onClick={() => window.location.reload()}
            title="Refresh feeds"
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            title="Notifications"
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200 relative transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Commander User Profile */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => logout()}>
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs ring-2 ring-sky-200">
              RV
            </div>
            <div className="text-left hidden lg:block leading-tight">
              <div className="text-xs font-bold text-slate-800">{user?.full_name || 'Col. Rajesh Verma'}</div>
              <div className="text-[10px] text-slate-400">NDMA Ops Commander</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </div>

          {/* Active Cyclone Header Card */}
          <div
            onClick={handleFocusOdisha}
            className="ml-2 pl-3 border-l border-slate-200 hidden xl:flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl px-3 py-1.5 cursor-pointer transition shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <Wind className="w-4 h-4 animate-spin" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[11px] font-semibold text-slate-800">Odisha Coastal Arc &gt; Storm Surge</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <span>Cat-3 Surge</span>
                <span className="text-emerald-600 font-bold bg-emerald-100/70 px-1 rounded text-[9px]">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN DIGITAL TWIN WORKSPACE
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT CONTROL RAIL: GIS 3.4 & LAYERS */}
        <aside className="w-80 bg-white/95 backdrop-blur border-r border-slate-200 flex flex-col z-20 shadow-sm shrink-0">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900">Disaster Intelligence</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                GIS 3.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Real-time GIS Digital Twin of India Hazards</p>

            <div className="mt-3 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search state, district, incident..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="p-4 border-b border-slate-100">
            <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
              Administrative Boundary
            </label>
            <div
              onClick={handleFocusOdisha}
              className="flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition text-xs font-semibold text-slate-700"
            >
              <span className="truncate">{selectedBoundary}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </div>
          </div>

          {/* MAP LAYERS LIST */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Map Layers</span>
                <button
                  onClick={handleResetLayers}
                  className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-1">
                {[
                  { id: 'cycloneSurge', label: 'Cyclone & Surge', icon: Wind, active: layers.cycloneSurge },
                  { id: 'floodInundation', label: 'Flood Inundation', icon: Droplets, active: layers.floodInundation },
                  { id: 'earthquakeSeismic', label: 'Earthquake Seismic', icon: Activity, active: layers.earthquakeSeismic },
                  { id: 'dopplerRadar', label: 'IMD Doppler Radar', icon: Radar, active: layers.dopplerRadar },
                  { id: 'populationDensity', label: 'Population Density', icon: Users, active: layers.populationDensity },
                  { id: 'ndrfAssets', label: 'NDRF Assets & Fleet', icon: Truck, active: layers.ndrfAssets },
                  { id: 'healthImpact', label: 'Health Impact Zones', icon: HeartPulse, active: layers.healthImpact },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${item.active ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span className={`font-medium ${item.active ? 'text-slate-800' : 'text-slate-500'}`}>
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggle(item.id as keyof typeof layers)}
                          className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                            item.active ? 'bg-sky-500' : 'bg-slate-200'
                          }`}
                        >
                          <div
                            className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
                              item.active ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VIEW MODE SELECTOR */}
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-2">View Mode</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'insat', label: 'INSAT-3DR', icon: Satellite },
                  { id: 'topo', label: 'Topographic', icon: Mountain },
                  { id: 'inundation', label: 'Inundation', icon: Waves },
                ].map(m => {
                  const Icon = m.icon;
                  const isSel = viewMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setViewMode(m.id as any)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                        isSel
                          ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-sm'
                          : 'bg-slate-50/60 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="text-[10px] font-semibold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER INTERACTIVE DIGITAL TWIN MAP CANVAS */}
        <main className="flex-1 relative overflow-hidden flex flex-col bg-[#e2ecf5]">
          {/* Top Floating Map Controls Overlay */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE {liveTime || 'Mon, 28 Dec 2026 • 11:23:40 AM IST'}</span>
            </div>

            <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 backdrop-blur p-1 rounded-full border border-slate-200 shadow-sm">
              <button
                onClick={() => setProjection('2d')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  projection === '2d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2D Ortho
              </button>
              <button
                onClick={() => setProjection('3d')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  projection === '3d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Mesh
              </button>
            </div>
          </div>

          {/* REAL MAP CONTAINER (Leaflet + OpenFreeMap Vector / Satellite) */}
          <div className="absolute inset-0 z-0">
            <IndiaMap
              alerts={alerts}
              resources={resources}
              height="100%"
              className="h-full w-full !rounded-none !border-0"
              hud={false}
            />
          </div>

          {/* BOTTOM MAP STATUS BAR */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto bg-white/95 backdrop-blur px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5 text-xs text-slate-600 font-medium">
              <div>
                Zoom: <span className="font-bold text-slate-800">6.8x</span>
              </div>
              <div>
                GSD: <span className="font-bold text-slate-800">250m/px</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold border-l border-slate-200 pl-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sensor Mesh: 1,420 Active Buoys &amp; Gauges
              </div>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={handleFocusOdisha}
                className="px-3 py-1.5 bg-white/95 hover:bg-white backdrop-blur border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                GIS Tools
              </button>
              <button
                onClick={() => alert('Exporting GeoTIFF layer bundle for Odisha Coastal Arc...')}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm shadow-sky-600/20 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                GeoTIFF Export
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT COMMAND & TELEMETRY RAIL */}
        <aside className="w-96 bg-white/95 backdrop-blur border-l border-slate-200 flex flex-col z-20 shadow-sm shrink-0 overflow-y-auto p-4 space-y-4">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            {(['Overview', 'Incidents', 'Risk', 'Weather', 'Fleet'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-xs font-bold pb-1 transition relative ${
                  activeTab === t ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t}
                {activeTab === t && (
                  <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* CRITICAL ALERT BANNER */}
          <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-left">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900 leading-tight">Severe Storm Surge &amp; Inundation</h4>
                <p className="text-[11px] text-rose-700 mt-1 leading-normal">
                  Seawall overtopping in Rajnagar block; immediate evacuations active under NDRF Bn 03 command.
                </p>
              </div>
            </div>
          </div>

          {/* TELEMETRY STACK CARD */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Telemetry Stack</span>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Realtime Sensor Synced
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/70 shadow-sm">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-medium text-slate-700">Active Incidents</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">28</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">↑ +3</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/70 shadow-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-medium text-slate-700">Population at Risk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">3.42M</span>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1 rounded">↑ 84k</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/70 shadow-sm">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-medium text-slate-700">Evac Readiness</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">88.4%</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">↑ Mobilized</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/70 shadow-sm">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-medium text-slate-700">Composite Risk (CVI)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">89/100</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">Severe</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI INSIGHTS (BETA) CARD */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-200 text-left relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">AI Insights</span>
                <span className="text-[9px] font-bold bg-sky-200/80 text-sky-800 px-1.5 py-0.5 rounded">BETA</span>
              </div>
              <Sparkles className="w-4 h-4 text-sky-500" />
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Surge inundation is modeled to peak by <strong className="text-slate-900">+35%</strong> in the next 18 hours
              across the Jagatsinghpur coastal corridor due to astronomical high tide alignment. NDRF Bn 03 reinforcement recommended.
            </p>

            <div className="mt-3 pt-3 border-t border-sky-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">
                Model Confidence: <strong className="text-slate-800">94.2%</strong>
              </span>
              <button
                onClick={() => alert('Deploying AI Surge Inundation Physics Model to field dispatch...')}
                className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 transition"
              >
                Deploy Model →
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER BAR
      ───────────────────────────────────────────────────────────── */}
      <footer className="h-7 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-400 shrink-0 z-30">
        <div>© 2025 SENTRA Command Network. National Disaster Management Digital Twin.</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Encrypted Defense Gateway
          </span>
          <span>Scope: National Ops - All India</span>
        </div>
      </footer>
    </div>
  );
};

export default CommandDashboardPage;
