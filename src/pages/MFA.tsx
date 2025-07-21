import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Shield, Smartphone, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const MFA: React.FC = () => {
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const { verifyMfa, sendMfaCode } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get user data from localStorage (stored during login)
  const getUserData = () => {
    const tempUserData = localStorage.getItem('tempUserData');
    if (tempUserData) {
      try {
        const userData = JSON.parse(tempUserData);
        return userData;
      } catch (error) {
        console.error('Error parsing temp user data:', error);
      }
    }
    return null;
  };

  const userData = getUserData();
  const email = userData?.email;
  const password = userData?.password;
  const storedOtp = userData?.otp;

  useEffect(() => {
    if (!email) {
      toast({
        title: "Invalid MFA session",
        description: "Please log in again to complete MFA verification.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [email, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Invalid MFA session",
        description: "Please log in again to complete MFA verification.",
        variant: "destructive",
      });
      return;
    }

    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('MFA Verification - Starting verification process');
      console.log('Email:', email);
      console.log('Password available:', !!password);
      console.log('Code entered:', code);
      
      // Use the unauthenticated MFA verification endpoint
      const { apiService } = await import('../services/api');
      console.log('Calling verifyMfaUnauthenticated API...');
      
      const verifyResponse = await apiService.verifyMfaUnauthenticated({
        email: email || '',
        password: password || '',
        mfaCode: code
      });
      
      console.log('MFA Verification Response:', verifyResponse);
      console.log('Response success:', verifyResponse.success);
      console.log('Response has data:', !!verifyResponse.data);
      console.log('Response data keys:', verifyResponse.data ? Object.keys(verifyResponse.data) : 'No data');
      
      if (verifyResponse.success && verifyResponse.data) {
        console.log('MFA verification successful - storing auth data');
        setIsVerified(true);
        
       
        localStorage.setItem('authToken', verifyResponse.data.accessToken);
        localStorage.setItem('authUser', JSON.stringify(verifyResponse.data.user));
        
        console.log('Auth token stored:', !!localStorage.getItem('authToken'));
        console.log('Auth user stored:', !!localStorage.getItem('authUser'));
        
        // Decode and log JWT token contents
        const token = verifyResponse.data.accessToken;
        if (token) {
          import('../lib/jwt-utils').then(({ logTokenDetails, getUserRoles, getUserPermissions }) => {
            logTokenDetails(token);
            
            // Extract roles and permissions from JWT token
            const roles = getUserRoles(token);
            const permissions = getUserPermissions(token);
            
            // Update user data with roles and permissions from token
            const userWithAuth = {
              ...verifyResponse.data.user,
              roles: roles,
              permissions: permissions
            };
            
            // Store updated user data
            localStorage.setItem('authUser', JSON.stringify(userWithAuth));
          });
        }
        
        
        localStorage.removeItem('tempUserData');
        
        toast({
          title: "MFA verification successful",
          description: "You can now access your account.",
        });
        
        console.log('Navigating to dashboard...');
        navigate('/');
      } else {
        console.log('MFA verification failed - invalid response');
        toast({
          title: "Invalid code",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('MFA verification error:', error);
      
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "Invalid MFA session",
        description: "Please log in again to complete MFA verification.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingCode(true);

    try {
      // For now, redirect to login since we need password for unauthenticated MFA
      toast({
        title: "Session expired",
        description: "Please log in again to request a new MFA code.",
        variant: "destructive",
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Send MFA code error:', error);
      
      toast({
        title: "Failed to send code",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  if (!email) {
    return (
      <div className="p-8 text-center text-red-500">
        Unable to load MFA data. Please try again later.<br />
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/Images/Logo.webp" 
              alt="Novacraft Billing Logo" 
              className="h-8 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
          <p className="text-gray-600">
            {isVerified 
              ? "Authentication successful!" 
              : "Enter the 6-digit code from your authenticator app"
            }
          </p>
        </CardHeader>
        <CardContent>
          {!isVerified ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Authentication Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>

              <div className="text-center">
                <Button variant="ghost" className="text-sm" onClick={handleResendCode} disabled={isSendingCode}>
                  {isSendingCode ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 mr-2" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Two-factor authentication successful. You can now access your account.
              </p>
              <Button asChild className="w-full">
                <Link to="/">Continue to Dashboard</Link>
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
