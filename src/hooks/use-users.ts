import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, CreateUserRequest } from '@/services/api';
import { toast } from 'sonner';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  roles: (userId: string) => [...userKeys.detail(userId), 'roles'] as const,
  permissions: (userId: string) => [...userKeys.detail(userId), 'permissions'] as const,
};

// Get users with pagination and filters
export const useUsers = (
  pageNumber: number = 1,
  pageSize: number = 10,
  filters?: {
    status?: string;
    userType?: string;
    searchTerm?: string;
  },
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: userKeys.list({ pageNumber, pageSize, ...filters }),
    queryFn: async () => {
      if (filters?.searchTerm) {
        return apiService.searchUsers(filters.searchTerm, pageNumber, pageSize);
      } else if (filters?.status) {
        return apiService.getUsersByStatus(filters.status, pageNumber, pageSize);
      } else if (filters?.userType) {
        return apiService.getUsersByType(filters.userType, pageNumber, pageSize);
      } else {
        return apiService.getUsers(pageNumber, pageSize);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  });
};

// Get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => apiService.getUserById(id),
    enabled: !!id,
  });
};

// Get user by email
export const useUserByEmail = (email: string) => {
  return useQuery({
    queryKey: [...userKeys.details(), 'email', email],
    queryFn: () => apiService.getUserByEmail(email),
    enabled: !!email,
  });
};

// Get current user profile
export const useCurrentUser = () => {
  return useQuery({
    queryKey: [...userKeys.details(), 'current'],
    queryFn: () => apiService.getCurrentProfile(),
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Get user roles
export const useUserRoles = (userId: string) => {
  return useQuery({
    queryKey: userKeys.roles(userId),
    queryFn: () => apiService.getUserRoles(userId),
    enabled: !!userId,
  });
};

// Get user permissions
export const useUserPermissions = (userId: string) => {
  return useQuery({
    queryKey: userKeys.permissions(userId),
    queryFn: () => apiService.getPermissionsByUser(userId),
    enabled: !!userId,
  });
};

// Get user count by status
export const useUserCountByStatus = (status: string) => {
  return useQuery({
    queryKey: [...userKeys.all, 'count', status],
    queryFn: () => apiService.getUserCountByStatus(status),
    enabled: !!status,
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => apiService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
};

// Update current user profile mutation
export const useUpdateCurrentProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.updateCurrentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...userKeys.details(), 'current'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

// User status management mutations
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiService.activateUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User activated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to activate user');
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiService.deactivateUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User deactivated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to deactivate user');
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) => 
      apiService.suspendUser(userId, reason),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User suspended successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to suspend user');
    },
  });
};

export const useUnlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiService.unlockUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User unlocked successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unlock user');
    },
  });
};

export const useLockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiService.lockUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User locked successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to lock user');
    },
  });
};

// User role assignment mutations
export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.assignRoleToUser,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.roles(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      toast.success('Role assigned successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign role');
    },
  });
};

export const useRemoveRoleFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      apiService.removeRoleFromUser(userId, roleId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.roles(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      toast.success('Role removed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove role');
    },
  });
};

export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      apiService.updateUserRoles(userId, roleIds),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.roles(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      toast.success('User roles updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user roles');
    },
  });
};

// User validation queries
export const useValidateEmail = (email: string) => {
  return useQuery({
    queryKey: [...userKeys.all, 'validate-email', email],
    queryFn: () => apiService.validateEmail(email),
    enabled: !!email,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useValidatePhone = (phoneNumber: string) => {
  return useQuery({
    queryKey: [...userKeys.all, 'validate-phone', phoneNumber],
    queryFn: () => apiService.validatePhone(phoneNumber),
    enabled: !!phoneNumber,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}; 