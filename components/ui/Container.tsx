import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'lg',
  ...props
}) => {
  const maxWidths = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1440px]',
  };

  return (
    <div
      className={`mx-auto px-4 md:px-6 w-full ${maxWidths[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
