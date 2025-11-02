import React from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/contexts/AuthContext';

export const PermissionDebugger: React.FC = () => {
  const { userPermissions, userRoles, isAdmin, isManager } = usePermissions();
  const { user } = useAuth();

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-md max-h-96 overflow-auto text-xs z-50">
      <h3 className="font-bold mb-2">🔐 Permission Debug Info</h3>
      
      <div className="mb-2">
        <strong>User:</strong> {user?.email || 'Not logged in'}
      </div>
      
      <div className="mb-2">
        <strong>Roles ({userRoles.length}):</strong>
        <ul className="list-disc list-inside ml-2">
          {userRoles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-2">
        <strong>Permissions ({userPermissions.length}):</strong>
        <ul className="list-disc list-inside ml-2 max-h-32 overflow-auto">
          {userPermissions.map((permission) => (
            <li key={permission}>{permission}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-2">
        <strong>Admin Status:</strong> {isAdmin() ? '✅ Yes' : '❌ No'}
      </div>
      
      <div>
        <strong>Manager Status:</strong> {isManager() ? '✅ Yes' : '❌ No'}
      </div>
    </div>
  );
};