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
    const baseStyles =
      'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-sm shadow-brand-500/20 border border-brand-600 hover:shadow-md hover:shadow-brand-500/25 hover:-translate-y-0.5',
      secondary:
        'bg-brand-50 hover:bg-brand-100 active:bg-brand-200 text-brand-700 border border-brand-200 hover:border-brand-300',
      outline:
        'bg-white hover:bg-surface-75 active:bg-surface-100 text-surface-800 border border-surface-200 hover:border-surface-300 shadow-sm',
      ghost:
        'bg-transparent hover:bg-surface-100 active:bg-surface-150 text-surface-700',
      success:
        'bg-success-600 hover:bg-success-700 active:bg-success-800 text-white border border-success-700 shadow-sm shadow-success-600/15 hover:-translate-y-0.5',
      danger:
        'bg-danger-600 hover:bg-danger-700 active:bg-danger-700 text-white border border-danger-700 shadow-sm shadow-danger-600/15 hover:-translate-y-0.5',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-bold rounded-lg gap-1.5',
      md: 'px-5 py-2.5 text-sm font-bold gap-2',
      lg: 'px-7 py-3.5 text-base font-black rounded-2xl gap-2.5',
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
            className="animate-spin h-4 w-4 text-current shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}
        {children}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
