import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters: any) => [...invoiceKeys.lists(), filters] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...invoiceKeys.details(), id] as const,
};

export function useInvoices(filters: any = {}) {
  return useQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: () => apiService.getInvoices(filters),
  });
}

export function useInvoice(id: string | number, options: any = {}) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => apiService.getInvoiceById(id),
    ...options,
  });
}

export function useSendInvoiceEmail() {
  return useMutation({
    mutationFn: (id: string | number) => apiService.sendInvoiceEmail(id),
    onSuccess: () => {
      toast.success('Invoice email sent successfully');
    },
    onError: () => {
      toast.error('Failed to send invoice email');
    },
  });
}

export function useDownloadInvoicePdf() {
  return useMutation({
    mutationFn: async (id: string | number) => {
      const blob = await apiService.downloadInvoicePdf(id);
      // Download the PDF in browser
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return blob;
    },
    onSuccess: () => {
      toast.success('Invoice PDF downloaded');
    },
    onError: () => {
      toast.error('Failed to download invoice PDF');
    },
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();
  // Map human-friendly status to enum value
  const statusMap: Record<string, number> = {
    Draft: 1,
    Sent: 2,
    Paid: 3,
    Overdue: 4,
    Cancelled: 5,
  };
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string | number; status: string | number; reason?: string }) => {
      let statusValue = status;
      if (typeof status === 'string' && statusMap[status]) {
        statusValue = statusMap[status];
      }
      return apiService.updateInvoiceStatus(id, statusValue, reason);
    },
    onSuccess: (response, variables) => {
      toast.success('Invoice status updated');
      // Update the detail cache
      queryClient.setQueryData(
        invoiceKeys.detail(variables.id),
        (old: any) => ({
          ...old,
          data: response.data,
        })
      );
      // Invalidate all invoice list queries (with any filters)
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
    onError: () => {
      toast.error('Failed to update invoice status');
    },
  });
} 