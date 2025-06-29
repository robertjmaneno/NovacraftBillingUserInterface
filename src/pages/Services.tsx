
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Package,
  TrendingUp,
  Filter,
  Star,
  Users
} from 'lucide-react';
import { CreateServiceDialog } from '@/components/CreateServiceDialog';

const services = [
  {
    id: 'SRV-001',
    name: 'Web Development',
    description: 'Full-stack web application development with modern technologies',
    category: 'Development',
    pricing: 'hourly',
    rate: 150,
    currency: 'USD',
    status: 'Active',
    clients: 12,
    revenue: 18000
  },
  {
    id: 'SRV-002',
    name: 'SEO Optimization',
    description: 'Search engine optimization services to boost online visibility',
    category: 'Marketing',
    pricing: 'fixed',
    rate: 2500,
    currency: 'USD',
    status: 'Active',
    clients: 8,
    revenue: 20000
  },
  {
    id: 'SRV-003',
    name: 'Graphic Design',
    description: 'Logo and brand identity design for businesses',
    category: 'Design',
    pricing: 'fixed',
    rate: 800,
    currency: 'USD',
    status: 'Active',
    clients: 15,
    revenue: 12000
  },
  {
    id: 'SRV-004',
    name: 'Business Consulting',
    description: 'Strategic business consulting and growth planning',
    category: 'Consulting',
    pricing: 'hourly',
    rate: 200,
    currency: 'USD',
    status: 'Inactive',
    clients: 5,
    revenue: 8000
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Development': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Marketing': return 'bg-green-100 text-green-800 border-green-200';
    case 'Design': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Consulting': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-200';
    case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'Active').length;
  const totalRevenue = services.reduce((sum, s) => sum + s.revenue, 0);
  const avgRate = Math.round(services.reduce((sum, s) => sum + s.rate, 0) / services.length);

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Services</h1>
          <p className="text-lg text-gray-600">Manage your service offerings and pricing</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 shadow-lg"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-3xl font-bold text-gray-900">{totalServices}</p>
                <p className="text-sm text-blue-600 mt-1">{activeServices} active</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">All time</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rate</p>
                <p className="text-3xl font-bold text-gray-900">${avgRate}</p>
                <p className="text-sm text-purple-600 mt-1">Per hour/project</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-3xl font-bold text-gray-900">{services.reduce((sum, s) => sum + s.clients, 0)}</p>
                <p className="text-sm text-orange-600 mt-1">Using services</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="shadow-md border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search services by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-semibold text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600">{service.id}</div>
                      <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">{service.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(service.category)}>
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{service.pricing}</TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      ${service.rate}
                      <span className="text-sm font-normal text-gray-600">
                        /{service.pricing === 'hourly' ? 'hr' : 'project'}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-blue-600">{service.clients}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">${service.revenue.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateServiceDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};
