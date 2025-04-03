import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

export function ProtectedRoute({ 
  redirectPath = '/auth',
  children 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If authentication is still loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login page with return path
  if (!isAuthenticated) {
    const currentPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${redirectPath}?redirect=${currentPath}`} replace />;
  }

  // If there are children, render them, otherwise render the Outlet
  return children ? <>{children}</> : <Outlet />;
}
