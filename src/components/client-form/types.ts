export interface Address {
  street: string;
  city: string;
  district: string;
  postOfficeBox: string;
  country: string;
  sameAsBilling?: boolean;
}

export interface ClientFormData {
  clientType: 'individual' | 'business';
  firstName?: string;
  lastName?: string;
  businessName?: string;
  billingAddress: Address;
  physicalAddress: Address;
  // Add other fields as needed for your form
  // Example fields:
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  businessLicense?: File | null;
  taxCertificate?: File | null;
  industry?: string;
  companySize?: string;
  preferredCurrency?: string;
  paymentTerms?: string;
  notes?: string;
} 