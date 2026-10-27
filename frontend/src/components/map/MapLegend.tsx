import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';
import { HAZARD_CONFIG } from '../../utils/constants';
import type { MapViewMode } from '../../stores/mapStore';

interface MapLegendProps {
  viewMode?: MapViewMode;
}

const LEGEND_HAZARDS = [
  { key: 'FLOOD', label: 'Flood' },
  { key: 'CYCLONE', label: 'Cyclone' },
  { key: 'EARTHQUAKE', label: 'Seismic' },
  { key: 'HEATWAVE', label: 'Heat' },
  { key: 'LANDSLIDE', label: 'Landslide' },
] as const;

export const MapLegend: React.FC<MapLegendProps> = ({ viewMode = 'INDIA' }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-[#080D13]/92 backdrop-blur border border-[#243342] rounded-lg shadow-xl text-xs overflow-hidden transition-all">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="px-3 py-1.5 bg-[#111C27]/70 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#182635] text-[#91A0B3]"
      >
        <div className="flex items-center gap-1.5 font-medium text-[11px] text-[#E8EEF5]">
          <Info className="w-3.5 h-3.5 text-amber-500" />
          <span>Map legend & sources</span>
        </div>
        {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </div>

      {!collapsed && (
        <div className="p-3 space-y-2.5 w-[228px]">
          <div>
            <div className="text-[10px] uppercase font-semibold text-[#5A6E85] tracking-wider mb-1">
              Hazard layers
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {LEGEND_HAZARDS.map((hazard) => (
                <div key={hazard.key} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: HAZARD_CONFIG[hazard.key].color }}
                  />
                  <span className="text-[#E8EEF5] truncate">{hazard.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#243342]/70">
            <div className="text-[10px] uppercase font-semibold text-[#5A6E85] tracking-wider mb-1">
              Severity halo
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#91A0B3]">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Critical</span>
              <span className="w-2 h-2 rounded-full bg-orange-500 ml-1" />
              <span>High</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 ml-1" />
              <span>Moderate</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#243342]/70">
            <div className="text-[10px] uppercase font-semibold text-[#5A6E85] tracking-wider mb-1">
              Operational points
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-[#91A0B3]">
              <span className="flex items-center gap-1"><i className="w-1.5 h-1.5 rounded-full bg-sky-400" />Ambulance</span>
              <span className="flex items-center gap-1"><i className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Hospital</span>
              <span className="flex items-center gap-1"><i className="w-1.5 h-1.5 rounded-full bg-violet-400" />Medical</span>
              <span className="flex items-center gap-1"><i className="w-1.5 h-1.5 rounded-full bg-amber-400" />Shelter</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#243342]/70 text-[9px] leading-relaxed text-[#5A6E85]">
            {viewMode === 'INDIA'
              ? 'Sentinel-2 cloudless 2023 © EOX (CC BY 4.0) — static mosaic, not live imagery.'
              : 'OpenFreeMap dark vector basemap © OpenMapTiles / OpenStreetMap contributors.'}
            <br />
            State boundaries © geoBoundaries ADM1 (CC BY 2.5 IN).
            <br />
            District boundaries © geoBoundaries ADM2 (ODbL 1.0), bundled for 14 reference districts
            only.
            <br />
            Resource points are district reference centroids; facility coordinates are not provided
            by the API.
          </div>
        </div>
      )}
    </div>
  );
};
