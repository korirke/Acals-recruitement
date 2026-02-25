import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
        // Variants
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg active:scale-95': variant === 'primary',
          'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 shadow-md hover:shadow-lg active:scale-95': variant === 'secondary',
          'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400 dark:hover:text-white': variant === 'outline',
          'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/20': variant === 'ghost',
        },
        // Sizes
        {
          'px-3 py-2 text-sm min-h-9': size === 'sm',
          'px-4 py-2.5 text-base min-h-10': size === 'md',
          'px-6 py-3 text-lg min-h-12': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';