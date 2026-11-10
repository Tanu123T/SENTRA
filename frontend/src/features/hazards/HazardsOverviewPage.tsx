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
import { HazardType, HazardPredictionOutput } from '../../types';
import {
  Play,
  Info,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Layers,
  History,
  Activity,
  Calculator,
  ShieldAlert,
  Database,
  Waves,
  Calendar,
  DollarSign,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HazardsOverviewPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<HazardType>('FLOOD');
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('dist-od-pu');
  const [timeHorizon, setTimeHorizon] = useState<string>('24h');
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Simulator state for active hazard
  const [simInputs, setSimInputs] = useState<Record<string, number>>({
    rainfall_24h_mm: 95.0,
    cumulative_rainfall_72h_mm: 180.0,
    river_water_level_m: 51.2,
    danger_level_m: 50.0,
    magnitude_mw: 6.8,
    focal_depth_km: 15.0,
    hypocentral_distance_km: 40.0,
    rainfall_deficit_pct: -45.0,
    spei_index: -1.75,
    soil_moisture_pct: 18.0,
    consecutive_dry_days: 35,
    undersea_earthquake_magnitude: 8.2,
  });

  const [simResult, setSimResult] = useState<HazardPredictionOutput | null>(null);
  const [simError, setSimError] = useState<string | null>(null);

  // Queries
  const { data: readinessList } = useQuery({
    queryKey: ['hazard-detailed-readiness'],
    queryFn: hazardsApi.getDetailedReadiness,
  });

  const { data: historicalEvents } = useQuery({
    queryKey: ['hazard-historical-events', activeTab],
    queryFn: () => hazardsApi.getHistoricalEvents({ hazard_type: activeTab }),
  });

  // Simulator Mutation
  const simMutation = useMutation({
    mutationFn: (payload: { hazard: string; data: Record<string, any> }) =>
      hazardsApi.simulateHazard(payload.hazard, payload.data),
    onSuccess: (data) => {
      setSimResult(data);
      setSimError(null);
    },
    onError: (err: any) => {
      setSimResult(null);
      const detail = err.response?.data?.error?.details || err.response?.data?.error?.message || err.message;
      setSimError(detail || 'Inference execution blocked for uncalibrated model.');
    },
  });

  // DB Risk Assessment Mutation
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
            'Trained ML model weights for this hazard are currently blocked or uncalibrated. A traceable audit entry was logged. For deterministic projections, use the Health Impact Estimator.',
        });
      } else {
        setModalFeedback({
          type: 'error',
          message: err.response?.data?.error?.message || 'Failed to trigger risk assessment.',
        });
      }
    },
  });

  const activeReadiness = readinessList?.find((r) => r.hazard_type === activeTab);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setSimError(null);
    setSimResult(null);

    let payload: Record<string, any> = {};
    if (activeTab === 'FLOOD') {
      payload = {
        rainfall_24h_mm: Number(simInputs.rainfall_24h_mm || 95),
        cumulative_rainfall_72h_mm: Number(simInputs.cumulative_rainfall_72h_mm || 180),
        river_water_level_m: Number(simInputs.river_water_level_m || 51.2),
        danger_level_m: Number(simInputs.danger_level_m || 50),
      };
    } else if (activeTab === 'EARTHQUAKE') {
      payload = {
        magnitude_mw: Number(simInputs.magnitude_mw || 6.8),
        focal_depth_km: Number(simInputs.focal_depth_km || 15),
        hypocentral_distance_km: Number(simInputs.hypocentral_distance_km || 40),
        seismic_zone: 'ZONE_V',
      };
    } else if (activeTab === 'DROUGHT') {
      payload = {
        rainfall_deficit_pct: Number(simInputs.rainfall_deficit_pct || -45),
        spei_index: Number(simInputs.spei_index || -1.75),
        soil_moisture_pct: Number(simInputs.soil_moisture_pct || 18),
        consecutive_dry_days: Number(simInputs.consecutive_dry_days || 35),
      };
    } else if (activeTab === 'TSUNAMI') {
      payload = {
        undersea_earthquake_magnitude: Number(simInputs.undersea_earthquake_magnitude || 8.2),
        focal_depth_km: Number(simInputs.focal_depth_km || 15.0),
        bathymetry_depth_m: Number(simInputs.bathymetry_depth_m || 3500.0),
        coastal_distance_km: Number(simInputs.coastal_distance_km || 120.0),
        coastal_elevation_m: Number(simInputs.coastal_elevation_m || 3.5),
        fault_mechanism: 'THRUST',
      };
    } else {
      payload = {};
    }

    simMutation.mutate({ hazard: activeTab, data: payload });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified Multi-Hazard Intelligence Platform"
        subtitle="Independent scientific hazard categories, historical intelligence, and verified inference pipelines"
        actions={
          <Button
            variant="primary"
            icon={<Play className="w-3.5 h-3.5" />}
            onClick={() => {
              setModalFeedback(null);
              setIsAssessmentModalOpen(true);
            }}
          >
            Record Audit Assessment
          </Button>
        }
      />

      {/* Seven Hazard Categories Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {(Object.keys(HAZARD_CONFIG) as HazardType[]).map((type) => {
          const readiness = readinessList?.find((r) => r.hazard_type === type);
          const isSelected = activeTab === type;
          const status = readiness?.readiness_status || 'PLANNED_RESEARCH';

          let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
          if (status === 'OPERATIONAL_VALIDATED') {
            badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          } else if (status === 'MODEL_TRAINING_BLOCKED') {
            badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
          } else if (status === 'PLANNED_RESEARCH') {
            badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
          }

          return (
            <button
              key={type}
              onClick={() => {
                setActiveTab(type);
                setSimResult(null);
                setSimError(null);
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#2563EB] shadow-sm ring-2 ring-[#2563EB]/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{HAZARD_CONFIG[type].name.split(' ')[0]}</span>
                  {readiness?.is_available ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-mono line-clamp-1">{type}</div>
              </div>

              <div className="mt-2.5">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border font-bold uppercase ${badgeColor}`}>
                  {status === 'OPERATIONAL_VALIDATED' ? 'VALIDATED' : status === 'MODEL_TRAINING_BLOCKED' ? 'BLOCKED' : 'PLANNED'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Hazard Hero Deep-Dive */}
      {activeReadiness && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scientific Specification & Calibration */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200/90 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <HazardBadge hazard={activeTab} size="md" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{activeReadiness.model_name}</h3>
                    <p className="text-xs text-slate-500 font-mono">Version {activeReadiness.model_version}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                      activeReadiness.is_available
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : activeReadiness.readiness_status === 'MODEL_TRAINING_BLOCKED'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {activeReadiness.readiness_status}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                {/* Tsunami Status Banner if active */}
                {activeTab === 'TSUNAMI' && (
                  activeReadiness.readiness_status === 'MODEL_TRAINING_BLOCKED' ? (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-rose-800">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>Preserved Scientific Status: MODEL_TRAINING_BLOCKED</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div className="bg-white/80 p-2 rounded-lg border border-rose-200">
                          <span className="text-slate-500">Wave Propagation:</span>{' '}
                          <strong className="text-amber-700 font-bold">PENDING</strong>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-rose-200">
                          <span className="text-slate-500">Coastal Inundation:</span>{' '}
                          <strong className="text-amber-700 font-bold">PENDING</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-rose-700 leading-relaxed">
                        {activeReadiness.blocker_reason}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-cyan-800">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                        <span>Operational Status: OPERATIONAL_VALIDATED (NOAA Catalogue Calibrated)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div className="bg-white/80 p-2 rounded-lg border border-cyan-200">
                          <span className="text-slate-500">Wave Propagation:</span>{' '}
                          <strong className="text-emerald-700 font-bold">CALIBRATED</strong>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-cyan-200">
                          <span className="text-slate-500">Coastal Inundation:</span>{' '}
                          <strong className="text-emerald-700 font-bold">CALIBRATED</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-cyan-800 leading-relaxed">
                        Coupled Nonlinear Shallow Water wave propagation c = √(g·H) with 1,012-event NOAA/NCEI Gradient-Boosted runup regression and Green's law shoaling.
                      </p>
                    </div>
                  )
                )}

                {/* Planned Research Warning */}
                {activeReadiness.readiness_status === 'PLANNED_RESEARCH' && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-800">
                      <Info className="w-4 h-4 text-amber-600" />
                      <span>Planned Research Module</span>
                    </div>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      {activeReadiness.blocker_reason || 'Scientific data integration and calibration scheduled for future development phases.'}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-sky-600" /> Scientific Methodology
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {activeReadiness.scientific_methodology}
                  </p>
                </div>

                {/* Expected Input Feature Definitions */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-sky-600" /> Input Feature Schema & Units
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeReadiness.expected_inputs.map((feature) => (
                      <div key={feature} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="font-mono text-slate-700 text-[11px]">{feature}</span>
                        <span className="text-[10px] text-slate-500 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {activeReadiness.input_units[feature] || 'metric'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evaluation Metrics (if validated) */}
                {activeReadiness.evaluation_metrics.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" /> Benchmark Evaluation & Calibration Metrics
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeReadiness.evaluation_metrics.map((m) => (
                        <div key={m.metric_name} className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-emerald-900">{m.metric_name}</span>
                            <span className="font-mono font-bold text-emerald-700 text-sm">
                              {m.value} {m.unit || ''}
                            </span>
                          </div>
                          <p className="text-[10px] text-emerald-700 leading-tight">{m.description}</p>
                          <div className="mt-1 text-[9px] text-emerald-600 font-mono">Ref: {m.benchmark_dataset}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historical Ground-Truth Events Table */}
            <Card className="border-slate-200/90 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-sky-600" />
                    <h3 className="text-sm font-bold text-slate-900">Verified Historical Disaster Intelligence</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {historicalEvents?.length || 0} Benchmarks Recorded
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Event Name</th>
                        <th className="py-2.5 px-3 font-semibold">Location</th>
                        <th className="py-2.5 px-3 font-semibold">Year</th>
                        <th className="py-2.5 px-3 font-semibold">Peak Metric</th>
                        <th className="py-2.5 px-3 font-semibold">Loss (INR Cr)</th>
                        <th className="py-2.5 px-3 font-semibold">Source Citation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {historicalEvents && historicalEvents.length > 0 ? (
                        historicalEvents.map((event) => (
                          <tr key={event.event_id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-slate-900">
                              <div>{event.event_name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{event.event_id}</div>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {event.district_name}, {event.state_name}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{event.event_year}</td>
                            <td className="py-2.5 px-3 text-sky-700 font-mono font-semibold">
                              {event.peak_metric_value} {event.peak_metric_unit}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-700">₹{event.economic_loss_inr_cr.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-[10px] text-slate-500 max-w-xs truncate" title={event.data_source}>
                              {event.data_source}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-400">
                            No historical records currently registered for this hazard category.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Interactive Prediction Simulator & Sandbox */}
          <div className="space-y-6">
            <Card className="border-slate-200/90 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">Interactive Model Simulator</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Test physical parameters through the validated hazard pipeline or verify unavailable enforcement.
                </p>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <form onSubmit={handleSimulate} className="space-y-3">
                  {/* Dynamic Inputs based on active tab */}
                  {activeTab === 'FLOOD' && (
                    <>
                      <div>
                        <label className="text-[11px] font-medium text-slate-700 block mb-1">
                          24h Rainfall (mm)
                        </label>
                        <input
                          type="number"
                          value={simInputs.rainfall_24h_mm || 95}
                          onChange={(e) => setSimInputs({ ...simInputs, rainfall_24h_mm: parseFloat(e.target.value) })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-700 block mb-1">
                          River Water Level (m)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={simInputs.river_water_level_m || 51.2}
                          onChange={(e) => setSimInputs({ ...simInputs, river_water_level_m: parseFloat(e.target.value) })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-700 block mb-1">
                          CWC Danger Level Mark (m)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={simInputs.danger_level_m || 50.0}
                          onChange={(e) => setSimInputs({ ...simInputs, danger_level_m: parseFloat(e.target.value) })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'EARTHQUAKE' && (
                    <>
                      <div>
                        <label className="text-[11px] font-medium text-slate-700 block mb-1">
                          Moment Magnitude (Mw)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={simInputs.magnitude_mw || 6.8}
                          onChange={(e) => setSimInputs({ ...simInputs, magnitude_mw: parseFloat(e.target.value) })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-700 block mb-1">
                          Focal Depth (km)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={simInputs.focal_depth_km || 15}
                          onChange={(e) => setSimInputs({ ...simInputs, focal_depth_km: parseFloat(e.target.value) })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-700 block mb-1">
                          Distance to Centroid (km)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={simInputs.hypocentral_distance_km || 40}
                          onChange={(e) => setSimInputs({ ...simInputs, hypocentral_distance_km: parseFloat(e.target.value) })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'DROUGHT' && (
                    <>
                      <div>
                        <label className="text-[11px] font-medium text-slate-700 block mb-1">
                          Monsoon Rainfall Deficit (%)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={simInputs.rainfall_deficit_pct || -45}
                          onChange={(e) => setSimInputs({ ...simInputs, rainfall_deficit_pct: parseFloat(e.target.value) })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-700 block mb-1">
                          Standardized Precipitation Evapotranspiration Index (SPEI)
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          value={simInputs.spei_index || -1.75}
                          onChange={(e) => setSimInputs({ ...simInputs, spei_index: parseFloat(e.target.value) })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-700 block mb-1">
                          Consecutive Dry Days
                        </label>
                        <input
                          type="number"
                          value={simInputs.consecutive_dry_days || 35}
                          onChange={(e) => setSimInputs({ ...simInputs, consecutive_dry_days: parseInt(e.target.value) })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'TSUNAMI' && (
                    <>
                      <div>
                        <label className="text-[11px] font-medium text-slate-700 block mb-1">
                          Undersea Rupture Magnitude (Mw)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="6.0"
                          max="9.9"
                          value={simInputs.undersea_earthquake_magnitude || 8.2}
                          onChange={(e) => setSimInputs({ ...simInputs, undersea_earthquake_magnitude: parseFloat(e.target.value) })}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-medium text-slate-700 block mb-1">
                            Focal Depth (km)
                          </label>
                          <input
                            type="number"
                            step="1"
                            value={simInputs.focal_depth_km || 15}
                            onChange={(e) => setSimInputs({ ...simInputs, focal_depth_km: parseFloat(e.target.value) })}
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-slate-700 block mb-1">
                            Bathymetry Depth (m)
                          </label>
                          <input
                            type="number"
                            step="100"
                            value={simInputs.bathymetry_depth_m || 3500}
                            onChange={(e) => setSimInputs({ ...simInputs, bathymetry_depth_m: parseFloat(e.target.value) })}
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-medium text-slate-700 block mb-1">
                            Coastal Distance (km)
                          </label>
                          <input
                            type="number"
                            step="5"
                            value={simInputs.coastal_distance_km || 120}
                            onChange={(e) => setSimInputs({ ...simInputs, coastal_distance_km: parseFloat(e.target.value) })}
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-slate-700 block mb-1">
                            Shoreline Elevation (m)
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            value={simInputs.coastal_elevation_m || 3.5}
                            onChange={(e) => setSimInputs({ ...simInputs, coastal_elevation_m: parseFloat(e.target.value) })}
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                          />
                        </div>
                      </div>
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Hydrodynamic solver active: wave speed c = √(g·H), Green's law shoaling, and NOAA ML runup model.</span>
                      </div>
                    </>
                  )}

                  {['CYCLONE', 'LANDSLIDE', 'HEATWAVE'].includes(activeTab) && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                      Module is registered as <strong>PLANNED_RESEARCH</strong>. Executing will return explicit service unavailable status.
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="w-full"
                    isLoading={simMutation.isPending}
                  >
                    Execute Sandbox Simulation
                  </Button>
                </form>

                {/* Simulation Output Card */}
                {simResult && (
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-900 text-white space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-sky-400 font-bold">
                        Calculated Risk Result
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          simResult.severity_level === 'CRITICAL'
                            ? 'bg-rose-500 text-white'
                            : simResult.severity_level === 'HIGH'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {simResult.severity_level}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Risk Score:</span>
                      <span className="text-2xl font-bold font-mono text-sky-300">
                        {simResult.risk_score} <span className="text-xs text-slate-500">/ 100</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-400">{simResult.primary_metric_name}:</div>
                      <div className="text-sm font-mono font-bold text-white">
                        {simResult.primary_metric_value} {simResult.primary_metric_unit}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-normal bg-slate-800/80 p-2.5 rounded-lg">
                      {simResult.summary}
                    </p>

                    {simResult.recommended_actions.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Recommended Actions:
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                          {simResult.recommended_actions.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Banner */}
                {simError && (
                  <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Model Unavailable (HTTP 503)</div>
                      <div className="text-[11px] mt-0.5 leading-relaxed">{simError}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deterministic Health Estimator Link */}
            <Card className="bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-200">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
                  <Info className="w-4 h-4 text-sky-600" />
                  <span>Deterministic Health Surge Projection</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Need deterministic patient ICU bed, ambulance, and triage estimates for an emergency event?
                </p>
                <Link to="/health" className="block pt-1">
                  <Button variant="secondary" size="sm" className="w-full" icon={<ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />}>
                    Open Health Surge Estimator
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Record Formal Assessment Modal */}
      <Dialog
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        title="Execute Multi-Hazard Risk Assessment"
        description="Trigger hazard prediction adapter or record verified operational assessment"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setModalFeedback(null);
            assessMutation.mutate({
              district_id: selectedDistrict,
              hazard_type: activeTab,
              time_horizon: timeHorizon,
            });
          }}
          className="space-y-4"
        >
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
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as HazardType)}
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
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAssessmentModalOpen(false)}>
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
