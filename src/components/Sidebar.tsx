
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
import { PermissionGuard } from './PermissionGuard';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: BarChart3,
    permissions: [PERMISSIONS.DASHBOARD_VIEW] // Requires dashboard view permission
  },
  { 
    name: 'Invoices', 
    href: '/invoices', 
    icon: FileText,
    permissions: [PERMISSIONS.INVOICES_READ] // Requires invoice read permission
  },
  { 
    name: 'Customers', 
    href: '/customers', 
    icon: Users,
    permissions: [PERMISSIONS.CUSTOMERS_READ] // Requires customer read permission
  },
  { 
    name: 'Services', 
    href: '/services', 
    icon: Package,
    permissions: [PERMISSIONS.PRODUCTS_READ] // Requires product read permission
  },
  { 
    name: 'Subscriptions', 
    href: '/subscriptions', 
    icon: Calendar,
    permissions: [PERMISSIONS.SUBSCRIPTIONS_READ] // Requires subscription read permission
  },
  { 
    name: 'Payments', 
    href: '/payments', 
    icon: CreditCard,
    permissions: [PERMISSIONS.PAYMENTS_READ] // Requires payment read permission
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: Receipt,
    permissions: [PERMISSIONS.REPORTS_VIEW] // Requires report view permission
  },
  { 
    name: 'Users', 
    href: '/users', 
    icon: UserCog,
    permissions: [PERMISSIONS.USERS_READ] // Requires user read permission
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
    permissions: [PERMISSIONS.INVOICES_READ] // Requires invoice read permission
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    permissions: [PERMISSIONS.SETTINGS_READ] // Requires settings read permission
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { userPermissions } = usePermissions();
  const { logout } = useAuth();

  // Debug: Log user permissions
  console.log('User permissions in sidebar:', userPermissions);
  console.log('Available permissions:', Object.values(PERMISSIONS));

  const handleLogout = () => {
    logout();
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
        {navigation.map((item) => (
          <PermissionGuard 
            key={item.name}
            permissions={item.permissions}
            requireAll={false}
          >
            <Link
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
          </PermissionGuard>
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
