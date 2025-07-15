
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  FileText,
  Users,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const months = timeRange === '1month' ? 1 : timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : timeRange === '1year' ? 12 : 6;

  // Queries
  const {
    data: totalRevenueData,
    isLoading: isLoadingTotalRevenue,
    error: errorTotalRevenue
  } = useQuery({ queryKey: ['report-total-revenue'], queryFn: () => apiService.getReportTotalRevenue() });

  // Use the same endpoint as Dashboard for total customers
  const {
    data: customersData,
    isLoading: isLoadingCustomers,
    error: errorCustomers
  } = useQuery({ queryKey: ['customers-count'], queryFn: () => apiService.getCustomers({ pageSize: 1 }) });

  const {
    data: outstandingAmountData,
    isLoading: isLoadingOutstandingAmount,
    error: errorOutstandingAmount
  } = useQuery({ queryKey: ['report-outstanding-amount'], queryFn: () => apiService.getReportOutstandingAmount() });

  const {
    data: topClientsData,
    isLoading: isLoadingTopClients,
    error: errorTopClients
  } = useQuery({ queryKey: ['report-top-clients', 5], queryFn: () => apiService.getReportTopClients(5) });

  const {
    data: invoiceStatusData,
    isLoading: isLoadingInvoiceStatus,
    error: errorInvoiceStatus
  } = useQuery({ queryKey: ['report-invoice-status-distribution'], queryFn: () => apiService.getReportInvoiceStatusDistribution() });

  const {
    data: invoiceVolumeTrendData,
    isLoading: isLoadingInvoiceVolumeTrend,
    error: errorInvoiceVolumeTrend
  } = useQuery({ queryKey: ['report-invoice-volume-trend', months], queryFn: () => apiService.getReportInvoiceVolumeTrend(months) });

  const {
    data: monthlyRevenueTrendData,
    isLoading: isLoadingMonthlyRevenueTrend,
    error: errorMonthlyRevenueTrend
  } = useQuery({ queryKey: ['report-monthly-revenue-trend', months], queryFn: () => apiService.getReportMonthlyRevenueTrend(months) });

  // Add getReportTotalInvoices to apiService if not present
  // Use: apiService.getReportTotalInvoices()
  const {
    data: totalInvoicesData,
    isLoading: isLoadingTotalInvoices,
    error: errorTotalInvoices
  } = useQuery({ queryKey: ['report-total-invoices'], queryFn: () => apiService.getReportTotalInvoices() });

  // Error handling (permission)
  const isForbidden = (...errs: any[]) => errs.some(e => (e && (e.status === 403 || (e.response && e.response.status === 403))));
  if (
    isForbidden(errorTotalRevenue, errorCustomers, errorOutstandingAmount, errorTopClients, errorInvoiceStatus, errorInvoiceVolumeTrend, errorMonthlyRevenueTrend)
  ) {
    return <div className="text-red-600 text-center mt-10">You do not have permission to view reports.</div>;
  }

  // Loading state
  const isLoading =
    isLoadingTotalRevenue ||
    isLoadingCustomers ||
    isLoadingOutstandingAmount ||
    isLoadingTopClients ||
    isLoadingInvoiceStatus ||
    isLoadingInvoiceVolumeTrend ||
    isLoadingMonthlyRevenueTrend;

  // Helper for error display
  const renderError = (error: any, fallback: string) => (
    <div className="text-red-500 text-sm text-center py-2">{error?.message || fallback}</div>
  );

  // Data
  const totalRevenue = totalRevenueData?.data ?? 0;
  const totalInvoices = totalInvoicesData?.data ?? 0;
  const totalOutstanding = outstandingAmountData?.data ?? 0;
  // Map statusData to expected structure
  const statusColorMap: Record<string, string> = {
    Paid: '#10B981',
    Sent: '#F59E0B',
    Overdue: '#EF4444',
    Draft: '#6B7280',
    Cancelled: '#EF4444',
    Pending: '#F59E0B',
  };
  let statusData = (invoiceStatusData?.data ?? []).map((item: any) => ({
    name: item.status,
    value: Math.round(item.percentage), // Show as whole number
    color: statusColorMap[item.status] || '#6B7280',
    amount: item.totalAmount,
  }));
  // Sort by percentage descending
  statusData = statusData.sort((a, b) => b.value - a.value);
  // Map topClients to expected structure
  const topClients = (topClientsData?.data ?? []).map((item: any) => ({
    name: item.customerName,
    invoices: item.invoiceCount,
    revenue: item.totalRevenue,
    growth: (item.revenueGrowthPercent >= 0 ? '+' : '') + item.revenueGrowthPercent + '%',
  }));
  const invoiceVolumeTrend = invoiceVolumeTrendData?.data ?? [];
  const monthlyRevenue = (monthlyRevenueTrendData?.data ?? []).map((item: any, idx: number) => ({
    month: item.month,
    revenue: item.revenue,
    invoices: invoiceVolumeTrend[idx]?.invoiceCount ?? 0,
    expenses: 0 // No expenses in API, keep as 0
  }));

  console.log('apiService:', apiService);

  // Debug logs for queries
  const debugLog = (label, data, error) => {
    console.log(`[DEBUG] ${label} data:`, data);
    if (error) console.error(`[DEBUG] ${label} error:`, error);
  };

  debugLog('Total Revenue', totalRevenueData, errorTotalRevenue);
  debugLog('Total Invoices', totalInvoicesData, errorTotalInvoices);
  debugLog('Outstanding Amount', outstandingAmountData, errorOutstandingAmount);

  const totalCustomers = customersData?.data?.totalCount || 0;

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-lg text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48 h-12">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="h-12">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Revenue</p>
                {isLoadingTotalRevenue ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                ) : errorTotalRevenue ? (
                  renderError(errorTotalRevenue, 'Failed to load total revenue')
                ) : (
                  <p className="text-2xl font-bold text-gray-900">MKW{totalRevenue.toLocaleString()}</p>
                )}
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowUpRight className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">+18.5% vs last period</p>
                </div>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Invoices</p>
                {isLoadingTotalInvoices ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : errorTotalInvoices ? (
                  renderError(errorTotalInvoices, 'Failed to load total invoices')
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
                )}
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowUpRight className="w-3 h-3 text-blue-600" />
                  <p className="text-xs text-blue-600">+12.3% vs last period</p>
                </div>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Outstanding Amount</p>
                {isLoadingOutstandingAmount ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                ) : errorOutstandingAmount ? (
                  renderError(errorOutstandingAmount, 'Failed to load outstanding amount')
                ) : (
                  <p className="text-2xl font-bold text-gray-900">MKW{totalOutstanding.toLocaleString()}</p>
                )}
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowDownRight className="w-3 h-3 text-orange-600" />
                  <p className="text-xs text-orange-600">-5.2% vs last period</p>
                </div>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Active Clients</p>
                {isLoadingCustomers ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : errorCustomers ? (
                  renderError(errorCustomers, 'Failed to load active clients')
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
                )}
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowUpRight className="w-3 h-3 text-purple-600" />
                  <p className="text-xs text-purple-600">+8.9% vs last period</p>
                </div>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="revenue" className="text-sm">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="invoices" className="text-sm">Invoice Status</TabsTrigger>
          <TabsTrigger value="clients" className="text-sm">Client Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <BarChart3 className="w-4 h-4" />
                  <span>Monthly Revenue Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMonthlyRevenueTrend ? (
                  <div className="h-64 w-full bg-gray-100 animate-pulse rounded" />
                ) : errorMonthlyRevenueTrend ? (
                  renderError(errorMonthlyRevenueTrend, 'Failed to load monthly revenue trend')
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`MKW${value.toLocaleString()}`, 'Revenue']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <TrendingUp className="w-4 h-4" />
                  <span>Revenue vs Expenses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* This chart uses the same monthlyRevenue data, expenses are always 0 */}
                {isLoadingMonthlyRevenueTrend ? (
                  <div className="h-64 w-full bg-gray-100 animate-pulse rounded" />
                ) : errorMonthlyRevenueTrend ? (
                  renderError(errorMonthlyRevenueTrend, 'Failed to load revenue vs expenses')
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [`MKW${value.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Expenses']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Invoice Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingInvoiceStatus ? (
                  <div className="h-56 w-full bg-gray-100 animate-pulse rounded" />
                ) : errorInvoiceStatus ? (
                  renderError(errorInvoiceStatus, 'Failed to load invoice status distribution')
                ) : (
                  <>
                    <div className="h-56 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {statusData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs font-medium text-gray-900">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold text-gray-900">{item.value}%</span>
                            <p className="text-xs text-gray-600">MKW{item.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Invoice Volume Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingInvoiceVolumeTrend ? (
                  <div className="h-56 w-full bg-gray-100 animate-pulse rounded" />
                ) : errorInvoiceVolumeTrend ? (
                  renderError(errorInvoiceVolumeTrend, 'Failed to load invoice volume trend')
                ) : (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={invoiceVolumeTrend}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="invoiceCount" 
                          stroke="#10B981" 
                          strokeWidth={3}
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Top Clients by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTopClients ? (
                <div className="h-56 w-full bg-gray-100 animate-pulse rounded" />
              ) : errorTopClients ? (
                renderError(errorTopClients, 'Failed to load top clients')
              ) : (
                <div className="space-y-3">
                  {topClients.map((client, index) => (
                    <div key={client.name} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-600">{client.invoices} invoices</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-3">
                        <div>
                          <p className="font-semibold text-sm text-gray-900">MKW{typeof client.revenue === 'number' ? client.revenue.toLocaleString() : '0'}</p>
                          <p className="text-xs text-gray-600">{typeof client.revenue === 'number' && typeof client.invoices === 'number' && client.invoices > 0 ? `MKW${Math.round(client.revenue / client.invoices).toLocaleString()} avg` : 'N/A'}</p>
                        </div>
                        <Badge 
                          className={`${client.growth.startsWith('+') ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}
                        >
                          {client.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
