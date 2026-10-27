import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observationsApi } from '../../api/observations.api';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { SEED_DISTRICTS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { ObservationCreate, ObservationType } from '../../types';
import { Radio, Plus, LineChart as ChartIcon, Gauge } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const SensorObservationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // New observation state
  const [form, setForm] = useState<ObservationCreate>({
    district_id: 'dist-mh-pu',
    observation_type: 'RAINFALL',
    value: 45.0,
    unit: 'mm',
    timestamp: new Date().toISOString(),
    data_source: 'CWC_AUTOMATIC_RAIN_GAUGE',
    quality_status: 'VERIFIED',
  });

  const { data: obsData, isLoading } = useQuery({
    queryKey: ['observations-list', selectedType, selectedDistrict],
    queryFn: () =>
      observationsApi.getObservations({
        observation_type: selectedType !== 'all' ? selectedType : undefined,
        district_id: selectedDistrict !== 'all' ? selectedDistrict : undefined,
        page_size: 50,
      }),
  });

  const observations = obsData?.items || [];

  // Ingest mutation
  const ingestMutation = useMutation({
    mutationFn: observationsApi.createObservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations-list'] });
      setIsIngestOpen(false);
    },
  });

  const handleIngestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ingestMutation.mutate({
      ...form,
      value: Number(form.value),
    });
  };

  // Mock trend data for chart if list has limited points
  const chartData = observations.length > 3
    ? observations
        .slice()
        .reverse()
        .map((o) => ({
          time: new Date(o.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: o.value,
          unit: o.unit,
        }))
    : [
        { time: '04:00', value: 22.4, unit: 'mm' },
        { time: '08:00', value: 45.8, unit: 'mm' },
        { time: '12:00', value: 89.2, unit: 'mm' },
        { time: '16:00', value: 110.5, unit: 'mm' },
        { time: '20:00', value: 78.1, unit: 'mm' },
        { time: '24:00', value: 42.0, unit: 'mm' },
      ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Environmental Sensor Ingestion & Telemetry"
        subtitle="Real-time river stage levels, automatic weather station precipitation, and seismic intensity"
        actions={
          <Button
            variant="primary"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsIngestOpen(true)}
          >
            Ingest Sensor Observation
          </Button>
        }
      />

      {/* Observation Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            <ChartIcon className="w-4 h-4 text-sky-400" />
            <span>Precipitation & Stream Runoff Trend (Last 24 Hours)</span>
          </CardTitle>
          <span className="text-xs font-mono text-[#5A6E85]">IMD / CWC REALTIME FEED</span>
        </CardHeader>
        <CardContent className="h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#243342" vertical={false} />
              <XAxis dataKey="time" stroke="#5A6E85" fontSize={11} tickLine={false} />
              <YAxis stroke="#5A6E85" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111C27',
                  borderColor: '#243342',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#E8EEF5',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#38BDF8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#areaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-[#0D151E] p-3 rounded-lg border border-[#243342]">
        <div className="w-48">
          <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="all">All Sensor Types</option>
            <option value="RAINFALL">Rainfall (mm)</option>
            <option value="RIVER_LEVEL">River Level (m)</option>
            <option value="TEMPERATURE">Temperature (°C)</option>
            <option value="WIND_SPEED">Wind Speed (km/h)</option>
            <option value="SEISMIC_INTENSITY">Seismic Intensity (g)</option>
            <option value="SOIL_MOISTURE">Soil Moisture (%)</option>
          </Select>
        </div>

        <div className="w-48">
          <Select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
            <option value="all">All Districts</option>
            {Object.entries(SEED_DISTRICTS).map(([id, d]) => (
              <option key={id} value={id}>
                {d.name} ({d.state})
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Observation Records Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#243342] bg-[#111C27]/50 text-[#5A6E85] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Sensor Type</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Data Source</th>
                <th className="py-3 px-4">Quality Status</th>
                <th className="py-3 px-4">Observation Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243342]/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#91A0B3]">
                    Loading sensor records...
                  </td>
                </tr>
              ) : observations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#5A6E85]">
                    No sensor observations match the selected filters.
                  </td>
                </tr>
              ) : (
                observations.map((obs) => {
                  const district = SEED_DISTRICTS[obs.district_id];
                  const loc = district ? `${district.name}, ${district.state}` : obs.district_id;

                  return (
                    <tr key={obs.id} className="hover:bg-[#111C27]/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-sky-400">
                        {obs.observation_type}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-base font-bold text-[#E8EEF5]">
                          {obs.value}
                        </span>{' '}
                        <span className="text-[11px] text-[#91A0B3]">{obs.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-[#E8EEF5]">📍 {loc}</td>
                      <td className="py-3 px-4 text-[#91A0B3] font-mono text-[11px]">
                        {obs.data_source}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-medium border ${
                            obs.quality_status === 'VERIFIED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {obs.quality_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#5A6E85] font-mono">
                        {formatDate(obs.timestamp)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Ingestion Dialog */}
      <Dialog
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        title="Ingest Environmental Observation"
        description="Submit calibrated meteorological or geological station telemetry"
      >
        <form onSubmit={handleIngestSubmit} className="space-y-4">
          <Select
            label="Sensor Measurement Type"
            value={form.observation_type}
            onChange={(e) => setForm({ ...form, observation_type: e.target.value as ObservationType })}
          >
            <option value="RAINFALL">RAINFALL (mm)</option>
            <option value="RIVER_LEVEL">RIVER_LEVEL (m)</option>
            <option value="TEMPERATURE">TEMPERATURE (°C)</option>
            <option value="WIND_SPEED">WIND_SPEED (km/h)</option>
            <option value="SEISMIC_INTENSITY">SEISMIC_INTENSITY (g)</option>
            <option value="SOIL_MOISTURE">SOIL_MOISTURE (%)</option>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Observed Numeric Value"
              type="number"
              step="0.01"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              label="Measurement Unit"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              required
            />
          </div>

          <Select
            label="Reporting District"
            value={form.district_id}
            onChange={(e) => setForm({ ...form, district_id: e.target.value })}
          >
            {Object.entries(SEED_DISTRICTS).map(([id, d]) => (
              <option key={id} value={id}>
                {d.name} ({d.state})
              </option>
            ))}
          </Select>

          <Input
            label="Data Provenance / Source Identifier"
            value={form.data_source}
            onChange={(e) => setForm({ ...form, data_source: e.target.value })}
            placeholder="IMD_AWS_RADAR_04"
            required
          />

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsIngestOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={ingestMutation.isPending}>
              Ingest Reading
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
