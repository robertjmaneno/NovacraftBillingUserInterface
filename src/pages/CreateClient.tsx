import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import { CoreInformationStep } from '@/components/client-form/CoreInformationStep';
import { PhysicalAddressStep } from '@/components/client-form/PhysicalAddressStep';
import { BillingAddressStep } from '@/components/client-form/BillingAddressStep';
import { DocumentsStep } from '@/components/client-form/DocumentsStep';
import { PreviewStep } from '@/components/client-form/PreviewStep';

export interface ClientFormData {
  clientType: 'individual' | 'business';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  industry: string;
  website: string;
  taxId: string;
  registrationNumber: string;
  
  physicalAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    district: string;
    postOfficeBox: string;
    sameAsBilling: boolean;
  };
  
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    district: string;
    postOfficeBox: string;
  };
  
  documents: {
    nationalId: File | null;
    businessLicense: File | null;
    taxCertificate: File | null;
    otherDocuments: File[];
  };
}

const initialFormData: ClientFormData = {
  clientType: 'individual',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  businessName: '',
  industry: '',
  website: '',
  taxId: '',
  registrationNumber: '',
  physicalAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    district: '',
    postOfficeBox: '',
    sameAsBilling: false,
  },
  billingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    district: '',
    postOfficeBox: '',
  },
  documents: {
    nationalId: null,
    businessLicense: null,
    taxCertificate: null,
    otherDocuments: [],
  },
};

const steps = [
  { id: 1, title: 'Core Information', description: 'Basic client details' },
  { id: 2, title: 'Physical Address', description: 'Client location' },
  { id: 3, title: 'Billing Address', description: 'Billing information' },
  { id: 4, title: 'Documents', description: 'Upload documents' },
  { id: 5, title: 'Preview', description: 'Review and submit' },
];

export const CreateClient: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);

  const updateFormData = (data: Partial<ClientFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting client data:', formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CoreInformationStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <PhysicalAddressStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <BillingAddressStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <DocumentsStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <PreviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Create New Client</h1>
          <p className="text-gray-600">Add a new client to your billing system</p>
        </div>

        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        
        <Card className="border">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep === steps.length ? (
                <Button onClick={handleSubmit}>
                  Submit Client
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
