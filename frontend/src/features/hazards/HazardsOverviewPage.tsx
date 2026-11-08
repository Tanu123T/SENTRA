import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hazardsApi } from '../../api/hazards.api';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Select } from '../../components/ui/Select';
import { HazardBadge } from '../../components/common/StatusBadge';
import { HAZARD_CONFIG, SEED_DISTRICTS } from '../../utils/constants';
import { HazardType } from '../../types';
import { Play, Info, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HazardsOverviewPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState<HazardType>('FLOOD');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('dist-od-pu');
  const [timeHorizon, setTimeHorizon] = useState<string>('24h');
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Fetch model readiness
  const { data: modelStatuses } = useQuery({
    queryKey: ['hazard-models-status'],
    queryFn: hazardsApi.getModelStatuses,
  });

  // Risk assessment mutation
  const assessMutation = useMutation({
    mutationFn: hazardsApi.requestRiskAssessment,
    onSuccess: (data) => {
      setModalFeedback({
        type: 'success',
        message: `Risk assessment registered with status: ${data.status}. Trace recorded in SENTRA audit ledger.`,
      });
      queryClient.invalidateQueries({ queryKey: ['hazard-assessments'] });
    },
    onError: (err: any) => {
      if (err.response?.status === 503) {
        setModalFeedback({
          type: 'info',
          message:
            'ML hazard prediction weights are currently uncalibrated. A traceable audit entry was logged. For deterministic projections, use the Health Impact Estimator.',
        });
      } else {
        setModalFeedback({
          type: 'error',
          message: err.response?.data?.error?.message || 'Failed to trigger risk assessment.',
        });
      }
    },
  });

  const handleRunAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    setModalFeedback(null);
    assessMutation.mutate({
      district_id: selectedDistrict,
      hazard_type: selectedHazard,
      time_horizon: timeHorizon,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Hazard Prediction Architecture"
        subtitle="Independent scientific hazard categories, telemetry monitoring, and model readiness status"
        actions={
          <Button
            variant="primary"
            icon={<Play className="w-3.5 h-3.5" />}
            onClick={() => {
              setModalFeedback(null);
              setIsModalOpen(true);
            }}
          >
            Request Risk Assessment
          </Button>
        }
      />

      {/* Seven Hazard Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(HAZARD_CONFIG).map(([type, meta]) => {
          const status = modelStatuses?.find((s) => s.hazard_type === type);
          const isTrained = status?.is_available || false;

          return (
            <Card key={type} className="flex flex-col justify-between hover:border-sky-300 hover:shadow-xs transition-all">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between w-full">
                  <HazardBadge hazard={type} />
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold ${
                      isTrained
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {status?.readiness_status || 'DEVELOPMENT'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {type === 'FLOOD' && 'Inundation forecasting, upstream river gauge runoff & rainfall telemetry.'}
                  {type === 'CYCLONE' && 'Central barometric pressure tracking, gust trajectories & coastal storm surge.'}
                  {type === 'EARTHQUAKE' && 'Peak ground acceleration (PGA), seismic station focal depth modeling.'}
                  {type === 'DROUGHT' && 'Standardized precipitation evapotranspiration indices (SPEI) and soil aridity.'}
                  {type === 'LANDSLIDE' && 'Western Ghats slope shear strength and continuous precipitation triggers.'}
                  {type === 'TSUNAMI' && 'Subsea seismic displacement vectors and coastal bathymetry runup.'}
                  {type === 'HEATWAVE' && 'Wet-bulb thermal stress index and maximum temperature anomalies.'}
                </p>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Model Adapter:</span>
                    <span className="text-slate-800 font-semibold">{status?.model_name || `SENTRA-${type}-V1`}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Active Version:</span>
                    <span className="text-sky-600 font-bold">{status?.model_version || '1.0.0'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mathematical Simulation Banner */}
      <Card className="bg-gradient-to-r from-sky-50/80 via-blue-50/60 to-indigo-50/80 border-sky-200 shadow-xs">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white text-sky-600 border border-sky-200 shadow-2xs shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Deterministic Health Surge Estimator</h4>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-normal">
                When machine learning weights are uncalibrated, calculate transparent macro health demand (ICU beds, ALS ambulances, medical teams) using deterministic hazard severity scores.
              </p>
            </div>
          </div>
          <Link to="/health">
            <Button variant="secondary" size="sm" icon={<ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />}>
              Open Health Estimator
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Assessment Request Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Execute Multi-Hazard Risk Assessment"
        description="Trigger hazard prediction adapter or record verified operational assessment"
      >
        <form onSubmit={handleRunAssessment} className="space-y-4">
          {modalFeedback && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                modalFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : modalFeedback.type === 'info'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {modalFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              )}
              <span>{modalFeedback.message}</span>
            </div>
          )}

          <Select
            label="Target Hazard Category"
            value={selectedHazard}
            onChange={(e) => setSelectedHazard(e.target.value as HazardType)}
          >
            {Object.keys(HAZARD_CONFIG).map((h) => (
              <option key={h} value={h}>
                {HAZARD_CONFIG[h as HazardType].name}
              </option>
            ))}
          </Select>

          <Select
            label="Target Operational District"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            {Object.entries(SEED_DISTRICTS).map(([id, d]) => (
              <option key={id} value={id}>
                {d.name} ({d.state})
              </option>
            ))}
          </Select>

          <Select
            label="Forecast Horizon"
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(e.target.value)}
          >
            <option value="24h">24 Hours (Immediate Response)</option>
            <option value="48h">48 Hours (Tactical Staging)</option>
            <option value="7d">7 Days (Strategic Advisory)</option>
          </Select>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={assessMutation.isPending}>
              Submit Assessment Run
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default HazardsOverviewPage;
