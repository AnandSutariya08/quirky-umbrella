'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import ServiceTable from './ServiceTable';
import ServiceFormNew from './ServiceFormNew';
import ServicePreview from './ServicePreview';
import { servicesService } from '@/lib/services';
import type { Service } from '@/types/service';

const ServicesManagementInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      fetchServices();
    }
  }, [isHydrated]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const fetchedServices = await servicesService.getAll();
      setServices(fetchedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      showNotification('error', 'Failed to load services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        await servicesService.delete(id);
        setServices(prev => prev.filter(s => s.id !== id));
        showNotification('success', 'Service deleted successfully');
      } catch (error) {
        console.error('Error deleting service:', error);
        showNotification('error', 'Failed to delete service. Please try again.');
      }
    }
  };

  const handlePreview = (service: Service) => {
    setPreviewService(service);
  };

  const handleSave = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('handleSave called with:', serviceData);
      
      if (editingService && editingService.id) {
        // Update existing service
        console.log('Updating service:', editingService.id);
        await servicesService.update(editingService.id, serviceData);
        showNotification('success', 'Service updated successfully');
      } else {
        // Create new service
        console.log('Creating new service');
        const serviceId = await servicesService.create(serviceData);
        console.log('Service created with ID:', serviceId);
        showNotification('success', 'Service created successfully');
      }
      
      // Refresh services list
      await fetchServices();
      setShowForm(false);
      setEditingService(null);
    } catch (error: any) {
      console.error('Error saving service:', error);
      const errorMessage = error?.message || 'Failed to save service. Please check your Firebase configuration and try again.';
      showNotification('error', errorMessage);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-12 bg-card rounded animate-pulse" />
          <div className="h-96 bg-card rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Services Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Create and manage service offerings for your website
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
          >
            <Icon name="PlusIcon" size={20} />
            Add New Service
          </button>
        </div>

        {notification && (
          <div
            className={`flex items-center gap-3 p-4 rounded-md animate-slide-down ${
              notification.type === 'success' ?'bg-success/10 text-success' :'bg-error/10 text-error'
            }`}
          >
            <Icon
              name={notification.type === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'}
              size={20}
            />
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {showForm ? (
          <ServiceFormNew
            service={editingService}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : isLoading ? (
          <div className="bg-card rounded-lg shadow-neutral-md p-12 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        ) : (
          <ServiceTable
            services={services}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        )}

        {previewService && (
          <ServicePreview
            service={previewService}
            onClose={() => setPreviewService(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ServicesManagementInteractive;