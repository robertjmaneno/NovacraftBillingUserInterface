
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
  DialogDescription,
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
import { useRoles, useDeleteRole, useCreateRole, useUpdateRole } from '@/hooks/use-roles';
import { useAllPermissions } from '@/hooks/use-permissions';
import { Role, Permission } from '@/services/api';
import { toast } from 'sonner';
import { apiService } from '@/services/api';
import { TableShimmer } from '@/components/ui/shimmer';

export const RoleManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [viewPermissions, setViewPermissions] = useState<Role | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [newlyCreatedRole, setNewlyCreatedRole] = useState<{role: Role, permissions: Permission[]} | null>(null);

  // Use the real API
  const { data: rolesData, isLoading, error } = useRoles(1, 100);
  const { data: permissionsData, isLoading: permissionsLoading, error: permissionsError } = useAllPermissions();

  const deleteRoleMutation = useDeleteRole();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();


  const roles = rolesData?.data?.roles || [];

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

  const handleDeleteRole = (roleId: string) => {
    setDeleteRoleId(roleId);
  };

  const confirmDelete = async () => {
    if (!deleteRoleId) return;
    
    try {
      await deleteRoleMutation.mutateAsync(deleteRoleId);
      setDeleteRoleId(null);
    } catch (error) {
      console.error('Failed to delete role:', error);
      
    }
  };

  const handleViewPermissions = (role: Role) => {
    setViewPermissions(role);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Role Management</h1>
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
          {isLoading ? (
            <TableShimmer rows={8} columns={5} />
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">Error loading roles: {error.message}</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                <TableRow key={role.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="font-semibold text-gray-900">{role.name}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900 truncate block max-w-xs" title={role.description}>
                      {role.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isSystem ? 'default' : 'secondary'}>
                      {role.isSystem ? 'System' : 'Custom'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {role.permissionCount > 0 ? `${role.permissionCount} permissions` : 'No permissions'}
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
                        {!role.isSystem && (
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
          )}
        </CardContent>
      </Card>

      {/* Role Form Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            <DialogDescription>
              {selectedRole ? 'Update the role details and permissions below.' : 'Create a new role with the details and permissions below.'}
            </DialogDescription>
          </DialogHeader>
          <RoleForm 
            role={selectedRole} 
            permissions={permissionsData?.data?.permissions || []}
            onClose={() => setIsRoleDialogOpen(false)}
            createRoleMutation={createRoleMutation}
            updateRoleMutation={updateRoleMutation}
            isLoading={permissionsLoading}
            onRoleCreated={setNewlyCreatedRole}
          />


        </DialogContent>
      </Dialog>

      {/* View Permissions Dialog */}
      <Dialog open={!!viewPermissions} onOpenChange={() => setViewPermissions(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permissions for {viewPermissions?.name}</DialogTitle>
            <DialogDescription>
              View all permissions assigned to this role.
            </DialogDescription>
          </DialogHeader>
          {viewPermissions && (
            <PermissionsView permissions={viewPermissions.permissions} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteRoleId} onOpenChange={() => setDeleteRoleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteRoleId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteRoleMutation.isPending}
              >
                {deleteRoleMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Newly Created Role Dialog */}
      <Dialog open={!!newlyCreatedRole} onOpenChange={() => setNewlyCreatedRole(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Role Created Successfully!</DialogTitle>
            <DialogDescription>
              The role "{newlyCreatedRole?.role.name}" has been created with the following permissions:
            </DialogDescription>
          </DialogHeader>
          {newlyCreatedRole && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Role Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {newlyCreatedRole.role.name}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {newlyCreatedRole.role.isSystem ? 'System' : 'Custom'}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Description:</span> {newlyCreatedRole.role.description || 'No description'}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Assigned Permissions ({newlyCreatedRole.permissions.length})</h3>
                <PermissionsView permissions={newlyCreatedRole.permissions} />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setNewlyCreatedRole(null)}>
                  Close
                </Button>
              </div>
            </div>
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
  createRoleMutation: { mutateAsync: (data: unknown) => Promise<unknown>; isPending: boolean };
  updateRoleMutation: { mutateAsync: (data: unknown) => Promise<unknown>; isPending: boolean };
  isLoading?: boolean;
  onRoleCreated?: (data: {role: Role, permissions: Permission[]}) => void;
}> = ({ role, permissions, onClose, createRoleMutation, updateRoleMutation, isLoading = false, onRoleCreated }) => {
  const getExistingPermissionIds = () => {
    if (!role) return [];
    
   
    return role.permissions?.map(p => p.id) || [];
  };

  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    roleType: role?.roleType === 1 ? 'System' : 'Custom' as 'System' | 'Custom',
    permissionIds: role ? getExistingPermissionIds() : [] as number[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (formData.name.length > 100) {
      toast.error('Role name must be 100 characters or less');
      return;
    }
    
   
    if (formData.description && formData.description.length > 500) {
      toast.error('Role description must be 500 characters or less');
      return;
    }
    
    try {
      if (role) {
        // Update existing role
        const updateData = {
          displayName: formData.name,
          description: formData.description,
          roleType: formData.roleType === 'System' ? 1 : 2,
          isActive: true
        };
        
        await updateRoleMutation.mutateAsync({ id: role.id, data: updateData });
        

        console.log('Update role permissions:', { roleId: role.id, permissionIds: formData.permissionIds });
      } else {
      
        const createData = {
          name: formData.name,
          description: formData.description,
          roleType: formData.roleType === 'System' ? 1 : 2,
          displayName: formData.name,
          permissionIds: formData.permissionIds.length > 0 ? formData.permissionIds : undefined,
          isActive: true
        };
        
        console.log('Creating role with data:', JSON.stringify(createData, null, 2));
        
        console.log('Creating role with data:', createData);
        console.log('Selected permission IDs:', formData.permissionIds);
        console.log('Selected permissions:', permissions.filter(p => formData.permissionIds.includes(p.id)));
        
        let newRole;
        try {
          newRole = await createRoleMutation.mutateAsync(createData);
        } catch (error) {
          console.error('Role creation failed with error:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack
          });
          throw error;
        }
        
       
        if (newRole?.data) {
          const selectedPermissions = permissions.filter(p => formData.permissionIds.includes(p.id));
          console.log('Role created successfully:', newRole.data);
          
          // Show success message
          if (formData.permissionIds.length > 0) {
            toast.success(`Role "${formData.name}" created successfully with ${formData.permissionIds.length} permissions!`);
          } else {
            toast.success('Role created successfully!');
          }
          
       
          onRoleCreated?.({
            role: newRole.data,
            permissions: selectedPermissions
          });
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save role:', error);
    }
  };

  const togglePermission = (permissionId: number) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

 
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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading permissions...</div>
          </div>
        ) : permissions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">No permissions available ({permissions.length} loaded)</div>
          </div>
        ) : (
          <>
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
                            {permission.displayName || permission.name}
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
          </>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={createRoleMutation.isPending || updateRoleMutation.isPending}
        >
          {(createRoleMutation.isPending || updateRoleMutation.isPending) ? 'Saving...' : (role ? 'Update Role' : 'Create Role')}
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
