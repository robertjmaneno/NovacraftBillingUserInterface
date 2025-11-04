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
  CheckCircle,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardShimmer } from '@/components/ui/shimmer';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/use-dashboard';

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

  // Fetch dashboard data - backend handles role-based permissions and returns appropriate data
  const { data: dashboardData, isLoading, error } = useDashboard();

  // Debug logging to help troubleshoot
  if (process.env.NODE_ENV === 'development') {
    console.log('Dashboard Debug Info:');
    console.log('- User:', user);
    console.log('- Loading:', isLoading);
    console.log('- Error:', error);
    console.log('- Dashboard Data:', dashboardData);
  }

  if (isLoading) {
    return <DashboardShimmer />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 mb-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Unable to load dashboard data</h3>
          </div>
          <p className="text-red-700 mb-4">
            {error.message || 'Please try again later.'}
          </p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Extract data from backend response
  const data = dashboardData?.data;

  // Debug what we got from backend
  if (process.env.NODE_ENV === 'development') {
    console.log('Dashboard Data Extracted:', data);
  }

  // Create stats array from API data
  const stats = data ? [
    {
      label: 'Total Revenue',
      value: `MWK ${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Total Customers',
      value: data.totalCustomers.toString(),
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Invoices',
      value: data.totalInvoices.toString(),
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Active Subscriptions',
      value: data.activeSubscriptions.toString(),
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Outstanding Amount',
      value: `MWK ${data.outstandingAmount.toLocaleString()}`,
      icon: AlertCircle,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Overdue Invoices',
      value: data.overdueInvoices.toString(),
      icon: TrendingUp,
      color: 'bg-red-50 text-red-600',
    },
  ] : [];

  // Default actions for quick navigation
  const defaultActions = [
    {
      label: 'Create Invoice',
      description: 'Create a new invoice',
      link: '/invoices/create',
      icon: Plus,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'View Customers',
      description: 'Manage your customers',
      link: '/customers',
      icon: Users,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'View Subscriptions',
      description: 'Check subscriptions',
      link: '/subscriptions',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'View Reports',
      description: 'Generate reports',
      link: '/reports',
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
    },
  ];


  const displayName = user?.firstName || user?.fullName || 'User';

  return (
    <div className="space-y-8">      
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-700">
            Welcome back, {displayName}! Here's your dashboard.
          </p>
        </div>
      </div>

      {/* Stats Grid - Always show */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
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
            {data?.recentInvoices && data.recentInvoices.length > 0 ? (
              <div className="space-y-2">
                {data.recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">{invoice.invoiceNumber}</span>
                          <Badge className={`${getStatusColor(invoice.status)} text-xs flex items-center space-x-1`}>
                            {getStatusIcon(invoice.status)}
                            <span>{invoice.status}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{invoice.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-gray-900">
                        MWK {invoice.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No recent invoices</p>
                <p className="text-sm text-gray-400 mt-1">Your invoices will appear here</p>
                <Link to="/invoices/create">
                  <Button className="mt-4" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border">
          <CardHeader className="pb-3">
            <div>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <p className="text-xs text-gray-600 mt-1">Common tasks and navigation</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1">
              {defaultActions.map((action, index) => (
                <Link key={index} to={action.link} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{action.label}</p>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};