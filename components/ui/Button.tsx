import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-sm shadow-brand-500/10 border border-brand-600',
      secondary: 'bg-brand-50 hover:bg-brand-100 active:bg-brand-200 text-brand-700 border border-brand-100',
      outline: 'bg-white hover:bg-surface-50 active:bg-surface-100 text-surface-800 border border-surface-200',
      ghost: 'bg-transparent hover:bg-surface-50 active:bg-surface-100 text-surface-800',
      success: 'bg-success-600 hover:bg-success-700 active:bg-success-700 text-white border border-success-700 shadow-sm shadow-success-600/10',
      danger: 'bg-danger-600 hover:bg-danger-700 active:bg-danger-700 text-white border border-danger-700 shadow-sm shadow-danger-600/10',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs md:text-sm font-semibold rounded-lg',
      md: 'px-5 py-2.5 text-sm md:text-base font-semibold',
      lg: 'px-6 py-3.5 text-base md:text-lg font-bold rounded-2xl w-full md:w-auto',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="mr-2 inline-flex">{icon}</span>
        )}
        {children}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="ml-2 inline-flex">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
