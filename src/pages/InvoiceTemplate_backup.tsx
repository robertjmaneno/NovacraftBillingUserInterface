import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Eye, 
  Download, 
  Printer, 
  Palette, 
  Save,
  FileText,
  Building,
  Mail,
  Phone,
  Upload
} from 'lucide-react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { 
  InvoiceTemplateDto, 
  MockInvoiceData,
  CompanyInfoDto,
  DesignSettings,
  ContentSettings,
  FooterSettings,
  LayoutSettings,
  LocalizationSettings,
  TaxSettings,
  TableSettings,
  EmailSettings
} from '@/types/invoice-template';

// Default template structure for initialization
const getDefaultTemplate = (): InvoiceTemplateDto => ({
  name: 'Default Template',
  isActive: true,
  design: {
    primaryColor: '#3B82F6',
    secondaryColor: '#F3F4F6',
    accentColor: '#10B981',
    fontFamily: 'Poppins',
    fontSize: {
      heading: '24px',
      subheading: '18px',
      body: '14px',
      small: '12px'
    },
    logoPosition: 'left',
    logoSize: 'medium',
    borderStyle: 'solid',
    borderColor: '#E5E7EB',
    borderRadius: '8px'
  },
  companyInfo: {
    name: 'Novacraft Inc.',
    address: '123 Business Street',
    city: 'Blantyre',
    state: 'Southern Region',
    country: 'Malawi',
    postalCode: 'BT1 1XX',
    phone: '+265 (0) 123-4567',
    email: 'hello@novacraft.mw',
    website: 'www.novacraft.mw',
    taxId: 'TIN123456789',
    registrationNumber: 'REG987654321'
  },
  layout: {
    headerHeight: '120px',
    footerHeight: '80px',
    marginTop: '20px',
    marginBottom: '20px',
    marginLeft: '20px',
    marginRight: '20px',
    showWatermark: false,
    watermarkText: 'PAID',
    watermarkOpacity: 0.1
  },
  content: {
    showInvoiceNumber: true,
    invoiceNumberPrefix: 'INV-',
    showDate: true,
    showDueDate: true,
    showPurchaseOrder: true,
    showPaymentTerms: true,
    defaultPaymentTerms: 'Net 30',
    showNotes: true,
    defaultNotes: 'Thank you for your business!',
    showSignature: false
  },
  table: {
    showItemNumber: false,
    showDescription: true,
    showQuantity: true,
    showRate: true,
    showAmount: true,
    showDiscount: false,
    showTax: true,
    alternateRowColors: true,
    headerBackgroundColor: '#F9FAFB',
    headerTextColor: '#374151',
    rowBackgroundColor: '#FFFFFF',
    alternateRowBackgroundColor: '#F9FAFB'
  },
  localization: {
    currency: 'MWK',
    currencySymbol: 'K',
    currencyPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    dateFormat: 'DD/MM/YYYY',
    language: 'en',
    timezone: 'Africa/Blantyre'
  },
  tax: {
    defaultTaxRate: 16.5,
    taxLabel: 'VAT',
    showTaxNumber: true,
    taxCalculation: 'exclusive',
    multiTaxSupport: false
  },
  footer: {
    showFooter: true,
    footerText: 'Thank you for your business!',
    termsAndConditions: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
    bankDetails: {
      showBankDetails: true,
      bankName: 'Standard Bank',
      accountNumber: '1234567890',
      routingNumber: '987654321',
      swiftCode: 'SBICMWMX'
    }
  },
  email: {
    subjectTemplate: 'Invoice {invoice_number} from {company_name}',
    bodyTemplate: 'Dear {client_name},\n\nPlease find attached invoice {invoice_number} for {amount}.\n\nBest regards,\n{company_name}',
    attachPdf: true,
    sendCopyToSender: true
  }
});

const mockInvoiceData: MockInvoiceData = {
  invoiceNumber: 'INV-2024-001',
  date: '2024-01-20',
  dueDate: '2024-02-20',
  client: {
    name: 'Old Mutual',
    address: '456 Commercial Avenue',
    city: 'Blantyre, Malawi',
    email: 'billing@oldmutual.mw'
  },
  items: [
    { description: 'Email Hosting Services', quantity: 12, rate: 15000, amount: 180000 },
    { description: 'Web Hosting Services', quantity: 6, rate: 25000, amount: 150000 },
    { description: 'Cloud Based Performance Management', quantity: 3, rate: 40000, amount: 120000 }
  ],
  subtotal: 450000,
  tax: 0,
  total: 450000
};

