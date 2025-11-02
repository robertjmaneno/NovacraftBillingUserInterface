// Permission Testing Guide for Developers
// =====================================

/*
UPDATED PERMISSION STRUCTURE

Based on the backend seeding code provided, here are the new permission names that the frontend now uses:

1. DASHBOARD PERMISSIONS:
   - Dashboard.View (view system dashboard)
   - Dashboard.ViewOwn (view personal dashboard)
   - Dashboard.Manage (manage all dashboards)
   - Dashboard.ManageOwn (manage own dashboard)

2. INVOICE PERMISSIONS:
   - Invoices.View (view all invoices)
   - Invoices.ViewOwn (view own invoices)
   - Invoices.Manage (manage all invoices)
   - Invoices.ManageOwn (manage own invoices)
   - Invoices.Create, Invoices.Update, Invoices.Delete
   - Invoices.Send, Invoices.Print, Invoices.Approve, Invoices.Void

3. CUSTOMER PERMISSIONS:
   - Customers.View (view all customers)
   - Customers.ViewOwn (view own customer profile)
   - Customers.Manage (manage all customers)
   - Customers.ManageOwn (manage own customer data)
   - Customers.Create, Customers.Update, Customers.Delete

4. SUBSCRIPTION PERMISSIONS:
   - Subscriptions.View (view all subscriptions)
   - Subscriptions.ViewOwn (view own subscriptions)
   - Subscriptions.Manage (manage all subscriptions)
   - Subscriptions.ManageOwn (manage own subscriptions)
   - Subscriptions.Activate, Subscriptions.Suspend, Subscriptions.Cancel, Subscriptions.Renew

5. PAYMENT PERMISSIONS:
   - Payments.View (view all payments)
   - Payments.ViewOwn (view own payments)
   - Payments.Manage (manage all payments)
   - Payments.ManageOwn (manage own payments)
   - Payments.Process, Payments.Refund, Payments.Reconcile

6. REPORT PERMISSIONS:
   - Reports.View (view all reports)
   - Reports.ViewOwn (view own reports)
   - Reports.Manage (manage all reports)
   - Reports.ManageOwn (manage own reports)

7. USER MANAGEMENT PERMISSIONS:
   - Users.Read, Users.Manage
   - Users.Create, Users.Update, Users.Delete
   - Users.Suspend, Users.Activate, Users.ResetPassword

8. ROLE MANAGEMENT PERMISSIONS:
   - Roles.Read, Roles.Manage
   - Roles.Create, Roles.Update, Roles.Delete

9. SETTINGS PERMISSIONS:
   - Settings.View (view all settings)
   - Settings.ViewOwn (view own settings)
   - Settings.Manage (manage all settings)
   - Settings.ManageOwn (manage own settings)

10. INVOICE TEMPLATE PERMISSIONS:
    - InvoiceTemplates.View (view all templates)
    - InvoiceTemplates.ViewOwn (view own templates)
    - InvoiceTemplates.Manage (manage all templates)
    - InvoiceTemplates.ManageOwn (manage own templates)
    - InvoiceTemplates.Use, InvoiceTemplates.Copy

ROLE HIERARCHY (from backend seeding):
- System Administrator: All permissions
- Business Manager: Full business operations
- Team Lead: Team management + business operations
- Sales Representative: Customer and subscription management
- Billing Specialist: Invoice, payment, billing management
- Customer Service: Customer support functions
- Customer User: Self-service customer access
- User: Basic "Own" permissions (default fallback role)
- Auditor: Read-only access for compliance

TESTING CHECKLIST:
================
1. Login as different users with different roles
2. Check that sidebar only shows menu items the user has permission for
3. Use the Permission Debugger (bottom-right corner in dev mode) to see:
   - Current user's roles
   - Current user's permissions
   - Admin/Manager status
4. Test that Profile is always visible (no permissions required)
5. Test that admin-only items (Users, Roles) only show for System Administrator
6. Test that customer users only see their own data options

DEBUGGING:
==========
- Permission Debugger component shows in development mode (bottom-right)
- Console logs show permission checks in development mode
- JWT token permissions are extracted from the token claims
- Check browser console for detailed permission checking logs

COMMON ISSUES:
==============
1. "Only Profile showing": User doesn't have required permissions in JWT token
2. "No menu items": JWT token doesn't contain proper permission claims
3. "Wrong permissions": Backend role-permission mappings need to be updated
4. "Not working after login": Token needs to be refreshed or re-decoded

BACKEND INTEGRATION:
===================
The frontend now expects the JWT token to contain:
- 'permission' or 'permissions' claim with array of permission names
- 'role' claim with array of role names
- Permissions follow the new naming convention (Module.Action format)
*/

export const PermissionTestingGuide = () => {
  return null; // This is just a documentation file
};