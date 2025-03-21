import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'outlined' | 'underlined';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = 'default',
  className,
  ...props
}) => {
  const baseStyles = 'w-full px-3 py-2 rounded-md focus:outline-none';
  
  const variantStyles = {
    default: 'border border-gray-300 focus:ring-2 focus:ring-blue-500',
    outlined: 'border-2 border-gray-400 focus:border-blue-600',
    underlined: 'border-b-2 border-gray-300 focus:border-blue-600 rounded-none'
  };

  const inputClasses = clsx(
    baseStyles,
    variantStyles[variant],
    error && 'border-red-500 focus:ring-red-500',
    className
  );

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input 
        className={inputClasses} 
        {...props} 
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
