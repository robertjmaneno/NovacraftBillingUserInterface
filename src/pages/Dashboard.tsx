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

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'positive',
    icon: DollarSign,
    color: 'text-green-600 bg-green-50',
    trend: 'up',
  },
  {
    title: 'Outstanding',
    value: '$12,234.56',
    change: '-4.3%',
    changeType: 'negative',
    icon: AlertCircle,
    color: 'text-orange-600 bg-orange-50',
    trend: 'down',
  },
  {
    title: 'Total Invoices',
    value: '254',
    change: '+12.5%',
    changeType: 'positive',
    icon: FileText,
    color: 'text-blue-600 bg-blue-50',
    trend: 'up',
  },
  {
    title: 'Active Clients',
    value: '48',
    change: '+8.2%',
    changeType: 'positive',
    icon: Users,
    color: 'text-purple-600 bg-purple-50',
    trend: 'up',
  },
];

const recentInvoices = [
  { id: 'INV-001', client: 'Acme Corp', amount: '$2,500.00', status: 'Paid', date: '2024-01-15', priority: 'high' },
  { id: 'INV-002', client: 'Tech Solutions', amount: '$1,800.00', status: 'Pending', date: '2024-01-14', priority: 'medium' },
  { id: 'INV-003', client: 'Digital Agency', amount: '$3,200.00', status: 'Overdue', date: '2024-01-10', priority: 'high' },
  { id: 'INV-004', client: 'StartupXYZ', amount: '$950.00', status: 'Draft', date: '2024-01-12', priority: 'low' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
    case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid': return <CheckCircle className="w-3 h-3" />;
    case 'Pending': return <Clock className="w-3 h-3" />;
    case 'Overdue': return <AlertCircle className="w-3 h-3" />;
    default: return <FileText className="w-3 h-3" />;
  }
};

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/invoices/new">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center space-x-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="text-sm font-semibold">{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">from last month</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Recent Invoices */}
        <Card className="lg:col-span-2 border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Invoices</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Latest invoice activity</p>
              </div>
              <Link to="/invoices">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-semibold text-gray-900">{invoice.id}</span>
                        <Badge className={`${getStatusColor(invoice.status)} text-xs flex items-center space-x-1`}>
                          {getStatusIcon(invoice.status)}
                          <span>{invoice.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{invoice.client}</p>
                      <p className="text-xs text-gray-500">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">{invoice.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <p className="text-sm text-gray-600">Common tasks</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/invoices/new">
                <Button variant="outline" className="w-full h-24 flex-col hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Create Invoice</span>
                </Button>
              </Link>
              <Link to="/clients">
                <Button variant="outline" className="w-full h-24 flex-col hover:bg-green-50 hover:border-green-200 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Add Client</span>
                </Button>
              </Link>
              <Link to="/subscriptions/new">
                <Button variant="outline" className="w-full h-24 flex-col hover:bg-purple-50 hover:border-purple-200 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">New Subscription</span>
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="w-full h-24 flex-col hover:bg-orange-50 hover:border-orange-200 transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">Manage Services</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
