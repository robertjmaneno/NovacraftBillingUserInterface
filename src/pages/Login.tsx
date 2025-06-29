import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, FileText, Receipt, Calculator, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Logo */}
      <div className="flex-1 bg-blue-600 flex items-start justify-center p-8 pt-8 relative overflow-hidden">
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
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
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

              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

           
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
