
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  User, 
  Calendar,
  BarChart3,
  Settings,
  CreditCard,
  Receipt,
  Package,
  UserCog,
  Palette,
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions: string[];
}

const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: BarChart3,
    permissions: ['Dashboard.View', 'Dashboard.ViewOwn', 'Dashboard.Manage'] // View system dashboard, own dashboard, or manage all dashboards
  },
  { 
    name: 'Invoices', 
    href: '/invoices', 
    icon: FileText,
    permissions: ['Invoices.View', 'Invoices.ViewOwn', 'Invoices.Manage', 'Invoices.ManageOwn'] // View all invoices, own invoices, or manage invoices
  },
  { 
    name: 'Customers', 
    href: '/customers', 
    icon: Users,
    permissions: ['Customers.View', 'Customers.ViewOwn', 'Customers.Manage', 'Customers.ManageOwn'] // View all customers, own profile, or manage customers
  },
  { 
    name: 'Services', 
    href: '/services', 
    icon: Package,
    permissions: ['Products.Read', 'Products.Manage'] // View or manage products/services
  },
  { 
    name: 'Subscriptions', 
    href: '/subscriptions', 
    icon: Calendar,
    permissions: ['Subscriptions.View', 'Subscriptions.ViewOwn', 'Subscriptions.Manage', 'Subscriptions.ManageOwn'] // View all subscriptions, own subscriptions, or manage subscriptions
  },
  { 
    name: 'Payments', 
    href: '/payments', 
    icon: CreditCard,
    permissions: ['Payments.View', 'Payments.ViewOwn', 'Payments.Manage', 'Payments.ManageOwn'] // View all payments, own payments, or manage payments
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: Receipt,
    permissions: ['Reports.View', 'Reports.ViewOwn', 'Reports.Manage', 'Reports.ManageOwn'] // View all reports, own reports, or manage reports
  },
  { 
    name: 'Users', 
    href: '/users', 
    icon: UserCog,
    permissions: ['Users.Read', 'Users.Manage'] // View or manage users (admin only)
  },
  { 
    name: 'Roles', 
    href: '/roles', 
    icon: UserCog,
    permissions: ['Roles.Read', 'Roles.Manage'] // View or manage roles (admin only)
  },
  { 
    name: 'Profile', 
    href: '/profile', 
    icon: User,
    permissions: [] // Always visible - user's own profile
  },
  { 
    name: 'Invoice Template', 
    href: '/invoices/template', 
    icon: Palette,
    permissions: ['Settings.View', 'Settings.ViewOwn', 'Settings.Manage', 'Settings.ManageOwn'] // Requires settings permissions
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    permissions: ['Settings.View', 'Settings.ViewOwn', 'Settings.Manage', 'Settings.ManageOwn'] // View system settings, own settings, or manage settings
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { userPermissions, hasAnyPermission } = usePermissions();
  const { logout, user } = useAuth();
  const { isOpen, isMobile, closeSidebar } = useSidebar();

  const handleLogout = () => {
    logout();
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile after navigation
    if (isMobile) {
      closeSidebar();
    }
  };

  // Helper function to check if user should see menu item based on permissions
  const shouldShowMenuItem = (item: NavigationItem) => {
    // Profile is always visible (no permissions required)
    if (item.permissions.length === 0) {
      return true;
    }
    
    // Use the hasAnyPermission hook for better permission checking
    const hasAccess = hasAnyPermission(item.permissions);
    
    // Debug logging to help troubleshoot permission issues
    if (process.env.NODE_ENV === 'development') {
      console.log(`MenuItem "${item.name}": Required permissions:`, item.permissions);
      console.log(`User permissions:`, userPermissions);
      console.log(`Has access:`, hasAccess);
    }
    
    return hasAccess;
  };

  // Filter navigation items based on permissions
  const visibleNavigation = navigation.filter(shouldShowMenuItem);

  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('User permissions:', userPermissions);
    console.log('Visible navigation items:', visibleNavigation.map(item => item.name));
  }

  // Mobile overlay when sidebar is open
  if (isMobile) {
    if (isOpen) {
      return (
        <>
          {/* Mobile backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={closeSidebar}
          />
          
          {/* Mobile sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/Images/Logo.webp" 
                    alt="Novacraft Billing Logo" 
                    className="h-8 w-auto"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeSidebar}
                  className="p-2 hover:bg-gray-100"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {visibleNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      location.pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                ))}
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 w-full mt-4"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </>
      );
    } else {
      return null;
    }
  }

  // Desktop sidebar - only show if isOpen is true
  if (isOpen) {
    return (
      <div className="flex flex-col w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
          <div className="flex items-center space-x-2">
            <img 
              src="/Images/Logo.webp" 
              alt="Novacraft Billing Logo" 
              className="h-8 w-auto"
            />
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {visibleNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                location.pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 w-full mt-4"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>
    );
  }

  // Return null when sidebar is closed
  return null;
};
