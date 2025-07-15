
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Trash2,
  Eye,
  Send,
  MoreVertical,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInvoices, useSendInvoiceEmail, useDownloadInvoicePdf, useUpdateInvoiceStatus, useInvoice } from '@/hooks/use-invoices';
import { TableShimmer } from '@/components/ui/shimmer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const statusNameMap: Record<number, string> = {
  1: 'Draft',
  2: 'Sent',
  3: 'Paid',
  4: 'Overdue',
  5: 'Cancelled',
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
    case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    case 'Sent': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const Invoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewedInvoiceId, setViewedInvoiceId] = useState<string | null>(null);
  const [statusDialog, setStatusDialog] = useState<{ open: boolean; id: string | null; status: string }>({ open: false, id: null, status: '' });
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useInvoices({
    search: searchTerm,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page,
    pageSize: 10,
  });
  const invoices = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;
  const totalCount = data?.data?.totalCount || 0;

  const sendEmailMutation = useSendInvoiceEmail();
  const downloadPdfMutation = useDownloadInvoicePdf();
  const updateStatusMutation = useUpdateInvoiceStatus();

  // View invoice details
  const { data: invoiceDetailsRaw, isLoading: isInvoiceLoading } = useInvoice(viewedInvoiceId!, { enabled: !!viewedInvoiceId });
  const invoiceDetails: any = (invoiceDetailsRaw as any)?.data;

  if (isLoading) {
    return <TableShimmer rows={5} columns={7} />;
  }
  if (isError) {
    return <div className="p-8 text-center text-red-500">Failed to load invoices.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
        </div>
        <Link to="/invoices/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </Link>
      </div>
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search invoices or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Invoice</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Client</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-semibold text-blue-600">{invoice.invoiceNumber || invoice.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">{invoice.customerName || '-'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{invoice.total !== undefined ? `${Number(invoice.total).toLocaleString()} ${invoice.currency || 'MWK'}` : '-'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(invoice.statusName || statusNameMap[invoice.status])}>
                        {invoice.statusName || statusNameMap[invoice.status] || '-'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : '-'}</td>
                    <td className="py-4 px-4 text-gray-600">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewedInvoiceId(invoice.id)}>View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadPdfMutation.mutate(invoice.id)} disabled={downloadPdfMutation.isPending}>Download PDF</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => sendEmailMutation.mutate(invoice.id)} disabled={sendEmailMutation.isPending}>Send Email</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusDialog({ open: true, id: invoice.id, status: '' })}>Update Status</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         {/* Pagination Controls */}
         <div className="flex items-center justify-between mt-4">
           <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
           <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
           <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
         </div>
        </CardContent>
      </Card>
      {/* Invoice Details Modal */}
      <Dialog open={!!viewedInvoiceId} onOpenChange={open => !open && setViewedInvoiceId(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {isInvoiceLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : invoiceDetails ? (
            (() => {
              const inv = invoiceDetails;
              return (
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{inv.invoiceNumber || inv.id}</h2>
                      <div className="flex items-center gap-3 mb-4">
                        <Badge>{inv.statusName || statusNameMap[inv.status] || '-'}</Badge>
                      </div>
                    </div>
                  </div>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Client</h3>
                          <p className="text-gray-600 leading-relaxed">{inv.customerName || '-'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <h3 className="font-medium text-gray-900">Amount</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold text-gray-900">{inv.subtotal !== undefined ? `${Number(inv.subtotal).toLocaleString()} ${inv.currency || 'MWK'}` : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-semibold text-gray-900">{inv.discountAmount !== undefined ? `${Number(inv.discountAmount).toLocaleString()} ${inv.currency || 'MWK'}` : '-'} ({inv.discountPercent || 0}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-semibold text-gray-900">{inv.taxAmount !== undefined ? `${Number(inv.taxAmount).toLocaleString()} ${inv.currency || 'MWK'}` : '-'} ({inv.taxPercent || 0}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold text-gray-900">{inv.total !== undefined ? `${Number(inv.total).toLocaleString()} ${inv.currency || 'MWK'}` : '-'}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <h3 className="font-medium text-gray-900">Dates</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Invoice Date:</span>
                          <span className="font-semibold text-gray-900">{inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-semibold text-gray-900">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '-'}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Settings className="w-5 h-5 text-gray-600" />
                          <h3 className="font-medium text-gray-900">Status</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-semibold text-gray-900">{inv.statusName || statusNameMap[inv.status] || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created By:</span>
                          <span className="font-semibold text-gray-900">{inv.createdBy || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created At:</span>
                          <span className="font-semibold text-gray-900">{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '-'}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <h3 className="font-medium text-gray-900">Notes & Terms</h3>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Notes:</span>
                          <span className="font-semibold text-gray-900">{inv.notes || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Terms & Conditions:</span>
                          <span className="font-semibold text-gray-900">{inv.termsAndConditions || '-'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <h3 className="font-medium text-gray-900">Items</h3>
                      </div>
                      <ul className="list-disc ml-6">
                        {Array.isArray(inv.items) && inv.items.length > 0
                          ? inv.items.map((item: any, idx: number) => (
                              <li key={idx} className="mb-2">
                                <div><b>Name:</b> {item.description || '-'}</div>
                                <div><b>Quantity:</b> {item.quantity ?? '-'}</div>
                                <div><b>Rate:</b> {item.rate !== undefined ? `${Number(item.rate).toLocaleString()} ${inv.currency || 'MWK'}` : '-'}</div>
                                <div><b>Amount:</b> {item.amount !== undefined ? `${Number(item.amount).toLocaleString()} ${inv.currency || 'MWK'}` : '-'}</div>
                              </li>
                            ))
                          : <li>-</li>}
                      </ul>
                    </CardContent>
                  </Card>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setViewedInvoiceId(null)}>Close</Button>
                  </div>
                </div>
              );
            })()
          ) : null}
        </DialogContent>
      </Dialog>
      {/* Update Status Dialog */}
      <Dialog open={statusDialog.open} onOpenChange={open => !open && setStatusDialog({ open: false, id: null, status: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Invoice Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={statusDialog.status} onValueChange={v => setStatusDialog(s => ({ ...s, status: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusDialog({ open: false, id: null, status: '' })}>Cancel</Button>
              <Button
                onClick={() => {
                  if (statusDialog.id && statusDialog.status) {
                    updateStatusMutation.mutate({ id: statusDialog.id, status: statusDialog.status });
                    setStatusDialog({ open: false, id: null, status: '' });
                  }
                }}
                disabled={!statusDialog.status || updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
