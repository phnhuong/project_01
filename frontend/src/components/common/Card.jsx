import React from 'react';
import { clsx } from 'clsx';

const Card = ({ children, className, padding = true, title, ...props }) => {
  return (
    <div 
      className={clsx(
        "bg-white rounded-lg border border-gray-200 shadow-sm",
        padding ? "p-6" : "",
        className
      )} 
      {...props}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
