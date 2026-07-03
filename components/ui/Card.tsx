import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-5 md:p-6 transition-all duration-200 ${
        bordered ? 'border border-surface-200' : ''
      } ${
        hoverable ? 'hover:shadow-md hover:border-surface-300' : 'shadow-sm'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
