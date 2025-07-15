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
import { 
  Eye, 
  Download, 
  Printer, 
  Palette, 
  Save,
  FileText,
  Building,
  Mail,
  Phone
} from 'lucide-react';

interface InvoiceTemplate {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontStyle: string;
  logo?: string;
  companyInfo: {
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    website: string;
  };
  footer: string;
  terms: string;
}

const mockTemplate: InvoiceTemplate = {
  id: '1',
  name: 'Default Template',
  primaryColor: '#3B82F6',
  secondaryColor: '#F3F4F6',
  fontStyle: 'Poppins',
  companyInfo: {
    name: 'Novacraft Inc.',
    address: '123 Business Street',
    city: 'Blantyre, Malawi',
    country: 'Malawi',
    phone: '+265 (0) 123-4567',
    email: 'hello@novacraft.mw',
    website: 'www.novacraft.mw'
  },
  footer: 'Thank you for your business!',
  terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.'
};

const mockInvoiceData = {
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
  const [template, setTemplate] = useState<InvoiceTemplate>(mockTemplate);
  const [activeTab, setActiveTab] = useState<'design' | 'preview'>('design');

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTemplate(prev => ({ ...prev, logo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Saving template:', template);
  };

  const handleDownload = () => {
    console.log('Downloading invoice as PDF');
  };

  const handlePrint = () => {
    window.print();
  };

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
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
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
                    />
                    {template.logo && (
                      <div className="flex items-center space-x-2">
                        <img src={template.logo} alt="Logo preview" className="h-12 w-auto" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTemplate(prev => ({ ...prev, logo: undefined }))}
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
                      value={template.primaryColor}
                      onChange={(e) => setTemplate(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      value={template.primaryColor}
                      onChange={(e) => setTemplate(prev => ({ ...prev, primaryColor: e.target.value }))}
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
                      value={template.secondaryColor}
                      onChange={(e) => setTemplate(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      value={template.secondaryColor}
                      onChange={(e) => setTemplate(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontStyle">Font Style</Label>
                  <Select value={template.fontStyle} onValueChange={(value) => setTemplate(prev => ({ ...prev, fontStyle: value }))}>
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
                    onChange={(e) => setTemplate(prev => ({ 
                      ...prev, 
                      companyInfo: { ...prev.companyInfo, name: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <Input
                    id="companyAddress"
                    value={template.companyInfo.address}
                    onChange={(e) => setTemplate(prev => ({ 
                      ...prev, 
                      companyInfo: { ...prev.companyInfo, address: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyCity">City</Label>
                  <Input
                    id="companyCity"
                    value={template.companyInfo.city}
                    onChange={(e) => setTemplate(prev => ({ 
                      ...prev, 
                      companyInfo: { ...prev.companyInfo, city: e.target.value }
                    }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input
                      id="companyPhone"
                      value={template.companyInfo.phone}
                      onChange={(e) => setTemplate(prev => ({ 
                        ...prev, 
                        companyInfo: { ...prev.companyInfo, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      value={template.companyInfo.email}
                      onChange={(e) => setTemplate(prev => ({ 
                        ...prev, 
                        companyInfo: { ...prev.companyInfo, email: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={template.companyInfo.website}
                    onChange={(e) => setTemplate(prev => ({ 
                      ...prev, 
                      companyInfo: { ...prev.companyInfo, website: e.target.value }
                    }))}
                  />
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
                    value={template.footer}
                    onChange={(e) => setTemplate(prev => ({ ...prev, footer: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={template.terms}
                    onChange={(e) => setTemplate(prev => ({ ...prev, terms: e.target.value }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Invoice Preview */}
        <div className={`${activeTab === 'design' ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
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
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{template.companyInfo.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{template.companyInfo.email}</span>
                          </div>
                        </div>
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
                      <span>MK{mockInvoiceData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Tax (0%):</span>
                      <span>MK{mockInvoiceData.tax.toLocaleString()}</span>
                    </div>
                    <div 
                      className="flex justify-between py-3 text-lg font-medium border-t-2"
                      style={{ borderTopColor: template.primaryColor }}
                    >
                      <span>Total:</span>
                      <span style={{ color: template.primaryColor }}>MK{mockInvoiceData.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="mb-6">
                  <h3 
                    className="text-lg font-medium mb-3"
                    style={{ color: template.primaryColor }}
                  >
                    Terms & Conditions
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {template.terms}
                  </p>
                </div>

                {/* Footer */}
                <div 
                  className="text-center py-4 border-t-2"
                  style={{ borderTopColor: template.primaryColor }}
                >
                  <p 
                    className="text-lg font-medium"
                    style={{ color: template.primaryColor }}
                  >
                    {template.footer}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">{template.companyInfo.website}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
