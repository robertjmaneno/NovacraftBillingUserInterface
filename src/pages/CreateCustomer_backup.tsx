import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Loader2, 
  User, 
  Building, 
  MapPin, 
  FileText, 
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateCustomer } from '@/hooks/use-customers';
import { useUsers } from '@/hooks/use-users';
import { CreateCustomerWithDocumentsRequest, UserData } from '@/services/api';
import { toast } from 'sonner';

interface CustomerFormData {
  // Step 1: Core Information
  firstName: string;
  lastName: string;
  organizationName: string;
  phoneNumber: string;
  email: string;
  customerType: number; 
  contactPerson: string;
  contactPersonId: string; 
  contactPhone: string;
  contactEmail: string;
  notes: string;
  
  // Step 2: Billing Address
  billingStreetAddress: string;
  billingCity: string;
  billingDistrict: string;
  billingPostOfficeBox: string;
  billingCountry: string;
  billingPostalCode: string;
  billingState: string;
  billingAdditionalInfo: string;
  
  // Step 3: Physical Address
  physicalStreetAddress: string;
  physicalCity: string;
  physicalDistrict: string;
  physicalCountry: string;
  physicalPostalCode: string;
  physicalState: string;
  
  // Step 4: Documents
  documents: Array<{
    fileName: string;
    documentType: string;
    description: string;
    documentNumber: string;
    expiryDate: string;
    issueDate: string;
    issuingAuthority: string;
    tags: string;
    file?: File;
    fileUrl?: string;
    fileSize?: number;
    fileType?: string;
  }>;
}

// Remove Documents step for now:
const steps = [
  { id: 1, title: 'Core Information', icon: User },
  { id: 2, title: 'Billing Address', icon: MapPin },
  { id: 3, title: 'Physical Address', icon: Building },
  { id: 4, title: 'Review & Submit', icon: CheckCircle },
];

const documentTypes = [
  'ID', 'Passport', 'Driver License', 'Business License', 
  'Tax Certificate', 'Registration Certificate', 'Other'
];

// Countries list
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// Malawi Districts
const malawiDistricts = [
  'Balaka', 'Blantyre', 'Chikwawa', 'Chiradzulu', 'Chitipa', 'Dedza', 'Dowa', 'Karonga', 'Kasungu', 'Likoma',
  'Lilongwe', 'Machinga', 'Mangochi', 'Mchinji', 'Mulanje', 'Mwanza', 'Mzimba', 'Neno', 'Nkhata Bay', 'Nkhotakota',
  'Nsanje', 'Ntcheu', 'Ntchisi', 'Phalombe', 'Rumphi', 'Salima', 'Thyolo', 'Zomba'
];

// Cities in Malawi
const cities = [
  'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Other'
];

// File validation constants
const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/tiff',
  
  // PDFs
  'application/pdf',
  
  // Microsoft Office Documents
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  
  // Legacy Office formats
  'application/vnd.ms-office',
  'application/octet-stream' 
];

const ALLOWED_FILE_EXTENSIONS = [
  // Images
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff',
  
  // PDFs
  '.pdf',
  
  // Microsoft Office
  '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// File validation functions
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file type by MIME type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    // Fallback: check by file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => 
      fileName.endsWith(ext)
    );
    
    if (!hasValidExtension) {
      return {
        isValid: false,
        error: `File type not supported. Allowed types: Images (JPG, PNG, GIF, etc.), PDF, Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx)`
      };
    }
  }

  return { isValid: true };
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileTypeIcon = (fileName: string): string => {
  const ext = fileName.toLowerCase().split('.').pop();
  switch (ext) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    case 'ppt':
    case 'pptx':
      return '📈';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'bmp':
    case 'tiff':
      return '🖼️';
    default:
      return '📎';
  }
};