export const InvoiceTemplate: React.FC = () => {
  const [template, setTemplate] = useState<InvoiceTemplateDto>(getDefaultTemplate());
  const [activeTab, setActiveTab] = useState<'design' | 'preview'>('design');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    setLoading(true);
    try {
      const response = await apiService.getInvoiceTemplate();
      if (response.success && response.data) {
        setTemplate(response.data);
      } else {
        // Use default template if none exists
        setTemplate(getDefaultTemplate());
      }
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load template');
      setTemplate(getDefaultTemplate());
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await apiService.uploadInvoiceTemplateLogo(file);
      if (response.success && response.data) {
        setTemplate(prev => ({
          ...prev,
          design: {
            ...prev.design,
            logoUrl: response.data!.url
          }
        }));
        toast.success('Logo uploaded successfully');
      } else {
        toast.error(response.message || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Logo upload failed:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await apiService.updateInvoiceTemplate(template);
      if (response.success) {
        toast.success('Template saved successfully');
      } else {
        toast.error(response.message || 'Failed to save template');
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const previewUrl = apiService.getInvoiceTemplatePreviewUrl(true);
    window.open(previewUrl, '_blank');
  };

  const handlePrint = () => {
    const previewUrl = apiService.getInvoiceTemplatePreviewUrl(true);
    const printWindow = window.open(previewUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // Helper functions to update nested objects
  const updateDesign = (updates: Partial<DesignSettings>) => {
    setTemplate(prev => ({
      ...prev,
      design: { ...prev.design, ...updates }
    }));
  };

  const updateCompanyInfo = (updates: Partial<CompanyInfoDto>) => {
    setTemplate(prev => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, ...updates }
    }));
  };

  const updateContent = (updates: Partial<ContentSettings>) => {
    setTemplate(prev => ({
      ...prev,
      content: { ...prev.content, ...updates }
    }));
  };

  const updateFooter = (updates: Partial<FooterSettings>) => {
    setTemplate(prev => ({
      ...prev,
      footer: { ...prev.footer, ...updates }
    }));
  };

  const updateLayout = (updates: Partial<LayoutSettings>) => {
    setTemplate(prev => ({
      ...prev,
      layout: { ...prev.layout, ...updates }
    }));
  };

  const updateLocalization = (updates: Partial<LocalizationSettings>) => {
    setTemplate(prev => ({
      ...prev,
      localization: { ...prev.localization, ...updates }
    }));
  };

  const updateTax = (updates: Partial<TaxSettings>) => {
    setTemplate(prev => ({
      ...prev,
      tax: { ...prev.tax, ...updates }
    }));
  };

  const updateTable = (updates: Partial<TableSettings>) => {
    setTemplate(prev => ({
      ...prev,
      table: { ...prev.table, ...updates }
    }));
  };

  const updateEmail = (updates: Partial<EmailSettings>) => {
    setTemplate(prev => ({
      ...prev,
      email: { ...prev.email, ...updates }
    }));
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading template...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
                      <h1 className="text-2xl font-semibold text-gray-900">Invoice Template</h1>
          <p className="text-gray-600 mt-1">Customize your invoice design and branding</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>Saving...</span> : <><Save className="w-4 h-4 mr-2" />Save Template</>}
          </Button>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'design' ? 'default' : 'outline'}
          onClick={() => setActiveTab('design')}
        >
          <Palette className="w-4 h-4 mr-2" />
          Design
        </Button>
        <Button
          variant={activeTab === 'preview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('preview')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Design Panel */}
        {activeTab === 'design' && (
          <div className="lg:col-span-4 space-y-6">
            {/* Template Settings */}
            <Card className="border">
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={template.name}
                    onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Company Logo</Label>
                  <div className="space-y-2">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="cursor-pointer"
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="text-sm text-blue-600">Uploading logo...</div>
                    )}
                    {template.design.logoUrl && (
                      <div className="flex items-center space-x-2">
                        <img 
                          src={template.design.logoUrl} 
                          alt="Logo preview" 
                          className="h-12 w-auto" 
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDesign({ logoUrl: undefined })}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={template.design.primaryColor}
                      onChange={(e) => updateDesign({ primaryColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={template.design.primaryColor}
                      onChange={(e) => updateDesign({ primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={template.design.secondaryColor}
                      onChange={(e) => updateDesign({ secondaryColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={template.design.secondaryColor}
                      onChange={(e) => updateDesign({ secondaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={template.design.accentColor}
                      onChange={(e) => updateDesign({ accentColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={template.design.accentColor}
                      onChange={(e) => updateDesign({ accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontStyle">Font Family</Label>
                  <Select 
                    value={template.design.fontFamily} 
                    onValueChange={(value) => updateDesign({ fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoPosition">Logo Position</Label>
                  <Select 
                    value={template.design.logoPosition} 
                    onValueChange={(value: 'left' | 'center' | 'right') => updateDesign({ logoPosition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoSize">Logo Size</Label>
                  <Select 
                    value={template.design.logoSize} 
                    onValueChange={(value: 'small' | 'medium' | 'large') => updateDesign({ logoSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card className="border">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={template.companyInfo.name}
                    onChange={(e) => updateCompanyInfo({ name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <Input
                    id="companyAddress"
                    value={template.companyInfo.address}
                    onChange={(e) => updateCompanyInfo({ address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyCity">City</Label>
                  <Input
                    id="companyCity"
                    value={template.companyInfo.city}
                    onChange={(e) => updateCompanyInfo({ city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyState">State/Region</Label>
                  <Input
                    id="companyState"
                    value={template.companyInfo.state}
                    onChange={(e) => updateCompanyInfo({ state: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyCountry">Country</Label>
                    <Input
                      id="companyCountry"
                      value={template.companyInfo.country}
                      onChange={(e) => updateCompanyInfo({ country: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPostalCode">Postal Code</Label>
                    <Input
                      id="companyPostalCode"
                      value={template.companyInfo.postalCode}
                      onChange={(e) => updateCompanyInfo({ postalCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input
                      id="companyPhone"
                      value={template.companyInfo.phone}
                      onChange={(e) => updateCompanyInfo({ phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      value={template.companyInfo.email}
                      onChange={(e) => updateCompanyInfo({ email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={template.companyInfo.website}
                    onChange={(e) => updateCompanyInfo({ website: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={template.companyInfo.taxId}
                      onChange={(e) => updateCompanyInfo({ taxId: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={template.companyInfo.registrationNumber}
                      onChange={(e) => updateCompanyInfo({ registrationNumber: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer & Terms */}
            <Card className="border">
              <CardHeader>
                <CardTitle>Footer & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="footer">Footer Message</Label>
                  <Textarea
                    id="footer"
                    value={template.footer.footerText}
                    onChange={(e) => updateFooter({ footerText: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={template.footer.termsAndConditions}
                    onChange={(e) => updateFooter({ termsAndConditions: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showBankDetails"
                      checked={template.footer.bankDetails.showBankDetails}
                      onCheckedChange={(checked) => updateFooter({ 
                        bankDetails: { ...template.footer.bankDetails, showBankDetails: checked }
                      })}
                    />
                    <Label htmlFor="showBankDetails">Show Bank Details</Label>
                  </div>

                  {template.footer.bankDetails.showBankDetails && (
                    <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={template.footer.bankDetails.bankName}
                          onChange={(e) => updateFooter({ 
                            bankDetails: { ...template.footer.bankDetails, bankName: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={template.footer.bankDetails.accountNumber}
                          onChange={(e) => updateFooter({ 
                            bankDetails: { ...template.footer.bankDetails, accountNumber: e.target.value }
                          })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input
                            id="routingNumber"
                            value={template.footer.bankDetails.routingNumber}
                            onChange={(e) => updateFooter({ 
                              bankDetails: { ...template.footer.bankDetails, routingNumber: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="swiftCode">SWIFT Code</Label>
                          <Input
                            id="swiftCode"
                            value={template.footer.bankDetails.swiftCode}
                            onChange={(e) => updateFooter({ 
                              bankDetails: { ...template.footer.bankDetails, swiftCode: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Invoice Preview */}
                {/* Invoice Preview */}
        <div className={`${activeTab === 'design' ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <Card className="min-h-[800px] border">
            <CardContent className="p-8">
              <div 
                className="max-w-4xl mx-auto bg-white"
                style={{ fontFamily: template.design.fontFamily }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-start space-x-4">
                    {template.design.logoUrl && (
                      <img 
                        src={template.design.logoUrl} 
                        alt="Company Logo" 
                        className={`w-auto ${
                          template.design.logoSize === 'small' ? 'h-12' : 
                          template.design.logoSize === 'large' ? 'h-20' : 'h-16'
                        }`} 
                      />
                    )}
                    <div>
                      <h1 
                        className="text-3xl font-semibold mb-2"
                        style={{ color: template.design.primaryColor }}
                      >
                        {template.companyInfo.name}
                      </h1>
                      <div className="text-gray-600">
                        <p>{template.companyInfo.address}</p>
                        <p>{template.companyInfo.city}, {template.companyInfo.state} {template.companyInfo.postalCode}</p>
                        <p>{template.companyInfo.country}</p>
                        <p>{template.companyInfo.phone}</p>
                        <p>{template.companyInfo.email}</p>
                        <p>{template.companyInfo.website}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 
                      className="text-3xl font-bold mb-4"
                      style={{ color: template.design.primaryColor }}
                    >
                      INVOICE
                    </h2>
                    <div className="text-sm text-gray-600">
                      <p><strong>Invoice #:</strong> {template.content.invoiceNumberPrefix}{mockInvoiceData.invoiceNumber.replace(/^INV-/, '')}</p>
                      <p><strong>Date:</strong> {mockInvoiceData.date}</p>
                      <p><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                  <h3 
                    className="text-lg font-semibold mb-2"
                    style={{ color: template.design.primaryColor }}
                  >
                    Bill To:
                  </h3>
                  <div className="text-gray-600">
                    <p className="font-semibold">{mockInvoiceData.client.name}</p>
                    <p>{mockInvoiceData.client.address}</p>
                    <p>{mockInvoiceData.client.city}</p>
                    <p>{mockInvoiceData.client.email}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full">
                    <thead>
                      <tr 
                        style={{ 
                          backgroundColor: template.table.headerBackgroundColor,
                          color: template.table.headerTextColor
                        }}
                      >
                        {template.table.showItemNumber && <th className="text-left p-3 border-b">No.</th>}
                        {template.table.showDescription && <th className="text-left p-3 border-b">Description</th>}
                        {template.table.showQuantity && <th className="text-center p-3 border-b">Qty</th>}
                        {template.table.showRate && <th className="text-right p-3 border-b">Rate</th>}
                        {template.table.showAmount && <th className="text-right p-3 border-b">Amount</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {mockInvoiceData.items.map((item, index) => (
                        <tr 
                          key={index}
                          style={{ 
                            backgroundColor: template.table.alternateRowColors && index % 2 === 1 
                              ? template.table.alternateRowBackgroundColor 
                              : template.table.rowBackgroundColor
                          }}
                        >
                          {template.table.showItemNumber && <td className="p-3 border-b">{index + 1}</td>}
                          {template.table.showDescription && <td className="p-3 border-b">{item.description}</td>}
                          {template.table.showQuantity && <td className="text-center p-3 border-b">{item.quantity}</td>}
                          {template.table.showRate && <td className="text-right p-3 border-b">{template.localization.currencySymbol}{item.rate.toLocaleString()}</td>}
                          {template.table.showAmount && <td className="text-right p-3 border-b">{template.localization.currencySymbol}{item.amount.toLocaleString()}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-80">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>{template.localization.currencySymbol}{mockInvoiceData.subtotal.toLocaleString()}</span>
                    </div>
                    {template.table.showTax && (
                      <div className="flex justify-between py-2">
                        <span>{template.tax.taxLabel} ({template.tax.defaultTaxRate}%):</span>
                        <span>{template.localization.currencySymbol}{mockInvoiceData.tax.toLocaleString()}</span>
                      </div>
                    )}
                    <div 
                      className="flex justify-between py-2 text-lg font-bold border-t-2"
                      style={{ borderTopColor: template.design.primaryColor }}
                    >
                      <span>Total:</span>
                      <span style={{ color: template.design.primaryColor }}>
                        {template.localization.currencySymbol}{mockInvoiceData.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                {template.content.showPaymentTerms && (
                  <div className="mb-6">
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: template.design.primaryColor }}
                    >
                      Payment Terms:
                    </h4>
                    <p className="text-gray-600">{template.content.defaultPaymentTerms}</p>
                  </div>
                )}

                {/* Notes */}
                {template.content.showNotes && (
                  <div className="mb-6">
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: template.design.primaryColor }}
                    >
                      Notes:
                    </h4>
                    <p className="text-gray-600">{template.content.defaultNotes}</p>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="mb-6">
                  <h4 
                    className="font-semibold mb-2"
                    style={{ color: template.design.primaryColor }}
                  >
                    Terms & Conditions:
                  </h4>
                  <p className="text-sm text-gray-600">{template.footer.termsAndConditions}</p>
                </div>

                {/* Bank Details */}
                {template.footer.bankDetails.showBankDetails && (
                  <div className="mb-6">
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: template.design.primaryColor }}
                    >
                      Bank Details:
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p><strong>Bank:</strong> {template.footer.bankDetails.bankName}</p>
                      <p><strong>Account:</strong> {template.footer.bankDetails.accountNumber}</p>
                      <p><strong>Routing:</strong> {template.footer.bankDetails.routingNumber}</p>
                      <p><strong>SWIFT:</strong> {template.footer.bankDetails.swiftCode}</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                {template.footer.showFooter && (
                  <div 
                    className="text-center py-4 border-t-2"
                    style={{ borderTopColor: template.design.primaryColor }}
                  >
                    <p 
                      className="text-lg font-semibold"
                      style={{ color: template.design.primaryColor }}
                    >
                      {template.footer.footerText}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
          <Card className="min-h-[800px] border">
            <CardContent className="p-8">
              <div 
                className="max-w-4xl mx-auto bg-white"
                style={{ fontFamily: template.fontStyle }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-start space-x-4">
                    {template.logo && (
                      <img src={template.logo} alt="Company Logo" className="h-16 w-auto" />
                    )}
                    <div>
                      <h1 
                        className="text-3xl font-semibold mb-2"
                        style={{ color: template.primaryColor }}
                      >
                        {template.companyInfo.name}
                      </h1>
                      <div className="text-gray-600 space-y-1">
                        <p>{template.companyInfo.address}</p>
                        <p>{template.companyInfo.city}</p>
                        <p>{template.companyInfo.country}</p>
                        <p>{template.companyInfo.phone}</p>
                        <p>{template.companyInfo.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 
                      className="text-2xl font-semibold mb-4"
                      style={{ color: template.primaryColor }}
                    >
                      INVOICE
                    </h2>
                    <div className="space-y-1 text-gray-600">
                      <p><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                      <p><strong>Date:</strong> {mockInvoiceData.date}</p>
                      <p><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                  <h3 
                    className="text-lg font-medium mb-3"
                    style={{ color: template.primaryColor }}
                  >
                    Bill To:
                  </h3>
                  <div className="text-gray-700">
                    <p className="font-medium">{mockInvoiceData.client.name}</p>
                    <p>{mockInvoiceData.client.address}</p>
                    <p>{mockInvoiceData.client.city}</p>
                    <p>{mockInvoiceData.client.email}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: template.secondaryColor }}>
                        <th className="border border-gray-300 px-4 py-3 text-left font-medium">Description</th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-medium">Qty</th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-medium">Rate</th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInvoiceData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-3">{item.description}</td>
                          <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                          <td className="border border-gray-300 px-4 py-3 text-right">MK{item.rate.toLocaleString()}</td>
                          <td className="border border-gray-300 px-4 py-3 text-right">MK{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>{template.localization.currencySymbol}{mockInvoiceData.subtotal.toLocaleString()}</span>
                    </div>
                    {template.table.showTax && (
                      <div className="flex justify-between py-2">
                        <span>{template.tax.taxLabel} ({template.tax.defaultTaxRate}%):</span>
                        <span>{template.localization.currencySymbol}{mockInvoiceData.tax.toLocaleString()}</span>
                      </div>
                    )}
                    <div 
                      className="flex justify-between py-3 text-lg font-medium border-t-2"
                      style={{ borderTopColor: template.design.primaryColor }}
                    >
                      <span>Total:</span>
                      <span style={{ color: template.design.primaryColor }}>
                        {template.localization.currencySymbol}{mockInvoiceData.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                {template.content.showPaymentTerms && (
                  <div className="mb-6">
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: template.design.primaryColor }}
                    >
                      Payment Terms:
                    </h4>
                    <p className="text-gray-600">{template.content.defaultPaymentTerms}</p>
                  </div>
                )}

                {/* Notes */}
                {template.content.showNotes && (
                  <div className="mb-6">
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: template.design.primaryColor }}
                    >
                      Notes:
                    </h4>
                    <p className="text-gray-600">{template.content.defaultNotes}</p>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="mb-6">
                  <h4 
                    className="font-semibold mb-2"
                    style={{ color: template.design.primaryColor }}
                  >
                    Terms & Conditions:
                  </h4>
                  <p className="text-sm text-gray-600">{template.footer.termsAndConditions}</p>
                </div>

                {/* Bank Details */}
                {template.footer.bankDetails.showBankDetails && (
                  <div className="mb-6">
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: template.design.primaryColor }}
                    >
                      Bank Details:
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p><strong>Bank:</strong> {template.footer.bankDetails.bankName}</p>
                      <p><strong>Account:</strong> {template.footer.bankDetails.accountNumber}</p>
                      <p><strong>Routing:</strong> {template.footer.bankDetails.routingNumber}</p>
                      <p><strong>SWIFT:</strong> {template.footer.bankDetails.swiftCode}</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                {template.footer.showFooter && (
                  <div 
                    className="text-center py-4 border-t-2"
                    style={{ borderTopColor: template.design.primaryColor }}
                  >
                    <p 
                      className="text-lg font-semibold"
                      style={{ color: template.design.primaryColor }}
                    >
                      {template.footer.footerText}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
