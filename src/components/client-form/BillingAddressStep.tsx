
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientFormData } from './types';

interface BillingAddressStepProps {
  formData: ClientFormData;
  updateFormData: (data: Partial<ClientFormData>) => void;
}

const malawiDistricts = [
  'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Chitipa', 'Dedza',
  'Dowa', 'Karonga', 'Kasungu', 'Likoma', 'Lilongwe', 'Machinga',
  'Mangochi', 'Mchinji', 'Mulanje', 'Mwanza', 'Mzimba', 'Neno',
  'Nkhata Bay', 'Nkhotakota', 'Nsanje', 'Ntcheu', 'Ntchisi',
  'Phalombe', 'Rumphi', 'Salima', 'Thyolo', 'Zomba'
];

export const BillingAddressStep: React.FC<BillingAddressStepProps> = ({
  formData,
  updateFormData
}) => {
  const updateBillingAddress = (field: string, value: string) => {
    updateFormData({
      billingAddress: {
        ...formData.billingAddress,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="billingStreet">Street Address *</Label>
        <Input
          id="billingStreet"
          value={formData.billingAddress.street}
          onChange={(e) => updateBillingAddress('street', e.target.value)}
          placeholder="Enter street address"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billingCity">City *</Label>
          <Input
            id="billingCity"
            value={formData.billingAddress.city}
            onChange={(e) => updateBillingAddress('city', e.target.value)}
            placeholder="Enter city"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="billingDistrict">District *</Label>
          <Select
            value={formData.billingAddress.district}
            onValueChange={(value) => updateBillingAddress('district', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {malawiDistricts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billingPostOfficeBox">Post Office Box *</Label>
          <Input
            id="billingPostOfficeBox"
            value={formData.billingAddress.postOfficeBox}
            onChange={(e) => updateBillingAddress('postOfficeBox', e.target.value)}
            placeholder="Enter P.O. Box number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="billingCountry">Country *</Label>
          <Select
            value={formData.billingAddress.country}
            onValueChange={(value) => updateBillingAddress('country', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MW">Malawi</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="FR">France</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
