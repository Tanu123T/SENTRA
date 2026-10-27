import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LoadingScreen } from '../../components/common/LoadingScreen';

interface ProtectedRouteProps {
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user, accessToken, isInitialized, isLoading, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (accessToken && !user && !isInitialized) {
      fetchProfile();
    }
  }, [accessToken, user, isInitialized, fetchProfile]);

  if (!isInitialized && accessToken) {
    return <LoadingScreen message="Verifying operator authorization and cryptographic credentials..." />;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user) {
    const hasRole = user.roles.some((r) => r.name === requiredRole || r.name === 'ADMINISTRATOR');
    if (!hasRole) {
      return (
        <div className="p-8 text-center text-red-400">
          <h2 className="text-lg font-bold">Access Denied (403)</h2>
          <p className="text-sm mt-2 text-[#91A0B3]">
            This operational module requires the '{requiredRole}' clearance role.
          </p>
        </div>
      );
    }
  }

  return <Outlet />;
};
