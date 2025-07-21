
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ClientFormData } from './types';

interface PhysicalAddressStepProps {
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

export const PhysicalAddressStep: React.FC<PhysicalAddressStepProps> = ({
  formData,
  updateFormData
}) => {
  const updatePhysicalAddress = (field: string, value: string | boolean) => {
    const newPhysicalAddress = {
      ...formData.physicalAddress,
      [field]: value
    };

    
    if (field === 'sameAsBilling' && value === true) {
      newPhysicalAddress.street = formData.billingAddress.street;
      newPhysicalAddress.city = formData.billingAddress.city;
      newPhysicalAddress.district = formData.billingAddress.district;
      newPhysicalAddress.postOfficeBox = formData.billingAddress.postOfficeBox;
      newPhysicalAddress.country = formData.billingAddress.country;
    }

    updateFormData({
      physicalAddress: newPhysicalAddress
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="sameAsBilling"
          checked={formData.physicalAddress.sameAsBilling}
          onCheckedChange={(checked) => updatePhysicalAddress('sameAsBilling', checked)}
        />
        <Label htmlFor="sameAsBilling">Same as billing address</Label>
      </div>

      {!formData.physicalAddress.sameAsBilling && (
        <>
          <div className="space-y-2">
            <Label htmlFor="physicalStreet">Street Address *</Label>
            <Input
              id="physicalStreet"
              value={formData.physicalAddress.street}
              onChange={(e) => updatePhysicalAddress('street', e.target.value)}
              placeholder="Enter street address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="physicalCity">City *</Label>
              <Input
                id="physicalCity"
                value={formData.physicalAddress.city}
                onChange={(e) => updatePhysicalAddress('city', e.target.value)}
                placeholder="Enter city"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="physicalDistrict">District *</Label>
              <Select
                value={formData.physicalAddress.district}
                onValueChange={(value) => updatePhysicalAddress('district', value)}
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
              <Label htmlFor="physicalPostOfficeBox">Post Office Box *</Label>
              <Input
                id="physicalPostOfficeBox"
                value={formData.physicalAddress.postOfficeBox}
                onChange={(e) => updatePhysicalAddress('postOfficeBox', e.target.value)}
                placeholder="Enter P.O. Box number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="physicalCountry">Country *</Label>
              <Select
                value={formData.physicalAddress.country}
                onValueChange={(value) => updatePhysicalAddress('country', value)}
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
        </>
      )}
    </div>
  );
};
