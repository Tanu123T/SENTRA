import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  Truck,
  AlertTriangle,
  Crosshair,
  ArrowLeft,
  ArrowUpRight,
  Database,
  ShieldAlert,
  Layers3,
} from 'lucide-react';
import { AlertRead, HazardModelStatus, ResourceRead } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { useMapStore } from '../../stores/mapStore';
import {
  REGION_DEFAULT_ZOOM,
  SEED_DISTRICTS,
  STATE_DEFAULT_ZOOM,
} from '../../utils/constants';
import { formatNumber } from '../../utils/formatters';
import { Badge } from '../../components/ui/Badge';
import { HazardBadge, SeverityBadge } from '../../components/common/StatusBadge';
import { clsx } from 'clsx';

interface RegionOpsPanelProps {
  alerts: AlertRead[];
  resources: ResourceRead[];
  modelStatuses?: HazardModelStatus[];
}

const DISTRICT_GROUPS = [
  {
    state: 'Maharashtra',
    ids: ['dist-mh-pu', 'dist-mh-mc', 'dist-mh-rg'],
  },
  {
    state: 'Assam',
    ids: ['dist-as-km', 'dist-as-dh', 'dist-as-ca'],
  },
  {
    state: 'Odisha',
    ids: ['dist-od-pu', 'dist-od-ba'],
  },
  {
    state: 'Kerala',
    ids: ['dist-kl-er', 'dist-kl-wa'],
  },
  {
    state: 'Rajasthan',
    ids: ['dist-rj-jp', 'dist-rj-js'],
  },
  {
    state: 'Uttarakhand',
    ids: ['dist-uk-ch', 'dist-uk-dd'],
  },
];

