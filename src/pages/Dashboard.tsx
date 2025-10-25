import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp,
  Calendar,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardShimmer } from '@/components/ui/shimmer';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

// Helper function to get customer display name (same as in Subscriptions)
const getCustomerDisplayName = (customer: Record<string, unknown>) => {
  if (!customer) return 'Unknown Customer';
  
  // For business customers (customerType === 1), show organization name
  if (customer.customerType === 1 && customer.organizationName && (customer.organizationName as string).trim()) {
    return customer.organizationName as string;
  }
  
  // For individual customers (customerType === 0), show first name + last name
  if (customer.customerType === 0) {
    const firstName = (customer.firstName as string)?.trim() || '';
    const lastName = (customer.lastName as string)?.trim() || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
  }
  
  // Fallback: show email if available
  if (customer.email && (customer.email as string).trim()) {
    return customer.email as string;
  }
  
  // Final fallback: show phone number
  if (customer.phoneNumber && (customer.phoneNumber as string).trim()) {
    return customer.phoneNumber as string;
  }
  
  return 'Unknown Customer';
};

// Invoice status mapping (same as in Invoices.tsx)
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
    case 'Sent': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
    case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid': return <CheckCircle className="w-3 h-3" />;
    case 'Sent': return <FileText className="w-3 h-3" />;
    case 'Pending': return <Clock className="w-3 h-3" />;
    case 'Overdue': return <AlertCircle className="w-3 h-3" />;
    case 'Draft': return <FileText className="w-3 h-3" />;
    case 'Cancelled': return <AlertCircle className="w-3 h-3" />;
    default: return <FileText className="w-3 h-3" />;
  }
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch payment stats
  const { data: paymentStats, isLoading: paymentStatsLoading, error: paymentStatsError } = useQuery({
    queryKey: ['payment-stats'],
    queryFn: () => apiService.getPaymentStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch total subscription revenue
  const { data: subscriptionRevenue, isLoading: subscriptionRevenueLoading, error: subscriptionRevenueError } = useQuery({
    queryKey: ['subscription-revenue'],
    queryFn: () => apiService.getTotalSubscriptionRevenue(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch customers count
  const { data: customersData, isLoading: customersLoading, error: customersError } = useQuery({
    queryKey: ['customers-count'],
    queryFn: () => apiService.getCustomers({ pageSize: 1 }), // Just get count
    staleTime: 5 * 60 * 1000,
  });

  // Fetch invoices count and recent invoices
  const { data: invoicesData, isLoading: invoicesLoading, error: invoicesError } = useQuery({
    queryKey: ['invoices-data'],
    queryFn: () => apiService.getInvoices({ pageSize: 5 }), // Get latest 5 invoices
    staleTime: 5 * 60 * 1000,
  });

  // Fetch outstanding amount from reports endpoint
  const { data: outstandingAmountData, isLoading: outstandingAmountLoading, error: outstandingAmountError } = useQuery({
    queryKey: ['report-outstanding-amount'],
    queryFn: () => apiService.getReportOutstandingAmount(),
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry 403 errors
  });

  const isLoading = paymentStatsLoading || subscriptionRevenueLoading || customersLoading || invoicesLoading || outstandingAmountLoading;
  
  // Only treat it as a critical error if it's not a permission issue
  const isCriticalError = (error: unknown) => {
    return error && !(error instanceof Error && error.message.includes('403'));
  };
  
  const criticalError = isCriticalError(paymentStatsError) || 
                       isCriticalError(subscriptionRevenueError) || 
                       isCriticalError(customersError) || 
                       isCriticalError(invoicesError);

  if (isLoading) {
    return <DashboardShimmer />;
  }

  if (criticalError) {
    return (
      <div className="p-8 text-center text-red-500">
        Unable to load dashboard data. Please try again later.<br />
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Calculate stats from API data
  const totalRevenue = (paymentStats?.data?.totalPayments || 0) + (subscriptionRevenue?.data || 0);
  const totalCustomers = (customersData?.data as Record<string, unknown>)?.totalCount as number || 0;
  const totalInvoices = (invoicesData?.data as Record<string, unknown>)?.totalCount as number || 0;
  const recentInvoices = (invoicesData?.data as Record<string, unknown>)?.items as unknown[] || [];

  const stats = [
    {
      title: 'Total Revenue',
      value: `${Number(totalRevenue).toLocaleString()} MWK`,
      change: '+0%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600 bg-green-50',
      trend: 'up' as const,
    },
    {
      title: 'Outstanding Payments',
      value: `${Number(outstandingAmountData?.data || 0).toLocaleString()} MWK`,
      change: '+0%',
      changeType: 'negative' as const,
      icon: AlertCircle,
      color: 'text-orange-600 bg-orange-50',
      trend: 'down' as const,
    },
    {
      title: 'Total Invoices',
      value: totalInvoices.toString(),
      change: '+0%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
      trend: 'up' as const,
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      change: '+0%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-purple-600 bg-purple-50',
      trend: 'up' as const,
    },
  ];

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.fullName) {
      return user.fullName;
    } else {
      return 'User';
    }
  };

  const displayName = getUserDisplayName();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
     
          <p className="text-lg font-semibold text-gray-700">Welcome back, {displayName}! Here's what's happening with your business.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/invoices/create">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center space-x-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span className="text-xs font-semibold">{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">from last month</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Recent Invoices */}
        <Card className="lg:col-span-2 border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Invoices</CardTitle>
                <p className="text-xs text-gray-600 mt-1">Latest invoice activity</p>
              </div>
              <Link to="/invoices">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice: Record<string, unknown>) => (
                  <div key={invoice.id as string} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">{(invoice.invoiceNumber as string) || `INV-${invoice.id}`}</span>
                          <Badge className={`${getStatusColor(statusNameMap[invoice.status as keyof typeof statusNameMap] || 'Unknown')} text-xs flex items-center space-x-1`}>
                            {getStatusIcon(statusNameMap[invoice.status as keyof typeof statusNameMap] || 'Unknown')}
                            <span>{statusNameMap[invoice.status as keyof typeof statusNameMap] || 'Unknown'}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{getCustomerDisplayName(invoice.customer as Record<string, unknown>)}</p>
                        <p className="text-xs text-gray-500">{invoice.createdAt ? new Date(invoice.createdAt as string).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{invoice.amount ? `${Number(invoice.amount).toLocaleString()} MWK` : '-'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No invoices found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <p className="text-xs text-gray-600">Common tasks</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/invoices/create">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium">Create Invoice</span>
                </Button>
              </Link>
              <Link to="/customers">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs font-medium">Add Client</span>
                </Button>
              </Link>
              <Link to="/subscriptions/create">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium">New Subscription</span>
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium">Manage Services</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
