import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  accent?: 'brand' | 'success' | 'warning' | 'danger' | 'indigo';
  className?: string;
}

const accentStyles: Record<string, string> = {
  brand:   'bg-brand-50 text-brand-600 ring-1 ring-brand-100',
  success: 'bg-success-50 text-success-700 ring-1 ring-success-100',
  warning: 'bg-warning-50 text-warning-600 ring-1 ring-warning-100',
  danger:  'bg-danger-50 text-danger-600 ring-1 ring-danger-100',
  indigo:  'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  accent = 'brand',
  className = '',
}) => {
  return (
    <Card variant="raised" className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] md:text-xs font-black text-surface-450 uppercase tracking-wider mb-1.5">
          {title}
        </p>
        <h3 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight leading-none">
          {value}
        </h3>
        {description && (
          <p className="mt-2 text-xs text-surface-500 font-semibold leading-snug">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                trend.isPositive
                  ? 'bg-success-50 text-success-700 ring-1 ring-success-100'
                  : 'bg-danger-50 text-danger-700 ring-1 ring-danger-100'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
            <span className="text-[10px] text-surface-400 font-semibold">vs last week</span>
          </div>
        )}
      </div>
      {icon && (
        <div className={`p-3 rounded-2xl shrink-0 ${accentStyles[accent]}`}>
          {icon}
        </div>
      )}
    </Card>
  );
};
