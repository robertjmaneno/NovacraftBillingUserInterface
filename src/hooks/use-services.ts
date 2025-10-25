import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  apiService, 
  Service, 
  ServiceListResponse, 
  CreateServiceRequest, 
  UpdateServiceRequest,
  ServiceQueryParams,
  BillingCycle,
  ServiceStatsResponse
} from '@/services/api';
import { toast } from 'sonner';

// Query keys
export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...serviceKeys.lists(), filters] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: number) => [...serviceKeys.details(), id] as const,
  categories: () => [...serviceKeys.all, 'categories'] as const,
  billingCycles: () => [...serviceKeys.all, 'billing-cycles'] as const,
  stats: () => [...serviceKeys.all, 'stats'] as const,
  revenue: () => [...serviceKeys.all, 'revenue'] as const,
  clients: () => [...serviceKeys.all, 'clients'] as const,
};

// Get services with pagination
export const useServices = (
  pageNumber: number = 1,
  pageSize: number = 10,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: serviceKeys.list({ pageNumber, pageSize }),
    queryFn: () => apiService.getServices(pageNumber, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  });
};

// Get services with advanced query parameters
export const useServicesWithQuery = (
  params: ServiceQueryParams = {},
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: serviceKeys.list(params as Record<string, unknown>),
    queryFn: () => apiService.getServicesWithQuery(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  });
};

// Get service by ID
export const useService = (id: number) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => apiService.getServiceById(id),
    enabled: !!id,
  });
};

// Create service mutation
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceRequest) => apiService.createService(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Service created successfully!');
        queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
        queryClient.invalidateQueries({ queryKey: serviceKeys.stats() });
      } else {
        toast.error(response.message || 'Failed to create service');
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to create service:', error);
      toast.error((error as Record<string, unknown>)?.message as string || 'Failed to create service');
    },
  });
};

// Update service mutation
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateServiceRequest }) =>
      apiService.updateService(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        toast.success('Service updated successfully!');
        queryClient.invalidateQueries({ queryKey: serviceKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
        queryClient.invalidateQueries({ queryKey: serviceKeys.stats() });
      } else {
        toast.error(response.message || 'Failed to update service');
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to update service:', error);
      toast.error((error as Record<string, unknown>)?.message as string || 'Failed to update service');
    },
  });
};

// Delete service mutation
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteService(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Service deleted successfully!');
        queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
        queryClient.invalidateQueries({ queryKey: serviceKeys.stats() });
      } else {
        toast.error(response.message || 'Failed to delete service');
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to delete service:', error);
      toast.error((error as Record<string, unknown>)?.message as string || 'Failed to delete service');
    },
  });
};

// Get service categories
export const useServiceCategories = () => {
  return useQuery({
    queryKey: serviceKeys.categories(),
    queryFn: () => apiService.getServiceCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get billing cycles
export const useBillingCycles = () => {
  return useQuery({
    queryKey: serviceKeys.billingCycles(),
    queryFn: () => apiService.getBillingCycles(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get total revenue
export const useTotalRevenue = () => {
  return useQuery({
    queryKey: serviceKeys.revenue(),
    queryFn: () => apiService.getTotalRevenue(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get total clients
export const useTotalClients = () => {
  return useQuery({
    queryKey: serviceKeys.clients(),
    queryFn: () => apiService.getTotalClients(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get service statistics (revenue and clients)
export const useServiceStats = () => {
  return useQuery({
    queryKey: serviceKeys.stats(),
    queryFn: () => apiService.getServiceStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update service status mutation
export const useUpdateServiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      apiService.updateService(id, { status }),
    onSuccess: (response, { id }) => {
      if (response.success) {
        toast.success('Service status updated successfully!');
        queryClient.invalidateQueries({ queryKey: serviceKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
        queryClient.invalidateQueries({ queryKey: serviceKeys.stats() });
      } else {
        toast.error(response.message || 'Failed to update service status');
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to update service status:', error);
      toast.error((error as Record<string, unknown>)?.message as string || 'Failed to update service status');
    },
  });
};

// Get active subscription count
export const useActiveSubscriptionCount = () => {
  return useQuery({
    queryKey: ['active-subscription-count'],
    queryFn: () => apiService.getActiveSubscriptionCount(),
    staleTime: 5 * 60 * 1000,
  });
};

// Get total subscription revenue
export const useTotalSubscriptionRevenue = () => {
  return useQuery({
    queryKey: ['total-subscription-revenue'],
    queryFn: () => apiService.getTotalSubscriptionRevenue(),
    staleTime: 5 * 60 * 1000,
  });
};

// Utility functions for service data
export const getBillingCycleDisplay = (billingCycle: number): string => {
  switch (billingCycle) {
    case 1: return 'Monthly';
    case 2: return 'Quarterly';
    case 3: return 'SemiAnnually';
    case 4: return 'Annually';
    case 5: return 'OneTime';
    default: return 'Unknown';
  }
};

export const getServiceStatusDisplay = (status: number): string => {
  switch (status) {
    case 1: return 'Active';
    case 2: return 'Inactive';
    case 3: return 'Discontinued';
    case 4: return 'Pending';
    case 5: return 'Draft';
    default: return 'Unknown';
  }
};

export const getServiceStatusColor = (status: number): string => {
  switch (status) {
    case 1: return 'bg-green-100 text-green-800 border-green-200';
    case 2: return 'bg-gray-100 text-gray-800 border-gray-200';
    case 3: return 'bg-red-100 text-red-800 border-red-200';
    case 4: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 5: return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getCategoryColor = (category?: string | null): string => {
  if (!category) return 'bg-gray-100 text-gray-800 border-gray-200';
  
  switch (category.toLowerCase()) {
    case 'web hosting': return 'bg-green-100 text-green-800 border-green-200';
    case 'software licenses': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'consulting services': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'cloud services': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'support services': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'training': return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'custom development': return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'data storage': return 'bg-red-100 text-red-800 border-red-200';
    case 'api services': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'email hosting': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'other': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Predefined service categories
export const SERVICE_CATEGORIES = [
  'Web Hosting',
  'Software Licenses',
  'Consulting Services',
  'Cloud Services',
  'Maintenance',
  'Support Services',
  'Training',
  'Custom Development',
  'Data Storage',
  'API Services',
  'Email Hosting',
  'Other'
];

// Predefined billing cycles
export const BILLING_CYCLES = [
  { value: 1, name: 'Monthly' },
  { value: 2, name: 'Quarterly' },
  { value: 3, name: 'SemiAnnually' },
  { value: 4, name: 'Annually' },
  { value: 5, name: 'OneTime' }
];

// Predefined service statuses
export const SERVICE_STATUSES = [
  { value: 1, name: 'Active' },
  { value: 2, name: 'Inactive' },
  { value: 3, name: 'Discontinued' },
  { value: 4, name: 'Pending' },
  { value: 5, name: 'Draft' }
]; 