
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
  TrendingUp,
  MoreVertical,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscriptions, usePauseSubscription, useResumeSubscription, useCancelSubscription, useUpdateSubscription } from '@/hooks/use-subscriptions';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format, lastDayOfMonth } from 'date-fns';
import { TableShimmer, StatsCardShimmer } from '@/components/ui/shimmer';

const getStatusColor = (status: number) => {
  switch (status) {
    case 1: return 'bg-green-100 text-green-800 border-green-200'; // Active
    case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Paused
    case 3: return 'bg-red-100 text-red-800 border-red-200'; // Cancelled
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

// Helper function to get customer display name
const getCustomerDisplayName = (customer: any) => {
  if (!customer) return 'Unknown Customer';
  
  // For business customers (customerType === 1), show organization name
  if (customer.customerType === 1 && customer.organizationName && customer.organizationName.trim()) {
    return customer.organizationName;
  }
  
  // For individual customers (customerType === 0), show first name + last name
  if (customer.customerType === 0) {
    const firstName = customer.firstName?.trim() || '';
    const lastName = customer.lastName?.trim() || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
  }
  
  // Fallback: show email if available
  if (customer.email && customer.email.trim()) {
    return customer.email;
  }
  
  // Final fallback: show phone number
  if (customer.phoneNumber && customer.phoneNumber.trim()) {
    return customer.phoneNumber;
  }
  
  return 'Unknown Customer';
};

export const Subscriptions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming'>('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const today = new Date();
  const [upcomingStart, setUpcomingStart] = useState<string>(() => format(today, 'yyyy-MM-dd'));
  const [upcomingEnd, setUpcomingEnd] = useState<string>(() => format(lastDayOfMonth(today), 'yyyy-MM-dd'));

  const { data, isLoading, isError } = useSubscriptions({
    search: searchTerm,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page,
    pageSize,
  });

  const subscriptions = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;
  const totalCount = data?.data?.totalCount || 0;


  const { data: revenueData } = useQuery({
    queryKey: ['subscription-revenue'],
    queryFn: () => apiService.getTotalSubscriptionRevenue(),
    staleTime: 5 * 60 * 1000,
  });
  const totalRevenue = revenueData?.data || 0;


  const { data: activeSubsData } = useQuery({
    queryKey: ['active-subscriptions'],
    queryFn: () => apiService.getActiveSubscriptions(),
    staleTime: 5 * 60 * 1000,
  });
  const activeSubscriptions = Array.isArray(activeSubsData?.data) ? activeSubsData.data.length : 0;

  
  const { data: upcomingData, isLoading: isUpcomingLoading, isError: isUpcomingError, refetch: refetchUpcoming } = useQuery({
    queryKey: ['upcoming-billing', upcomingStart, upcomingEnd],
    queryFn: () => apiService.getUpcomingBillingSubscriptions({ from: upcomingStart, to: upcomingEnd }),
    enabled: activeTab === 'upcoming',
  });
  const upcomingSubscriptions = upcomingData?.data?.items || [];

  // Pause/Resume actions
  const pauseMutation = usePauseSubscription();
  const resumeMutation = useResumeSubscription();
  const cancelMutation = useCancelSubscription();
  const updateSubscriptionMutation = useUpdateSubscription();
  const [viewedSubscription, setViewedSubscription] = useState<any | null>(null);
  const [editSubscription, setEditSubscription] = useState<any | null>(null);
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; sub: any | null }>({ open: false, sub: null });
  const [editForm, setEditForm] = useState<any | null>(null);

  const handlePause = (id: string | number) => {
    pauseMutation.mutate(id);
  };
  const handleResume = (id: string | number) => {
    resumeMutation.mutate(id);
  };

  // Cancel handler
  const handleCancel = (sub: any) => {
    setCancelDialog({ open: true, sub });
  };
  const confirmCancel = () => {
    if (cancelDialog.sub) {
      cancelMutation.mutate({ id: cancelDialog.sub.id, reason: 'Cancelled by user' }, {
        onSuccess: () => {
          toast.success('Subscription cancelled');
          setCancelDialog({ open: false, sub: null });
        },
        onError: () => {
          toast.error('Failed to cancel subscription');
        },
      });
    }
  };

  // View handler
  const handleView = (sub: any) => {
    setViewedSubscription(sub);
  };
  // Edit handler
  const handleEdit = (sub: any) => {
    setEditSubscription(sub);
  };
  const closeEdit = () => setEditSubscription(null);

  React.useEffect(() => {
    if (editSubscription) {
      setEditForm({
        amount: editSubscription.amount || '',
        notes: editSubscription.notes || '',
        nextBillingDate: editSubscription.nextBillingDate ? editSubscription.nextBillingDate.split('T')[0] : '',
      });
    }
  }, [editSubscription]);
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubscription) return;
    updateSubscriptionMutation.mutate({
      id: editSubscription.id,
      data: {
        amount: Number(editForm.amount),
        notes: editForm.notes,
        nextBillingDate: editForm.nextBillingDate,
      },
    }, {
      onSuccess: () => {
        toast.success('Subscription updated');
        setEditSubscription(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <StatsCardShimmer key={i} />)}
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
        
        <TableShimmer rows={10} columns={7} />
      </div>
    );
  }
  if (isError) {
    return <div className="p-8 text-center text-red-500">Failed to load subscriptions.</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'all' | 'upcoming')}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Subscriptions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Subscriptions</h1>
              <p className="text-gray-600 mt-1">Manage recurring billing and subscriptions</p>
            </div>
            <Link to="/subscriptions/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Subscription
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Subscription Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{Number(totalRevenue).toLocaleString()} MWK</p>
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
                    <p className="text-2xl font-bold text-gray-900">{activeSubscriptions > 0 ? `${Math.round(totalRevenue / activeSubscriptions).toLocaleString()} MWK` : '0 MWK'}</p>
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
          <Card className="mb-6">
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
              <CardTitle>Subscriptions ({totalCount})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscription Code</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription: any) => (
                    <TableRow key={subscription.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-semibold text-gray-900">{subscription.subscriptionCode}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">
                          {getCustomerDisplayName(subscription.customer)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">{subscription.service?.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-900">{subscription.amount ? `${Number(subscription.amount).toLocaleString()} MWK` : '-'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-900">{subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : '-'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status === 1 ? 'Active' : subscription.status === 2 ? 'Paused' : subscription.status === 3 ? 'Cancelled' : 'Other'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(subscription)}>View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(subscription)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCancel(subscription)} disabled={cancelMutation.status === 'pending'}>Cancel</DropdownMenuItem>
                            {subscription.status === 1 ? (
                              <DropdownMenuItem onClick={() => handlePause(subscription.id)} disabled={pauseMutation.status === 'pending'}>Pause</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleResume(subscription.id)} disabled={resumeMutation.status === 'pending'}>Resume</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                  Page {page} of {totalPages} ({totalCount} total subscriptions)
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming">
          <Card className="mb-6">
            <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <Input type="date" value={upcomingStart} onChange={e => setUpcomingStart(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <Input type="date" value={upcomingEnd} onChange={e => setUpcomingEnd(e.target.value)} />
              </div>
              <Button onClick={() => refetchUpcoming()} className="h-10">Refresh</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Billing ({upcomingSubscriptions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isUpcomingLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                  <TableShimmer rows={5} columns={6} />
                </div>
              ) : isUpcomingError ? (
                <div className="p-8 text-center text-red-500">Failed to load upcoming billing.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subscription Code</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingSubscriptions.map((subscription: any) => (
                      <TableRow key={subscription.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-semibold text-gray-900">{subscription.subscriptionCode}</div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-900">
                            {getCustomerDisplayName(subscription.customer)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-900">{subscription.service?.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-gray-900">{subscription.amount ? `${Number(subscription.amount).toLocaleString()} MWK` : '-'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">{subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : '-'}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(subscription.status)}>
                            {subscription.status === 1 ? 'Active' : subscription.status === 2 ? 'Paused' : subscription.status === 3 ? 'Cancelled' : 'Other'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* View Subscription Modal (consistent style) */}
      <Dialog open={!!viewedSubscription} onOpenChange={open => !open && setViewedSubscription(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">Subscription Details</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setViewedSubscription(null)} className="h-8 w-8 p-0">X</Button>
            </div>
          </DialogHeader>
          {viewedSubscription && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{viewedSubscription.subscriptionCode}</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge>{viewedSubscription.status === 1 ? 'Active' : viewedSubscription.status === 2 ? 'Paused' : viewedSubscription.status === 3 ? 'Cancelled' : 'Other'}</Badge>
                  </div>
                </div>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Customer</h3>
                      <p className="text-gray-600 leading-relaxed">{getCustomerDisplayName(viewedSubscription.customer)}</p>
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
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-900">{viewedSubscription.amount ? `${Number(viewedSubscription.amount).toLocaleString()} MWK` : '-'}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-gray-900">Next Billing</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Billing:</span>
                      <span className="font-semibold text-gray-900">{viewedSubscription.nextBillingDate ? new Date(viewedSubscription.nextBillingDate).toLocaleDateString() : '-'}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <h3 className="font-medium text-gray-900">Service</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-semibold text-gray-900">{viewedSubscription.service?.name}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h3 className="font-medium text-gray-900">Notes</h3>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Notes:</span>
                      <span className="font-semibold text-gray-900">{viewedSubscription.notes || '-'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setViewedSubscription(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialog.open} onOpenChange={open => !open && setCancelDialog({ open: false, sub: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>Are you sure you want to cancel this subscription?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog({ open: false, sub: null })}>No</Button>
            <Button variant="destructive" onClick={confirmCancel} disabled={cancelMutation.status === 'pending'}>Yes, Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Subscription Dialog */}
      <Dialog open={!!editSubscription} onOpenChange={open => !open && setEditSubscription(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Subscription</DialogTitle>
          </DialogHeader>
          {editSubscription && (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">Amount (MWK)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={editForm && editForm.amount || ''}
                  onChange={handleEditChange}
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextBillingDate" className="text-sm font-medium">Next Billing Date</Label>
                <Input
                  id="nextBillingDate"
                  name="nextBillingDate"
                  type="date"
                  value={editForm && editForm.nextBillingDate || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={editForm && editForm.notes || ''}
                  onChange={handleEditChange}
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditSubscription(null)} type="button">Cancel</Button>
                <Button type="submit" disabled={updateSubscriptionMutation.isPending}>
                  {updateSubscriptionMutation.isPending ? 'Updating...' : 'Update Subscription'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
