
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  FileText,
  Building,
  User,
  Calendar,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useCustomers, useDeleteCustomer, getCustomerTypeDisplay, getCustomerStatusDisplay, getCustomerStatusColor, getCustomerTypeColor, useCustomer, useUpdateCustomer } from '@/hooks/use-customers';
import { Customer } from '@/services/api';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';
import { TableShimmer } from '@/components/ui/shimmer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CustomerForm } from './CreateCustomer';
import { useUsers } from '@/hooks/use-users';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [viewedCustomerId, setViewedCustomerId] = useState<number | null>(null);
  const [editCustomerId, setEditCustomerId] = useState<number | null>(null);

  // Use the real API
  const { data: customersData, isLoading, error } = useCustomers({ page, pageSize: 10 });
  const deleteCustomerMutation = useDeleteCustomer();

  // Handle the API response structure
  const customers = customersData?.data?.items || [];
  const totalPages = customersData?.data?.totalPages || 1;
  const totalCount = customersData?.data?.totalCount || 0;

  const filteredCustomers = customers.filter(customer =>
    customer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.organizationName && customer.organizationName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteCustomer = (customerId: number) => {
    setDeleteCustomerId(customerId);
  };

  const confirmDelete = async () => {
    if (!deleteCustomerId) return;
    
    try {
      await deleteCustomerMutation.mutateAsync(deleteCustomerId);
      setDeleteCustomerId(null);
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships and contacts</p>
        </div>
        <Link to="/customers/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search customers by name, email, phone, or organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <TableShimmer rows={8} columns={6} />}
          
          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">Error loading customers: {error.message}</div>
            </div>
          )}
          
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 bg-blue-100">
                          <AvatarFallback className="text-blue-600 font-semibold text-sm">
                            {getInitials(customer.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {customer.customerType === 1 ? customer.organizationName : customer.displayName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-48">{customer.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          <span>{customer.phoneNumber}</span>
                        </div>
                        {customer.contactPerson && (
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="w-3 h-3 mr-1" />
                            <span>{customer.contactPerson}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCustomerTypeColor(customer.customerType)}>
                        {getCustomerTypeDisplay(customer.customerType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCustomerStatusColor(customer.status)}>
                        {getCustomerStatusDisplay(customer.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(customer.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewedCustomerId(customer.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditCustomerId(customer.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {deleteCustomerId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Customer</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setDeleteCustomerId(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteCustomerMutation.isPending}
              >
                {deleteCustomerMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Customer Details Modal */}
      <Dialog open={!!viewedCustomerId} onOpenChange={open => { if (!open) setViewedCustomerId(null); }}>
        <CustomerDetailsModal customerId={viewedCustomerId} />
      </Dialog>
      {/* Edit Customer Modal */}
      <Dialog open={!!editCustomerId} onOpenChange={open => { if (!open) setEditCustomerId(null); }}>
        <EditCustomerModal customerId={editCustomerId} onClose={() => setEditCustomerId(null)} />
      </Dialog>
    </div>
  );
};

// Customer Details Modal
const CustomerDetailsModal: React.FC<{ customerId: number | null }> = ({ customerId }) => {
  const { data, isLoading } = useCustomer(customerId!, { enabled: !!customerId });
  const customer = (data as any)?.data;
  if (!customerId) return null;
  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Customer Details</DialogTitle>
      </DialogHeader>
      {isLoading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : customer ? (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{customer.organizationName || customer.displayName || customer.fullName || customer.firstName || '-'}</h2>
              <div className="flex items-center gap-3 mb-4">
                <Badge>{getCustomerTypeDisplay(customer.customerType)}</Badge>
                <Badge>{getCustomerStatusDisplay(customer.status)}</Badge>
              </div>
            </div>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-600 leading-relaxed">Email: {customer.email || '-'}</p>
                  <p className="text-gray-600 leading-relaxed">Phone: {customer.phoneNumber || '-'}</p>
                  {customer.contactPerson && <p className="text-gray-600 leading-relaxed">Contact Person: {customer.contactPerson}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Building className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-900">Organization</h3>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Organization Name:</span>
                  <span className="font-semibold text-gray-900">{customer.organizationName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ID:</span>
                  <span className="font-semibold text-gray-900">{customer.taxId || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Number:</span>
                  <span className="font-semibold text-gray-900">{customer.registrationNumber || '-'}</span>
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
                  <span className="text-gray-600">Created At:</span>
                  <span className="font-semibold text-gray-900">{customer.createdAt ? formatDate(customer.createdAt) : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated At:</span>
                  <span className="font-semibold text-gray-900">{customer.updatedAt ? formatDate(customer.updatedAt) : '-'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Notes</h3>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Notes:</span>
                <span className="font-semibold text-gray-900">{customer.notes || '-'}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-gray-900">Addresses</h3>
              </div>
              {Array.isArray(customer.addresses) && customer.addresses.length > 0 ? (
                <ul className="space-y-2">
                  {customer.addresses.map((addr: any, idx: number) => (
                    <li key={idx} className="border rounded p-2">
                      <div><b>Type:</b> {addr.addressType === 1 ? 'Billing' : addr.addressType === 2 ? 'Physical' : addr.addressType === 3 ? 'Shipping' : '-'}</div>
                      <div><b>Street:</b> {addr.streetAddress || '-'}</div>
                      <div><b>City:</b> {addr.city || '-'}</div>
                      <div><b>District:</b> {addr.district || '-'}</div>
                      <div><b>Country:</b> {addr.country || '-'}</div>
                      <div><b>Postal Code:</b> {addr.postalCode || '-'}</div>
                    </li>
                  ))}
                </ul>
              ) : <div>-</div>}
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => {}} /* Dialog handles close */>Close</Button>
          </div>
        </div>
      ) : null}
    </DialogContent>
  );
};

// Edit Customer Modal
const EditCustomerModal: React.FC<{ customerId: number | null; onClose: () => void }> = ({ customerId, onClose }) => {
  const { data, isLoading } = useCustomer(customerId!, { enabled: !!customerId });
  const customer = (data as any)?.data;
  const { data: usersData, isLoading: usersLoading } = useUsers(1, 100);
  const users = usersData?.data?.items || [];
  const updateCustomerMutation = useUpdateCustomer();

  if (!customerId) return null;
  if (isLoading || usersLoading) return <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"><div className="p-8 text-center text-gray-500">Loading...</div></DialogContent>;

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <CustomerForm
        initialValues={customer}
        mode="edit"
        users={users}
        usersLoading={usersLoading}
        onCancel={onClose}
        onSubmit={(values) => {
          updateCustomerMutation.mutate({ id: customerId, data: values }, { onSuccess: onClose });
        }}
      />
    </DialogContent>
  );
};
