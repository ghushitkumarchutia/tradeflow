import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[var(--color-brand-dark)] text-white hover:bg-[var(--color-brand-DEFAULT)] focus:ring-[var(--color-brand-DEFAULT)] shadow-sm",
      secondary:
        "bg-[var(--color-brand-muted)] text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-light)] focus:ring-[var(--color-brand-light)]",
      danger:
        "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm",
      outline:
        "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200 shadow-sm",
      ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-200",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3 text-base",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
