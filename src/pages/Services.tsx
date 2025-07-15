
import React, { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Package,
  TrendingUp,
  Filter,
  Star,
  Users,
  MoreVertical,
  Eye,
  Play,
  Pause,
  X
} from 'lucide-react';
import { CreateServiceDialog } from '@/components/CreateServiceDialog';
import { ServiceDetailsModal } from '@/components/ServiceDetailsModal';
import { EditServiceDialog } from '@/components/EditServiceDialog';
import { TableShimmer, StatsCardShimmer } from '@/components/ui/shimmer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Service } from '@/services/api';
import { 
  useServices, 
  useTotalRevenue, 
  useTotalClients, 
  useUpdateServiceStatus,
  useDeleteService,
  getBillingCycleDisplay, 
  getServiceStatusDisplay, 
  getServiceStatusColor, 
  getCategoryColor,
  SERVICE_CATEGORIES,
  SERVICE_STATUSES,
  useActiveSubscriptionCount,
  useTotalSubscriptionRevenue
} from '@/hooks/use-services';

// Remove the hardcoded services array and utility functions since they're now imported from the hook

export const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState<number | null>(null);

  // Fetch services and statistics from API
  const { data: servicesData, isLoading, error } = useServices(1, 100);
  // const { data: revenueData } = useTotalRevenue();
  // const { data: clientsData } = useTotalClients();
  const { data: activeSubsData } = useActiveSubscriptionCount();
  const { data: totalSubsRevenueData } = useTotalSubscriptionRevenue();
  
  // Mutations
  const updateStatusMutation = useUpdateServiceStatus();
  const deleteServiceMutation = useDeleteService();
  
  const services = servicesData?.data?.items || [];
  // const totalRevenue = revenueData?.data || 0;
  // const totalClients = clientsData?.data || 0;
  const totalRevenue = totalSubsRevenueData?.data || 0;
  const totalClients = activeSubsData?.data || 0;

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || (service.category && service.category.toLowerCase() === categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 1).length;

  // Action handlers
  const handleStatusChange = async (serviceId: number, newStatus: number) => {
    try {
      await updateStatusMutation.mutateAsync({ id: serviceId, status: newStatus });
    } catch (error) {
      console.error('Failed to update service status:', error);
    }
  };

  const handleDeleteService = (serviceId: number) => {
    setDeleteServiceId(serviceId);
  };

  const confirmDelete = async () => {
    if (!deleteServiceId) return;
    
    try {
      await deleteServiceMutation.mutateAsync(deleteServiceId);
      setDeleteServiceId(null);
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleViewService = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setIsDetailsModalOpen(true);
    }
  };

  const handleEditService = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setIsEditDialogOpen(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
                      <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
          <p className="text-lg text-gray-600">Manage your service offerings and pricing</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 shadow-lg"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <StatsCardShimmer />
            <StatsCardShimmer />
            <StatsCardShimmer />
          </>
        ) : (
          <>
            <Card className="border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Services</p>
                    <p className="text-3xl font-bold text-gray-900">{totalServices}</p>
                    <p className="text-sm text-blue-600 mt-1">{activeServices} active</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">MWK {totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">All time</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Clients</p>
                    <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
                    <p className="text-sm text-orange-600 mt-1">Using services</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Enhanced Filters */}
      <Card className="border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search services by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {SERVICE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="border">
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableShimmer rows={8} columns={8} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Clients</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              
              {error && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-red-500">Error loading services: {error.message}</div>
                  </TableCell>
                </TableRow>
              )}
              
              {!isLoading && !error && filteredServices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">No services found</div>
                  </TableCell>
                </TableRow>
              )}
              
              {!isLoading && !error && filteredServices.map((service) => (
                <TableRow key={service.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="font-semibold text-gray-900">{service.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(service.category)}>
                      {service.category || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {getBillingCycleDisplay(service.billingCycle)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      MWK {service.price.toLocaleString()}
                      {service.discountPercentage > 0 && (
                        <span className="text-sm font-normal text-red-600 ml-1">
                          (-{service.discountPercentage}%)
                        </span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-blue-600">{service.clientCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">MWK {service.revenue.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getServiceStatusColor(service.status)}>
                      {getServiceStatusDisplay(service.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={() => handleViewService(service.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleEditService(service.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        {/* Status Actions */}
                        {service.status !== 1 && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(service.id, 1)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Set Active
                          </DropdownMenuItem>
                        )}
                        {service.status !== 2 && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(service.id, 2)}
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            Set Inactive
                          </DropdownMenuItem>
                        )}
                        {service.status !== 3 && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(service.id, 3)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Discontinue
                          </DropdownMenuItem>
                        )}
                        {service.status !== 4 && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(service.id, 4)}
                            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Set Pending
                          </DropdownMenuItem>
                        )}
                        {service.status !== 5 && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(service.id, 5)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Star className="mr-2 h-4 w-4" />
                            Set Draft
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      <CreateServiceDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
      
      <ServiceDetailsModal
        service={selectedService}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />
      
      <EditServiceDialog
        service={selectedService}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      {deleteServiceId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Service</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setDeleteServiceId(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteServiceMutation.isPending}
              >
                {deleteServiceMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
