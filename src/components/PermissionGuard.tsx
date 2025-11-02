import React from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback = null,
  showFallback = false,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole, hasAllRoles } = usePermissions();

  // Check if user has required permissions
  const hasRequiredPermissions = permissions.length > 0 
    ? requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
    : true;

  // Check if user has required roles
  const hasRequiredRoles = roles.length > 0
    ? requireAll
      ? hasAllRoles(roles)
      : hasAnyRole(roles)
    : true;

  // User has access if they have both required permissions and roles
  const hasAccess = hasRequiredPermissions && hasRequiredRoles;

  if (hasAccess) {
    return <>{children}</>;
  }

  return showFallback ? <>{fallback}</> : null;
};

// Simplified role-based guards that work with dynamic backend roles
export const AdminGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard roles={['System Administrator', 'Administrator']} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
};

export const ManagerGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard roles={['Business Manager', 'Team Lead', 'System Administrator']} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
};

export const BillingGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard roles={['Billing Specialist', 'Business Manager', 'System Administrator']} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
};

export const SalesGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard roles={['Sales Representative', 'Team Lead', 'Business Manager', 'System Administrator']} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
};

export const CustomerServiceGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard roles={['Customer Service', 'Team Lead', 'Business Manager', 'System Administrator']} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}; 