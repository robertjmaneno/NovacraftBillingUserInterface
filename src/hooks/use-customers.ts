import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Customer, CreateCustomerWithDocumentsRequest, UpdateCustomerRequest, CustomerSearchParams, AddCustomerAddressRequest, AddCustomerDocumentRequest } from '@/services/api';
import { toast } from 'sonner';

// Hook to get customers with search and filtering
export const useCustomers = (params: CustomerSearchParams = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => apiService.getCustomers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get a single customer by ID
export const useCustomer = (id: number, p0: { enabled: boolean; }) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => apiService.getCustomerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to create a new customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerWithDocumentsRequest) => apiService.createCustomer(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Customer created successfully!');
        // Invalidate and refetch customers list
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      } else {
        toast.error(response.message || 'Failed to create customer');
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to create customer:', error);
      toast.error((error as Record<string, unknown>)?.message as string || 'Failed to create customer');
    },
  });
};

// Hook to update an existing customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCustomerRequest }) =>
      apiService.updateCustomer(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Customer updated successfully!');
        // Invalidate and refetch customers list and specific customer
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
      } else {
        toast.error(response.message || 'Failed to update customer');
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to update customer:', error);
      toast.error((error as Record<string, unknown>)?.message as string || 'Failed to update customer');
    },
  });
};

// Hook to delete a customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteCustomer(id),
    onSuccess: (response, deletedId) => {
      if (response.success) {
        toast.success('Customer deleted successfully!');
        // Invalidate and refetch customers list
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        // Remove the specific customer from cache
        queryClient.removeQueries({ queryKey: ['customer', deletedId] });
      } else {
        toast.error(response.message || 'Failed to delete customer');
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to delete customer:', error);
      toast.error((error as Record<string, unknown>)?.message as string || 'Failed to delete customer');
    },
  });
};

// Utility function to get customer type display name
export const getCustomerTypeDisplay = (customerType: number): string => {
  return customerType === 1 ? 'Business' : 'Individual';
};

// Utility function to get customer status display name
export const getCustomerStatusDisplay = (status: number): string => {
  return status === 1 ? 'Active' : 'Inactive';
};

// Utility function to get customer status color
export const getCustomerStatusColor = (status: number): string => {
  return status === 1 
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';
};

// Utility function to get customer type color
export const getCustomerTypeColor = (customerType: number): string => {
  return customerType === 1 
    ? 'bg-blue-100 text-blue-800 border-blue-200'
    : 'bg-purple-100 text-purple-800 border-purple-200';
};

// Customer Address Management Hooks
export const useAddCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: number; data: AddCustomerAddressRequest }) =>
      apiService.addCustomerAddress(customerId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Address added successfully!');
        queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      } else {
        toast.error(response.message || 'Failed to add address');
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to add address:', error);
      toast.error((error as Record<string, unknown>)?.message as string || 'Failed to add address');
    },
  });
};

// Customer Document Management Hooks
export const useAddCustomerDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: number; data: AddCustomerDocumentRequest }) =>
      apiService.addCustomerDocument(customerId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Document added successfully!');
        queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      } else {
        toast.error(response.message || 'Failed to add document');
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to add document:', error);
      toast.error((error as Record<string, unknown>)?.message as string || 'Failed to add document');
    },
  });
};

export const useAddMultipleCustomerDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, files, documentType, description }: { 
      customerId: number; 
      files: File[]; 
      documentType: string; 
      description?: string;
    }) => apiService.addMultipleCustomerDocuments(customerId, files, documentType, description),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success(`${variables.files.length} documents added successfully!`);
        queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      } else {
        toast.error(response.message || 'Failed to add documents');
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to add documents:', error);
      toast.error((error as Record<string, unknown>)?.message as string || 'Failed to add documents');
    },
  });
}; 