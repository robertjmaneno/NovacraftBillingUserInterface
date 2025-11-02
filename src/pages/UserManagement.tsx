import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit, 
  Trash2, 
  Shield, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  UserX,
  Play,
  Eye,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUsers, useDeleteUser, useActivateUser, useDeactivateUser, useSuspendUser, useUnlockUser, useLockUser, useUpdateUser } from '@/hooks/use-users';
import { useActiveRoles } from '@/hooks/use-roles';
import { PermissionGuard } from '@/components/PermissionGuard';
import { getUserInitials } from '@/lib/utils';
import { TableShimmer } from '@/components/ui/shimmer';
import { UserData } from '@/services/api';

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [viewUser, setViewUser] = useState<unknown>(null);
  const [editUser, setEditUser] = useState<unknown>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [suspendModal, setSuspendModal] = useState<{ userId: string; reason: string } | null>(null);
  

  




  // Fetch users with search and pagination
  const { data: usersData, isLoading, error } = useUsers(currentPage, pageSize, {
    searchTerm: searchTerm || undefined,
  });

  // Fetch active roles for display
  const { data: rolesData } = useActiveRoles();

  // Mutations
  const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();
  const suspendUserMutation = useSuspendUser();
  const unlockUserMutation = useUnlockUser();
  const lockUserMutation = useLockUser();

  // Backend returns "items" instead of "users"
  const users = usersData?.data?.items || [];
  const totalPages = usersData?.data?.totalPages || 1;
  const totalCount = usersData?.data?.totalCount || 0;
  const roles = rolesData?.data?.roles || [];



  const getRoleById = (roleId: string) => roles.find(r => r.id === roleId);

  const handleUserAction = async (userId: string, action: string, reason?: string) => {
    try {
      switch (action) {
        case 'activate':
          await activateUserMutation.mutateAsync(userId);
          break;
        case 'deactivate':
          await deactivateUserMutation.mutateAsync(userId);
          break;
        case 'suspend':
          if (reason) {
            await suspendUserMutation.mutateAsync({ userId, reason });
          }
          break;
        case 'lock':
          await lockUserMutation.mutateAsync(userId);
          break;
        case 'unlock':
          await unlockUserMutation.mutateAsync(userId);
          break;
        case 'delete':
          await deleteUserMutation.mutateAsync(userId);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const getStatusBadge = (status: number | string) => {
    // Convert numeric status to string if needed
    const statusStr = typeof status === 'number' ? 
      (status === 1 ? 'Active' : 
       status === 2 ? 'Inactive' : 
       status === 3 ? 'Suspended' : 
       status === 4 ? 'Pending' : 
       status === 5 ? 'Locked' : 
       status === 6 ? 'Deactivated' : 'Unknown') :
      status.toString();
    
    switch (statusStr.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return (
          <div className="flex items-center gap-1">
            <Badge variant="secondary">Inactive</Badge>
            <span className="text-xs text-gray-500">(Contact support to reactivate)</span>
          </div>
        );
      case 'locked':
        return <Badge variant="destructive">Locked</Badge>;
      case 'suspended':
        return (
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="border-yellow-500 text-yellow-700">Suspended</Badge>
            <span className="text-xs text-gray-500">(Contact support for assistance)</span>
          </div>
        );
      case 'pending':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Pending</Badge>;
      case 'deactivated':
        return <Badge variant="secondary">Deactivated</Badge>;
      default:
        return <Badge variant="secondary">{statusStr}</Badge>;
    }
  };

  const renderRoles = (userRoles: string[]) => {
    if (!userRoles || userRoles.length === 0) return <span className="text-gray-400">No roles</span>;
    if (userRoles.length === 1) {
      return <Badge variant="secondary">{userRoles[0]}</Badge>;
    }
    
    return (
      <div className="flex items-center gap-1">
        <Badge variant="secondary">{userRoles[0]}</Badge>
        <span className="text-sm text-gray-500">+{userRoles.length - 1} more...</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    // Compare only the date parts (local time)
    const dateYMD = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    const nowYMD = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
    if (dateYMD === nowYMD) {
      return 'Today';
    }
    // Yesterday check
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yestYMD = yesterday.getFullYear() + '-' + (yesterday.getMonth()+1) + '-' + yesterday.getDate();
    if (dateYMD === yestYMD) {
      return 'Yesterday';
    }
    // Days ago
    const diffTime = now.setHours(0,0,0,0) - date.setHours(0,0,0,0);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Handle errors from API calls (like 401/403 from backend authorization)
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1 text-base font-regular">Manage users and assign roles</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Unable to load user data.</p>
              <p className="text-sm text-gray-500 mt-1">
                {error.message || 'You may not have permission to access this resource.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        
        {/* Search Card Skeleton */}
        <Card>
          <CardContent className="p-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
        
        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <TableShimmer rows={10} columns={8} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1 text-base font-regular">Manage users and assign roles</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Failed to load users. Please try again.</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-2"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1 text-base font-regular">Manage users and assign roles</p>
        </div>
        <div className="flex space-x-2">
          <PermissionGuard permissions={['Roles.Read']}>
            <Link to="/roles">
              <Button variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Manage Roles
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </PermissionGuard>
          <PermissionGuard permissions={['Users.Create']}>
            <Link to="/users/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </Link>
          </PermissionGuard>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm('')}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              Searching for: "{searchTerm}" • Found {totalCount} result{totalCount !== 1 ? 's' : ''}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Users ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>User Type</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-center">
                          <p className="text-gray-500 mb-2">No users found</p>
                          <p className="text-sm text-gray-400">
                            {totalCount > 0 ? 'Try adjusting your search criteria' : 'No users have been created yet'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {getUserInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-900">{user.email}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {typeof user.userType === 'number' ? 
                            (user.userType === 1 ? 'Admin' : user.userType === 2 ? 'Customer' : user.userType === 3 ? 'Employee' : 'Unknown') :
                            user.userType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {renderRoles(user.roles || [])}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDate(user.lastLogin)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <PermissionGuard permissions={['Users.Read']}>
                              <DropdownMenuItem onClick={() => setViewUser(user)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            </PermissionGuard>
                            <PermissionGuard permissions={['Users.Update']}>
                              <DropdownMenuItem onClick={() => setEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </PermissionGuard>
                            <PermissionGuard permissions={['Users.Delete']}>
                              <DropdownMenuItem 
                                onClick={() => setDeleteConfirm(user.id)} 
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </PermissionGuard>
                            {(user.status === 'Active' || user.status === 1) && ( // Active
                              <>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'deactivate')}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSuspendModal({ userId: user.id, reason: '' })}>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'lock')}>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Lock
                                </DropdownMenuItem>
                              </>
                            )}
                            {(user.status === 'Inactive' || user.status === 2) && ( // Inactive
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            {(user.status === 'Locked' || user.status === 5) && ( // Locked
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'unlock')}>
                                <Unlock className="mr-2 h-4 w-4" />
                                Unlock
                              </DropdownMenuItem>
                            )}
                            {(user.status === 'Suspended' || user.status === 3) && ( // Suspended
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                <Play className="mr-2 h-4 w-4" />
                                Reactivate
                              </DropdownMenuItem>
                            )}
                            {(user.status === 'Deactivated' || user.status === 6) && ( // Deactivated
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Reactivate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                </TableBody>
              </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {viewUser && (
            <div className="bg-white rounded-lg shadow-lg">
              <div className="flex items-center gap-4 p-6 border-b">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={(viewUser as Record<string, unknown>).avatar as string} />
                  <AvatarFallback className="text-lg">
                    {getUserInitials((viewUser as Record<string, unknown>).firstName as string, (viewUser as Record<string, unknown>).lastName as string)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {(viewUser as Record<string, unknown>).firstName as string} {(viewUser as Record<string, unknown>).middleName as string} {(viewUser as Record<string, unknown>).lastName as string}
                  </h3>
                  <p className="text-gray-600">{(viewUser as Record<string, unknown>).email as string}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {((viewUser as Record<string, unknown>).roles as string[] || []).map((roleId: string) => {
                      const role = getRoleById(roleId);
                      return role ? (
                        <Badge key={roleId} variant="secondary">
                          {role.displayName}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b">
                <div className="p-6 space-y-2 border-r md:border-r-0 md:border-b">
                  <h4 className="font-medium text-gray-900 mb-2">Personal Info</h4>
                  <p><span className="text-gray-600">Date of Birth:</span> {(viewUser as Record<string, unknown>).dateOfBirth as string || 'Not provided'}</p>
                  <p><span className="text-gray-600">Gender:</span> {(viewUser as Record<string, unknown>).gender as string || 'Not provided'}</p>
                  <p><span className="text-gray-600">Phone:</span> {(viewUser as Record<string, unknown>).phoneNumber as string || 'Not provided'}</p>
                  <p><span className="text-gray-600">Address:</span> {(viewUser as Record<string, unknown>).address as string || 'Not provided'}</p>
                </div>
                <div className="p-6 space-y-2">
                  <h4 className="font-medium text-gray-900 mb-2">Professional Info</h4>
                  <p><span className="text-gray-600">Job Title:</span> {(viewUser as Record<string, unknown>).jobTitle as string || 'Not provided'}</p>
                  <p><span className="text-gray-600">Company:</span> {(viewUser as Record<string, unknown>).company as string || 'Not provided'}</p>
                  <p><span className="text-gray-600">User Type:</span> {(viewUser as Record<string, unknown>).userType as string}</p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="space-y-2 border-r md:border-r-0 md:border-b">
                  <h4 className="font-medium text-gray-900 mb-2">Account Status</h4>
                  <p><span className="text-gray-600">Status:</span> {getStatusBadge((viewUser as Record<string, unknown>).status as string | number)}</p>
                  <p><span className="text-gray-600">Last Login:</span> {formatDate((viewUser as Record<string, unknown>).lastLogin as string)}</p>
                  <p><span className="text-gray-600">Created:</span> {formatDate((viewUser as Record<string, unknown>).createdAt as string)}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 mb-2">Security</h4>
                  <p><span className="text-gray-600">Email Confirmed:</span> {(viewUser as Record<string, unknown>).emailConfirmed ? 'Yes' : 'No'}</p>
                  <p><span className="text-gray-600">Two Factor Enabled:</span> {(viewUser as Record<string, unknown>).twoFactorEnabled ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <EditUserDialog 
        user={editUser as UserData}
        open={!!editUser}
        onClose={() => setEditUser(null)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (deleteConfirm) {
                    handleUserAction(deleteConfirm, 'delete');
                    setDeleteConfirm(null);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suspend User Dialog */}
      <Dialog open={!!suspendModal} onOpenChange={() => setSuspendModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please provide a reason for suspending this user. This information will be recorded.
            </p>
            <div className="space-y-2">
              <Label htmlFor="suspend-reason">Reason for Suspension *</Label>
              <textarea
                id="suspend-reason"
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the reason for suspending this user..."
                value={suspendModal?.reason || ''}
                onChange={(e) => setSuspendModal(prev => prev ? { ...prev, reason: e.target.value } : null)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSuspendModal(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                disabled={!suspendModal?.reason.trim()}
                onClick={() => {
                  if (suspendModal) {
                    handleUserAction(suspendModal.userId, 'suspend', suspendModal.reason);
                    setSuspendModal(null);
                  }
                }}
              >
                Suspend User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Edit User Dialog Component
interface EditUserDialogProps {
  user: UserData | null;
  open: boolean;
  onClose: () => void;
}

const userTypes = [
  { value: 'admin', label: 'Administrator' },
  { value: 'customer', label: 'Customer' },
  { value: 'employee', label: 'Employee' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'vendor', label: 'Vendor' }
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' }
];

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phoneNumber: '',
    company: '',
    jobTitle: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    userType: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateUserMutation = useUpdateUser();

  // Initialize form data when user changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: user.middleName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: typeof user.gender === 'string' ? user.gender : '',
        userType: typeof user.userType === 'string' ? user.userType : ''
      });
      setErrors({});
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          company: formData.company || undefined,
          jobTitle: formData.jobTitle || undefined,
          address: formData.address || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          userType: formData.userType || undefined,
        }
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User - {user.firstName} {user.lastName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`${errors.firstName ? 'border-red-500' : ''} text-gray-700`}
                  disabled={updateUserMutation.isPending}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`${errors.lastName ? 'border-red-500' : ''} text-gray-700`}
                  disabled={updateUserMutation.isPending}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="middleName" className="text-gray-700">Middle Name</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className="text-gray-700"
                  disabled={updateUserMutation.isPending}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`${errors.email ? 'border-red-500' : ''} text-gray-700`}
                  disabled={updateUserMutation.isPending}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="text-gray-700"
                  disabled={updateUserMutation.isPending}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="text-gray-700"
                disabled={updateUserMutation.isPending}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-700">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="text-gray-700"
                  disabled={updateUserMutation.isPending}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-gray-700">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="text-gray-700"
                  disabled={updateUserMutation.isPending}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-gray-700">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="text-gray-700"
                  disabled={updateUserMutation.isPending}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-700">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  disabled={updateUserMutation.isPending}
                >
                  <SelectTrigger className="text-gray-700">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-gray-700">User Type</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => handleInputChange('userType', value)}
                  disabled={updateUserMutation.isPending}
                >
                  <SelectTrigger className="text-gray-700">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
