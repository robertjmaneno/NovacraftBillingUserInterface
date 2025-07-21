import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute - Auth state:', {
    isAuthenticated: isAuthenticated,
    isLoading: isLoading,
    user: user,
    pathname: location.pathname
  });

  if (isLoading) {
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force password reset if required
  if (user?.mustChangePassword) {
    return <Navigate to={`/reset-password?firstLogin=1&email=${encodeURIComponent(user.email)}`} replace />;
  }

  return <>{children}</>;
}; 