import React from 'react';
import { Badge } from './Badge';
import { Difficulty } from '@/types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  className = '',
}) => {
  let variant: 'success' | 'warning' | 'danger' = 'success';

  if (difficulty === 'Medium') {
    variant = 'warning';
  } else if (difficulty === 'Hard') {
    variant = 'danger';
  }

  return (
    <Badge variant={variant} size="sm" className={className}>
      {difficulty}
    </Badge>
  );
};
