import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';    // Notification library
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { SetPassword } from './pages/SetPassword';
import { MFA } from './pages/MFA';
import { Dashboard } from './pages/Dashboard';
import { Customers } from "./pages/Customers";
import { CreateCustomer } from "./pages/CreateCustomer";
import { Invoices } from './pages/Invoices';
import { CreateInvoice } from './pages/CreateInvoice';
import { InvoiceTemplate } from './pages/InvoiceTemplate';
import { Subscriptions } from './pages/Subscriptions';
import { CreateSubscription } from './pages/CreateSubscription';
import { Payments } from './pages/Payments';
import { Services } from './pages/Services';
import { CreateServiceDialog } from './components/CreateServiceDialog';
import { UserManagement } from './pages/UserManagement';
import { CreateUser } from './pages/CreateUser';
import { RoleManagement } from './pages/RoleManagement';
import { ProfileManagement } from './pages/ProfileManagement';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route path="/mfa" element={<MFA />} />

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Outlet />
                  </Layout>
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/new" element={<CreateCustomer />} />
                <Route path="/customers/create" element={<CreateCustomer />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/invoices/create" element={<CreateInvoice />} />
                <Route path="/invoices/template" element={<InvoiceTemplate />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/subscriptions/create" element={<CreateSubscription />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/services" element={<Services />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/users/create" element={<CreateUser />} />
                <Route path="/roles" element={<RoleManagement />} />
                <Route path="/profile" element={<ProfileManagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
        <Toaster position="top-right" />
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
