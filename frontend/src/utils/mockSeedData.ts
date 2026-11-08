import { AlertRead, ResourceRead, SystemSummaryReport, HazardModelStatus } from '../types';
import { SEED_DISTRICTS } from './constants';

// 56 deterministic seed resources across the 14 districts
export const SEED_RESOURCES: ResourceRead[] = Object.entries(SEED_DISTRICTS).flatMap(([distId, dist]) => {
  return [
    {
      id: `seed-res-amb-${distId}`,
      district_id: distId,
      resource_type: 'AMBULANCE' as any,
      name: `${dist.name} Emergency ALS Ambulance Fleet`,
      total_capacity: 15,
      available_capacity: 12,
      operational_status: 'OPERATIONAL' as any,
      capabilities: { type: 'ALS', oxygen_equipped: true },
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-10-26T00:00:00Z',
    },
    {
      id: `seed-res-bed-${distId}`,
      district_id: distId,
      resource_type: 'HOSPITAL_BED' as any,
      name: `${dist.name} District Civil Hospital ICU Wing`,
      total_capacity: 50,
      available_capacity: 38,
      operational_status: 'OPERATIONAL' as any,
      capabilities: { ventilators: 20, pediatric_support: true },
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-10-26T00:00:00Z',
    },
    {
      id: `seed-res-rsc-${distId}`,
      district_id: distId,
      resource_type: 'RESCUE_TEAM' as any,
      name: `${dist.name} NDRF Flood & Deep-Water Rescue Unit`,
      total_capacity: 30,
      available_capacity: 25,
      operational_status: 'OPERATIONAL' as any,
      capabilities: { motorized_boats: 4, divers: 8 },
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-10-26T00:00:00Z',
    },
    {
      id: `seed-res-shl-${distId}`,
      district_id: distId,
      resource_type: 'TEMPORARY_SHELTER' as any,
      name: `${dist.name} Multi-Purpose Cyclone Relief Shelter #01`,
      total_capacity: 500,
      available_capacity: 410,
      operational_status: 'OPERATIONAL' as any,
      capabilities: { generator_backup: true, water_purification: true },
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-10-26T00:00:00Z',
    },
  ];
});

// Seed alerts representing active hazard scenarios (e.g. storm surge in Odisha, flood in Assam)
export const SEED_ALERTS: AlertRead[] = [
  {
    id: 'seed-alert-01',
    district_id: 'dist-od-pu',
    hazard_type: 'CYCLONE' as any,
    severity: 'SEVERE' as any,
    status: 'ACTIVE' as any,
    title: 'Severe Storm Surge & Inundation',
    description: 'Seawall overtopping in Rajnagar block; immediate evacuations active under NDRF Bn 03 command. Wave heights projected 9.2m.',
    issued_by: 'usr-admin-ops-01',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-alert-02',
    district_id: 'dist-od-ba',
    hazard_type: 'CYCLONE' as any,
    severity: 'HIGH' as any,
    status: 'ACTIVE' as any,
    title: 'Coastal High Wind Warning & Surge Alert',
    description: 'Wind speeds exceeding 110 kmph with heavy rainfall forecasted. Fishermen advised to remain moored.',
    issued_by: 'usr-admin-ops-01',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-alert-03',
    district_id: 'dist-as-km',
    hazard_type: 'FLOOD' as any,
    severity: 'MODERATE' as any,
    status: 'ACTIVE' as any,
    title: 'Brahmaputra River Inundation Alert',
    description: 'Water levels rising above danger mark in low-lying riparian embankments.',
    issued_by: 'usr-admin-ops-01',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-alert-04',
    district_id: 'dist-mh-mc',
    hazard_type: 'HEATWAVE' as any,
    severity: 'LOW' as any,
    status: 'ACTIVE' as any,
    title: 'Coastal Humidity & Heat Warning',
    description: 'High heat index advisory across coastal urban corridors.',
    issued_by: 'usr-admin-ops-01',
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const SEED_SYSTEM_SUMMARY: SystemSummaryReport = {
  total_states: 6,
  total_districts: 14,
  total_observations: 1420,
  total_risk_assessments: 28,
  total_active_alerts: 4,
  total_registered_resources: 56,
  total_optimization_runs: 12,
  generated_at: new Date().toISOString(),
};

export const SEED_MODEL_STATUSES: HazardModelStatus[] = [
  { hazard_type: 'FLOOD' as any, model_name: 'InundationNet-V3', model_version: 'v3.4', is_available: true, readiness_status: 'TRAINED' },
  { hazard_type: 'CYCLONE' as any, model_name: 'StormSurge-X', model_version: 'v3.4', is_available: true, readiness_status: 'TRAINED' },
  { hazard_type: 'HEATWAVE' as any, model_name: 'WetBulbForecast', model_version: 'v2.1', is_available: true, readiness_status: 'TRAINED' },
  { hazard_type: 'EARTHQUAKE' as any, model_name: 'SeismicPGA', model_version: 'v1.9', is_available: true, readiness_status: 'TRAINED' },
];
