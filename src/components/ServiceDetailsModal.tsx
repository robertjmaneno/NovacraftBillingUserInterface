import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  Users, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Service } from '@/services/api';
import { getBillingCycleDisplay, getServiceStatusDisplay, getServiceStatusColor, getCategoryColor } from '@/hooks/use-services';
import { ServiceDetailsShimmer } from '@/components/ui/shimmer';

interface ServiceDetailsModalProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  open,
  onOpenChange,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (service) {
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [service]);

  if (!service) return null;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Service Details
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <ServiceDetailsShimmer />
        </DialogContent>
      </Dialog>
    );
  }

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1: return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 2: return <Clock className="w-4 h-4 text-gray-600" />;
      case 3: return <X className="w-4 h-4 text-red-600" />;
      case 4: return <Clock className="w-4 h-4 text-yellow-600" />;
      case 5: return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Service Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {service.name}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getCategoryColor(service.category)}>
                  <Tag className="w-3 h-3 mr-1" />
                  {service.category || 'Uncategorized'}
                </Badge>
                <Badge className={getServiceStatusColor(service.status)}>
                  {getStatusIcon(service.status)}
                  <span className="ml-1">{getServiceStatusDisplay(service.status)}</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pricing Information */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-900">Pricing</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold text-gray-900">
                      MWK {service.price.toLocaleString()}
                    </span>
                  </div>
                  {service.discountPercentage > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-red-600">
                        {service.discountPercentage}%
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxable:</span>
                    <span className="font-semibold text-gray-900">
                      {service.isTaxable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Billing</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cycle:</span>
                    <span className="font-semibold text-gray-900">
                      {getBillingCycleDisplay(service.billingCycle)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getServiceStatusColor(service.status)}>
                      {getServiceStatusDisplay(service.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-gray-900">Clients</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Clients:</span>
                    <span className="font-semibold text-purple-600">
                      {service.clientCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Information */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-900">Revenue</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue:</span>
                    <span className="font-semibold text-green-600">
                      MWK {service.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terms and Conditions */}
          {service.termsAndConditions && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">Terms and Conditions</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {service.termsAndConditions}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service ID and Metadata */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Service ID:</span>
                  <span className="ml-2 font-mono text-gray-900">#{service.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                {service.updatedAt && (
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(service.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 