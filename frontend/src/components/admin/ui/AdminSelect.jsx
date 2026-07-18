import React, { forwardRef } from 'react';

export const AdminSelect = forwardRef(({ label, error, helperText, options = [], className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select 
        ref={ref}
        className={`w-full px-3 py-2 bg-white border ${
          error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-primary focus:ring-primary/20'
        } rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all appearance-none`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {(error || helperText) && (
        <span className={`text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
});

AdminSelect.displayName = 'AdminSelect';
