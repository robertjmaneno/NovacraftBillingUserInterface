import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useUpdateService, SERVICE_CATEGORIES, BILLING_CYCLES, SERVICE_STATUSES } from '@/hooks/use-services';
import { Service, UpdateServiceRequest } from '@/services/api';

interface EditServiceDialogProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditServiceDialog: React.FC<EditServiceDialogProps> = ({
  service,
  open,
  onOpenChange,
}) => {
  const updateServiceMutation = useUpdateService();
  const [formData, setFormData] = useState<UpdateServiceRequest>({
    name: '',
    description: '',
    price: 0,
    billingCycle: 1,
    status: 1,
    category: 'Web Hosting',
    discountPercentage: 0,
    isTaxable: false,
    termsAndConditions: '',
  });

  // Separate state for input display values to avoid leading zeros
  const [priceInput, setPriceInput] = useState('');
  const [discountInput, setDiscountInput] = useState('');

  // Populate form when service changes
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        price: service.price,
        billingCycle: service.billingCycle,
        status: service.status,
        category: service.category || 'Web Hosting',
        discountPercentage: service.discountPercentage,
        isTaxable: service.isTaxable,
        termsAndConditions: service.termsAndConditions || '',
      });
      setPriceInput(service.price.toString());
      setDiscountInput(service.discountPercentage.toString());
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Service name is required');
      return;
    }
    
    if (formData.name.length > 100) {
      toast.error('Service name must be 100 characters or less');
      return;
    }
    
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    
    if (formData.description && formData.description.length > 500) {
      toast.error('Description must be 500 characters or less');
      return;
    }
    
    if (formData.category && formData.category.length > 100) {
      toast.error('Category must be 100 characters or less');
      return;
    }
    
    if (formData.termsAndConditions && formData.termsAndConditions.length > 500) {
      toast.error('Terms and conditions must be 500 characters or less');
      return;
    }
    
    try {
      await updateServiceMutation.mutateAsync({ id: service.id, data: formData });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const handlePriceChange = (value: string) => {
    // Remove all non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return; // Don't update if there are multiple decimal points
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return; // Don't update if more than 2 decimal places
    }
    
    // Update the display value
    setPriceInput(cleanValue);
    
    // Update the form data with the numeric value
    const numValue = parseFloat(cleanValue) || 0;
    setFormData({ ...formData, price: numValue });
  };

  const handleDiscountChange = (value: string) => {
    // Remove all non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return; // Don't update if there are multiple decimal points
    }
    
    // Limit to 1 decimal place
    if (parts[1] && parts[1].length > 1) {
      return; // Don't update if more than 1 decimal place
    }
    
    // Limit to 100%
    const numValue = parseFloat(cleanValue) || 0;
    if (numValue > 100) {
      return; // Don't update if greater than 100
    }
    
    // Update the display value
    setDiscountInput(cleanValue);
    
    // Update the form data with the numeric value
    setFormData({ ...formData, discountPercentage: numValue });
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Service Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Web Development"
              className="h-10"
              maxLength={100}
              required
            />
            {formData.name && (
              <div className="text-xs text-gray-500 text-right">
                {formData.name.length}/100 characters
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingCycle" className="text-sm font-medium">Billing Cycle</Label>
              <Select 
                value={formData.billingCycle.toString()} 
                onValueChange={(value) => setFormData({ ...formData, billingCycle: parseInt(value) })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_CYCLES.map((cycle) => (
                    <SelectItem key={cycle.value} value={cycle.value.toString()}>
                      {cycle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">Status</Label>
            <Select 
              value={formData.status.toString()} 
              onValueChange={(value) => setFormData({ ...formData, status: parseInt(value) })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value.toString()}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the service"
              rows={4}
              className="resize-none"
            />
            {formData.description && (
              <div className="text-xs text-gray-500 text-right">
                {formData.description.length}/500 characters
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Price</Label>
              <Input
                id="price"
                type="text"
                value={priceInput}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0.00"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercentage" className="text-sm font-medium">Discount Percentage</Label>
              <Input
                id="discountPercentage"
                type="text"
                value={discountInput}
                onChange={(e) => handleDiscountChange(e.target.value)}
                placeholder="0"
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="termsAndConditions" className="text-sm font-medium">Terms and Conditions</Label>
            <Textarea
              id="termsAndConditions"
              value={formData.termsAndConditions}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
              placeholder="Enter terms and conditions for this service..."
              rows={4}
              className="resize-none"
            />
            {formData.termsAndConditions && (
              <div className="text-xs text-gray-500 text-right">
                {formData.termsAndConditions.length}/500 characters
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isTaxable"
              checked={formData.isTaxable}
              onCheckedChange={(checked) => setFormData({ ...formData, isTaxable: checked })}
            />
            <Label htmlFor="isTaxable" className="text-sm font-medium">Taxable Service</Label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={updateServiceMutation.isPending}
              className="px-6"
            >
              Cancel
            </Button>

            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 px-6"
              disabled={updateServiceMutation.isPending}
            >
              {updateServiceMutation.isPending ? 'Updating...' : 'Update Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 