import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, FileText, Receipt, Calculator, CreditCard, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useApiErrorToast } from '@/hooks/use-api-error-toast';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showApiError } = useApiErrorToast();

  // Get email from location state (from SetPassword page)
  const emailFromState = location.state?.email || '';
  const messageFromState = location.state?.message || '';

  const [formData, setFormData] = useState({
    email: emailFromState,
    password: ''
  });

  // Show success message if coming from SetPassword
  useEffect(() => {
    if (messageFromState) {
      toast.success(messageFromState);
    }
  }, [messageFromState]);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success === 'PASSWORD_CHANGE_REQUIRED') {
        // Store temp password for reset
        localStorage.setItem('tempUserData', JSON.stringify({ email: formData.email, password: formData.password }));
        toast.error("Password Change Required - Please change your password on first login.");
        navigate(`/reset-password?firstLogin=1&email=${encodeURIComponent(formData.email)}`);
        return;
      }
      if (success === 'EMAIL_CONFIRMATION_REQUIRED') {
        toast.error("Email Confirmation Required - Please check your email and confirm your account before logging in.");
        navigate(`/confirm-email?email=${encodeURIComponent(formData.email)}`);
        return;
      }
      if (success) {
        // Get the user object from localStorage (set by AuthContext)
        const user = JSON.parse(localStorage.getItem('authUser') || '{}');
        if (user.mustChangePassword) {
          navigate(`/reset-password?firstLogin=1&email=${encodeURIComponent(formData.email)}`);
          return;
        }
        toast.success("Login successful - Welcome back!");
        
        // Add a small delay to ensure auth state is updated
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);
      } else {
        toast.info("MFA verification required - Please check your email for the verification code.");
        navigate('/mfa', { replace: true });
      }
    } catch (error: unknown) {
      // Provide more specific error handling for login
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        
        if (errorMsg.includes('invalid email or password')) {
          toast.error(`Login Failed: The email or password you entered is incorrect. Please double-check your credentials.${formData.email ? ` Make sure you're using the correct email: ${formData.email}` : ''}`);
        } else if (errorMsg.includes('email not confirmed') || errorMsg.includes('confirm your email')) {
          toast.error("Email Not Confirmed: Please check your email and set up your password before logging in. Look for an email with password setup instructions.");
        } else {
          // Use the enhanced API error handler for other errors
          showApiError(error, "Login failed");
        }
      } else {
        showApiError(error, "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login Logo */}
      <div className="flex-1 bg-blue-600 flex items-start justify-center p-8 pt-8 relative overflow-hidden md:order-1 order-2">
        <div className="text-center text-white z-10 -ml-8 mt-2">
          <img 
            src="/Images/billing-software.png" 
            alt="Novacraft Billing Login" 
            className="max-w-lg w-full h-auto"
          />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8 md:order-2 order-1">
        <Card className="w-full max-w-md border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/Images/Logo.webp" 
                alt="Novacraft Billing Logo" 
                className="h-8 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-medium">Welcome back</CardTitle>
            <p className="text-gray-600">Sign in to your account</p>

          </CardHeader>
          <CardContent>
            <form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  console.log('Enter key pressed in form');
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

           
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
