import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: () => apiService.getDashboardData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};