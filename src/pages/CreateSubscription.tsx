
import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';

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
  });

  const clients = [
    { id: '1', name: 'Acme Corp' },
    { id: '2', name: 'Tech Solutions Ltd' },
    { id: '3', name: 'Digital Agency Inc' },
    { id: '4', name: 'StartupXYZ' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscription created:', subscriptionData);
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
            <h1 className="text-3xl font-bold text-gray-900">Create Subscription</h1>
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
                <Label htmlFor="client">Client</Label>
                <Select value={subscriptionData.clientId} onValueChange={(value) => setSubscriptionData({ ...subscriptionData, clientId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planName">Plan Name</Label>
                <Input
                  id="planName"
                  value={subscriptionData.planName}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, planName: e.target.value })}
                  placeholder="e.g., Professional Plan"
                  required
                />
              </div>
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
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={subscriptionData.amount}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={subscriptionData.currency} onValueChange={(value) => setSubscriptionData({ ...subscriptionData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">Billing Interval</Label>
                <Select value={subscriptionData.interval} onValueChange={(value) => setSubscriptionData({ ...subscriptionData, interval: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="setupFee">Setup Fee (Optional)</Label>
                <Input
                  id="setupFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={subscriptionData.setupFee}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, setupFee: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountRate">Discount (%)</Label>
                <Input
                  id="discountRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={subscriptionData.discountRate}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, discountRate: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={subscriptionData.taxRate}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, taxRate: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={subscriptionData.startDate}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trialDays">Trial Period (Days)</Label>
                <Input
                  id="trialDays"
                  type="number"
                  min="0"
                  value={subscriptionData.trialDays}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, trialDays: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCycles">Max Billing Cycles</Label>
                <Input
                  id="maxCycles"
                  type="number"
                  min="1"
                  value={subscriptionData.maxCycles}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, maxCycles: e.target.value })}
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoRenew"
                checked={subscriptionData.autoRenew}
                onCheckedChange={(checked) => setSubscriptionData({ ...subscriptionData, autoRenew: checked })}
              />
              <Label htmlFor="autoRenew">Auto-renew subscription</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={subscriptionData.notes}
                onChange={(e) => setSubscriptionData({ ...subscriptionData, notes: e.target.value })}
                placeholder="Additional notes about this subscription"
                rows={3}
              />
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
                <span className="text-gray-600">Base Amount:</span>
                <span>${amount.toFixed(2)} {subscriptionData.currency}</span>
              </div>
              {parseFloat(subscriptionData.discountRate) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount ({subscriptionData.discountRate}%):</span>
                  <span className="text-red-600">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {parseFloat(subscriptionData.taxRate) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({subscriptionData.taxRate}%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
              )}
              {setupFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Setup Fee (one-time):</span>
                  <span>${setupFee.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    Total per {subscriptionData.interval.replace('ly', '')}:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${(totalAmount - setupFee).toFixed(2)} {subscriptionData.currency}
                  </span>
                </div>
                {setupFee > 0 && (
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>First payment (including setup):</span>
                    <span>${totalAmount.toFixed(2)} {subscriptionData.currency}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Link to="/subscriptions">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Create Subscription
          </Button>
        </div>
      </form>
    </div>
  );
};
