import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

// Query keys
export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters: any) => [...subscriptionKeys.lists(), filters] as const,
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...subscriptionKeys.details(), id] as const,
};

export function useSubscriptions(filters: any = {}) {
  return useQuery({
    queryKey: subscriptionKeys.list(filters),
    queryFn: () => apiService.getSubscriptions(filters),
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.createSubscription(data),
    onSuccess: () => {
      toast.success('Subscription created successfully');
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    onError: () => {
      toast.error('Failed to create subscription');
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => apiService.updateSubscription(id, data),
    onSuccess: () => {
      toast.success('Subscription updated successfully');
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    onError: () => {
      toast.error('Failed to update subscription');
    },
  });
}

export function usePauseSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiService.pauseSubscription(id),
    onSuccess: () => {
      toast.success('Subscription paused');
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    onError: () => {
      toast.error('Failed to pause subscription');
    },
  });
}

export function useResumeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiService.resumeSubscription(id),
    onSuccess: () => {
      toast.success('Subscription resumed');
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    onError: () => {
      toast.error('Failed to resume subscription');
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string | number; reason: string }) => apiService.cancelSubscription(id, reason),
    onSuccess: () => {
      toast.success('Subscription cancelled');
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    onError: () => {
      toast.error('Failed to cancel subscription');
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiService.deleteSubscription(id),
    onSuccess: () => {
      toast.success('Subscription deleted');
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    onError: () => {
      toast.error('Failed to delete subscription');
    },
  });
} 