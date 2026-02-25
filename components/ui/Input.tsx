import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  size = 'md',
  id,
  name,
  ...props
}, ref) => {
  const inputId = id || (name ? `input-${name}` : undefined);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        className={cn(
          'w-full border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
