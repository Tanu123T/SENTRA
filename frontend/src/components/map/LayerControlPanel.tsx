import React, { useState } from 'react';
import { Layers, Check } from 'lucide-react';
import { useMapStore } from '../../stores/mapStore';
import { clsx } from 'clsx';

const LAYERS_LIST: Array<{ key: 'flood' | 'cyclone' | 'earthquake' | 'heatwave' | 'landslide' | 'resources' | 'shelters'; label: string; color: string }> = [
  { key: 'flood', label: 'Floods & Inundation', color: '#38BDF8' },
  { key: 'cyclone', label: 'Tropical Cyclones', color: '#06B6D4' },
  { key: 'earthquake', label: 'Seismic Activity', color: '#EF4444' },
  { key: 'heatwave', label: 'Extreme Heat', color: '#F97316' },
  { key: 'landslide', label: 'Landslides', color: '#F59E0B' },
  { key: 'resources', label: 'Emergency Fleet', color: '#22C55E' },
  { key: 'shelters', label: 'Relief Shelters', color: '#A78BFA' },
];

interface LayerControlPanelProps {
  inline?: boolean;
}

export const LayerControlPanel: React.FC<LayerControlPanelProps> = ({ inline = false }) => {
  const [isOpen, setIsOpen] = useState(inline);
  const { activeLayers, toggleLayer } = useMapStore();

  const content = (
    <div
      className={clsx(
        inline
          ? 'space-y-0.5'
          : 'absolute right-0 top-10 w-56 bg-[#080D13]/95 backdrop-blur border border-[#243342] rounded-lg shadow-2xl p-2.5 z-50 space-y-0.5'
      )}
    >
      <div className="text-[10px] uppercase font-semibold text-[#5A6E85] tracking-wider px-2 py-1">
        Hazard & operational layers
      </div>
      {LAYERS_LIST.map((layer) => {
        const isActive = activeLayers[layer.key];
        return (
          <button
            key={layer.key}
            type="button"
            onClick={() => toggleLayer(layer.key)}
            className={clsx(
              'w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors text-left',
              isActive
                ? 'bg-[#111C27] text-[#E8EEF5] font-medium'
                : 'text-[#91A0B3] hover:text-[#E8EEF5] hover:bg-[#111C27]/50'
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: layer.color,
                  boxShadow: isActive ? `0 0 8px ${layer.color}66` : 'none',
                  opacity: isActive ? 1 : 0.4,
                }}
              />
              <span>{layer.label}</span>
            </span>
            <span
              className={clsx(
                'w-4 h-4 rounded flex items-center justify-center border',
                isActive
                  ? 'bg-amber-500 border-amber-500 text-slate-950'
                  : 'border-[#243342]'
              )}
            >
              {isActive && <Check className="w-3 h-3 stroke-[3]" />}
            </span>
          </button>
        );
      })}
    </div>
  );

  if (inline) {
    return (
      <div className="rounded-lg border border-[#243342] bg-[#0D151E]/80 p-2">
        <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-semibold text-[#E8EEF5] uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>Operational Layers</span>
          <span className="ml-auto font-mono text-[10px] text-[#5A6E85]">
            {Object.values(activeLayers).filter(Boolean).length}/{Object.keys(activeLayers).length}
          </span>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#080D13]/90 hover:bg-[#111C27] border border-[#243342] hover:border-amber-500/50 text-xs font-medium text-[#E8EEF5] rounded-md backdrop-blur transition-all shadow-lg active:scale-95"
        title="Toggle map layers"
      >
        <Layers className="w-3.5 h-3.5 text-amber-500" />
        <span>Layers ({Object.values(activeLayers).filter(Boolean).length})</span>
      </button>

      {isOpen && content}
    </div>
  );
};
