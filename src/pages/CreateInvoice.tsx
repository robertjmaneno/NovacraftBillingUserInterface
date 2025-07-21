
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Save, Send, Eye } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCustomers } from '@/hooks/use-customers';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: customersData, isLoading: customersLoading } = useCustomers();
  const customers = customersData?.data?.items || [];

  // If coming back from CreateCustomer, pre-select the new customer
  const newCustomerId = location.state?.newCustomerId;

  const [invoiceData, setInvoiceData] = useState({
    customerId: newCustomerId || '',
    currency: 'MWK',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    discountPercent: 0,
    taxPercent: 0,
    notes: '',
    termsAndConditions: '',
  });

  const [items, setItems] = useState([
    { id: '1', description: '', quantity: 1, rate: 0 }
  ]);

  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (newCustomerId) {
      setInvoiceData((prev) => ({ ...prev, customerId: newCustomerId }));
    }
  }, [newCustomerId]);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), description: '', quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: 'description' | 'quantity' | 'rate', value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const discountAmount = subtotal * (invoiceData.discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (invoiceData.taxPercent / 100);
  const total = taxableAmount + taxAmount;

  const handleSaveOrSend = async (action: 'save' | 'send') => {
    
    const reqBody = {
      customerId: Number(invoiceData.customerId),
      items: items.map(({ description, quantity, rate }) => ({ description, quantity: Number(quantity), rate: Number(quantity) * Number(rate) })),
      currency: invoiceData.currency,
      invoiceDate: invoiceData.invoiceDate,
      dueDate: invoiceData.dueDate,
      discountPercent: Number(invoiceData.discountPercent),
      taxPercent: Number(invoiceData.taxPercent),
      notes: invoiceData.notes,
      termsAndConditions: invoiceData.termsAndConditions,
    };
    setSending(true);
    try {
      await apiService.createInvoice(reqBody);
      toast.success('Invoice sent successfully!');
      navigate('/invoices');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send invoice');
    } finally {
      setSending(false);
    }
  };

  const handleAddCustomer = () => {
    navigate('/customers/create', { state: { from: '/invoices/create' } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Invoice</h1>
          <p className="text-gray-600 mt-1">Generate a new invoice for your customer</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/invoices">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>
      {/* Invoice Header */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <div className="flex gap-2 items-center">
                <Select
                  value={invoiceData.customerId}
                  onValueChange={(value) => setInvoiceData({ ...invoiceData, customerId: value })}
                  disabled={customersLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={customersLoading ? 'Loading...' : 'Select a customer'} />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={String(customer.id)}>
                        {customer.displayName || customer.fullName || customer.organizationName || customer.firstName + ' ' + customer.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="sm" onClick={handleAddCustomer}>
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Add Customer</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={invoiceData.currency} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button variant="outline" size="sm" onClick={addItem}>
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Rate</Label>
                  <Input
                    type="number"
                    min={0}
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Amount</Label>
                  <Input value={item.quantity * item.rate} disabled />
                </div>
                <div className="col-span-1 flex items-center">
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} disabled={items.length === 1}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Totals and Extras */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                min={0}
                value={String(invoiceData.discountPercent)}
                onChange={(e) => setInvoiceData({ ...invoiceData, discountPercent: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tax (%)</Label>
              <Input
                type="number"
                min={0}
                value={String(invoiceData.taxPercent)}
                onChange={(e) => setInvoiceData({ ...invoiceData, taxPercent: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <Input value={total} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Terms & Conditions</Label>
            <Textarea
              value={invoiceData.termsAndConditions}
              onChange={(e) => setInvoiceData({ ...invoiceData, termsAndConditions: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
      {/* Send Invoice Button at bottom right */}
      <div className="flex justify-end mt-8">
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleSaveOrSend('send')} disabled={sending}>
          {sending ? <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"></span> : null}
          Send Invoice
        </Button>
      </div>
    </div>
  );
};
