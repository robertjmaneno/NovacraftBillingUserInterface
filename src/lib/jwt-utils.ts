export interface JwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  role?: string | string[];
  permission?: string | string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function decodeJwtToken(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    
    // Log available claims (excluding sensitive data)
    const claimKeys = Object.keys(payload);
    console.log('Available JWT claims:', claimKeys);
    
    return payload;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

export function getUserRoles(token: string): string[] {
  const payload = decodeJwtToken(token);
  if (!payload) return [];
  
  const roles = payload.role;
  if (Array.isArray(roles)) {
    return roles;
  } else if (typeof roles === 'string') {
    return [roles];
  }
  return [];
}

export function getUserPermissions(token: string): string[] {
  const payload = decodeJwtToken(token);
  if (!payload) return [];
  
  console.log('JWT Payload for permissions:', payload);
  
  // Try different possible permission claim names
  const possiblePermissionKeys = ['permission', 'permissions', 'perms', 'scope', 'scopes'];
  let permissions: unknown = null;
  let usedKey = '';
  
  for (const key of possiblePermissionKeys) {
    if (payload[key]) {
      permissions = payload[key];
      usedKey = key;
      break;
    }
  }
  
  console.log(`Found permissions under key "${usedKey}":`, permissions);
  
  if (Array.isArray(permissions)) {
    console.log('Permissions as array:', permissions);
    return permissions as string[];
  } else if (typeof permissions === 'string') {
    console.log('Permissions as string:', permissions);
    // Check if it's a space-separated string (common in OAuth scopes)
    if (permissions.includes(' ')) {
      return permissions.split(' ');
    }
    return [permissions];
  }
  
  console.log('No permissions found in JWT token');
  return [];
}

export function hasPermission(token: string, requiredPermission: string): boolean {
  const userPermissions = getUserPermissions(token);
  return userPermissions.includes(requiredPermission);
}

export function hasRole(token: string, requiredRole: string): boolean {
  const userRoles = getUserRoles(token);
  return userRoles.includes(requiredRole);
}

export function hasAnyRole(token: string, requiredRoles: string[]): boolean {
  const userRoles = getUserRoles(token);
  return requiredRoles.some(role => userRoles.includes(role));
}

export function hasAnyPermission(token: string, requiredPermissions: string[]): boolean {
  const userPermissions = getUserPermissions(token);
  return requiredPermissions.some(permission => userPermissions.includes(permission));
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) {
    return true; // Consider invalid tokens as expired
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

export function logTokenDetails(token: string): void {
  const payload = decodeJwtToken(token);
  if (!payload) {
    console.log('❌ Invalid JWT token');
    return;
  }
  
  console.group('🔍 JWT Token Analysis');
  console.log('👤 User ID:', payload.sub);
  console.log('📧 Email:', payload.email);
  console.log('🏷️ Name:', payload.name);
  console.log('👥 Roles:', getUserRoles(token));
  console.log('🔑 Permissions:', getUserPermissions(token));
  console.log('📋 All Claims:', Object.keys(payload));
  console.log('⏳ Token Expires:', new Date((payload.exp || 0) * 1000));
  console.log('⏰ Token Issued:', new Date((payload.iat || 0) * 1000));
  console.log('🔐 Is Expired:', isTokenExpired(token));
  
  // Log the full payload for debugging (be careful in production)
  console.log('🗂️ Full Payload:', payload);
  console.groupEnd();
} 