
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUser } from '@/hooks/use-users';
import { useActiveRoles } from '@/hooks/use-roles';
import { useValidateEmail, useValidatePhone } from '@/hooks/use-users';
import { PermissionGuard } from '@/components/PermissionGuard';
import { PERMISSIONS } from '@/hooks/use-permissions';
import { toast } from 'sonner';
import { FormShimmer } from '@/components/ui/shimmer';

interface CreateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  company: string;
  userType: string;
  roles: string[];
  acceptTerms: boolean;
  acceptMarketing: boolean;
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

export const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading time for form data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  const [formData, setFormData] = useState<CreateUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    company: '',
    userType: '',
    roles: [],
    acceptTerms: true,
    acceptMarketing: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hooks
  const createUserMutation = useCreateUser();
  const { data: rolesData } = useActiveRoles();
  const { data: emailValidation } = useValidateEmail(formData.email);

  const roles = rolesData?.data?.roles || [];
  
  // Debug: Log roles data
  console.log('Roles data:', roles);
  console.log('RolesData:', rolesData);
  console.log('RolesData?.data:', rolesData?.data);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    if (!formData.userType) {
      newErrors.userType = 'User type is required';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Convert role IDs to role names
      const roleNames = formData.roles.length > 0 
        ? formData.roles.map(roleId => {
            const role = roles.find(r => r.id === roleId);
            return role?.name;
          }).filter(Boolean)
        : undefined;

      console.log('Sending role names:', roleNames);

      await createUserMutation.mutateAsync({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company || undefined,
        jobTitle: formData.jobTitle || undefined,
        userType: formData.userType,
        acceptTerms: formData.acceptTerms,
        acceptMarketing: formData.acceptMarketing,
        roleNames: roleNames,
      });
      
      navigate('/users');
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleInputChange = (field: keyof CreateUserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckboxChange = (field: keyof CreateUserFormData, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleRole = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(r => r !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  const isEmailValid = emailValidation?.data;

  if (isLoading) {
    return (
      <PermissionGuard permissions={[PERMISSIONS.USERS_CREATE]}>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
          </div>
          <Card>
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <FormShimmer />
            </CardContent>
          </Card>
        </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permissions={[PERMISSIONS.USERS_CREATE]}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Create New User</h1>
            <p className="text-gray-600 mt-1">Add a new user to the system</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`${errors.firstName ? 'border-red-500' : ''} text-gray-700`}
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
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`${errors.email ? 'border-red-500' : ''} text-gray-700`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
                {formData.email && isEmailValid === false && (
                  <p className="text-sm text-red-600">This email is already in use</p>
                )}
              </div>





            
                              <div className="space-y-2">
                  <Label htmlFor="userType" className="text-gray-700">User Type *</Label>
                  <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                    <SelectTrigger className={`${errors.userType ? 'border-red-500' : ''} text-gray-700`}>
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
                  {errors.userType && (
                    <p className="text-sm text-red-600">{errors.userType}</p>
                  )}
                </div>

              {/* Role Assignment */}
              <div className="space-y-2">
                <Label className="text-gray-700">Roles</Label>
                <div className="space-y-2">
                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={role.id}
                          checked={formData.roles.includes(role.id)}
                          onCheckedChange={() => toggleRole(role.id)}
                        />
                        <Label htmlFor={role.id} className="text-sm cursor-pointer text-gray-700">
                          {role.displayName || role.name}
                        </Label>
                      </div>
                    ))}
                    {roles.length === 0 && (
                      <p className="text-sm text-gray-500">No roles available</p>
                    )}
                  </div>
                  {formData.roles.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Selected roles: {formData.roles.map(roleId => {
                        const role = roles.find(r => r.id === roleId);
                        return role?.displayName || role?.name;
                      }).filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </div>

                               {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-gray-700">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-gray-700">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="text-gray-700"
                    />
                  </div>
                </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleCheckboxChange('acceptTerms', !!checked)}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm text-gray-700">
                    I accept the terms and conditions *
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600">{errors.acceptTerms}</p>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptMarketing"
                    checked={formData.acceptMarketing}
                    onCheckedChange={(checked) => handleCheckboxChange('acceptMarketing', !!checked)}
                  />
                  <Label htmlFor="acceptMarketing" className="text-sm text-gray-700">
                    I agree to receive marketing communications
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-2">
                <Link to="/users">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create User
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
};
