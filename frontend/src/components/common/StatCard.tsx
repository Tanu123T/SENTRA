import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={clsx(
        'group relative overflow-hidden transition-all duration-200',
        onClick && 'cursor-pointer hover:border-slate-600 hover:bg-[#111C27]'
      )}
    >
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ backgroundColor: accentColor }}
        />
      )}
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-[#91A0B3]">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-[#E8EEF5]">
                {value}
              </span>
              {trend && (
                <span
                  className={clsx(
                    'text-xs font-semibold px-1.5 py-0.5 rounded',
                    trend.isPositive
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-red-400 bg-red-500/10'
                  )}
                >
                  {trend.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-[#5A6E85] pt-0.5">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="p-2.5 rounded-lg bg-[#111C27] border border-[#243342] text-[#91A0B3] group-hover:text-amber-400 group-hover:border-amber-500/30 transition-colors">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
