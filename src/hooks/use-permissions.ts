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

// Hook to fetch all permissions from API (for admin management purposes only)
export const useAllPermissions = () => {
  return useQuery({
    queryKey: ['permissions', 'all'],
    queryFn: () => apiService.getActivePermissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
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

// NOTE: All permissions and roles are now dynamically managed by the backend.
// The frontend only consumes what's provided in the JWT token and validated server-side.
// No hardcoded constants - everything comes from the backend authentication system. 