
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
    permissions: ['Dashboard.View'] // From JWT token
  },
  { 
    name: 'Invoices', 
    href: '/invoices', 
    icon: FileText,
    permissions: ['Invoices.Read'] // From JWT token
  },
  { 
    name: 'Customers', 
    href: '/customers', 
    icon: Users,
    permissions: ['Customers.Read'] // From JWT token
  },
  { 
    name: 'Services', 
    href: '/services', 
    icon: Package,
    permissions: ['Services.Read', 'Products.Read'] // From JWT token
  },
  { 
    name: 'Subscriptions', 
    href: '/subscriptions', 
    icon: Calendar,
    permissions: ['Subscriptions.Read'] // From JWT token
  },
  { 
    name: 'Payments', 
    href: '/payments', 
    icon: CreditCard,
    permissions: ['Payments.Read'] // From JWT token
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: Receipt,
    permissions: ['Reports.View'] // From JWT token
  },
  { 
    name: 'Users', 
    href: '/users', 
    icon: UserCog,
    permissions: ['Users.Read', 'Users.Manage'] // From JWT token
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
    permissions: ['Settings.Read'] // From JWT token
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    permissions: ['Settings.Read'] // From JWT token
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { userPermissions } = usePermissions();
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

  // Helper function to check if user should see menu item based on permissions only
  const shouldShowMenuItem = (item: NavigationItem) => {
    // Profile is always visible (no permissions required)
    if (item.permissions.length === 0) {
      return true;
    }
    
    // Check if user has ANY of the required permissions
    const hasPermission = item.permissions.some((permission: string) => userPermissions.includes(permission));
    
    return hasPermission;
  };

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
                {navigation.filter(shouldShowMenuItem).map((item) => (
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
          {navigation.filter(shouldShowMenuItem).map((item) => (
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
