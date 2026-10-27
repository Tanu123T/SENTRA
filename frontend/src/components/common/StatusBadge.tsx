import React from 'react';
import { Badge } from '../ui/Badge';
import { AlertSeverityEnum, HazardType, OperationalStatusEnum } from '../../types';
import { HAZARD_CONFIG, SEVERITY_CONFIG } from '../../utils/constants';

interface SeverityBadgeProps {
  severity: AlertSeverityEnum | string;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const sevKey = (severity?.toUpperCase() || 'LOW') as AlertSeverityEnum;
  const config = SEVERITY_CONFIG[sevKey] || SEVERITY_CONFIG.LOW;

  const variantMap: Record<AlertSeverityEnum, 'critical' | 'warning' | 'watch' | 'low'> = {
    CRITICAL: 'critical',
    HIGH: 'warning',
    MODERATE: 'watch',
    LOW: 'low',
  };

  return (
    <Badge variant={variantMap[sevKey]} size={size} pulse={config.pulse}>
      {config.label}
    </Badge>
  );
};

interface HazardBadgeProps {
  hazard: HazardType | string;
  size?: 'sm' | 'md';
}

export const HazardBadge: React.FC<HazardBadgeProps> = ({ hazard, size = 'md' }) => {
  const hazKey = (hazard?.toUpperCase() || 'FLOOD') as HazardType;
  const config = HAZARD_CONFIG[hazKey] || HAZARD_CONFIG.FLOOD;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.badgeClass} ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.name}
    </span>
  );
};

interface OperationalBadgeProps {
  status: OperationalStatusEnum | string;
}

export const OperationalBadge: React.FC<OperationalBadgeProps> = ({ status }) => {
  switch (status?.toUpperCase()) {
    case 'OPERATIONAL':
      return <Badge variant="low" size="sm">Operational</Badge>;
    case 'DEGRADED':
      return <Badge variant="watch" size="sm">Degraded</Badge>;
    case 'OFFLINE':
      return <Badge variant="critical" size="sm">Offline</Badge>;
    default:
      return <Badge variant="neutral" size="sm">{status || 'Unknown'}</Badge>;
  }
};
