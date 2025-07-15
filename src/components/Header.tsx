import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInitials } from '@/lib/utils';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getPageTitle = (pathname: string) => {
    const routes: { [key: string]: string } = {
      '/': 'Dashboard',
      '/invoices': 'Invoices',
              '/invoices/create': 'Create Invoice',
      '/invoices/template': 'Invoice Template',
      '/customers': 'Customers',
      '/services': 'Services',
      '/subscriptions': 'Subscriptions',
              '/subscriptions/create': 'Create Subscription',
      '/payments': 'Payments',
      '/reports': 'Reports',
      '/users': 'User Management',
      '/roles': 'Role Management',
      '/profile': 'Profile Management',
      '/settings': 'Settings'
    };
    return routes[pathname] || 'Dashboard';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          {getPageTitle(location.pathname)}
        </h1>

        <div className="flex items-center space-x-4">
          {/* Connection Status - Only show in development */}
          {import.meta.env.DEV && <ConnectionStatus />}
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-sm">New invoice payment received</p>
                  <p className="text-xs text-gray-600">2 minutes ago</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="font-medium text-sm">Invoice #INV-001 is overdue</p>
                  <p className="text-xs text-gray-600">1 hour ago</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-sm">New client registered</p>
                  <p className="text-xs text-gray-600">3 hours ago</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt="User" />
                  <AvatarFallback>
                    {user ? getUserInitials(user.firstName, user.lastName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
