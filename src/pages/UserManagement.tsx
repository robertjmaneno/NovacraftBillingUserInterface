import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  avatar?: string;
  roles: string[];
  userType: string;
  status: 'active' | 'inactive' | 'locked' | 'suspended';
  lastLogin: string;
  dateOfBirth?: string;
  gender?: string;
  jobTitle?: string;
  company?: string;
  address?: string;
  phoneNumber?: string;
  acceptTerms: boolean;
}

const defaultRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: [],
    color: 'bg-red-100 text-red-800'
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Business operations management',
    permissions: [],
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Financial operations',
    permissions: [],
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: [],
    color: 'bg-gray-100 text-gray-800'
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    roles: ['admin'],
    userType: 'admin',
    status: 'active',
    lastLogin: '2024-01-20',
    jobTitle: 'System Administrator',
    company: 'Tech Corp',
    acceptTerms: true
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    roles: ['manager', 'accountant'],
    userType: 'employee',
    status: 'active',
    lastLogin: '2024-01-19',
    jobTitle: 'Finance Manager',
    company: 'Tech Corp',
    acceptTerms: true
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob@example.com',
    roles: ['viewer'],
    userType: 'customer',
    status: 'inactive',
    lastLogin: '2024-01-15',
    acceptTerms: true
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
    roles: ['manager'],
    userType: 'employee',
    status: 'locked',
    lastLogin: '2024-01-18',
    acceptTerms: true
  },
  {
    id: '5',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie@example.com',
    roles: ['viewer'],
    userType: 'customer',
    status: 'suspended',
    lastLogin: '2024-01-16',
    acceptTerms: true
  }
];

const USERS_PER_PAGE = 10;

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles] = useState<Role[]>(defaultRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  const getRoleById = (roleId: string) => roles.find(r => r.id === roleId);

  const handleUserAction = (userId: string, action: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'activate':
            return { ...user, status: 'active' as const };
          case 'lockout':
            return { ...user, status: 'locked' as const };
          case 'suspend':
            return { ...user, status: 'suspended' as const };
          case 'unlock':
            return { ...user, status: 'active' as const };
          case 'delete':
            return user; // Handle delete separately
          default:
            return user;
        }
      }
      return user;
    }));

    if (action === 'delete') {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'locked':
        return <Badge variant="destructive">Locked</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderRoles = (userRoles: string[]) => {
    if (userRoles.length === 0) return <span className="text-gray-400">No roles</span>;
    if (userRoles.length === 1) {
      const role = getRoleById(userRoles[0]);
      return role ? <Badge variant="secondary">{role.name}</Badge> : null;
    }
    
    const firstRole = getRoleById(userRoles[0]);
    return (
      <div className="flex items-center gap-1">
        {firstRole && <Badge variant="secondary">{firstRole.name}</Badge>}
        <span className="text-sm text-gray-500">+{userRoles.length - 1} more...</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users and assign roles</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/roles">
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Manage Roles
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/users/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900">{user.firstName}</div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-900">{user.lastName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.userType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {renderRoles(user.roles)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{user.lastLogin}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'delete')} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                        {user.status === 'inactive' && (
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        {user.status === 'locked' && (
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'unlock')}>
                            <Unlock className="mr-2 h-4 w-4" />
                            Unlock
                          </DropdownMenuItem>
                        )}
                        {user.status === 'active' && (
                          <>
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'lockout')}>
                              <Lock className="mr-2 h-4 w-4" />
                              Lockout
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          </>
                        )}
                        {user.status === 'suspended' && (
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                            <Play className="mr-2 h-4 w-4" />
                            Reactivate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Information</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={viewUser.avatar} />
                  <AvatarFallback className="text-lg">
                    {viewUser.firstName.charAt(0)}{viewUser.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {viewUser.firstName} {viewUser.middleName} {viewUser.lastName}
                  </h3>
                  <p className="text-gray-600">{viewUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Personal Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="text-gray-600">Date of Birth:</span> {viewUser.dateOfBirth || 'Not provided'}</p>
                    <p><span className="text-gray-600">Gender:</span> {viewUser.gender || 'Not provided'}</p>
                    <p><span className="text-gray-600">Phone:</span> {viewUser.phoneNumber || 'Not provided'}</p>
                    <p><span className="text-gray-600">Address:</span> {viewUser.address || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Professional Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="text-gray-600">Job Title:</span> {viewUser.jobTitle || 'Not provided'}</p>
                    <p><span className="text-gray-600">Company:</span> {viewUser.company || 'Not provided'}</p>
                    <p><span className="text-gray-600">User Type:</span> {viewUser.userType}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Roles</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {viewUser.roles.map(roleId => {
                    const role = getRoleById(roleId);
                    return role ? (
                      <Badge key={roleId} variant="secondary">
                        {role.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Account Status</h4>
                <div className="mt-2 space-y-2">
                  <p><span className="text-gray-600">Status:</span> {getStatusBadge(viewUser.status)}</p>
                  <p><span className="text-gray-600">Last Login:</span> {viewUser.lastLogin}</p>
                  <p><span className="text-gray-600">Terms Accepted:</span> {viewUser.acceptTerms ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Edit functionality will be implemented. Currently showing user: {editUser.firstName} {editUser.lastName}
              </p>
              {/* TODO: Implement edit form with pre-populated data */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
