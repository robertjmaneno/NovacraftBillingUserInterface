
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
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: BarChart3,
    permissions: ['View Dashboard'] // Proper new format from backend seeder
  },
  { 
    name: 'Invoices', 
    href: '/invoices', 
    icon: FileText,
    permissions: ['View Invoices'] // Proper new format from backend seeder
  },
  { 
    name: 'Customers', 
    href: '/customers', 
    icon: Users,
    permissions: ['View Customers'] // Proper new format from backend seeder
  },
  { 
    name: 'Services', 
    href: '/services', 
    icon: Package,
    permissions: ['View Services', 'View Products'] // Proper new format from backend seeder
  },
  { 
    name: 'Subscriptions', 
    href: '/subscriptions', 
    icon: Calendar,
    permissions: ['View Subscriptions'] // Proper new format from backend seeder
  },
  { 
    name: 'Payments', 
    href: '/payments', 
    icon: CreditCard,
    permissions: ['View Payments'] // Proper new format from backend seeder
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: Receipt,
    permissions: ['View Reports'] // Proper new format from backend seeder
  },
  { 
    name: 'Users', 
    href: '/users', 
    icon: UserCog,
    permissions: ['View Users', 'Manage Users'] // Proper new format from backend seeder
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
    permissions: ['View Invoice Templates'] // Proper new format from backend seeder
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    permissions: ['View Settings'] // Proper new format from backend seeder
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { userPermissions } = usePermissions();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Helper function to check if user should see menu item based on permissions only
  const shouldShowMenuItem = (item: any) => {
    // Profile is always visible (no permissions required)
    if (item.permissions.length === 0) {
      return true;
    }
    
    // Check if user has ANY of the required permissions
    const hasPermission = item.permissions.some((permission: string) => userPermissions.includes(permission));
    
    return hasPermission;
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
        <div className="flex items-center space-x-2">
          <img 
            src="/Images/Logo.webp" 
            alt="Novacraft Billing Logo" 
            className="h-8 w-auto"
          />
          
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
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
        
        {/* Spacer for logout positioning */}
        <div className="flex-1"></div>
        
        {/* Additional spacing before logout */}
        <div className="h-3"></div>
        
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};
