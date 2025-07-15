import React from 'react';
import { usePermissions, PERMISSIONS } from '@/hooks/use-permissions';

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

// Specialized permission guards for common use cases
export const AdminGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard roles={['Administrator', 'SystemAdmin']} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
};

export const ManagerGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard roles={['Manager', 'Administrator', 'SystemAdmin']} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
};

export const UserManagementGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard 
      permissions={[PERMISSIONS.USERS_READ, PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_UPDATE, PERMISSIONS.USERS_DELETE]} 
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
};

export const RoleManagementGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard 
      permissions={[PERMISSIONS.ROLES_READ, PERMISSIONS.ROLES_CREATE, PERMISSIONS.ROLES_UPDATE, PERMISSIONS.ROLES_DELETE]} 
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
};

export const InvoiceManagementGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard 
      permissions={[PERMISSIONS.INVOICES_READ, PERMISSIONS.INVOICES_CREATE, PERMISSIONS.INVOICES_UPDATE, PERMISSIONS.INVOICES_DELETE]} 
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
};

export const CustomerManagementGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard 
      permissions={[PERMISSIONS.CUSTOMERS_READ, PERMISSIONS.CUSTOMERS_CREATE, PERMISSIONS.CUSTOMERS_UPDATE, PERMISSIONS.CUSTOMERS_DELETE]} 
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
};

export const ReportsGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard 
      permissions={[PERMISSIONS.REPORTS_VIEW, PERMISSIONS.REPORTS_EXPORT]} 
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
};

export const SettingsGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  return (
    <PermissionGuard 
      permissions={[PERMISSIONS.SETTINGS_READ, PERMISSIONS.SETTINGS_UPDATE]} 
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
}; 