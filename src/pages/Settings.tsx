
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Lock,
  Smartphone,
  Mail,
  Save,
  Upload,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { apiService } from '@/services/api';
import { PasswordChangeDialog } from '@/components/PasswordChangeDialog';
import { useMfaStatus, useToggleMfa } from '@/hooks/use-mfa';
import { getUserInitials } from '@/lib/utils';

export const Settings: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    company: user?.company || '',
    avatar: user?.avatar || ''
  });

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  // MFA hooks
  const { data: mfaStatus, isLoading: mfaLoading, error: mfaError } = useMfaStatus(user?.id);
  const toggleMfaMutation = useToggleMfa();

  const [security, setSecurity] = useState({
    mfaEnabled: user?.twoFactorEnabled || false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Africa/Blantyre',
    currency: 'MWK'
  });

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update profile data when user data changes
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        company: user.company || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  // Update MFA status when API data changes
  useEffect(() => {
    if (mfaStatus?.data?.enabled !== undefined) {
      setSecurity(prev => ({
        ...prev,
        mfaEnabled: mfaStatus.data.enabled
      }));
    } else if (user?.twoFactorEnabled !== undefined) {
      setSecurity(prev => ({
        ...prev,
        mfaEnabled: user.twoFactorEnabled
      }));
    }
  }, [mfaStatus?.data?.enabled, user?.twoFactorEnabled]);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleMfaToggle = async (enabled: boolean) => {
    try {
      await toggleMfaMutation.mutateAsync(enabled);
      
      toast.success(`MFA ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Failed to toggle MFA:', error);
      toast.error('Failed to update MFA settings');
    }
  };

  const handleChangePassword = () => {
    setPasswordDialogOpen(true);
  };

  const formatLastPasswordChange = () => {
    if (!user?.lastPasswordChange) {
      return 'Never';
    }
    
    const lastChange = new Date(user.lastPasswordChange);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastChange.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return lastChange.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading settings...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">Authentication required</div>
            <p className="text-gray-600">Please log in to view settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-lg">
                    {getUserInitials(profile.firstName, profile.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="cursor-pointer"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <span className="font-medium">Enable MFA</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={security.mfaEnabled}
                    onCheckedChange={handleMfaToggle}
                    disabled={toggleMfaMutation.isPending || mfaLoading}
                  />
                </div>

                {security.mfaEnabled && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">MFA is enabled</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Your account is protected with multi-factor authentication.
                    </p>
                    <Button variant="outline" size="sm">
                      Configure MFA
                    </Button>
                  </div>
                )}

                {!security.mfaEnabled && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-900">MFA is disabled</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Enable multi-factor authentication for enhanced security.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span className="font-medium">Login Alerts</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Get notified of new sign-ins to your account
                    </p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginAlerts: checked }))}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleChangePassword}>
                      Change Password
                    </Button>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Last changed {formatLastPasswordChange()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">Email Notifications</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Receive updates about invoices and payments via email
                  </p>
                </div>
                <Switch
                  checked={security.emailNotifications}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span className="font-medium">SMS Notifications</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Get important alerts via text message
                  </p>
                </div>
                <Switch
                  checked={security.smsNotifications}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, smsNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={preferences.timezone}
                    onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Africa/Blantyre">Malawi Time (CAT)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <select
                  id="currency"
                  value={preferences.currency}
                  onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MWK">MWK - Malawi Kwacha</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PasswordChangeDialog 
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
    </div>
  );
};
