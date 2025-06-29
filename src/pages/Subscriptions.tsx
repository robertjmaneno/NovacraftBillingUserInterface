
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Calendar,
  DollarSign,
  Users,
  Pause,
  Play,
  Settings,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const subscriptions = [
  {
    id: 'SUB-001',
    client: 'Acme Corp',
    plan: 'Professional',
    amount: 299,
    currency: 'USD',
    interval: 'monthly',
    status: 'Active',
    nextBilling: '2024-02-15',
    startDate: '2023-02-15',
    progress: 75
  },
  {
    id: 'SUB-002',
    client: 'Tech Solutions',
    plan: 'Enterprise',
    amount: 999,
    currency: 'USD',
    interval: 'monthly',
    status: 'Active',
    nextBilling: '2024-02-20',
    startDate: '2023-08-20',
    progress: 60
  },
  {
    id: 'SUB-003',
    client: 'StartupXYZ',
    plan: 'Basic',
    amount: 99,
    currency: 'USD',
    interval: 'monthly',
    status: 'Paused',
    nextBilling: '2024-03-01',
    startDate: '2023-12-01',
    progress: 25
  },
  {
    id: 'SUB-004',
    client: 'Digital Agency',
    plan: 'Professional',
    amount: 2999,
    currency: 'USD',
    interval: 'annually',
    status: 'Active',
    nextBilling: '2024-12-10',
    startDate: '2023-12-10',
    progress: 15
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-200';
    case 'Paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPlanColor = (plan: string) => {
  switch (plan) {
    case 'Basic': return 'bg-blue-100 text-blue-800';
    case 'Professional': return 'bg-purple-100 text-purple-800';
    case 'Enterprise': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const Subscriptions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscription.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMRR = subscriptions
    .filter(sub => sub.status === 'Active')
    .reduce((sum, sub) => sum + (sub.interval === 'monthly' ? sub.amount : sub.amount / 12), 0);

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600 mt-1">Manage recurring billing and subscriptions</p>
        </div>
        <Link to="/subscriptions/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Subscription
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalMRR.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
                <p className="text-sm text-blue-600">+2 new this month</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Revenue Per User</p>
                <p className="text-2xl font-bold text-gray-900">${Math.round(totalMRR / activeSubscriptions)}</p>
                <p className="text-sm text-purple-600">+5.3% from last month</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search subscriptions..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscription</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-semibold text-gray-900">{subscription.id}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Started {subscription.startDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">{subscription.client}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanColor(subscription.plan)}>
                      {subscription.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-semibold text-gray-900">
                        ${subscription.amount}
                      </span>
                      <span className="text-sm text-gray-600">
                        /{subscription.interval}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900">{subscription.nextBilling}</span>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{subscription.progress}%</span>
                      </div>
                      <Progress value={subscription.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      {subscription.status === 'Active' ? (
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
