import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../../api/reports.api';
import { alertsApi } from '../../api/alerts.api';
import { resourcesApi } from '../../api/resources.api';
import { hazardsApi } from '../../api/hazards.api';
import { IndiaMap } from '../../components/map/IndiaMap';
import { LayerControlPanel } from '../../components/map/LayerControlPanel';
import { NationalOverviewPanel } from './NationalOverviewPanel';
import { RegionOpsPanel } from './RegionOpsPanel';
import { LiveIncidentFeed } from './LiveIncidentFeed';
import { useMapStore } from '../../stores/mapStore';
import { Badge } from '../../components/ui/Badge';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ShieldCheck, Satellite, Map as MapIcon, Waves, Database } from 'lucide-react';
import { clsx } from 'clsx';

export const CommandDashboardPage: React.FC = () => {
  const { viewMode, selectedDistrictId } = useMapStore();
  const isDesktopHud = useMediaQuery('(min-width: 1536px)');

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['system-summary'],
    queryFn: reportsApi.getSystemSummary,
    refetchInterval: 30000,
  });

  const { data: alertsData, isLoading: isAlertsLoading } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: () => alertsApi.getAlerts({ page_size: 100 }),
    refetchInterval: 15000,
  });

  const { data: resourcesData } = useQuery({
    queryKey: ['dashboard-resources'],
    queryFn: () => resourcesApi.getResources({ page_size: 100 }),
    refetchInterval: 30000,
  });

  const { data: modelStatuses } = useQuery({
    queryKey: ['hazard-model-status'],
    queryFn: hazardsApi.getModelStatuses,
    staleTime: 60000,
  });

  const alerts = alertsData?.items || [];
  const resources = resourcesData?.items || [];

  const untrainedCount = modelStatuses?.filter(
    (status) => !status.is_available || status.readiness_status === 'NOT_TRAINED'
  ).length;
  const allUntrained =
    !!modelStatuses && modelStatuses.length > 0 && untrainedCount === modelStatuses.length;

  const syncTime = summary?.generated_at
    ? new Date(summary.generated_at).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : '—';

  const fitPadding = isDesktopHud
    ? {
        top: 18,
        right: 356,
        bottom: 18,
        left: 318,
      }
    : {
        top: 16,
        right: 16,
        bottom: 16,
        left: 16,
      };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#05080C] 2xl:h-[calc(100vh-4rem)] 2xl:min-h-0 2xl:overflow-hidden">
      <div className="relative h-[64vh] min-h-[440px] w-full 2xl:absolute 2xl:inset-0 2xl:h-full">
        <IndiaMap
          alerts={alerts}
          resources={resources}
          height="100%"
          className="h-full w-full !rounded-none !border-0"
          hud={false}
          fitPadding={fitPadding}
        />
      </div>

      {/* Desktop HUD */}
      <div className="pointer-events-none absolute inset-0 z-[600] hidden 2xl:block">
        <div className="pointer-events-auto absolute bottom-3 left-3 top-3 w-[298px] space-y-2 overflow-y-auto">
          <NationalOverviewPanel
            summary={summary}
            alerts={alerts}
            resources={resources}
            modelStatuses={modelStatuses}
            isLoading={isSummaryLoading}
          />
          <LayerControlPanel inline />
        </div>

        <div className="pointer-events-auto absolute bottom-3 right-3 top-3 w-[334px] space-y-2 overflow-y-auto pr-0.5">
          <RegionOpsPanel
            alerts={alerts}
            resources={resources}
            modelStatuses={modelStatuses}
          />
          <LiveIncidentFeed alerts={alerts} isLoading={isAlertsLoading} />
        </div>

        <div className="pointer-events-auto absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-[#243342]/90 bg-[#080D13]/90 px-3.5 py-1.5 text-[9px] text-[#91A0B3] shadow-2xl backdrop-blur">
          <span className="flex items-center gap-1.5 font-medium text-[#E8EEF5]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {viewMode === 'REGION'
              ? selectedDistrictId
                ? 'Region view · selected district'
                : 'Region view · state scope'
              : 'India view · national overview'}
          </span>
          <span className="hidden h-3 w-px bg-[#243342] min-[1600px]:block" />
          <span className="hidden items-center gap-1 min-[1600px]:flex">
            <Database className="h-2.5 w-2.5 text-sky-400" />
            Sync {syncTime}
          </span>
          <span className="hidden h-3 w-px bg-[#243342] min-[1600px]:block" />
          <span className="flex items-center gap-1">
            {viewMode === 'INDIA' ? (
              <Satellite className="h-2.5 w-2.5 text-amber-400" />
            ) : (
              <MapIcon className="h-2.5 w-2.5 text-sky-400" />
            )}
            {viewMode === 'INDIA' ? 'EOX CC BY 4.0' : 'OpenFreeMap'}
          </span>
          <span className="h-3 w-px bg-[#243342]" />
          <span>geoBoundaries ADM1/ADM2</span>
          <span className="h-3 w-px bg-[#243342]" />
          <span className={clsx('flex items-center gap-1', allUntrained ? 'text-amber-300' : '')}>
            <ShieldCheck className="h-2.5 w-2.5" />
            {allUntrained ? 'Models NOT_TRAINED' : 'Models ready'}
          </span>
        </div>
      </div>

      {/* Mobile stacked panels */}
      <div className="space-y-3 p-3 2xl:hidden">
        <NationalOverviewPanel
          summary={summary}
          alerts={alerts}
          resources={resources}
          modelStatuses={modelStatuses}
          isLoading={isSummaryLoading}
        />
        <RegionOpsPanel alerts={alerts} resources={resources} modelStatuses={modelStatuses} />
        <LayerControlPanel inline />
        <LiveIncidentFeed alerts={alerts} isLoading={isAlertsLoading} />
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-[#243342] bg-[#0D151E]/60 p-2.5 text-[9px] text-[#5A6E85]">
          <Badge variant="neutral" size="sm">Sources</Badge>
          <span className="flex items-center gap-1">
            <Waves className="h-3 w-3 text-sky-400" />
            {viewMode === 'REGION'
              ? 'Boundaries © geoBoundaries ADM1 (CC BY 2.5 IN) / ADM2 (ODbL 1.0)'
              : 'State boundaries © geoBoundaries ADM1 (CC BY 2.5 IN)'}
          </span>
          <span>·</span>
          <span>
            {viewMode === 'REGION'
              ? 'Basemap © OpenFreeMap / OpenStreetMap'
              : 'Satellite basemap © EOX Sentinel-2 cloudless (CC BY 4.0), static mosaic'}
          </span>
          <span>·</span>
          <span>Reference resource coordinates from SENTRA DB</span>
        </div>
      </div>
    </div>
  );
};
