import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, LoginResponse } from '../services/api';

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean | 'EMAIL_CONFIRMATION_REQUIRED' | 'PASSWORD_CHANGE_REQUIRED'>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string, confirmNewPassword: string, email?: string) => Promise<boolean>;
  setPassword: (email: string, token: string, password: string, confirmPassword: string) => Promise<boolean>;
  verifyMfa: (email: string, password: string, mfaCode: string) => Promise<boolean>;
  sendMfaCode: (userId: string) => Promise<boolean>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      
      console.log('Initializing auth with stored token:', storedToken ? 'Present' : 'Not found');
      console.log('Stored user data:', storedUser ? 'Present' : 'Not found');
      
      if (storedToken && storedUser) {
        try {
          // Check if token is expired
          const { isTokenExpired } = await import('../lib/jwt-utils');
          if (isTokenExpired(storedToken)) {
            console.log('Token is expired, clearing auth data');
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setToken(null);
            setUser(null);
            setIsLoading(false);
            // Do NOT redirect to login
            return;
          }
          
          setToken(storedToken);
          
          // Parse stored user data
          const userData = JSON.parse(storedUser);
          
          // Extract roles and permissions from JWT token
          const { getUserRoles, getUserPermissions, logTokenDetails } = await import('../lib/jwt-utils');
          
          // Log detailed token information for debugging
          logTokenDetails(storedToken);
          
          const roles = getUserRoles(storedToken);
          const permissions = getUserPermissions(storedToken);
          
          console.log('Extracted roles:', roles);
          console.log('Extracted permissions:', permissions);
          
          // Create complete user data with roles and permissions
          const userWithAuth = {
            ...userData,
            roles: roles,
            permissions: permissions
          };
          
          // Update stored user data with complete information
          localStorage.setItem('authUser', JSON.stringify(userWithAuth));
          setUser(userWithAuth);
          
          console.log('Auth initialized successfully');
        } catch (error) {
          console.error('Error parsing stored auth data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean | 'EMAIL_CONFIRMATION_REQUIRED' | 'PASSWORD_CHANGE_REQUIRED'> => {
    console.log('AuthContext login called with email:', email);
    try {
      const { apiService } = await import('../services/api');
      console.log('Making login API call...');
      const response = await apiService.login({ email, password });
      
      console.log('Login response:', response);
      console.log('Response structure:', {
        success: response.success,
        message: response.message,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'No data'
      });
      
      // Log the full response for debugging
      console.log('Full login response:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        // Check if this is an MFA required response
        if (response.message === "MFA verification required" || 
            (response.data && response.data.accessToken === "MFA_REQUIRED" && response.data.tokenType === "MFA_REQUIRED")) {
          // Store temporary user data for MFA verification
          localStorage.setItem('tempUserData', JSON.stringify({ 
            email: email,
            password: password, // Store password temporarily for MFA completion
            requiresMfa: true
          }));
          return false; // Indicate MFA is required
        }
        
        // Normal login success
        if (!response.data || !response.data.accessToken) {
          // Check if this is actually an MFA response without the expected token format
          if (response.message === "MFA verification required") {
            localStorage.setItem('tempUserData', JSON.stringify({ 
              email: email,
              password: password,
              requiresMfa: true
            }));
            return false; // Indicate MFA is required
          }
          throw new Error('Invalid login response: missing token data');
        }
        
        const { accessToken, refreshToken, expiresAt, tokenType } = response.data;
        
        // Store tokens
        localStorage.setItem('authToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        setToken(accessToken);
        
        // Extract user data and roles/permissions from JWT token
        const { getUserRoles, getUserPermissions, decodeJwtToken } = await import('../lib/jwt-utils');
        const payload = decodeJwtToken(accessToken);
        
        if (!payload) {
          throw new Error('Invalid JWT token received');
        }
        
        // Extract basic user info from JWT
        const userData = {
          id: payload.sub || '',
          email: payload.email || email,
          firstName: (payload.given_name as string) || '',
          lastName: (payload.family_name as string) || '',
          fullName: payload.name || '',
          emailConfirmed: true, // User can login, so email is confirmed
          twoFactorEnabled: true, // Based on new flow
          // Add other default fields as needed
          status: 'Active',
          userType: 'Customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          age: 0,
          phoneNumberConfirmed: false,
          lockoutEnabled: false,
          accessFailedCount: 0
        };
        
        const roles = getUserRoles(accessToken);
        const permissions = getUserPermissions(accessToken);
        
        // Create complete user data with roles and permissions
        const userWithAuth = {
          ...userData,
          roles: roles,
          permissions: permissions
        };
        
        // Store and set user data
        localStorage.setItem('authUser', JSON.stringify(userWithAuth));
        setUser(userWithAuth);
        
        console.log('Auth state updated successfully:', {
          token: !!accessToken,
          user: !!userWithAuth,
          userId: userWithAuth.id
        });
        
        // Wait for the next tick to ensure state updates have been processed
        await new Promise(resolve => setTimeout(resolve, 0));
        
        return true;
      } else {
        // Check for password change required
        if (response.message && response.message.toLowerCase().includes('password change required')) {
          return 'PASSWORD_CHANGE_REQUIRED';
        }
        // Check for email confirmation required
        if (response.message && response.message.toLowerCase().includes('email not confirmed')) {
          return 'EMAIL_CONFIRMATION_REQUIRED';
        }
        throw new Error(response.message);
      }
    } catch (error: unknown) {
      console.error('Login failed:', error);
      if (error && typeof error === 'object') {
        console.error('Error object:', error);
        if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
          console.error('Error message:', (error as { message: string }).message);
        }
        if ('response' in error) {
          console.error('Error response:', (error as { response: unknown }).response);
        }
      }
      
      // Check if it's an account lock error
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('lock') || 
            errorMessage.includes('suspended') || 
            errorMessage.includes('disabled') ||
            errorMessage.includes('account')) {
          // Re-throw the error with the specific lock message
          throw new Error(error.message);
        }
      }

      // Check for password change required in error message
      if (error instanceof Error && error.message.toLowerCase().includes('password change required')) {
        return 'PASSWORD_CHANGE_REQUIRED';
      }
      // Check for email confirmation required in error message
      if (error instanceof Error && error.message.toLowerCase().includes('email not confirmed')) {
        return 'EMAIL_CONFIRMATION_REQUIRED';
      }
      
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const { apiService } = await import('../services/api');
      const response = await apiService.forgotPassword({ email });
      
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string, confirmNewPassword: string, email?: string): Promise<boolean> => {
    try {
      const { apiService } = await import('../services/api');
      const response = await apiService.resetPassword({ email: email || '', token, newPassword, confirmPassword: confirmNewPassword });
      
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  const setPassword = async (email: string, token: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      const { apiService } = await import('../services/api');
      const response = await apiService.setPassword({ email, token, password, confirmPassword });
      
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Set password failed:', error);
      throw error;
    }
  };

  const verifyMfa = async (email: string, password: string, mfaCode: string): Promise<boolean> => {
    try {
      const { apiService } = await import('../services/api');
      const response = await apiService.verifyMfaUnauthenticated({ email, password, mfaCode });
      
      if (response.success) {
        const { accessToken, refreshToken, expiresAt, tokenType } = response.data;
        
        // Store tokens
        localStorage.setItem('authToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        setToken(accessToken);
        
        // Extract user data and roles/permissions from JWT token
        const { getUserRoles, getUserPermissions, decodeJwtToken } = await import('../lib/jwt-utils');
        const payload = decodeJwtToken(accessToken);
        
        if (!payload) {
          throw new Error('Invalid JWT token received');
        }
        
        // Extract basic user info from JWT
        const userData = {
          id: payload.sub || '',
          email: payload.email || email,
          firstName: (payload.given_name as string) || '',
          lastName: (payload.family_name as string) || '',
          fullName: payload.name || '',
          emailConfirmed: true, // User can login, so email is confirmed
          twoFactorEnabled: true, // Based on new flow
          // Add other default fields as needed
          status: 'Active',
          userType: 'Customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          age: 0,
          phoneNumberConfirmed: false,
          lockoutEnabled: false,
          accessFailedCount: 0
        };
        
        const roles = getUserRoles(accessToken);
        const permissions = getUserPermissions(accessToken);
        
        // Create complete user data with roles and permissions
        const userWithAuth = {
          ...userData,
          roles: roles,
          permissions: permissions
        };
        
        // Store and set user data
        localStorage.setItem('authUser', JSON.stringify(userWithAuth));
        setUser(userWithAuth);
        
        // Clear temporary user data
        localStorage.removeItem('tempUserData');
        
        console.log('MFA verification successful, auth state updated');
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('MFA verification failed:', error);
      throw error;
    }
  };

  const sendMfaCode = async (userId: string): Promise<boolean> => {
    try {
      const { apiService } = await import('../services/api');
      const response = await apiService.sendMfaCode({ userId });
      
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Send MFA code failed:', error);
      throw error;
    }
  };

  const refreshAuth = async () => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    forgotPassword,
    resetPassword,
    setPassword,
    verifyMfa,
    sendMfaCode,
    refreshAuth, // Add this to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 