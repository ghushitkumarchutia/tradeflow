import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1.5 w-full'>
        {label && (
          <label className='text-sm font-medium text-gray-700'>{label}</label>
        )}
        <input
          ref={ref}
          className={`px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-DEFAULT transition-all disabled:opacity-50 disabled:bg-gray-100 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : ""
          } ${className}`}
          {...props}
        />
        {error && <span className='text-xs text-red-500 mt-1'>{error}</span>}
      </div>
    );
  },
);
Input.displayName = "Input";
