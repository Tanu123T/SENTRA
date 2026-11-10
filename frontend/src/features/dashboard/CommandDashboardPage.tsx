import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '../../api/alerts.api';
import { hazardsApi } from '../../api/hazards.api';
import { reportsApi } from '../../api/reports.api';
import { IndiaMap } from '../../components/map/IndiaMap';
import { useMapStore } from '../../stores/mapStore';
import {
  Radio,
  AlertTriangle,
  Users,
  Compass,
  ChevronDown,
  Calendar,
  Globe,
  Waves,
  Droplets,
  Activity,
  Wind,
  Flame,
  ArrowRight,
  ArrowUpRight,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Play,
  Pause,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Zap,
  Mountain,
} from 'lucide-react';

interface HazardPill {
  id: string;
  name: string;
  count?: number;
  icon: React.FC<{ className?: string }>;
  color: string;
  activeBg: string;
}

export const CommandDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { setViewMode, setFlyTo } = useMapStore();

  const [selectedRegion, setSelectedRegion] = useState('Southeast Asia / Indo-Pacific');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 24 hours');
  const [activeHazardFilter, setActiveHazardFilter] = useState('all');
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [timeframeMenuOpen, setTimeframeMenuOpen] = useState(false);
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(100);
  const [searchEventsQuery, setSearchEventsQuery] = useState('');
  const [liveDateFormatted, setLiveDateFormatted] = useState('MON, 16 JUN 2025');

  // Live Date formatting matching Figma design
  useEffect(() => {
    const d = new Date();
    const formatted = d
      .toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .toUpperCase();
    setLiveDateFormatted(formatted);
  }, []);

  // Fetch alerts from backend
  const { data: alertsData } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: () => alertsApi.getAlerts({ page_size: 50 }),
    refetchInterval: 15000,
  });

  const hazardPills: HazardPill[] = [
    { id: 'all', name: 'All hazards', count: 38, icon: Radio, color: 'text-blue-600', activeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'flood', name: 'Flood', count: 14, icon: Waves, color: 'text-blue-500', activeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'drought', name: 'Drought', count: 6, icon: Droplets, color: 'text-amber-500', activeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'earthquake', name: 'Earthquake', count: 8, icon: Zap, color: 'text-orange-500', activeBg: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'cyclone', name: 'Cyclone', count: 3, icon: Wind, color: 'text-indigo-500', activeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'landslide', name: 'Landslide', count: 4, icon: Mountain, color: 'text-emerald-500', activeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'tsunami', name: 'Tsunami', count: 2, icon: Activity, color: 'text-cyan-500', activeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { id: 'heatwave', name: 'Heatwave', count: 1, icon: Flame, color: 'text-rose-500', activeBg: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  // Active events mock catalog mirroring Figma screen
  const activeEventsList = [
    {
      id: 'EVT-01',
      title: 'Severe Flooding in Central Java',
      hazard: 'Flood',
      location: 'Central Java, Indonesia',
      severity: 'Critical',
      time: '4m ago',
      metric: '+2.8m above normal river level',
      lat: -7.15,
      lng: 110.14,
    },
    {
      id: 'EVT-02',
      title: 'Tropical Cyclone Ewini',
      hazard: 'Cyclone',
      location: 'Eastern Visayas, Philippines',
      severity: 'High',
      time: '12m ago',
      metric: 'Sustained winds 95 km/h',
      lat: 11.24,
      lng: 125.0,
    },
    {
      id: 'EVT-03',
      title: 'M5.8 Earthquake near Sumatra',
      hazard: 'Earthquake',
      location: 'West Sumatra, Indonesia',
      severity: 'High',
      time: '28m ago',
      metric: 'Magnitude 5.8 Mw (Depth 24km)',
      lat: -0.58,
      lng: 100.35,
    },
    {
      id: 'EVT-04',
      title: 'Mahanadi Basin Flash Flood Surge',
      hazard: 'Flood',
      location: 'Cuttack & Puri, Odisha',
      severity: 'Critical',
      time: '35m ago',
      metric: 'Discharge 850,000 cusecs',
      lat: 20.46,
      lng: 85.88,
    },
    {
      id: 'EVT-05',
      title: 'Severe Agricultural Drought Watch',
      hazard: 'Drought',
      location: 'Chao Phraya / Marathwada',
      severity: 'Moderate',
      time: '1h ago',
      metric: 'SPEI-3 Index -1.82 (Severe)',
      lat: 15.87,
      lng: 100.99,
    },
    {
      id: 'EVT-06',
      title: 'Bay of Bengal Deep Depression',
      hazard: 'Cyclone',
      location: 'Offshore Andhra Coast',
      severity: 'Moderate',
      time: '2h ago',
      metric: 'Central pressure 994 hPa',
      lat: 15.91,
      lng: 80.46,
    },
    {
      id: 'EVT-07',
      title: 'Andaman Basin Subduction Swarm',
      hazard: 'Earthquake',
      location: 'Nicobar Islands, India',
      severity: 'Moderate',
      time: '3h ago',
      metric: 'M5.2 seismic event (NOAA DART active)',
      lat: 9.15,
      lng: 92.75,
    },
  ];

  const filteredEvents = activeEventsList.filter((evt) => {
    const matchesFilter =
      activeHazardFilter === 'all' ||
      evt.hazard.toLowerCase() === activeHazardFilter.toLowerCase();
    const matchesQuery =
      searchEventsQuery === '' ||
      evt.title.toLowerCase().includes(searchEventsQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchEventsQuery.toLowerCase()) ||
      evt.hazard.toLowerCase().includes(searchEventsQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* ── Top Header Section ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Subtitle tag: • SITUATIONAL AWARENESS */}
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Situational Awareness
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Operational overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            A clearer picture. A faster response.
          </p>
        </div>

        {/* Right actions: • Updated just now + Generate Report Button */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Updated just now</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setReportMenuOpen((prev) => !prev)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/20 flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Generate report</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {reportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setReportMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 text-xs">
                  <button
                    onClick={() => {
                      setReportMenuOpen(false);
                      navigate('/reports');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>Situational Brief (PDF)</span>
                    <span className="text-[10px] text-slate-400">Executive</span>
                  </button>
                  <button
                    onClick={() => {
                      setReportMenuOpen(false);
                      navigate('/reports');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>Multi-Hazard Impact CSV</span>
                    <span className="text-[10px] text-slate-400">Raw Data</span>
                  </button>
                  <button
                    onClick={() => {
                      setReportMenuOpen(false);
                      navigate('/reports');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>Automated Recovery Audit</span>
                    <span className="text-[10px] text-blue-600 font-bold">JSON</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Filters & Timezone Bar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-200/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Region selector pill */}
          <div className="relative">
            <button
              onClick={() => setRegionMenuOpen((prev) => !prev)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedRegion}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {regionMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setRegionMenuOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 text-xs">
                  {[
                    'Southeast Asia / Indo-Pacific',
                    'India National Command (All Basins)',
                    'Odisha & Bay of Bengal Arc',
                    'Gujarat & Arabian Sea Coastal Zone',
                  ].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedRegion(r);
                        setRegionMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Timeframe selector pill */}
          <div className="relative">
            <button
              onClick={() => setTimeframeMenuOpen((prev) => !prev)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedTimeframe}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {timeframeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setTimeframeMenuOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 text-xs">
                  {['Last 6 hours', 'Last 24 hours', 'Last 72 hours', 'Past 7 days'].map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setSelectedTimeframe(t);
                          setTimeframeMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>

          <span className="text-slate-400 text-xs pl-1">
            Operational timezone: UTC +05:30 (IST)
          </span>
        </div>

        <div className="text-[11px] font-bold text-slate-400 tracking-wider">
          {liveDateFormatted}
        </div>
      </div>

      {/* ── 4 KPI Metric Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active hazard events */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Active hazard events
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              38
            </span>
            {/* Blue smooth upward sparkline */}
            <svg width="90" height="28" viewBox="0 0 90 28" fill="none">
              <path
                d="M2 20L20 18L38 22L54 12L70 14L88 4"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
            <span>↗ +6 from previous 24h</span>
          </div>
        </div>

        {/* Card 2: High-risk regions */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              High-risk regions
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              12
            </span>
            {/* Amber smooth sparkline */}
            <svg width="90" height="28" viewBox="0 0 90 28" fill="none">
              <path
                d="M2 18L18 21L36 14L54 18L72 10L88 6"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
            <span>↗ +2 require attention</span>
          </div>
        </div>

        {/* Card 3: Population exposed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Population exposed
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              2.4M
            </span>
            {/* Teal smooth downward sparkline */}
            <svg width="90" height="28" viewBox="0 0 90 28" fill="none">
              <path
                d="M2 10L20 8L38 18L56 14L74 20L88 16"
                stroke="#0EA5E9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span>↘ 8.2% from previous 24h</span>
          </div>
        </div>

        {/* Card 4: Monitoring coverage */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Monitoring coverage
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              98.6%
            </span>
            {/* Purple upward sparkline */}
            <svg width="90" height="28" viewBox="0 0 90 28" fill="none">
              <path
                d="M2 22L18 20L36 24L54 16L72 12L88 8"
                stroke="#6366F1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span>↗ +0.4% across monitored zones</span>
          </div>
        </div>
      </div>

      {/* ── Middle Two-Column Grid: Map + Priority Alerts ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Regional hazard map */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          {/* Map Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Regional hazard map
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>

            <button
              onClick={() => navigate('/map')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              <span>Explore map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hazard category filter pills matching Figma design */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {hazardPills.map((pill) => {
              const Icon = pill.icon;
              const isSelected = activeHazardFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveHazardFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 shrink-0 transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-white' : pill.color
                    }`}
                  />
                  <span>{pill.name}</span>
                  {pill.count && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {pill.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Map Container */}
          <div className="relative h-[480px] rounded-xl overflow-hidden border border-slate-200">
            {/* Live Map Canvas */}
            <IndiaMap />

            {/* Floating Top Badge */}
            <div className="absolute top-3 left-3 z-[400] px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur border border-slate-200/90 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>{selectedRegion}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-[11px] font-normal">
                Multi-hazard view
              </span>
            </div>

            {/* Bottom-left Map Legend */}
            <div className="absolute bottom-14 left-3 z-[400] px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur border border-slate-200/90 shadow-sm flex items-center gap-3 text-[11px]">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Risk Level
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-slate-700 font-medium">Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-700 font-medium">High</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-slate-700 font-medium">Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-700 font-medium">Low</span>
              </div>
            </div>

            {/* Bottom Timeline Playback Scrubber matching Figma design */}
            <div className="absolute bottom-2 left-2 right-2 z-[400] px-3 py-2 rounded-lg bg-white/95 backdrop-blur border border-slate-200/90 shadow-sm flex items-center gap-3 text-xs">
              <button
                onClick={() => setIsPlayingTimeline((prev) => !prev)}
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shrink-0"
              >
                {isPlayingTimeline ? (
                  <Pause className="w-3 h-3 fill-slate-700" />
                ) : (
                  <Play className="w-3 h-3 fill-slate-700 ml-0.5" />
                )}
              </button>

              <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                Last 24 hours
              </span>

              {/* Progress track */}
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={timelineProgress}
                  onChange={(e) => setTimelineProgress(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <span className="text-[11px] text-slate-700 font-bold whitespace-nowrap">
                Now
              </span>

              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Priority alerts */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Priority alerts</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                3
              </span>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Alert Cards matching Figma design */}
          <div className="space-y-3">
            {/* Alert 1: Critical Flooding */}
            <div
              onClick={() => navigate('/hazards')}
              className="p-4 rounded-xl border border-red-200 bg-red-50/20 hover:bg-red-50/40 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  Critical
                </span>
                <span className="text-[11px] text-slate-400">4m ago</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Severe flooding in Central Java
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Compass className="w-3 h-3 text-slate-400" />
                <span>Central Java, Indonesia</span>
              </div>
              <div className="pt-1.5 border-t border-red-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">River level</span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  +2.8 m above normal <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Alert 2: High Cyclone */}
            <div
              onClick={() => navigate('/hazards')}
              className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 hover:bg-amber-50/40 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  High
                </span>
                <span className="text-[11px] text-slate-400">12m ago</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Tropical Cyclone Ewini
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Compass className="w-3 h-3 text-slate-400" />
                <span>Eastern Visayas, Philippines</span>
              </div>
              <div className="pt-1.5 border-t border-amber-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Sustained winds</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  95 km/h <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Alert 3: High Earthquake */}
            <div
              onClick={() => navigate('/hazards')}
              className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 hover:bg-amber-50/40 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  High
                </span>
                <span className="text-[11px] text-slate-400">28m ago</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                M5.8 earthquake near Sumatra
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Compass className="w-3 h-3 text-slate-400" />
                <span>West Sumatra, Indonesia</span>
              </div>
              <div className="pt-1.5 border-t border-amber-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Magnitude</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  5.8 Mw <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/alerts')}
            className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View all alerts</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* ── Lower Grid: Active Events Table + Monitoring Live Feed ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Events Table (8 Cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Active events</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                {filteredEvents.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search events, locations..."
                  value={searchEventsQuery}
                  onChange={(e) => setSearchEventsQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => navigate('/alerts')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                <span>View all events</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5">Hazard</th>
                  <th className="pb-2.5">Incident Title</th>
                  <th className="pb-2.5">Location</th>
                  <th className="pb-2.5">Severity</th>
                  <th className="pb-2.5">Telemetry Metric</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-1.5">
                        {evt.hazard === 'Flood' && <Waves className="w-3.5 h-3.5 text-blue-500" />}
                        {evt.hazard === 'Cyclone' && <Wind className="w-3.5 h-3.5 text-indigo-500" />}
                        {evt.hazard === 'Earthquake' && <Zap className="w-3.5 h-3.5 text-orange-500" />}
                        {evt.hazard === 'Drought' && <Droplets className="w-3.5 h-3.5 text-amber-500" />}
                        <span>{evt.hazard}</span>
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900 max-w-[200px] truncate">
                      {evt.title}
                    </td>
                    <td className="py-3 text-slate-600">{evt.location}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          evt.severity === 'Critical'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : evt.severity === 'High'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}
                      >
                        {evt.severity}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">
                      {evt.metric}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate('/hazards')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monitoring Activity Live Feed (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Monitoring activity
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live feed</span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                time: '2m ago',
                icon: Waves,
                iconColor: 'text-blue-600 bg-blue-50',
                title: 'Flood threshold exceeded',
                desc: 'River gauging sensor ID-7734 exceeded HFL by 0.42m in Mahanadi basin.',
              },
              {
                time: '8m ago',
                icon: Wind,
                iconColor: 'text-indigo-600 bg-indigo-50',
                title: 'Cyclone windspeed update',
                desc: 'IMD Doppler Radar Paradip tracks 110 km/h gusts moving North-Northwest.',
              },
              {
                time: '18m ago',
                icon: Zap,
                iconColor: 'text-orange-600 bg-orange-50',
                title: 'USGS Seismic Telemetry',
                desc: 'M5.8 event processed in 1.4s. ShakeMap intensity VI generated.',
              },
              {
                time: '34m ago',
                icon: Activity,
                iconColor: 'text-cyan-600 bg-cyan-50',
                title: 'NOAA DART Buoy #23227',
                desc: 'Sea surface perturbation +0.34m recorded in Andaman Sea. No basin tsunami warning.',
              },
              {
                time: '52m ago',
                icon: CheckCircle2,
                iconColor: 'text-emerald-600 bg-emerald-50',
                title: 'MIP Optimization Solver',
                desc: 'Emergency response solution converged in 320ms: 14 NDRF teams rerouted.',
              },
            ].map((feed, i) => {
              const Icon = feed.icon;
              return (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${feed.iconColor}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 truncate">
                        {feed.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {feed.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      {feed.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/observations')}
            className="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Historical Telemetry Log</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
