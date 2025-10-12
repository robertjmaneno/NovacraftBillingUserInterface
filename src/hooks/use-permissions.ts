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

// Static permission constants - Updated to match backend seeder exactly
export const PERMISSIONS = {
  // Management Permissions (High-level)
  USERS_MANAGE: 'Manage Users',
  ROLES_MANAGE: 'Manage Roles', 
  PERMISSIONS_MANAGE: 'Manage Permissions',

  // User Management
  USERS_CREATE: 'Create User',
  USERS_READ: 'View Users', 
  USERS_UPDATE: 'Update User',
  USERS_DELETE: 'Delete User',
  USERS_EXPORT: 'Export Users',
  USERS_IMPORT: 'Import Users',
  USERS_SUSPEND: 'Suspend User',
  USERS_ACTIVATE: 'Activate User',
  USERS_RESETPASSWORD: 'Reset User Password',
  USERS_MANAGEMFA: 'Manage User MFA',

  // Role Management
  ROLES_CREATE: 'Create Role',
  ROLES_READ: 'View Roles',
  ROLES_UPDATE: 'Update Role',
  ROLES_DELETE: 'Delete Role',
  ROLES_ASSIGNPERMISSIONS: 'Assign Permissions to Role',
  ROLES_ASSIGNUSERS: 'Assign Users to Role',

  // Permission Management
  PERMISSIONS_CREATE: 'Create Permission',
  PERMISSIONS_READ: 'View Permissions',
  PERMISSIONS_UPDATE: 'Update Permission',
  PERMISSIONS_DELETE: 'Delete Permission',

  // User Role Management
  USERROLES_MANAGE: 'Manage User Roles',
  USERROLES_ASSIGN: 'Assign User Role',
  USERROLES_REMOVE: 'Remove User Role',
  USERROLES_READ: 'View User Roles',

  // Service Management
  SERVICES_CREATE: 'Create Service',
  SERVICES_READ: 'View Services',
  SERVICES_UPDATE: 'Update Service',
  SERVICES_DELETE: 'Delete Service',

  // Invoice Template Management
  INVOICETEMPLATES_CREATE: 'Create Invoice Template',
  INVOICETEMPLATES_READ: 'View Invoice Templates',
  INVOICETEMPLATES_UPDATE: 'Update Invoice Template',
  INVOICETEMPLATES_DELETE: 'Delete Invoice Template',

  // Invoice Management
  INVOICES_CREATE: 'Create Invoice',
  INVOICES_READ: 'View Invoices',
  INVOICES_UPDATE: 'Update Invoice',
  INVOICES_DELETE: 'Delete Invoice',
  INVOICES_SEND: 'Send Invoice',
  INVOICES_EXPORT: 'Export Invoices',
  INVOICES_PRINT: 'Print Invoice',

  // Payment Management
  PAYMENTS_CREATE: 'Create Payment',
  PAYMENTS_READ: 'View Payments',
  PAYMENTS_UPDATE: 'Update Payment',
  PAYMENTS_DELETE: 'Delete Payment',
  PAYMENTS_PROCESS: 'Process Payment',
  PAYMENTS_REFUND: 'Refund Payment',
  PAYMENTS_EXPORT: 'Export Payments',

  // Customer Management
  CUSTOMERS_CREATE: 'Create Customer',
  CUSTOMERS_READ: 'View Customers',
  CUSTOMERS_UPDATE: 'Update Customer',
  CUSTOMERS_DELETE: 'Delete Customer',
  CUSTOMERS_EXPORT: 'Export Customers',
  CUSTOMERS_IMPORT: 'Import Customers',

  // Product Management
  PRODUCTS_CREATE: 'Create Product',
  PRODUCTS_READ: 'View Products',
  PRODUCTS_UPDATE: 'Update Product',
  PRODUCTS_DELETE: 'Delete Product',
  PRODUCTS_EXPORT: 'Export Products',
  PRODUCTS_IMPORT: 'Import Products',

  // Subscription Management
  SUBSCRIPTIONS_CREATE: 'Create Subscription',
  SUBSCRIPTIONS_READ: 'View Subscriptions',
  SUBSCRIPTIONS_UPDATE: 'Update Subscription',
  SUBSCRIPTIONS_DELETE: 'Delete Subscription',
  SUBSCRIPTIONS_ACTIVATE: 'Activate Subscription',
  SUBSCRIPTIONS_SUSPEND: 'Suspend Subscription',
  SUBSCRIPTIONS_CANCEL: 'Cancel Subscription',
  SUBSCRIPTIONS_RENEW: 'Renew Subscription',
  SUBSCRIPTIONS_EXPORT: 'Export Subscriptions',
  SUBSCRIPTIONS_IMPORT: 'Import Subscriptions',
  SUBSCRIPTIONS_MANAGEOWN: 'Manage Own Subscriptions',

  // Reports Management
  REPORTS_VIEW: 'View Reports',
  REPORTS_GENERATE: 'Generate Report',
  REPORTS_EXPORT: 'Export Reports',
  REPORTS_SCHEDULE: 'Schedule Report',

  // Settings Management
  SETTINGS_READ: 'View Settings',
  SETTINGS_UPDATE: 'Update Settings',
  SETTINGS_BACKUP: 'Backup System',
  SETTINGS_RESTORE: 'Restore System',

  // Audit Management
  AUDIT_READ: 'View Audit Logs',
  AUDIT_EXPORT: 'Export Audit Logs',

  // Dashboard Management
  DASHBOARD_VIEW: 'View Dashboard',
  DASHBOARD_CUSTOMIZE: 'Customize Dashboard',
} as const;

export const ROLES = {
  SYSTEM_ADMIN: 'SystemAdmin',
  ADMINISTRATOR: 'Administrator',
  MANAGER: 'Manager',
  ACCOUNTANT: 'Accountant',
  VIEWER: 'Viewer',
  CUSTOMER: 'Customer',
} as const; 