export const RegionOpsPanel: React.FC<RegionOpsPanelProps> = ({
  alerts,
  resources,
  modelStatuses,
}) => {
  const { user, assignedDistrictName, assignedStateName, assignedCoordinates } = useAuthStore();
  const {
    viewMode,
    selectedDistrictId,
    selectedStateIso,
    selectedStateName,
    selectedStateCenter,
    setViewMode,
    setSelectedDistrictId,
    setSelectedState,
  } = useMapStore();

  const fallbackId =
    user?.district_id && SEED_DISTRICTS[user.district_id] ? user.district_id : 'dist-mh-pu';
  const activeDistrictId = selectedDistrictId || (!selectedStateName ? fallbackId : null);
  const district = activeDistrictId ? SEED_DISTRICTS[activeDistrictId] : null;
  const stateScopeOnly = viewMode === 'REGION' && !!selectedStateName && !activeDistrictId;

  const districtAlerts = useMemo(
    () => (activeDistrictId ? alerts.filter((alert) => alert.district_id === activeDistrictId) : []),
    [alerts, activeDistrictId]
  );
  const districtResources = useMemo(
    () =>
      activeDistrictId
        ? resources.filter((resource) => resource.district_id === activeDistrictId)
        : [],
    [resources, activeDistrictId]
  );

  const untrainedCount = modelStatuses?.filter(
    (status) => !status.is_available || status.readiness_status === 'NOT_TRAINED'
  ).length;
  const allUntrained =
    !!modelStatuses && modelStatuses.length > 0 && untrainedCount === modelStatuses.length;

  const availableResources = districtResources.reduce(
    (total, resource) => total + resource.available_capacity,
    0
  );
  const totalResources = districtResources.reduce(
    (total, resource) => total + resource.total_capacity,
    0
  );

  const openRegion = () => {
    if (district && activeDistrictId) {
      setSelectedDistrictId(activeDistrictId);
      setSelectedState(selectedStateIso || district.stateIso, selectedStateName || district.state);
      setViewMode('REGION', [district.lat, district.lng], REGION_DEFAULT_ZOOM);
    } else if (selectedStateCenter) {
      setViewMode('REGION', selectedStateCenter, STATE_DEFAULT_ZOOM);
    } else {
      setViewMode('REGION', assignedCoordinates, REGION_DEFAULT_ZOOM);
    }
  };

  const handleDistrictChange = (districtId: string) => {
    if (!districtId) {
      setSelectedDistrictId(null);
      return;
    }
    const next = SEED_DISTRICTS[districtId];
    if (!next) return;
    setSelectedDistrictId(districtId);
    setSelectedState(next.stateIso, next.state);
    setViewMode('REGION', [next.lat, next.lng], REGION_DEFAULT_ZOOM);
  };

  const title = district
    ? `${district.name}, ${district.state}`
    : selectedStateName || assignedDistrictName || 'Assigned region';
  const subtitle = district
    ? selectedDistrictId
      ? 'Selected operational district'
      : user?.district_id
      ? 'Assigned sector'
      : 'Default focus district'
    : stateScopeOnly
    ? 'State scope'
    : 'National overview';

  return (
    <div className="sentra-panel sentra-panel-accent overflow-hidden">
      <div className="border-b border-[#243342]/70 px-3.5 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
            </span>
            <div>
              <h2 className="text-sm font-bold leading-tight text-[#E8EEF5]">{title}</h2>
              <p className="text-[10px] text-[#5A6E85]">{subtitle}</p>
            </div>
          </div>
          <Badge variant={viewMode === 'REGION' ? 'watch' : 'neutral'} size="sm">
            {viewMode === 'REGION' ? 'REGION' : 'INDIA'}
          </Badge>
        </div>
      </div>

      <div className="space-y-2.5 p-3">
        <select
          value={activeDistrictId || ''}
          onChange={(event) => handleDistrictChange(event.target.value)}
          className="w-full rounded-md border border-[#243342] bg-[#080D13]/70 px-2.5 py-2 text-[11px] text-[#E8EEF5] outline-none transition-colors focus:border-amber-500/60"
        >
          <option value="">State scope — select a district</option>
          {DISTRICT_GROUPS.map((group) => (
            <optgroup key={group.state} label={group.state}>
              {group.ids.map((id) => {
                const item = SEED_DISTRICTS[id];
                if (!item) return null;
                return (
                  <option key={id} value={id}>
                    {item.name}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>

        {district ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-[#243342]/70 bg-[#080D13]/55 p-2">
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[#5A6E85]">
                  <Users className="h-3 w-3 text-amber-400" />
                  Reference population
                </div>
                <p className="mt-1 font-mono text-sm font-bold text-[#E8EEF5]">
                  {formatNumber(district.population)}
                </p>
              </div>
              <div className="rounded-md border border-[#243342]/70 bg-[#080D13]/55 p-2">
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[#5A6E85]">
                  <Truck className="h-3 w-3 text-emerald-400" />
                  Registered fleet
                </div>
                <p className="mt-1 font-mono text-sm font-bold text-[#E8EEF5]">
                  {districtResources.length}
                  <span className="ml-1 text-[10px] font-normal text-[#5A6E85]">units</span>
                </p>
              </div>
              <div className="rounded-md border border-[#243342]/70 bg-[#080D13]/55 p-2">
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[#5A6E85]">
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                  Active alerts
                </div>
                <p
                  className={clsx(
                    'mt-1 font-mono text-sm font-bold',
                    districtAlerts.length > 0 ? 'text-red-400' : 'text-emerald-400'
                  )}
                >
                  {districtAlerts.length}
                </p>
              </div>
              <div className="rounded-md border border-[#243342]/70 bg-[#080D13]/55 p-2">
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[#5A6E85]">
                  <Crosshair className="h-3 w-3 text-sky-400" />
                  Reference point
                </div>
                <p className="mt-1 font-mono text-[10px] font-semibold text-[#E8EEF5]">
                  {district.lat.toFixed(3)}, {district.lng.toFixed(3)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-[#243342]/60 bg-[#0D151E]/50 px-2.5 py-1.5 text-[10px]">
              <span className="flex items-center gap-1.5 text-[#5A6E85]">
                <Layers3 className="h-3 w-3 text-violet-400" />
                District boundary
              </span>
              <span className="font-medium text-emerald-400">ADM2 bundled</span>
            </div>

            <div className="flex items-center justify-between rounded-md border border-[#243342]/60 bg-[#0D151E]/50 px-2.5 py-1.5 text-[10px]">
              <span className="flex items-center gap-1.5 text-[#5A6E85]">
                <Database className="h-3 w-3 text-amber-400" />
                Standby capacity
              </span>
              <span className="font-mono text-[#91A0B3]">
                {availableResources} / {totalResources}
              </span>
            </div>

            {districtAlerts.length > 0 ? (
              <div className="space-y-1.5">
                {districtAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-md border border-[#243342]/70 bg-[#080D13]/50 px-2.5 py-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] font-medium text-[#E8EEF5]">
                        {alert.title}
                      </span>
                      <SeverityBadge severity={alert.severity} size="sm" />
                    </div>
                    <div className="mt-1">
                      <HazardBadge hazard={alert.hazard_type} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-0.5 text-[9px] text-[#5A6E85]">
                No active alert records for this district.
              </p>
            )}
          </>
        ) : (
          <div className="rounded-md border border-[#243342]/70 bg-[#080D13]/50 px-2.5 py-2 text-[10px] leading-relaxed text-[#91A0B3]">
            A state is selected. District boundary geometry is bundled for 14 reference districts
            across {DISTRICT_GROUPS.length} states. Select a supported district for local detail.
          </div>
        )}

        <div
          className={clsx(
            'flex items-start gap-2 rounded-md border px-2.5 py-2 text-[10px] leading-relaxed',
            allUntrained
              ? 'border-amber-500/25 bg-amber-500/[0.06] text-amber-300/90'
              : 'border-[#243342] bg-[#080D13]/60 text-[#91A0B3]'
          )}
        >
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {allUntrained
              ? 'Predictive models are NOT_TRAINED. No AI risk score or forecast is presented.'
              : 'Only active backend alerts and registered resources are shown.'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {viewMode === 'REGION' ? (
            <button
              type="button"
              onClick={() => setViewMode('INDIA')}
              className="flex items-center justify-center gap-1.5 rounded-md border border-[#243342] bg-[#111C27] px-2 py-1.5 text-[10px] font-medium text-[#91A0B3] transition-colors hover:text-[#E8EEF5]"
            >
              <ArrowLeft className="h-3 w-3" />
              India View
            </button>
          ) : (
            <button
              type="button"
              onClick={openRegion}
              className="flex items-center justify-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[10px] font-semibold text-amber-300 transition-colors hover:bg-amber-500/15"
            >
              <Crosshair className="h-3 w-3" />
              Region View
            </button>
          )}
          <Link
            to="/map"
            className="flex items-center justify-center gap-1.5 rounded-md border border-[#243342] bg-[#111C27] px-2 py-1.5 text-[10px] font-medium text-[#91A0B3] transition-colors hover:text-[#E8EEF5]"
          >
            Full map
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <p className="px-0.5 text-[8px] leading-relaxed text-[#5A6E85]">
          Reference coordinates from the SENTRA district dataset. Boundaries © geoBoundaries
          ADM1 (CC BY 2.5 IN) / ADM2 (ODbL 1.0). Population figures are reference values, not live
          census telemetry.
        </p>
      </div>
    </div>
  );
};
