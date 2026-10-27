import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { SEED_DISTRICTS } from '../../utils/constants';
import { formatNumber } from '../../utils/formatters';
import { MapPin, Users, Maximize, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RegionalSummaryCardProps {
  alertsCount: number;
  resourcesCount: number;
}

export const RegionalSummaryCard: React.FC<RegionalSummaryCardProps> = ({
  alertsCount,
  resourcesCount,
}) => {
  const { user, assignedDistrictName, assignedStateName } = useAuthStore();

  const districtKey = user?.district_id || 'dist-mh-pu';
  const districtMeta = SEED_DISTRICTS[districtKey] || {
    name: assignedDistrictName || 'Pune',
    state: assignedStateName || 'Maharashtra',
    population: 9429408,
    area_sq_km: 15643,
  };

  return (
    <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-[#111C27] to-[#0D151E]">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Assigned Region Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <MapPin className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest font-mono">
                Primary Assigned Operational Sector
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#E8EEF5] tracking-tight">
              {districtMeta.name}, <span className="text-[#91A0B3] font-normal">{districtMeta.state}</span>
            </h2>
            <p className="text-xs text-[#5A6E85]">
              Administrative focus region configured via authenticated role permissions
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#080D13]/70 p-2.5 rounded-lg border border-[#243342]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#91A0B3] mb-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Census Population</span>
              </div>
              <span className="text-base font-bold text-[#E8EEF5]">
                {formatNumber(districtMeta.population)}
              </span>
            </div>

            <div className="bg-[#080D13]/70 p-2.5 rounded-lg border border-[#243342]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#91A0B3] mb-1">
                <Maximize className="w-3.5 h-3.5 text-sky-400" />
                <span>Area Coverage</span>
              </div>
              <span className="text-base font-bold text-[#E8EEF5]">
                {formatNumber(15643)} km²
              </span>
            </div>

            <div className="bg-[#080D13]/70 p-2.5 rounded-lg border border-[#243342]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#91A0B3] mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Sector Alerts</span>
              </div>
              <span className="text-base font-bold text-red-400">
                {alertsCount} Active
              </span>
            </div>

            <div className="bg-[#080D13]/70 p-2.5 rounded-lg border border-[#243342]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#91A0B3] mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fleet Standby</span>
              </div>
              <span className="text-base font-bold text-emerald-400">
                {resourcesCount} Units
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
