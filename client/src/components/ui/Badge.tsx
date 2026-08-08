import type { ReactNode } from "react";
import type { CustomerStatus, ChallanStatus } from "../../types";

export interface BadgeProps {
  status: CustomerStatus | ChallanStatus | string;
  children?: ReactNode;
  className?: string;
}

export function Badge({ status, children, className = "" }: BadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "INACTIVE":
      case "DRAFT":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "SUSPENDED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
        status,
      )} ${className}`}
    >
      {children || status}
    </span>
  );
}
