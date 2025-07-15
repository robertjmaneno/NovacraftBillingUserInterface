import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { getUserRoles, getUserPermissions } from '@/lib/jwt-utils';

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  module: string;
  action: string;
  isActive: boolean;
  isSystem: boolean;
  permissionType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  isSystem: boolean;
  roleType: string;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

// Hook to fetch all permissions from API
export const useAllPermissions = () => {
  return useQuery({
    queryKey: ['permissions', 'all'],
    queryFn: () => apiService.getActivePermissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get dynamic permission constants from API
export const usePermissionConstants = () => {
  const { data: permissionsData } = useAllPermissions();
  
  const permissions = permissionsData?.data?.permissions || [];
  
  // Generate permission constants dynamically from API
  const PERMISSIONS = permissions.reduce((acc, permission) => {
    // Convert permission name to constant format (e.g., "Users.Create" -> "USERS_CREATE")
    const constantName = permission.name
      .split('.')
      .map(part => part.toUpperCase())
      .join('_');
    
    acc[constantName] = permission.name;
    return acc;
  }, {} as Record<string, string>);
  
  return {
    PERMISSIONS,
    permissions,
    isLoading: !permissionsData
  };
};

export const usePermissions = () => {
  const { user, token } = useAuth();

  // Get permissions and roles from JWT token instead of API calls
  const userPermissions = token ? getUserPermissions(token) : [];
  const userRoles = token ? getUserRoles(token) : [];
  const isLoading = false; // No loading since we get data from token

  // Check if user has a specific permission
  const hasPermission = (permissionName: string): boolean => {
    return userPermissions.includes(permissionName);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(permissionName => hasPermission(permissionName));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissionNames: string[]): boolean => {
    return permissionNames.every(permissionName => hasPermission(permissionName));
  };

  // Check if user has a specific role
  const hasRole = (roleName: string): boolean => {
    return userRoles.includes(roleName);
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roleNames: string[]): boolean => {
    return roleNames.some(roleName => hasRole(roleName));
  };

  // Check if user has all of the specified roles
  const hasAllRoles = (roleNames: string[]): boolean => {
    return roleNames.every(roleName => hasRole(roleName));
  };

  // Check if user is admin
  const isAdmin = (): boolean => {
    return hasRole('Administrator') || hasRole('System Admin');
  };

  // Check if user is manager
  const isManager = (): boolean => {
    return hasRole('Manager') || hasRole('Administrator') || hasRole('System Admin');
  };

  // Get user's permission names
  const getUserPermissionNames = (): string[] => {
    return userPermissions;
  };

  // Get user's role names
  const getUserRoleNames = (): string[] => {
    return userRoles;
  };

  return {
    userPermissions: userPermissions,
    userRoles: userRoles,
    isLoading: isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isManager,
    getUserPermissionNames,
    getUserRoleNames,
  };
};

// Static permission constants for backward compatibility
// These will be replaced by dynamic constants from the API
export const PERMISSIONS = {
  // User Management
  USERS_CREATE: 'Users.Create',
  USERS_READ: 'Users.Read',
  USERS_UPDATE: 'Users.Update',
  USERS_DELETE: 'Users.Delete',
  USERS_EXPORT: 'Users.Export',
  USERS_IMPORT: 'Users.Import',
  USERS_SUSPEND: 'Users.Suspend',
  USERS_ACTIVATE: 'Users.Activate',
  USERS_RESETPASSWORD: 'Users.ResetPassword',
  USERS_MANAGEMFA: 'Users.ManageMFA',

  // Role Management
  ROLES_CREATE: 'Roles.Create',
  ROLES_READ: 'Roles.Read',
  ROLES_UPDATE: 'Roles.Update',
  ROLES_DELETE: 'Roles.Delete',
  ROLES_ASSIGNPERMISSIONS: 'Roles.AssignPermissions',
  ROLES_ASSIGNUSERS: 'Roles.AssignUsers',

  // Permission Management
  PERMISSIONS_CREATE: 'Permissions.Create',
  PERMISSIONS_READ: 'Permissions.Read',
  PERMISSIONS_UPDATE: 'Permissions.Update',
  PERMISSIONS_DELETE: 'Permissions.Delete',

  // Billing Management
  BILLING_CREATE: 'Billing.Create',
  BILLING_READ: 'Billing.Read',
  BILLING_UPDATE: 'Billing.Update',
  BILLING_DELETE: 'Billing.Delete',
  BILLING_APPROVE: 'Billing.Approve',
  BILLING_REJECT: 'Billing.Reject',
  BILLING_EXPORT: 'Billing.Export',
  BILLING_GENERATEINVOICE: 'Billing.GenerateInvoice',

  // Invoice Management
  INVOICES_CREATE: 'Invoices.Create',
  INVOICES_READ: 'Invoices.Read',
  INVOICES_UPDATE: 'Invoices.Update',
  INVOICES_DELETE: 'Invoices.Delete',
  INVOICES_SEND: 'Invoices.Send',
  INVOICES_EXPORT: 'Invoices.Export',
  INVOICES_PRINT: 'Invoices.Print',

  // Payment Management
  PAYMENTS_CREATE: 'Payments.Create',
  PAYMENTS_READ: 'Payments.Read',
  PAYMENTS_UPDATE: 'Payments.Update',
  PAYMENTS_DELETE: 'Payments.Delete',
  PAYMENTS_PROCESS: 'Payments.Process',
  PAYMENTS_REFUND: 'Payments.Refund',
  PAYMENTS_EXPORT: 'Payments.Export',

  // Customer Management
  CUSTOMERS_CREATE: 'Customers.Create',
  CUSTOMERS_READ: 'Customers.Read',
  CUSTOMERS_UPDATE: 'Customers.Update',
  CUSTOMERS_DELETE: 'Customers.Delete',
  CUSTOMERS_EXPORT: 'Customers.Export',
  CUSTOMERS_IMPORT: 'Customers.Import',

  // Product Management
  PRODUCTS_CREATE: 'Products.Create',
  PRODUCTS_READ: 'Products.Read',
  PRODUCTS_UPDATE: 'Products.Update',
  PRODUCTS_DELETE: 'Products.Delete',
  PRODUCTS_EXPORT: 'Products.Export',
  PRODUCTS_IMPORT: 'Products.Import',

  // Subscription Management
  SUBSCRIPTIONS_CREATE: 'Subscriptions.Create',
  SUBSCRIPTIONS_READ: 'Subscriptions.Read',
  SUBSCRIPTIONS_UPDATE: 'Subscriptions.Update',
  SUBSCRIPTIONS_DELETE: 'Subscriptions.Delete',
  SUBSCRIPTIONS_ACTIVATE: 'Subscriptions.Activate',
  SUBSCRIPTIONS_SUSPEND: 'Subscriptions.Suspend',
  SUBSCRIPTIONS_CANCEL: 'Subscriptions.Cancel',
  SUBSCRIPTIONS_RENEW: 'Subscriptions.Renew',
  SUBSCRIPTIONS_EXPORT: 'Subscriptions.Export',
  SUBSCRIPTIONS_IMPORT: 'Subscriptions.Import',
  SUBSCRIPTIONS_MANAGEOWN: 'Subscriptions.ManageOwn',

  // Reports
  REPORTS_VIEW: 'Reports.View',
  REPORTS_GENERATE: 'Reports.Generate',
  REPORTS_EXPORT: 'Reports.Export',
  REPORTS_SCHEDULE: 'Reports.Schedule',

  // System Settings
  SETTINGS_READ: 'Settings.Read',
  SETTINGS_UPDATE: 'Settings.Update',
  SETTINGS_BACKUP: 'Settings.Backup',
  SETTINGS_RESTORE: 'Settings.Restore',

  // Audit
  AUDIT_READ: 'Audit.Read',
  AUDIT_EXPORT: 'Audit.Export',

  // Dashboard
  DASHBOARD_VIEW: 'Dashboard.View',
  DASHBOARD_CUSTOMIZE: 'Dashboard.Customize',
} as const;

export const ROLES = {
  SYSTEM_ADMIN: 'SystemAdmin',
  ADMINISTRATOR: 'Administrator',
  MANAGER: 'Manager',
  ACCOUNTANT: 'Accountant',
  VIEWER: 'Viewer',
  CUSTOMER: 'Customer',
} as const; 