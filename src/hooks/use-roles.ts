import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, CreateRoleRequest } from '@/services/api';
import { toast } from 'sonner';

// Query keys
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...roleKeys.lists(), filters] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
  permissions: (roleId: string) => [...roleKeys.detail(roleId), 'permissions'] as const,
  active: () => [...roleKeys.all, 'active'] as const,
};

// Get roles with pagination
export const useRoles = (pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: roleKeys.list({ pageNumber, pageSize }),
    queryFn: () => apiService.getRoles(pageNumber, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get active roles
export const useActiveRoles = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: roleKeys.active(),
    queryFn: () => apiService.getActiveRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  });
};

// Get role by ID
export const useRole = (id: string) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => apiService.getRoleById(id),
    enabled: !!id,
  });
};

// Get role with permissions
export const useRoleWithPermissions = (id: string) => {
  return useQuery({
    queryKey: [...roleKeys.detail(id), 'with-permissions'],
    queryFn: () => apiService.getRoleWithPermissions(id),
    enabled: !!id,
  });
};

// Get role permissions
export const useRolePermissions = (roleId: string) => {
  return useQuery({
    queryKey: roleKeys.permissions(roleId),
    queryFn: () => apiService.getRolePermissions(roleId),
    enabled: !!roleId,
  });
};

// Create role mutation
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => apiService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.active() });
      toast.success('Role created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create role');
    },
  });
};

// Update role mutation
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.updateRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.active() });
      toast.success('Role updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update role');
    },
  });
};

// Delete role mutation
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.active() });
      toast.success('Role deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete role');
    },
  });
};

// Role permission management mutations
export const useAssignPermissionToRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      apiService.assignPermissionToRole(roleId, permissionId),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.permissions(roleId) });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(roleId) });
      toast.success('Permission assigned to role successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign permission to role');
    },
  });
};

export const useRemovePermissionFromRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      apiService.removePermissionFromRole(roleId, permissionId),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.permissions(roleId) });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(roleId) });
      toast.success('Permission removed from role successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove permission from role');
    },
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      apiService.updateRolePermissions(roleId, permissionIds.map(id => Number(id))),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.permissions(roleId) });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(roleId) });
      toast.success('Role permissions updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update role permissions');
    },
  });
};

// Check role permission
export const useCheckRolePermission = (roleId: string, permissionName: string) => {
  return useQuery({
    queryKey: [...roleKeys.permissions(roleId), 'check', permissionName],
    queryFn: () => apiService.checkRolePermission(roleId, permissionName),
    enabled: !!roleId && !!permissionName,
  });
}; 