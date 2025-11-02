import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, FileText, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [searchParams] = useSearchParams();
  const rawToken = searchParams.get('token');
  const email = searchParams.get('email');
  const isFirstLogin = searchParams.get('firstLogin') === '1';
  

  const token = rawToken ? decodeURIComponent(rawToken) : null;
  
  // Debug logging
  console.log('Raw token from URL:', rawToken);
  console.log('Decoded token:', token);
  console.log('Token length:', token?.length);

  const { resetPassword, refreshAuth } = useAuth();
  const [firstLoginLoading, setFirstLoginLoading] = useState(false);
  const [firstLoginReset, setFirstLoginReset] = useState(false);
  const [firstLoginForm, setFirstLoginForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const [firstLoginError, setFirstLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirstLogin && !token) {
      toast.error("Invalid reset link - The password reset link is invalid or has expired.");
      navigate('/login');
    }
  }, [token, isFirstLogin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match - Please make sure both passwords are the same.");
      return;
    }

  
    if (formData.password.length < 6) {
      toast.error("Password too short - Password must be at least 6 characters long.");
      return;
    }

   
    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasLowercase = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      toast.error("Password requirements not met - Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    if (!token) {
      toast.error("Invalid reset link - The password reset link is invalid or has expired.");
      return;
    }

    setIsLoading(true);

    try {
      const success = await resetPassword(token, formData.password, formData.confirmPassword, email || '');
      
      if (success) {
        setIsReset(true);
        toast.success("Password reset successful - Your password has been reset successfully.");
      }
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      
      const errorMessage = (error && typeof (error as { message?: unknown }).message === 'string')
        ? (error as { message: string }).message
        : "Failed to reset password. Please try again.";
      
      toast.error(`Reset failed - ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // For first login, get the temp password from localStorage (set during login)
  const tempUserData = localStorage.getItem('tempUserData');
  const tempPassword = tempUserData ? (() => { try { return JSON.parse(tempUserData).password; } catch { return ''; } })() : '';

  // First login password reset handler
  const handleFirstLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFirstLoginError(null);
    if (firstLoginForm.newPassword !== firstLoginForm.confirmPassword) {
      toast.error("Passwords don't match - Please make sure both passwords are the same.");
      return;
    }
    // Password validation
    if (firstLoginForm.newPassword.length < 6) {
      toast.error("Password too short - Password must be at least 6 characters long.");
      return;
    }
    const hasUppercase = /[A-Z]/.test(firstLoginForm.newPassword);
    const hasLowercase = /[a-z]/.test(firstLoginForm.newPassword);
    const hasNumber = /\d/.test(firstLoginForm.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(firstLoginForm.newPassword);
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      toast.error("Password requirements not met - Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }
    setFirstLoginLoading(true);
    try {
      const { apiService } = await import('../services/api');
      const payload = {
        email: email || '',
        currentPassword: tempPassword,
        newPassword: firstLoginForm.newPassword
      };
      const resp = await apiService.forcePasswordChangeUnauthenticated(payload);
      if (resp.success && resp.data) {
        localStorage.setItem('authToken', resp.data.accessToken);
        localStorage.setItem('refreshToken', resp.data.refreshToken);
        localStorage.setItem('authUser', JSON.stringify(resp.data.user));
        if (refreshAuth) {
          await refreshAuth();
        }
        setFirstLoginReset(true);
        toast.success("Password changed successfully - You are now logged in.");
        await new Promise(res => setTimeout(res, 200));
        navigate('/');
        return;
      } else if (resp.success) {
        setFirstLoginReset(true);
        toast.success("Password changed successfully - You can now log in with your new password.");
        // Do NOT navigate away
        return;
      } else {
        setFirstLoginError(resp.message || "Failed to reset password. Please try again.");
        toast.error(`Reset failed - ${resp.message || "Failed to reset password. Please try again."}`);
        // Do NOT navigate away
        return;
      }
    } catch (error: unknown) {
      const errorMessage = (error && typeof (error as { message?: unknown }).message === 'string')
        ? (error as { message: string }).message
        : "Failed to reset password. Please try again.";
      
      setFirstLoginError(errorMessage);
      toast.error(`Reset failed - ${errorMessage}`);
    } finally {
      setFirstLoginLoading(false);
    }
  };

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
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <p className="text-gray-600">
            {isFirstLogin
              ? "You must reset your password before accessing the system for the first time."
              : isReset
                ? "Password reset successful!"
                : "Enter your new password"}
          </p>
        </CardHeader>
        <CardContent>
          {isFirstLogin ? (
            !firstLoginReset ? (
              <form onSubmit={handleFirstLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={firstLoginForm.newPassword}
                    onChange={e => setFirstLoginForm(f => ({ ...f, newPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={firstLoginForm.confirmPassword}
                    onChange={e => setFirstLoginForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={firstLoginLoading}>
                  {firstLoginLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
                {firstLoginError && (
                  <div className="text-red-600 text-sm mt-2 text-center">{firstLoginError}</div>
                )}
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Password changed successfully! You can now <Link to="/login" className="text-blue-600 underline">log in</Link> with your new password.
                </p>
              </div>
            )
          ) : !isReset ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
                <p className="text-sm text-gray-600">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
              </div>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link to="/login">Continue to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
