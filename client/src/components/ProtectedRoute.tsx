import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

export interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='w-8 h-8 border-4 border-gray-200 border-t-brand-DEFAULT rounded-full animate-spin'></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/dashboard' replace />;
  }

  return <Outlet />;
}
