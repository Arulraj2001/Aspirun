import React from 'react';
import { Badge } from './Badge';

export type StatusType = 'completed' | 'pending' | 'free' | 'locked' | 'reported' | 'active' | 'in_progress';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normStatus = status.toLowerCase();

  let variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' = 'default';
  let label = status;

  switch (normStatus) {
    case 'completed':
      variant = 'success';
      label = 'Completed';
      break;
    case 'free':
      variant = 'success';
      label = 'Free Resource';
      break;
    case 'active':
      variant = 'info';
      label = 'Active';
      break;
    case 'in_progress':
      variant = 'info';
      label = 'In Progress';
      break;
    case 'pending':
      variant = 'warning';
      label = 'Pending';
      break;
    case 'reported':
      variant = 'danger';
      label = 'Reported';
      break;
    case 'locked':
      variant = 'default';
      label = 'Locked';
      break;
    default:
      variant = 'default';
      label = status;
      break;
  }

  return (
    <Badge variant={variant} size="sm" className={className}>
      {label}
    </Badge>
  );
};
