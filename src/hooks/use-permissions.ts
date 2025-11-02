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

  // Debug logging in development
  if (process.env.NODE_ENV === 'development' && token) {
    console.group('🔐 usePermissions Debug Info');
    console.log('User:', user?.email);
    console.log('Token exists:', !!token);
    console.log('User Roles:', userRoles);
    console.log('User Permissions:', userPermissions);
    console.groupEnd();
  }

  // Check if user has a specific permission
  const hasPermission = (permissionName: string): boolean => {
    const result = userPermissions.includes(permissionName);
    if (process.env.NODE_ENV === 'development') {
      console.log(`Permission check "${permissionName}":`, result);
    }
    return result;
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    const result = permissionNames.some(permissionName => hasPermission(permissionName));
    if (process.env.NODE_ENV === 'development') {
      console.log(`Any permission check [${permissionNames.join(', ')}]:`, result);
    }
    return result;
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissionNames: string[]): boolean => {
    const result = permissionNames.every(permissionName => hasPermission(permissionName));
    if (process.env.NODE_ENV === 'development') {
      console.log(`All permissions check [${permissionNames.join(', ')}]:`, result);
    }
    return result;
  };

  // Check if user has a specific role
  const hasRole = (roleName: string): boolean => {
    const result = userRoles.includes(roleName);
    if (process.env.NODE_ENV === 'development') {
      console.log(`Role check "${roleName}":`, result);
    }
    return result;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roleNames: string[]): boolean => {
    const result = roleNames.some(roleName => hasRole(roleName));
    if (process.env.NODE_ENV === 'development') {
      console.log(`Any role check [${roleNames.join(', ')}]:`, result);
    }
    return result;
  };

  // Check if user has all of the specified roles
  const hasAllRoles = (roleNames: string[]): boolean => {
    const result = roleNames.every(roleName => hasRole(roleName));
    if (process.env.NODE_ENV === 'development') {
      console.log(`All roles check [${roleNames.join(', ')}]:`, result);
    }
    return result;
  };

  // Check if user is admin
  const isAdmin = (): boolean => {
    return hasRole('System Administrator') || hasRole('Administrator');
  };

  // Check if user is manager
  const isManager = (): boolean => {
    return hasRole('Business Manager') || hasRole('Team Lead') || hasRole('System Administrator');
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