
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Download, 
  Eye,
  CreditCard,
  DollarSign,
  TrendingUp,
  X,
  Calendar
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TableShimmer } from '@/components/ui/shimmer';
import { apiService, Payment as ApiPayment, PaymentStats } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export const Payments: React.FC = () => {
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewedPayment, setViewedPayment] = useState<ApiPayment | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Add outstanding amount query
  const { data: outstandingAmountData } = useQuery({
    queryKey: ['report-outstanding-amount'],
    queryFn: () => apiService.getReportOutstandingAmount(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      apiService.getAllPayments(),
      apiService.getPaymentStats()
    ])
      .then(([paymentsRes, statsRes]) => {
        setPayments(paymentsRes.data || []);
        setStats(statsRes.data || null);
        // Set pagination info if available
        if (paymentsRes.data && Array.isArray(paymentsRes.data)) {
          setTotalCount(paymentsRes.data.length);
          setTotalPages(Math.ceil(paymentsRes.data.length / pageSize));
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load payments');
      })
      .finally(() => setLoading(false));
  }, [pageSize]);

  // Reset page when search term changes
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const filteredPayments = payments.filter(payment =>
    payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply pagination to filtered results
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);
  const totalFilteredCount = filteredPayments.length;
  const totalFilteredPages = Math.ceil(totalFilteredCount / pageSize);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      Completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      Pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      Failed: { color: 'bg-red-100 text-red-800', text: 'Failed' }
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank':
        return <DollarSign className="w-4 h-4" />;
      case 'check':
        return <TrendingUp className="w-4 h-4" />;
      case 'mpamba':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  // Fetch payment details for modal (by ID)
  const handleViewPayment = async (paymentId: number) => {
    setModalLoading(true);
    try {
      const res = await apiService.getPaymentById(paymentId);
      setViewedPayment(res.data);
    } catch (err: any) {
      setViewedPayment(null);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
        
        <TableShimmer rows={10} columns={8} />
      </div>
    );
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Track and manage your payment transactions</p>
        </div>
        {/* Removed Record Payment button */}
      </div>
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold">{stats ? `${stats.totalPayments.toLocaleString()} MKW` : '-'}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats ? stats.completed : '-'}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold">{outstandingAmountData ? `MKW${outstandingAmountData.data.toLocaleString()}` : '-'}</p>
              </div>
              <CreditCard className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments ({totalFilteredCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.paymentId} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{'PAY-' + payment.paymentId}</TableCell>
                  <TableCell>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {payment.invoiceNumber}
                    </span>
                  </TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell className="font-semibold">
                    {payment.amount.toLocaleString()} MKW
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(payment.method)}
                      <span className="capitalize">{payment.method}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell>{new Date(payment.date).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleViewPayment(payment.paymentId)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
                            </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalFilteredPages} ({totalFilteredCount} total payments)
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(totalFilteredPages, p + 1))} 
                  disabled={page === totalFilteredPages}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
      {/* Payment Details Modal - styled like Service/Invoice modals */}
      <Dialog open={!!viewedPayment} onOpenChange={open => !open && setViewedPayment(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">Payment Details</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setViewedPayment(null)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {modalLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : viewedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <h3 className="font-medium text-gray-900">Amount</h3>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{viewedPayment.amount.toLocaleString()} MKW</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-gray-900">Method</h3>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{viewedPayment.method}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-gray-200 text-gray-800"><Eye className="w-4 h-4 mr-1" />Status</Badge>
                    </div>
                    <div className="text-lg font-semibold">{getStatusBadge(viewedPayment.status)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <h3 className="font-medium text-gray-900">Date</h3>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{new Date(viewedPayment.date).toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-600">Payment ID</div>
                      <div className="font-semibold text-gray-900">{'PAY-' + viewedPayment.paymentId}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Invoice Number</div>
                      <div className="font-semibold text-gray-900">{viewedPayment.invoiceNumber}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Customer Name</div>
                      <div className="font-semibold text-gray-900">{viewedPayment.customerName}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
