import React, { forwardRef } from "react";

// Wrap form elements elegantly

export interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function FormField({ label, description, error, htmlFor, children, className = "", required }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-[13px] font-bold text-on-surface">
          {label} {required && <span className="text-error">*</span>}
        </label>
      </div>
      {children}
      {description && !error && <p className="text-[11.5px] text-on-surface-variant">{description}</p>}
      {error && <p className="text-[11.5px] text-error font-medium">{error}</p>}
    </div>
  );
}

// Input primitive
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-10 px-3.5 rounded-xl border bg-surface text-[13.5px] text-on-surface outline-none transition-all duration-200 placeholder:text-outline
          ${hasError ? "border-error focus:border-error focus:ring-2 focus:ring-error-container" : "border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-fixed"}
          ${props.disabled ? "opacity-50 cursor-not-allowed bg-surface-container" : ""}
          ${className}
        `}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Textarea primitive
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", hasError, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full p-3.5 rounded-xl border bg-surface text-[13.5px] text-on-surface outline-none transition-all duration-200 placeholder:text-outline resize-y min-h-[80px]
          ${hasError ? "border-error focus:border-error focus:ring-2 focus:ring-error-container" : "border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-fixed"}
          ${props.disabled ? "opacity-50 cursor-not-allowed bg-surface-container" : ""}
          ${className}
        `}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// Select primitive (native for Phase 5.3 foundation)
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", hasError, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full h-10 px-3.5 rounded-xl border bg-surface text-[13.5px] text-on-surface outline-none transition-all duration-200 
          appearance-none cursor-pointer
          ${hasError ? "border-error focus:border-error focus:ring-2 focus:ring-error-container" : "border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-fixed"}
          ${props.disabled ? "opacity-50 cursor-not-allowed bg-surface-container" : ""}
          ${className}
        `}
        style={{ backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg fill="none" height="24" stroke="%239CA3AF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
