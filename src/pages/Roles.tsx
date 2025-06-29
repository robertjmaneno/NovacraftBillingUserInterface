
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
  Users,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

interface Permission {
  id: number;
  name: string;
  module: string;
  action: string;
  description?: string;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  roleType: 'System' | 'Custom';
  userCount: number;
  permissions: Permission[];
}

// Mock permissions grouped by module as they would come from GET /api/Permission
const mockPermissions: Permission[] = [
  // User Management Module
  { id: 1, name: 'View Users', module: 'User', action: 'View', description: 'View user list and details' },
  { id: 2, name: 'Create Users', module: 'User', action: 'Create', description: 'Create new users' },
  { id: 3, name: 'Edit Users', module: 'User', action: 'Edit', description: 'Modify user information' },
  { id: 4, name: 'Delete Users', module: 'User', action: 'Delete', description: 'Remove users from system' },
  
  // Billing Module
  { id: 5, name: 'View Invoices', module: 'Billing', action: 'View', description: 'View invoice list and details' },
  { id: 6, name: 'Create Invoices', module: 'Billing', action: 'Create', description: 'Create new invoices' },
  { id: 7, name: 'Edit Invoices', module: 'Billing', action: 'Edit', description: 'Modify invoice information' },
  { id: 8, name: 'Delete Invoices', module: 'Billing', action: 'Delete', description: 'Remove invoices' },
  
  // Reports Module
  { id: 9, name: 'View Reports', module: 'Reports', action: 'View', description: 'Access financial reports' },
  { id: 10, name: 'Export Reports', module: 'Reports', action: 'Export', description: 'Export reports to files' },
  
  // Settings Module
  { id: 11, name: 'View Settings', module: 'Settings', action: 'View', description: 'View system settings' },
  { id: 12, name: 'Edit Settings', module: 'Settings', action: 'Edit', description: 'Modify system settings' },
];

// Mock roles as they would come from GET /api/Role
const mockRoles: Role[] = [
  {
    id: 1,
    name: 'System Administrator',
    description: 'Full system access',
    roleType: 'System',
    userCount: 2,
    permissions: mockPermissions // All permissions
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Business operations management',
    roleType: 'Custom',
    userCount: 5,
    permissions: mockPermissions.filter(p => ['User', 'Billing'].includes(p.module))
  },
  {
    id: 3,
    name: 'Accountant',
    description: 'Financial operations',
    roleType: 'Custom',
    userCount: 3,
    permissions: mockPermissions.filter(p => ['Billing', 'Reports'].includes(p.module))
  },
  {
    id: 4,
    name: 'Viewer',
    description: 'Read-only access',
    roleType: 'Custom',
    userCount: 8,
    permissions: mockPermissions.filter(p => p.action === 'View')
  }
];

export const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [viewPermissions, setViewPermissions] = useState<Role | null>(null);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsRoleDialogOpen(true);
  };

  const handleDeleteRole = (roleId: number) => {
    // DELETE /api/Role/{id}
    setRoles(roles.filter(r => r.id !== roleId));
  };

  const handleViewPermissions = (role: Role) => {
    setViewPermissions(role);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Configure roles and permissions</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/users">
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
          </Link>
          <Button onClick={handleCreateRole}>
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles ({filteredRoles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-semibold text-gray-900">{role.name}</div>
                      <div className="text-sm text-gray-600">ID: {role.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900">{role.description}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.roleType === 'System' ? 'default' : 'secondary'}>
                      {role.roleType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {role.permissions.length} permissions
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewPermissions(role)}
                      >
                        View Details
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{role.userCount} users</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewPermissions(role)}>
                          View Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditRole(role)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {role.roleType === 'Custom' && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Form Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          </DialogHeader>
          <RoleForm 
            role={selectedRole} 
            permissions={mockPermissions}
            onClose={() => setIsRoleDialogOpen(false)}
            roles={roles}
            setRoles={setRoles}
          />
        </DialogContent>
      </Dialog>

      {/* View Permissions Dialog */}
      <Dialog open={!!viewPermissions} onOpenChange={() => setViewPermissions(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permissions for {viewPermissions?.name}</DialogTitle>
          </DialogHeader>
          {viewPermissions && (
            <PermissionsView permissions={viewPermissions.permissions} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Role Form Component
const RoleForm: React.FC<{
  role: Role | null;
  permissions: Permission[];
  onClose: () => void;
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}> = ({ role, permissions, onClose, roles, setRoles }) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    roleType: role?.roleType || 'Custom' as 'System' | 'Custom',
    permissionIds: role?.permissions.map(p => p.id) || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPermissions = permissions.filter(p => formData.permissionIds.includes(p.id));
    
    if (role) {
      // PUT /api/Role/{id}
      const updatedRole = { ...role, ...formData, permissions: selectedPermissions };
      setRoles(roles.map(r => r.id === role.id ? updatedRole : r));
    } else {
      // POST /api/Role
      const newRole: Role = {
        id: Math.max(...roles.map(r => r.id)) + 1,
        name: formData.name,
        description: formData.description,
        roleType: formData.roleType,
        userCount: 0,
        permissions: selectedPermissions
      };
      setRoles([...roles, newRole]);
    }
    
    onClose();
  };

  const togglePermission = (permissionId: number) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

  // Group permissions by module for better display
  const permissionsByModule = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Role Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="roleType">Role Type *</Label>
          <Select 
            value={formData.roleType} 
            onValueChange={(value: 'System' | 'Custom') => 
              setFormData(prev => ({ ...prev, roleType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Custom">Custom</SelectItem>
              <SelectItem value="System">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="space-y-4">
        <Label>Permissions</Label>
        <div className="max-h-96 overflow-y-auto border rounded-lg p-4 space-y-6">
          {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
            <div key={module} className="space-y-3">
              <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">
                {module} Module
              </h4>
              <div className="grid grid-cols-1 gap-3 ml-4">
                {modulePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={formData.permissionIds.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`permission-${permission.id}`} className="font-medium cursor-pointer">
                        {permission.name}
                      </Label>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Action:</span> {permission.action}
                      </div>
                      {permission.description && (
                        <p className="text-sm text-gray-500 mt-1">{permission.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">Selected: {formData.permissionIds.length} permissions</p>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {role ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
};

// Permissions View Component
const PermissionsView: React.FC<{ permissions: Permission[] }> = ({ permissions }) => {
  const permissionsByModule = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
        <div key={module} className="space-y-3">
          <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
            {module} Module ({modulePermissions.length} permissions)
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {modulePermissions.map((permission) => (
              <div key={permission.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{permission.name}</span>
                  <Badge variant="outline">{permission.action}</Badge>
                </div>
                {permission.description && (
                  <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
