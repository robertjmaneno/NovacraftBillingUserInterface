
import React, { useState, useEffect, useMemo } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateSubscription } from '@/hooks/use-subscriptions';
import { useCustomers } from '@/hooks/use-customers';
import { useServices } from '@/hooks/use-services';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

// Helper for generic POST requests
const postApi = async (url: string, data: Record<string, unknown>) => {
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(apiService['baseUrl'] + url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create subscription');
  return res.json();
};

export const CreateSubscription: React.FC = () => {
  const [subscriptionData, setSubscriptionData] = useState({
    clientId: '',
    planName: '',
    description: '',
    amount: '',
    currency: 'USD',
    interval: 'monthly',
    trialDays: '',
    autoRenew: true,
    startDate: new Date().toISOString().split('T')[0],
    maxCycles: '',
    setupFee: '',
    discountRate: '',
    taxRate: '',
    notes: '',
    serviceIds: [] as string[],
  });

  const createSubscriptionMutation = useCreateSubscription();
  const { data: customersData, isLoading: customersLoading } = useCustomers();
  const customers = customersData?.data?.items || [];
  const { data: servicesData, isLoading: servicesLoading } = useServices(1, 100);
  const services = useMemo(() => servicesData?.data?.items || [], [servicesData]);

  const [servicePage, setServicePage] = useState(1);
  const servicesPerPage = 10;
  const totalServicePages = Math.ceil(services.length / servicesPerPage);
  const paginatedServices = services.slice((servicePage - 1) * servicesPerPage, servicePage * servicesPerPage);

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const selectedServices = services.filter(service =>
      subscriptionData.serviceIds.includes(service.id.toString())
    );
    const total = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
    setSubscriptionData(prev => ({
      ...prev,
      amount: total.toString(),
    }));
  }, [subscriptionData.serviceIds, services]);

  
  const getBillingCycleString = (cycle: number) => {
    switch (cycle) {
      case 1: return 'Monthly';
      case 2: return 'Quarterly';
      case 3: return 'SemiAnnually';
      case 4: return 'Annually';
      case 5: return 'OneTime';
      default: return 'Other';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const customerId = Number(subscriptionData.clientId);
    const selectedServices = services.filter(service => subscriptionData.serviceIds.includes(service.id.toString()));
    const nowIso = new Date().toISOString();
    try {
      
      if (selectedServices.length === 0) throw new Error('Please select at least one service');
      const servicesPayload = selectedServices.map((service) => ({
        serviceId: service.id,
        amount: service.price,
        billingCycle: service.billingCycle, 
        startDate: nowIso,
        notes: subscriptionData.notes || "string",
        autoRenew: subscriptionData.autoRenew,
        discountPercentage: subscriptionData.discountRate ? Number(subscriptionData.discountRate) : 0,
        discountAmount: 0 
      }));
      const bulkPayload = {
        customerId,
        services: servicesPayload,
        generalNotes: subscriptionData.notes || "string",
        autoRenew: subscriptionData.autoRenew
      };
      console.log('POST /api/subscription/bulk', JSON.stringify(bulkPayload, null, 2));
      await postApi('/api/subscription/bulk', bulkPayload);
      toast.success('Subscriptions created successfully!');
      navigate('/subscriptions');
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message || 'Failed to create subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const setupFee = parseFloat(subscriptionData.setupFee) || 0;
  const amount = parseFloat(subscriptionData.amount) || 0;
  const discountAmount = amount * ((parseFloat(subscriptionData.discountRate) || 0) / 100);
  const discountedAmount = amount - discountAmount;
  const taxAmount = discountedAmount * ((parseFloat(subscriptionData.taxRate) || 0) / 100);
  const totalAmount = discountedAmount + taxAmount + setupFee;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/subscriptions">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Create Subscription</h1>
            <p className="text-gray-600 mt-1">Set up a new recurring billing subscription</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select value={subscriptionData.clientId} onValueChange={value => setSubscriptionData({ ...subscriptionData, clientId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={customersLoading ? 'Loading...' : 'Select a customer'} />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.customerType === 1
                          ? customer.organizationName
                          : `${customer.firstName} ${customer.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* After the client dropdown, add the multi-select for services with pagination */}
            <div className="space-y-2">
              <Label>Services</Label>
              {servicesLoading ? (
                <div>Loading services...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {paginatedServices.map(service => (
                      <label key={service.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={subscriptionData.serviceIds.includes(service.id.toString())}
                          onChange={e => {
                            const checked = e.target.checked;
                            setSubscriptionData(prev => ({
                              ...prev,
                              serviceIds: checked
                                ? [...(prev.serviceIds || []), service.id.toString()]
                                : (prev.serviceIds || []).filter(id => id !== service.id.toString())
                            }));
                          }}
                        />
                        <span>{service.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Button type="button" variant="outline" size="sm" disabled={servicePage === 1} onClick={() => setServicePage(p => Math.max(1, p - 1))}>
                      Previous
                    </Button>
                    <span className="text-xs text-gray-600">Page {servicePage} of {totalServicePages}</span>
                    <Button type="button" variant="outline" size="sm" disabled={servicePage === totalServicePages} onClick={() => setServicePage(p => Math.min(totalServicePages, p + 1))}>
                      Next
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={subscriptionData.description}
                onChange={(e) => setSubscriptionData({ ...subscriptionData, description: e.target.value })}
                placeholder="Describe what's included in this subscription"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label htmlFor="discountRate">Discount Rate (%)</Label>
                <Input
                  id="discountRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={subscriptionData.discountRate}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, discountRate: e.target.value })}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  type="text"
                  value={subscriptionData.notes}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, notes: e.target.value })}
                  placeholder="Additional notes"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoRenew"
                checked={subscriptionData.autoRenew}
                onCheckedChange={(checked) => setSubscriptionData({ ...subscriptionData, autoRenew: checked })}
              />
              <Label htmlFor="autoRenew">Auto Renew</Label>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span>{Number(subscriptionData.amount).toLocaleString()} MWK</span>
              </div>
              {Number(subscriptionData.setupFee) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Setup Fee (one-time):</span>
                  <span>{Number(subscriptionData.setupFee).toLocaleString()} MWK</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {(
                    Number(subscriptionData.amount) + (Number(subscriptionData.setupFee) || 0)
                  ).toLocaleString()} MWK
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Link to="/subscriptions">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createSubscriptionMutation.status === 'pending' || submitting}>
            {submitting ? <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"></span> : <Save className="w-4 h-4 mr-2" />}
            {submitting ? 'Creating...' : 'Create Subscription'}
          </Button>
        </div>
      </form>
    </div>
  );
};
