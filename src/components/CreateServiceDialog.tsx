
import React, { useState } from 'react';
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
import { useCreateService, SERVICE_CATEGORIES, BILLING_CYCLES } from '@/hooks/use-services';
import { CreateServiceRequest } from '@/services/api';

interface CreateServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateServiceDialog: React.FC<CreateServiceDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const createServiceMutation = useCreateService();
  const [formData, setFormData] = useState<CreateServiceRequest>({
    name: '',
    description: '',
    price: 0,
    billingCycle: 1, // Default to Monthly
    status: 1, // Default to Active
    category: 'Web Hosting',
    discountPercentage: 0,
    isTaxable: false,
    termsAndConditions: '',
  });

 
  const [priceInput, setPriceInput] = useState('');
  const [discountInput, setDiscountInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      await createServiceMutation.mutateAsync(formData);
      onOpenChange(false);
      // Reset form
      setFormData({
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
      setPriceInput('');
      setDiscountInput('');
    } catch (error) {
      console.error('Failed to create service:', error);
    }
  };



  const handlePriceChange = (value: string) => {
   
    const cleanValue = value.replace(/[^\d.]/g, '');
    

    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return; 
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return; 
    }
    
    
    setPriceInput(cleanValue);
    
    
    const numValue = parseFloat(cleanValue) || 0;
    setFormData({ ...formData, price: numValue });
  };

  const handleDiscountChange = (value: string) => {
    
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return; 
    }
    
    // Limit to 1 decimal place
    if (parts[1] && parts[1].length > 1) {
      return; // Don't update if more than 1 decimal place
    }
    
    // Limit to 100%
    const numValue = parseFloat(cleanValue) || 0;
    if (numValue > 100) {
      return; 
    }
    
    // Update the display value
    setDiscountInput(cleanValue);
    
    // Update the form data with the numeric value
    setFormData({ ...formData, discountPercentage: numValue });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Service</DialogTitle>
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
                min="0"
                step="0.01"
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
              disabled={createServiceMutation.isPending}
              className="px-6"
            >
              Cancel
            </Button>

            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 px-6"
              disabled={createServiceMutation.isPending}
            >
              {createServiceMutation.isPending ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
