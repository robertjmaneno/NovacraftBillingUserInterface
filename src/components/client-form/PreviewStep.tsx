import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Mail, Phone, MapPin, FileText, Calendar } from 'lucide-react';

export interface ClientFormData {
  // Core Information
  name: string;
  email: string;
  phone: string;
  website: string;
  taxId: string;
  registrationNumber: string;
  
  // Physical Address
  physicalAddress: string;
  physicalCity: string;
  physicalState: string;
  physicalZipCode: string;
  physicalCountry: string;
  
  // Billing Address
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingCountry: string;
  
  // Documents
  businessLicense: File | null;
  taxCertificate: File | null;
  
  // Additional fields
  industry: string;
  companySize: string;
  preferredCurrency: string;
  paymentTerms: string;
  notes: string;
}

interface PreviewStepProps {
  formData: ClientFormData;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Client Information Preview</h2>
        <p className="text-gray-600">Please review the information before submitting</p>
      </div>

      {/* Core Information */}
      <Card className="border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <p className="text-gray-900">{formData.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Industry</label>
              <p className="text-gray-900">{formData.industry || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{formData.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Website</label>
              <p className="text-gray-900">{formData.website || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Company Size</label>
              <p className="text-gray-900">{formData.companySize || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tax ID</label>
              <p className="text-gray-900">{formData.taxId || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Registration Number</label>
              <p className="text-gray-900">{formData.registrationNumber || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Address */}
      <Card className="border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Physical Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Address</label>
              <p className="text-gray-900">{formData.physicalAddress || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <p className="text-gray-900">{formData.physicalCity || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">State/Province</label>
              <p className="text-gray-900">{formData.physicalState || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">ZIP/Postal Code</label>
              <p className="text-gray-900">{formData.physicalZipCode || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Country</label>
              <p className="text-gray-900">{formData.physicalCountry || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card className="border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Billing Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Address</label>
              <p className="text-gray-900">{formData.billingAddress || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <p className="text-gray-900">{formData.billingCity || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">State/Province</label>
              <p className="text-gray-900">{formData.billingState || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">ZIP/Postal Code</label>
              <p className="text-gray-900">{formData.billingZipCode || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Country</label>
              <p className="text-gray-900">{formData.billingCountry || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Preferences */}
      <Card className="border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Business Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Preferred Currency</label>
              <p className="text-gray-900">{formData.preferredCurrency || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Payment Terms</label>
              <p className="text-gray-900">{formData.paymentTerms || 'Not provided'}</p>
            </div>
          </div>
          {formData.notes && (
            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <p className="text-gray-900">{formData.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Business License</label>
              <p className="text-gray-900">
                {formData.businessLicense ? formData.businessLicense.name : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tax Certificate</label>
              <p className="text-gray-900">
                {formData.taxCertificate ? formData.taxCertificate.name : 'Not provided'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
