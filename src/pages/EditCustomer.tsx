import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCustomer, useUpdateCustomer } from '@/hooks/use-customers';
import { useUsers } from '@/hooks/use-users';
import { CustomerForm } from './CreateCustomer';

// Helper to map backend Customer to CustomerFormData
function mapCustomerToFormData(customer) {
  // Find billing and physical addresses
  const billing = customer.addresses.find(a => a.addressType === 1) || {};
  const physical = customer.addresses.find(a => a.addressType === 2) || {};
  return {
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    organizationName: customer.organizationName || '',
    phoneNumber: customer.phoneNumber || '',
    email: customer.email || '',
    customerType: customer.customerType ?? 0,
    taxId: customer.taxId || '',
    registrationNumber: customer.registrationNumber || '',
    contactPerson: customer.contactPerson || '',
    contactPersonId: '', // Not available directly
    contactPhone: customer.contactPhone || '',
    contactEmail: customer.contactEmail || '',
    notes: customer.notes || '',
    billingStreetAddress: billing.streetAddress || '',
    billingCity: billing.city || '',
    billingDistrict: billing.district || '',
    billingPostOfficeBox: billing.postOfficeBox || '',
    billingCountry: billing.country || '',
    billingPostalCode: billing.postalCode || '',
    billingState: billing.state || '',
    billingAdditionalInfo: billing.additionalInfo || '',
    physicalStreetAddress: physical.streetAddress || '',
    physicalCity: physical.city || '',
    physicalDistrict: physical.district || '',
    physicalCountry: physical.country || '',
    physicalPostalCode: physical.postalCode || '',
    physicalState: physical.state || '',
    documents: (customer.documents || []).map(doc => ({
      fileName: doc.fileName,
      documentType: doc.documentType,
      description: doc.description || '',
      documentNumber: doc.documentNumber || '',
      expiryDate: doc.expiryDate || '',
      issueDate: doc.issueDate || '',
      issuingAuthority: doc.issuingAuthority || '',
      tags: doc.tags || '',
 
    })),
  };
}

const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = id ? parseInt(id, 10) : undefined;
  const { data, isLoading } = useCustomer(customerId, { enabled: !!customerId });
  const updateCustomer = useUpdateCustomer();
  const { data: usersData, isLoading: usersLoading } = useUsers(1, 100);
  const users = usersData?.data?.items || [];

  if (isLoading || !data?.data) {
    return <div>Loading...</div>;
  }

  const initialValues = mapCustomerToFormData(data.data);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/customers')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customers
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Customer</h1>
          <p className="text-gray-600 mt-1">Update customer details</p>
        </div>
      </div>
      <CustomerForm
        initialValues={initialValues}
        mode="edit"
        users={users}
        usersLoading={usersLoading}
        onSubmit={async (values) => {
          // Only send fields that are part of UpdateCustomerRequest
          const {
            firstName,
            lastName,
            organizationName,
            phoneNumber,
            email,
            customerType,
            notes,
            taxId,
            registrationNumber,
            contactPerson,
            contactPhone,
            contactEmail,
          } = values;
          await updateCustomer.mutateAsync({ id: customerId, data: {
            firstName,
            lastName,
            organizationName,
            phoneNumber,
            email,
            customerType,
            notes,
            taxId,
            registrationNumber,
            contactPerson,
            contactPhone,
            contactEmail,
          }});
          navigate('/customers');
        }}
        onCancel={() => navigate('/customers')}
      />
    </div>
  );
};

export default EditCustomer; 