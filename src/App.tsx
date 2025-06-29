import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Invoices } from "./pages/Invoices";
import { CreateInvoice } from "./pages/CreateInvoice";
import { Clients } from "./pages/Clients";
import { CreateClient } from "./pages/CreateClient";
import { Services } from "./pages/Services";
import { Subscriptions } from "./pages/Subscriptions";
import { CreateSubscription } from "./pages/CreateSubscription";
import { Reports } from "./pages/Reports";
import { UserManagement } from "./pages/UserManagement";
import { CreateUser } from "./pages/CreateUser";
import { Roles } from "./pages/Roles";
import { ProfileManagement } from "./pages/ProfileManagement";
import { InvoiceTemplate } from "./pages/InvoiceTemplate";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { MFA } from "./pages/MFA";
import { Payments } from "./pages/Payments";
import NotFound from "./pages/NotFound";
import { Settings } from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Authentication routes (without layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/mfa" element={<MFA />} />
          
          {/* Main app routes (with layout) */}
          <Route path="/" element={<Login />} />
          <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
          <Route path="/invoices/new" element={<Layout><CreateInvoice /></Layout>} />
          <Route path="/invoices/template" element={<Layout><InvoiceTemplate /></Layout>} />
          <Route path="/clients" element={<Layout><Clients /></Layout>} />
          <Route path="/clients/new" element={<Layout><CreateClient /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/subscriptions" element={<Layout><Subscriptions /></Layout>} />
          <Route path="/subscriptions/new" element={<Layout><CreateSubscription /></Layout>} />
          <Route path="/payments" element={<Layout><Payments /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/users" element={<Layout><UserManagement /></Layout>} />
          <Route path="/users/new" element={<Layout><CreateUser /></Layout>} />
          <Route path="/roles" element={<Layout><Roles /></Layout>} />
          <Route path="/profile" element={<Layout><ProfileManagement /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
