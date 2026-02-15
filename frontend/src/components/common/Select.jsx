import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

const Select = forwardRef(({ 
  label, 
  error, 
  options = [], 
  className, 
  placeholder = "Select an option",
  required,
  ...props 
}, ref) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          "w-full px-3 py-2 border rounded-lg shadow-sm bg-white transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed",
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
          "text-gray-900 sm:text-sm"
        )}
        {...props}
      >
        <option value="" disabled selected hidden>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-500">
           {error.message || error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