export const CreateCustomer: React.FC = () => {
  const navigate = useNavigate();
  const createCustomerMutation = useCreateCustomer();
  
  // Fetch users for contact person selection
  const { data: usersData, isLoading: usersLoading } = useUsers(1, 100);
  const users = usersData?.data?.items || [];
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomerFormData>({
    // Step 1
    firstName: '',
    lastName: '',
    organizationName: '',
    phoneNumber: '',
    email: '',
    customerType: 0, // 0 = Individual, 1 = Business
    contactPerson: '',
    contactPersonId: '',
    contactPhone: '',
    contactEmail: '',
    notes: '',
    
    // Step 2
    billingStreetAddress: '',
    billingCity: '',
    billingDistrict: '',
    billingPostOfficeBox: '',
    billingCountry: '',
    billingPostalCode: '',
    billingState: '',
    billingAdditionalInfo: '',
    
    // Step 3
    physicalStreetAddress: '',
    physicalCity: '',
    physicalDistrict: '',
    physicalCountry: '',
    physicalPostalCode: '',
    physicalState: '',
    
    // Step 4
    documents: [],
  });

  const [selectedContactUserId, setSelectedContactUserId] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof CustomerFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        // Validate customer type first
        if (formData.customerType === 0) {
          // Individual customer validation
          if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
          if (formData.firstName.length > 50) newErrors.firstName = 'First name must be 50 characters or less';
          if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
          if (formData.lastName.length > 50) newErrors.lastName = 'Last name must be 50 characters or less';
        } else if (formData.customerType === 1) {
          // Business customer validation
          if (!formData.organizationName.trim()) {
            newErrors.organizationName = 'Organization name is required for businesses';
          }
          if (formData.organizationName && formData.organizationName.length > 100) {
            newErrors.organizationName = 'Organization name must be 100 characters or less';
          }
        }
        
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (formData.phoneNumber.length > 20) newErrors.phoneNumber = 'Phone number must be 20 characters or less';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else if (formData.email.length > 100) {
          newErrors.email = 'Email must be 100 characters or less';
        }
        
        if (formData.contactPerson && formData.contactPerson.length > 100) newErrors.contactPerson = 'Contact person must be 100 characters or less';
        if (formData.contactPhone && formData.contactPhone.length > 20) newErrors.contactPhone = 'Contact phone must be 20 characters or less';
        if (formData.contactEmail && formData.contactEmail.length > 100) newErrors.contactEmail = 'Contact email must be 100 characters or less';
        if (formData.notes && formData.notes.length > 500) newErrors.notes = 'Notes must be 500 characters or less';
        break;
      
      case 2:
        if (!formData.billingStreetAddress.trim()) newErrors.billingStreetAddress = 'Street address is required';
        if (formData.billingStreetAddress.length > 200) newErrors.billingStreetAddress = 'Street address must be 200 characters or less';
        if (!formData.billingCity.trim()) newErrors.billingCity = 'City is required';
        if (!formData.billingDistrict.trim()) newErrors.billingDistrict = 'District is required';
        if (!formData.billingCountry.trim()) newErrors.billingCountry = 'Country is required';
        if (formData.billingPostOfficeBox && formData.billingPostOfficeBox.length > 50) newErrors.billingPostOfficeBox = 'Post office box must be 50 characters or less';
        if (formData.billingAdditionalInfo && formData.billingAdditionalInfo.length > 500) newErrors.billingAdditionalInfo = 'Additional info must be 500 characters or less';
        break;
      
      case 3:
        if (!formData.physicalStreetAddress.trim()) newErrors.physicalStreetAddress = 'Street address is required';
        if (formData.physicalStreetAddress.length > 200) newErrors.physicalStreetAddress = 'Street address must be 200 characters or less';
        if (!formData.physicalCity.trim()) newErrors.physicalCity = 'City is required';
        if (!formData.physicalDistrict.trim()) newErrors.physicalDistrict = 'District is required';
        if (!formData.physicalCountry.trim()) newErrors.physicalCountry = 'Country is required';
        break;
      
      case 4:
        // Validate documents if any are added
        formData.documents.forEach((doc, index) => {
          if (doc.documentType && !doc.file) {
            newErrors[`document_${index}`] = 'Please select a file for this document';
          }
          if (doc.file) {
            const validation = validateFile(doc.file);
            if (!validation.isValid) {
              newErrors[`document_${index}`] = validation.error || 'Invalid file';
            }
          }
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      // Debug: Log the current form data
      console.log('Current form data:', formData);
      console.log('Customer type:', formData.customerType);
      console.log('First name:', formData.firstName);
      console.log('Last name:', formData.lastName);
      console.log('Organization name:', formData.organizationName);

      const customerData = {
        step1: {
          // Only send appropriate fields based on customer type
          ...(formData.customerType === 0 ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
          } : {
            organizationName: formData.organizationName,
          }),
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          customerType: formData.customerType,
          contactPerson: formData.contactPerson || '',
          contactPhone: formData.contactPhone || '',
          contactEmail: formData.contactEmail || '',
          notes: formData.notes || '',
        },
        
        step2: {
          streetAddress: formData.billingStreetAddress,
          city: formData.billingCity,
          district: formData.billingDistrict,
          postOfficeBox: formData.billingPostOfficeBox || '',
          country: formData.billingCountry,
          postalCode: '', // Removed from UI but required by API
          state: '', // Removed from UI but required by API
          additionalInfo: formData.billingAdditionalInfo || '',
        },
        
        step3: {
          streetAddress: formData.physicalStreetAddress,
          city: formData.physicalCity,
          district: formData.physicalDistrict,
          postOfficeBox: '', // Not included in physical address form
          country: formData.physicalCountry,
          postalCode: '', // Removed from UI but required by API
          state: '', // Removed from UI but required by API
          additionalInfo: '', // Not included in physical address form
        },
        
        step4: {
          documents: formData.documents
            .filter(doc => doc.file && doc.file instanceof File && doc.file.size > 0 && doc.documentType)
            .map(doc => ({
              fileName: doc.fileName,
              documentType: doc.documentType,
              description: doc.description || '',
              documentNumber: doc.documentNumber || '',
              expiryDate: doc.expiryDate || '',
              issueDate: doc.issueDate || '',
              issuingAuthority: doc.issuingAuthority || '',
              tags: doc.tags || '',
              filePath: '', // Will be set by backend
              fileSize: doc.file ? doc.file.size : 0,
              fileType: doc.file ? doc.file.type : '',
            })),
        },
      };

      // Debug: Log what's being sent to the API
      console.log('Sending customer data to API:', customerData);

      const response = await createCustomerMutation.mutateAsync(customerData);
      console.log('API Response:', response);
      navigate('/customers');
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  const addDocument = () => {
    const newDocument = {
      fileName: '',
      documentType: '',
      description: '',
      documentNumber: '',
      expiryDate: '',
      issueDate: '',
      issuingAuthority: '',
      tags: '',
      file: undefined,
    };
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }));
  };

  const updateDocument = (index: number, field: string, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map((doc, i) => 
        i === index ? { ...doc, [field]: value } : doc
      )
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Customer Type - Start with this */}
      <div className="space-y-2">
        <Label htmlFor="customerType">Customer Type *</Label>
        <Select 
          value={formData.customerType.toString()} 
          onValueChange={(value) => {
            console.log('Customer type changed to:', value);
            updateFormData('customerType', parseInt(value));
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Individual</SelectItem>
            <SelectItem value="1">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Individual Customer Fields - Show only when Individual is selected */}
      {formData.customerType === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>
      )}

      {/* Business Customer Fields - Show only when Business is selected */}
      {formData.customerType === 1 && (
        <div className="space-y-2">
          <Label htmlFor="organizationName">Organization Name *</Label>
          <Input
            id="organizationName"
            value={formData.organizationName}
            onChange={(e) => updateFormData('organizationName', e.target.value)}
            className={errors.organizationName ? 'border-red-500' : ''}
          />
          {errors.organizationName && <p className="text-sm text-red-600">{errors.organizationName}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
            className={errors.phoneNumber ? 'border-red-500' : ''}
          />
          {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>

      {formData.customerType === 1 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Select 
                value={selectedContactUserId} 
                onValueChange={(value) => {
                  setSelectedContactUserId(value);
                  if (!value) {
                    updateFormData('contactPerson', '');
                    updateFormData('contactPersonId', '');
                    updateFormData('contactPhone', '');
                    updateFormData('contactEmail', '');
                    return;
                  }
                  
                  const selectedUser = users.find(user => user.id === value);
                  if (selectedUser) {
                    updateFormData('contactPerson', `${selectedUser.firstName} ${selectedUser.lastName}`);
                    updateFormData('contactPersonId', selectedUser.id);
                    updateFormData('contactPhone', selectedUser.phoneNumber || '');
                    updateFormData('contactEmail', selectedUser.email || '');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={usersLoading ? "Loading users..." : "Select a user"} />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => updateFormData('contactPhone', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => updateFormData('contactEmail', e.target.value)}
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={(e) => updateFormData('taxId', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Registration Number</Label>
          <Input
            id="registrationNumber"
            value={formData.registrationNumber}
            onChange={(e) => updateFormData('registrationNumber', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="billingStreetAddress">Street Address *</Label>
        <Input
          id="billingStreetAddress"
          value={formData.billingStreetAddress}
          onChange={(e) => updateFormData('billingStreetAddress', e.target.value)}
          className={errors.billingStreetAddress ? 'border-red-500' : ''}
        />
        {errors.billingStreetAddress && <p className="text-sm text-red-600">{errors.billingStreetAddress}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billingCity">City *</Label>
          <Select 
            value={formData.billingCity} 
            onValueChange={(value) => updateFormData('billingCity', value)}
          >
            <SelectTrigger className={errors.billingCity ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.billingCity && <p className="text-sm text-red-600">{errors.billingCity}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="billingDistrict">District *</Label>
          <Select 
            value={formData.billingDistrict} 
            onValueChange={(value) => updateFormData('billingDistrict', value)}
          >
            <SelectTrigger className={errors.billingDistrict ? 'border-red-500' : ''}>
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
          {errors.billingDistrict && <p className="text-sm text-red-600">{errors.billingDistrict}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingCountry">Country *</Label>
        <Select 
          value={formData.billingCountry} 
          onValueChange={(value) => updateFormData('billingCountry', value)}
        >
          <SelectTrigger className={errors.billingCountry ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.billingCountry && <p className="text-sm text-red-600">{errors.billingCountry}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingPostOfficeBox">Post Office Box</Label>
        <Input
          id="billingPostOfficeBox"
          value={formData.billingPostOfficeBox}
          onChange={(e) => updateFormData('billingPostOfficeBox', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingAdditionalInfo">Additional Information</Label>
        <Textarea
          id="billingAdditionalInfo"
          value={formData.billingAdditionalInfo}
          onChange={(e) => updateFormData('billingAdditionalInfo', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="physicalStreetAddress">Street Address *</Label>
        <Input
          id="physicalStreetAddress"
          value={formData.physicalStreetAddress}
          onChange={(e) => updateFormData('physicalStreetAddress', e.target.value)}
          className={errors.physicalStreetAddress ? 'border-red-500' : ''}
        />
        {errors.physicalStreetAddress && <p className="text-sm text-red-600">{errors.physicalStreetAddress}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="physicalCity">City *</Label>
          <Select 
            value={formData.physicalCity} 
            onValueChange={(value) => updateFormData('physicalCity', value)}
          >
            <SelectTrigger className={errors.physicalCity ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.physicalCity && <p className="text-sm text-red-600">{errors.physicalCity}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="physicalDistrict">District *</Label>
          <Select 
            value={formData.physicalDistrict} 
            onValueChange={(value) => updateFormData('physicalDistrict', value)}
          >
            <SelectTrigger className={errors.physicalDistrict ? 'border-red-500' : ''}>
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
          {errors.physicalDistrict && <p className="text-sm text-red-600">{errors.physicalDistrict}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="physicalCountry">Country *</Label>
        <Select 
          value={formData.physicalCountry} 
          onValueChange={(value) => updateFormData('physicalCountry', value)}
        >
          <SelectTrigger className={errors.physicalCountry ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.physicalCountry && <p className="text-sm text-red-600">{errors.physicalCountry}</p>}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Review Your Information</h3>
        <p className="text-blue-700 text-sm">Please review all the information before submitting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <User className="w-4 h-4 mr-2" />
              Core Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
            <div><strong>Type:</strong> {formData.customerType === 1 ? 'Business' : 'Individual'}</div>
            {formData.organizationName && <div><strong>Organization:</strong> {formData.organizationName}</div>}
            <div><strong>Phone:</strong> {formData.phoneNumber}</div>
            <div><strong>Email:</strong> {formData.email}</div>
            {formData.contactPerson && <div><strong>Contact Person:</strong> {formData.contactPerson}</div>}
            {formData.taxId && <div><strong>Tax ID:</strong> {formData.taxId}</div>}
            {formData.registrationNumber && <div><strong>Registration:</strong> {formData.registrationNumber}</div>}
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Billing:</strong> {formData.billingStreetAddress}, {formData.billingCity}</div>
            <div><strong>Physical:</strong> {formData.physicalStreetAddress}, {formData.physicalCity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      {formData.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Documents ({formData.documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{doc.fileName || 'Untitled Document'}</div>
                    <div className="text-sm text-gray-600">{doc.documentType} - {doc.description}</div>
                    {doc.file && (
                      <div className="text-xs text-gray-500">
                        {formatFileSize(doc.file.size)} • {doc.file.type}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">{doc.documentType}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create New Customer</h1>
          <p className="text-gray-600 mt-1">Add a new customer to your system</p>
        </div>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-gray-100 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={createCustomerMutation.isPending}
            >
              {createCustomerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Customer'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable CustomerForm component
export interface CustomerFormProps {
  initialValues: Partial<CustomerFormData>;
  mode: 'create' | 'edit';
  onSubmit: (values: CustomerFormData) => void;
  users: UserData[];
  usersLoading: boolean;
  onCancel?: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ initialValues, mode, onSubmit, users, usersLoading, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomerFormData>({
    // Step 1
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    organizationName: initialValues.organizationName || '',
    phoneNumber: initialValues.phoneNumber || '',
    email: initialValues.email || '',
    customerType: initialValues.customerType ?? 0,
    contactPerson: initialValues.contactPerson || '',
    contactPersonId: initialValues.contactPersonId || '',
    contactPhone: initialValues.contactPhone || '',
    contactEmail: initialValues.contactEmail || '',
    notes: initialValues.notes || '',
    // Step 2
    billingStreetAddress: initialValues.billingStreetAddress || '',
    billingCity: initialValues.billingCity || '',
    billingDistrict: initialValues.billingDistrict || '',
    billingPostOfficeBox: initialValues.billingPostOfficeBox || '',
    billingCountry: initialValues.billingCountry || '',
    billingPostalCode: initialValues.billingPostalCode || '',
    billingState: initialValues.billingState || '',
    billingAdditionalInfo: initialValues.billingAdditionalInfo || '',
    // Step 3
    physicalStreetAddress: initialValues.physicalStreetAddress || '',
    physicalCity: initialValues.physicalCity || '',
    physicalDistrict: initialValues.physicalDistrict || '',
    physicalCountry: initialValues.physicalCountry || '',
    physicalPostalCode: initialValues.physicalPostalCode || '',
    physicalState: initialValues.physicalState || '',
    // Step 4
    documents: initialValues.documents || [],
  });
  const [selectedContactUserId, setSelectedContactUserId] = useState<string>(initialValues.contactPersonId || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof CustomerFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 1:
        if (formData.customerType === 0) {
          if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
          if (formData.firstName.length > 50) newErrors.firstName = 'First name must be 50 characters or less';
          if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
          if (formData.lastName.length > 50) newErrors.lastName = 'Last name must be 50 characters or less';
        } else if (formData.customerType === 1) {
          if (!formData.organizationName.trim()) {
            newErrors.organizationName = 'Organization name is required for businesses';
          }
          if (formData.organizationName && formData.organizationName.length > 100) {
            newErrors.organizationName = 'Organization name must be 100 characters or less';
          }
        }
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (formData.phoneNumber.length > 20) newErrors.phoneNumber = 'Phone number must be 20 characters or less';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else if (formData.email.length > 100) {
          newErrors.email = 'Email must be 100 characters or less';
        }
        if (formData.contactPerson && formData.contactPerson.length > 100) newErrors.contactPerson = 'Contact person must be 100 characters or less';
        if (formData.contactPhone && formData.contactPhone.length > 20) newErrors.contactPhone = 'Contact phone must be 20 characters or less';
        if (formData.contactEmail && formData.contactEmail.length > 100) newErrors.contactEmail = 'Contact email must be 100 characters or less';
        if (formData.notes && formData.notes.length > 500) newErrors.notes = 'Notes must be 500 characters or less';
        break;
      case 2:
        if (!formData.billingStreetAddress.trim()) newErrors.billingStreetAddress = 'Street address is required';
        if (formData.billingStreetAddress.length > 200) newErrors.billingStreetAddress = 'Street address must be 200 characters or less';
        if (!formData.billingCity.trim()) newErrors.billingCity = 'City is required';
        if (!formData.billingDistrict.trim()) newErrors.billingDistrict = 'District is required';
        if (!formData.billingCountry.trim()) newErrors.billingCountry = 'Country is required';
        if (formData.billingPostOfficeBox && formData.billingPostOfficeBox.length > 50) newErrors.billingPostOfficeBox = 'Post office box must be 50 characters or less';
        if (formData.billingAdditionalInfo && formData.billingAdditionalInfo.length > 500) newErrors.billingAdditionalInfo = 'Additional info must be 500 characters or less';
        break;
      case 3:
        if (!formData.physicalStreetAddress.trim()) newErrors.physicalStreetAddress = 'Street address is required';
        if (formData.physicalStreetAddress.length > 200) newErrors.physicalStreetAddress = 'Street address must be 200 characters or less';
        if (!formData.physicalCity.trim()) newErrors.physicalCity = 'City is required';
        if (!formData.physicalDistrict.trim()) newErrors.physicalDistrict = 'District is required';
        if (!formData.physicalCountry.trim()) newErrors.physicalCountry = 'Country is required';
        break;
      case 4:
        formData.documents.forEach((doc, index) => {
          if (doc.documentType && !doc.file) {
            newErrors[`document_${index}`] = 'Please select a file for this document';
          }
          if (doc.file) {
            const validation = validateFile(doc.file);
            if (!validation.isValid) {
              newErrors[`document_${index}`] = validation.error || 'Invalid file';
            }
          }
        });
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    onSubmit(formData);
  };
  const addDocument = () => {
    const newDocument = {
      fileName: '',
      documentType: '',
      description: '',
      documentNumber: '',
      expiryDate: '',
      issueDate: '',
      issuingAuthority: '',
      tags: '',
      file: undefined,
    };
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }));
  };
  const updateDocument = (index: number, field: string, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc
      )
    }));
  };
  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Customer Type - Start with this */}
      <div className="space-y-2">
        <Label htmlFor="customerType">Customer Type *</Label>
        <Select 
          value={formData.customerType.toString()} 
          onValueChange={(value) => {
            console.log('Customer type changed to:', value);
            updateFormData('customerType', parseInt(value));
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Individual</SelectItem>
            <SelectItem value="1">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Individual Customer Fields - Show only when Individual is selected */}
      {formData.customerType === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>
      )}

      {/* Business Customer Fields - Show only when Business is selected */}
      {formData.customerType === 1 && (
        <div className="space-y-2">
          <Label htmlFor="organizationName">Organization Name *</Label>
          <Input
            id="organizationName"
            value={formData.organizationName}
            onChange={(e) => updateFormData('organizationName', e.target.value)}
            className={errors.organizationName ? 'border-red-500' : ''}
          />
          {errors.organizationName && <p className="text-sm text-red-600">{errors.organizationName}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
            className={errors.phoneNumber ? 'border-red-500' : ''}
          />
          {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>

      {formData.customerType === 1 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Select 
                value={selectedContactUserId} 
                onValueChange={(value) => {
                  setSelectedContactUserId(value);
                  if (!value) {
                    updateFormData('contactPerson', '');
                    updateFormData('contactPersonId', '');
                    updateFormData('contactPhone', '');
                    updateFormData('contactEmail', '');
                    return;
                  }
                  
                  const selectedUser = users.find(user => user.id === value);
                  if (selectedUser) {
                    updateFormData('contactPerson', `${selectedUser.firstName} ${selectedUser.lastName}`);
                    updateFormData('contactPersonId', selectedUser.id);
                    updateFormData('contactPhone', selectedUser.phoneNumber || '');
                    updateFormData('contactEmail', selectedUser.email || '');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={usersLoading ? "Loading users..." : "Select a user"} />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => updateFormData('contactPhone', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => updateFormData('contactEmail', e.target.value)}
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={(e) => updateFormData('taxId', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Registration Number</Label>
          <Input
            id="registrationNumber"
            value={formData.registrationNumber}
            onChange={(e) => updateFormData('registrationNumber', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="billingStreetAddress">Street Address *</Label>
        <Input
          id="billingStreetAddress"
          value={formData.billingStreetAddress}
          onChange={(e) => updateFormData('billingStreetAddress', e.target.value)}
          className={errors.billingStreetAddress ? 'border-red-500' : ''}
        />
        {errors.billingStreetAddress && <p className="text-sm text-red-600">{errors.billingStreetAddress}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billingCity">City *</Label>
          <Select 
            value={formData.billingCity} 
            onValueChange={(value) => updateFormData('billingCity', value)}
          >
            <SelectTrigger className={errors.billingCity ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.billingCity && <p className="text-sm text-red-600">{errors.billingCity}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="billingDistrict">District *</Label>
          <Select 
            value={formData.billingDistrict} 
            onValueChange={(value) => updateFormData('billingDistrict', value)}
          >
            <SelectTrigger className={errors.billingDistrict ? 'border-red-500' : ''}>
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
          {errors.billingDistrict && <p className="text-sm text-red-600">{errors.billingDistrict}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingCountry">Country *</Label>
        <Select 
          value={formData.billingCountry} 
          onValueChange={(value) => updateFormData('billingCountry', value)}
        >
          <SelectTrigger className={errors.billingCountry ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.billingCountry && <p className="text-sm text-red-600">{errors.billingCountry}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingPostOfficeBox">Post Office Box</Label>
        <Input
          id="billingPostOfficeBox"
          value={formData.billingPostOfficeBox}
          onChange={(e) => updateFormData('billingPostOfficeBox', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingAdditionalInfo">Additional Information</Label>
        <Textarea
          id="billingAdditionalInfo"
          value={formData.billingAdditionalInfo}
          onChange={(e) => updateFormData('billingAdditionalInfo', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="physicalStreetAddress">Street Address *</Label>
        <Input
          id="physicalStreetAddress"
          value={formData.physicalStreetAddress}
          onChange={(e) => updateFormData('physicalStreetAddress', e.target.value)}
          className={errors.physicalStreetAddress ? 'border-red-500' : ''}
        />
        {errors.physicalStreetAddress && <p className="text-sm text-red-600">{errors.physicalStreetAddress}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="physicalCity">City *</Label>
          <Select 
            value={formData.physicalCity} 
            onValueChange={(value) => updateFormData('physicalCity', value)}
          >
            <SelectTrigger className={errors.physicalCity ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.physicalCity && <p className="text-sm text-red-600">{errors.physicalCity}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="physicalDistrict">District *</Label>
          <Select 
            value={formData.physicalDistrict} 
            onValueChange={(value) => updateFormData('physicalDistrict', value)}
          >
            <SelectTrigger className={errors.physicalDistrict ? 'border-red-500' : ''}>
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
          {errors.physicalDistrict && <p className="text-sm text-red-600">{errors.physicalDistrict}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="physicalCountry">Country *</Label>
        <Select 
          value={formData.physicalCountry} 
          onValueChange={(value) => updateFormData('physicalCountry', value)}
        >
          <SelectTrigger className={errors.physicalCountry ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.physicalCountry && <p className="text-sm text-red-600">{errors.physicalCountry}</p>}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Review Your Information</h3>
        <p className="text-blue-700 text-sm">Please review all the information before submitting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <User className="w-4 h-4 mr-2" />
              Core Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
            <div><strong>Type:</strong> {formData.customerType === 1 ? 'Business' : 'Individual'}</div>
            {formData.organizationName && <div><strong>Organization:</strong> {formData.organizationName}</div>}
            <div><strong>Phone:</strong> {formData.phoneNumber}</div>
            <div><strong>Email:</strong> {formData.email}</div>
            {formData.contactPerson && <div><strong>Contact Person:</strong> {formData.contactPerson}</div>}
            {formData.taxId && <div><strong>Tax ID:</strong> {formData.taxId}</div>}
            {formData.registrationNumber && <div><strong>Registration:</strong> {formData.registrationNumber}</div>}
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Billing:</strong> {formData.billingStreetAddress}, {formData.billingCity}</div>
            <div><strong>Physical:</strong> {formData.physicalStreetAddress}, {formData.physicalCity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      {formData.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Documents ({formData.documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{doc.fileName || 'Untitled Document'}</div>
                    <div className="text-sm text-gray-600">{doc.documentType} - {doc.description}</div>
                    {doc.file && (
                      <div className="text-xs text-gray-500">
                        {formatFileSize(doc.file.size)} • {doc.file.type}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">{doc.documentType}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center md:flex-col md:items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-gray-100 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 md:ml-0 md:mt-2 md:text-center">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                  {index < steps.length - 1 && (
                    <div className={`md:hidden w-0.5 h-8 ml-5 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>
      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div className="flex space-x-2">
          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              {mode === 'edit' ? 'Update Customer' : 'Create Customer'}
            </Button>
          )}
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
