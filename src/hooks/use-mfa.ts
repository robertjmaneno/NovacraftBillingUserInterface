import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useMfaStatus = (userId?: string) => {
  return useQuery({
    queryKey: ['mfa-status', userId],
    queryFn: () => apiService.getMfaStatus(userId || ''),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useToggleMfa = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (enableMfa: boolean) => 
      apiService.toggleMfa({ 
        userId: user?.id || '', 
        enableMfa 
      }),
    onSuccess: () => {
      // Invalidate and refetch MFA status
      queryClient.invalidateQueries({ queryKey: ['mfa-status', user?.id] });
      // Also invalidate user profile to get updated twoFactorEnabled
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}; 