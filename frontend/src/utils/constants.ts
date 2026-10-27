// SENTRA Master Constants & Geo References

import { HazardType, AlertSeverityEnum } from '../types';

export const INDIA_CENTER: [number, number] = [22.5937, 78.9629];
export const INDIA_DEFAULT_ZOOM = 5;
export const REGION_DEFAULT_ZOOM = 8.5;
export const STATE_DEFAULT_ZOOM = 6.25;

export const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.4, 67.8],
  [36.6, 97.6],
];

// Representative Seed Geographic Reference Locations
export const SEED_DISTRICTS: Record<
  string,
  {
    name: string;
    state: string;
    stateIso: string;
    lat: number;
    lng: number;
    code: string;
    population: number;
  }
> = {
  'dist-mh-pu': { name: 'Pune', state: 'Maharashtra', stateIso: 'IN-MH', lat: 18.5204, lng: 73.8567, code: 'MH-PU', population: 9429408 },
  'dist-mh-mc': { name: 'Mumbai City', state: 'Maharashtra', stateIso: 'IN-MH', lat: 18.9388, lng: 72.8354, code: 'MH-MC', population: 3085411 },
  'dist-mh-rg': { name: 'Raigad', state: 'Maharashtra', stateIso: 'IN-MH', lat: 18.5158, lng: 73.1822, code: 'MH-RG', population: 2634200 },
  'dist-as-km': { name: 'Kamrup Metropolitan', state: 'Assam', stateIso: 'IN-AS', lat: 26.1445, lng: 91.7362, code: 'AS-KM', population: 1253938 },
  'dist-as-dh': { name: 'Dhubri', state: 'Assam', stateIso: 'IN-AS', lat: 26.0207, lng: 89.9743, code: 'AS-DH', population: 1949258 },
  'dist-as-ca': { name: 'Cachar', state: 'Assam', stateIso: 'IN-AS', lat: 24.8333, lng: 92.7789, code: 'AS-CA', population: 1736617 },
  'dist-od-pu': { name: 'Puri', state: 'Odisha', stateIso: 'IN-OR', lat: 19.8135, lng: 85.8312, code: 'OD-PU', population: 1698730 },
  'dist-od-ba': { name: 'Balasore', state: 'Odisha', stateIso: 'IN-OR', lat: 21.4934, lng: 86.9135, code: 'OD-BA', population: 2320529 },
  'dist-kl-er': { name: 'Ernakulam', state: 'Kerala', stateIso: 'IN-KL', lat: 9.9816, lng: 76.2999, code: 'KL-ER', population: 3282388 },
  'dist-kl-wa': { name: 'Wayanad', state: 'Kerala', stateIso: 'IN-KL', lat: 11.6854, lng: 76.1320, code: 'KL-WA', population: 817420 },
  'dist-rj-jp': { name: 'Jaipur', state: 'Rajasthan', stateIso: 'IN-RJ', lat: 26.9124, lng: 75.7873, code: 'RJ-JP', population: 6626178 },
  'dist-rj-js': { name: 'Jaisalmer', state: 'Rajasthan', stateIso: 'IN-RJ', lat: 26.9157, lng: 70.9083, code: 'RJ-JS', population: 669919 },
  'dist-uk-ch': { name: 'Chamoli', state: 'Uttarakhand', stateIso: 'IN-UT', lat: 30.4231, lng: 79.3283, code: 'UK-CH', population: 391605 },
  'dist-uk-dd': { name: 'Dehradun', state: 'Uttarakhand', stateIso: 'IN-UT', lat: 30.3165, lng: 78.0322, code: 'UK-DD', population: 1696694 },
};

// Resource marker presentation & deterministic map offsets around a district reference point.
// The API does not expose facility coordinates, so resources are plotted around the
// district reference centroid instead of implying an exact facility position.
export const RESOURCE_CONFIG: Record<
  string,
  { label: string; short: string; color: string; pixelOffset: [number, number] }
> = {
  AMBULANCE: { label: 'ALS Ambulance Fleet', short: 'AMB', color: '#38BDF8', pixelOffset: [15, -15] },
  HOSPITAL_BED: { label: 'Hospital ICU Beds', short: 'BED', color: '#22C55E', pixelOffset: [15, 15] },
  MEDICAL_TEAM: { label: 'Rapid Medical Teams', short: 'MED', color: '#A78BFA', pixelOffset: [-15, 15] },
  TEMPORARY_SHELTER: { label: 'Relief Shelter', short: 'SHL', color: '#F59E0B', pixelOffset: [-15, -15] },
  RESCUE_TEAM: { label: 'Rescue Team', short: 'RSC', color: '#F97316', pixelOffset: [0, -22] },
  RELIEF_SUPPLY_PACK: { label: 'Relief Supply Pack', short: 'SUP', color: '#EAB308', pixelOffset: [0, 22] },
};

export const HAZARD_LAYER_KEYS: Partial<Record<HazardType, string>> = {
  FLOOD: 'flood',
  CYCLONE: 'cyclone',
  EARTHQUAKE: 'earthquake',
  HEATWAVE: 'heatwave',
  LANDSLIDE: 'landslide',
  DROUGHT: 'drought',
};

// Hazard Theme Mapping
export const HAZARD_CONFIG: Record<HazardType, { name: string; color: string; badgeClass: string; icon: string }> = {
  FLOOD: {
    name: 'Flood & Inundation',
    color: '#38BDF8',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    icon: 'Waves',
  },
  CYCLONE: {
    name: 'Tropical Cyclone',
    color: '#06B6D4',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: 'Wind',
  },
  EARTHQUAKE: {
    name: 'Seismic Activity',
    color: '#EF4444',
    badgeClass: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: 'Activity',
  },
  DROUGHT: {
    name: 'Drought & Aridity',
    color: '#D97706',
    badgeClass: 'bg-amber-600/10 text-amber-500 border-amber-600/20',
    icon: 'Sun',
  },
  LANDSLIDE: {
    name: 'Slope Landslide',
    color: '#F59E0B',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: 'Mountain',
  },
  TSUNAMI: {
    name: 'Coastal Tsunami',
    color: '#14B8A6',
    badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    icon: 'Anchor',
  },
  HEATWAVE: {
    name: 'Extreme Heatwave',
    color: '#F97316',
    badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    icon: 'Flame',
  },
};

// Severity Color Mapping
export const SEVERITY_CONFIG: Record<AlertSeverityEnum, { label: string; color: string; border: string; bg: string; pulse: boolean }> = {
  CRITICAL: {
    label: 'Critical Alert',
    color: '#EF4444',
    border: 'border-red-500/40',
    bg: 'bg-red-500/15 text-red-400',
    pulse: true,
  },
  HIGH: {
    label: 'High Warning',
    color: '#F97316',
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/15 text-orange-400',
    pulse: false,
  },
  MODERATE: {
    label: 'Moderate Watch',
    color: '#F59E0B',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/15 text-amber-400',
    pulse: false,
  },
  LOW: {
    label: 'Advisory / Low',
    color: '#22C55E',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/15 text-emerald-400',
    pulse: false,
  },
};
