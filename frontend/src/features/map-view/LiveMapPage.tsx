import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '../../api/alerts.api';
import { resourcesApi } from '../../api/resources.api';
import { IndiaMap } from '../../components/map/IndiaMap';
import { PageHeader } from '../../components/common/PageHeader';
import { Select } from '../../components/ui/Select';
import { SEED_DISTRICTS, REGION_DEFAULT_ZOOM } from '../../utils/constants';
import { useMapStore } from '../../stores/mapStore';
import { MapPin, Globe2, Database, Layers3 } from 'lucide-react';
import { clsx } from 'clsx';

export const LiveMapPage: React.FC = () => {
  const {
    viewMode,
    selectedDistrictId,
    setViewMode,
    setSelectedDistrictId,
    setSelectedState,
  } = useMapStore();

  const { data: alertsData } = useQuery({
    queryKey: ['live-map-alerts'],
    queryFn: () => alertsApi.getAlerts({ page_size: 100 }),
    refetchInterval: 15000,
  });

  const { data: resourcesData } = useQuery({
    queryKey: ['live-map-resources'],
    queryFn: () => resourcesApi.getResources({ page_size: 100 }),
    refetchInterval: 30000,
  });

  const alerts = alertsData?.items || [];
  const resources = resourcesData?.items || [];

  const selectedDistrict = selectedDistrictId ? SEED_DISTRICTS[selectedDistrictId] : null;
  const districtAlerts = selectedDistrictId
    ? alerts.filter((alert) => alert.district_id === selectedDistrictId)
    : [];
  const districtResources = selectedDistrictId
    ? resources.filter((resource) => resource.district_id === selectedDistrictId)
    : [];

  const handleDistrictChange = (districtId: string) => {
    if (districtId === 'all') {
      setSelectedDistrictId(null);
      setSelectedState(null, null, null);
      setViewMode('INDIA');
      return;
    }

    const district = SEED_DISTRICTS[districtId];
    if (!district) return;

    setSelectedDistrictId(districtId);
    setSelectedState(district.stateIso, district.state);
    setViewMode('REGION', [district.lat, district.lng], REGION_DEFAULT_ZOOM);
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Tactical Geospatial Command Center"
        subtitle="Multi-hazard situational awareness, emergency facilities and district-level operational inspection"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-md border border-[#243342] bg-[#0D151E] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('INDIA')}
                className={clsx(
                  'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-all',
                  viewMode === 'INDIA'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-[#91A0B3] hover:text-[#E8EEF5]'
                )}
              >
                <Globe2 className="w-3.5 h-3.5" />
                India
              </button>
              <button
                type="button"
                onClick={() =>
                  selectedDistrict
                    ? setViewMode(
                        'REGION',
                        [selectedDistrict.lat, selectedDistrict.lng],
                        REGION_DEFAULT_ZOOM
                      )
                    : handleDistrictChange('dist-mh-pu')
                }
                className={clsx(
                  'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-all',
                  viewMode === 'REGION'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-[#91A0B3] hover:text-[#E8EEF5]'
                )}
              >
                <MapPin className="w-3.5 h-3.5" />
                Region
              </button>
            </div>

            <div className="w-60">
              <Select
                value={selectedDistrictId || 'all'}
                onChange={(event) => handleDistrictChange(event.target.value)}
              >
                <option value="all">All India overview</option>
                <optgroup label="Maharashtra">
                  <option value="dist-mh-pu">Pune (assigned sector)</option>
                  <option value="dist-mh-mc">Mumbai City</option>
                  <option value="dist-mh-rg">Raigad</option>
                </optgroup>
                <optgroup label="Assam">
                  <option value="dist-as-km">Kamrup Metropolitan</option>
                  <option value="dist-as-dh">Dhubri</option>
                  <option value="dist-as-ca">Cachar</option>
                </optgroup>
                <optgroup label="Odisha">
                  <option value="dist-od-pu">Puri</option>
                  <option value="dist-od-ba">Balasore</option>
                </optgroup>
                <optgroup label="Kerala">
                  <option value="dist-kl-er">Ernakulam</option>
                  <option value="dist-kl-wa">Wayanad</option>
                </optgroup>
                <optgroup label="Rajasthan">
                  <option value="dist-rj-jp">Jaipur</option>
                  <option value="dist-rj-js">Jaisalmer</option>
                </optgroup>
                <optgroup label="Uttarakhand">
                  <option value="dist-uk-ch">Chamoli</option>
                  <option value="dist-uk-dd">Dehradun</option>
                </optgroup>
              </Select>
            </div>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-md border border-[#243342] bg-[#0D151E] px-3 py-2 text-[11px] text-[#91A0B3]">
        <span className="flex items-center gap-1.5 font-medium text-[#E8EEF5]">
          <Layers3 className="w-3.5 h-3.5 text-amber-500" />
          {selectedDistrict
            ? `${selectedDistrict.name}, ${selectedDistrict.state}`
            : viewMode === 'REGION'
            ? 'Assigned regional sector'
            : 'National overview'}
        </span>
        <span className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-sky-400" />
          {viewMode === 'REGION'
            ? `${districtAlerts.length} active alerts · ${districtResources.length} registered resources`
            : `${alerts.length} active alerts · ${resources.length} registered resources`}
        </span>
        <span className="hidden sm:inline text-[#5A6E85]">
          {viewMode === 'REGION'
            ? 'District geometry: geoBoundaries ADM2 (ODbL 1.0) · bundled for 14 reference districts'
            : 'State boundaries: geoBoundaries ADM1 (CC BY 2.5 IN) · markers at district reference centroids'}
        </span>
        <span className="sm:hidden text-[#5A6E85]">
          {viewMode === 'REGION'
            ? 'Basemap © OpenFreeMap / OSM · districts © geoBoundaries ADM2 (ODbL 1.0)'
            : 'Imagery © EOX Sentinel-2 (CC BY 4.0), static mosaic · states © geoBoundaries ADM1 (CC BY 2.5 IN)'}
        </span>
      </div>

      <IndiaMap
        alerts={alerts}
        resources={resources}
        height="calc(100vh - 17.5rem)"
        className="min-h-[560px] rounded-xl"
      />
    </div>
  );
};
