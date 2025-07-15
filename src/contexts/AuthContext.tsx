import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, LoginResponse } from '../services/api';

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string, confirmNewPassword: string, email?: string) => Promise<boolean>;
  verifyMfa: (userId: string, mfaCode: string) => Promise<boolean>;
  sendMfaCode: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
            // Redirect to login if we're not already there
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            return;
          }
          
          setToken(storedToken);
          
          // Parse stored user data
          const userData = JSON.parse(storedUser);
          
          // Extract roles and permissions from JWT token
          const { getUserRoles, getUserPermissions } = await import('../lib/jwt-utils');
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

  const login = async (email: string, password: string): Promise<boolean> => {
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
        if (response.otp) {
          // Store temporary user data for MFA verification
          localStorage.setItem('tempUserData', JSON.stringify({ 
            email: email,
            password: password, // Store password temporarily for MFA completion
            requiresMfa: true,
            otp: response.otp // Store the OTP for verification
          }));
          return false; // Indicate MFA is required
        }
        
        // Normal login success
        if (!response.data || !response.data.accessToken || !response.data.user) {
          throw new Error('Invalid login response: missing token or user data');
        }
        
        const { accessToken, user: userData } = response.data;
        
        // Store token
        localStorage.setItem('authToken', accessToken);
        setToken(accessToken);
        
        // Extract roles and permissions from JWT token and update user data
        const { getUserRoles, getUserPermissions } = await import('../lib/jwt-utils');
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
        
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      
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
      const response = await apiService.resetPassword({ token, newPassword, confirmNewPassword, email });
      
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

  const verifyMfa = async (userId: string, mfaCode: string): Promise<boolean> => {
    try {
      const { apiService } = await import('../services/api');
      const response = await apiService.verifyMfa({ userId, mfaCode });
      
      if (response.success) {
        const { accessToken, user: userData } = response.data;
        
        // Store token
        localStorage.setItem('authToken', accessToken);
        setToken(accessToken);
        
        // Extract roles and permissions from JWT token and update user data
        const { getUserRoles, getUserPermissions } = await import('../lib/jwt-utils');
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

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyMfa,
    sendMfaCode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 