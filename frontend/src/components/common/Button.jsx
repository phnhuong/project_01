import React from 'react';
import { clsx } from 'clsx';
import { FaSpinner } from 'react-icons/fa';

const variants = {
  primary: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-sm disabled:bg-blue-300',
  secondary: 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300 shadow-sm disabled:bg-gray-100 disabled:text-gray-400',
  danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm disabled:bg-red-300',
  ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  isLoading = false, 
  disabled, 
  type = 'button',
  icon: Icon,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <FaSpinner className="animate-spin mr-2 h-4 w-4" />
      )}
      {!isLoading && Icon && (
        <span className={clsx(children ? "mr-2" : "")}>
          <Icon className="h-4 w-4" />
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
