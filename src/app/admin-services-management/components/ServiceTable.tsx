'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Service } from '@/types/service';

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onPreview: (service: Service) => void;
}

const ServiceTable = ({ services, onEdit, onDelete, onPreview }: ServiceTableProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'title' | 'slug' | 'updatedAt'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-neutral-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Slug</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Modified</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-muted rounded-md animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-muted rounded-full animate-pulse w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-28" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                      <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                      <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const handleSort = (field: 'title' | 'slug' | 'updatedAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedServices = [...filteredServices].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    if (sortField === 'updatedAt') {
      aValue = a.updatedAt || a.createdAt || new Date(0);
      bValue = b.updatedAt || b.createdAt || new Date(0);
      return sortDirection === 'asc' 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    }
    
    return 0;
  });

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {sortedServices.length} service{sortedServices.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="hidden lg:block bg-card rounded-lg shadow-neutral-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-muted/80 transition-smooth"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Title
                    {sortField === 'title' && (
                      <Icon
                        name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                        size={16}
                      />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-muted/80 transition-smooth"
                  onClick={() => handleSort('slug')}
                >
                  <div className="flex items-center gap-2">
                    Slug
                    {sortField === 'slug' && (
                      <Icon
                        name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                        size={16}
                      />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Tagline
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-muted/80 transition-smooth"
                  onClick={() => handleSort('updatedAt')}
                >
                  <div className="flex items-center gap-2">
                    Last Modified
                    {sortField === 'updatedAt' && (
                      <Icon
                        name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                        size={16}
                      />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <Icon name="DocumentTextIcon" size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No services found</p>
                    <p className="text-sm mt-2">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                sortedServices.map((service) => {
                  const lastModified = service.updatedAt || service.createdAt;
                  const formattedDate = lastModified 
                    ? new Date(lastModified).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A';
                  
                  return (
                    <tr key={service.id} className="border-t border-border hover:bg-muted/50 transition-smooth">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{service.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-secondary bg-secondary/10 px-2 py-1 rounded">
                          {service.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                          {service.tagline}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            service.isActive ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${
                            service.isActive ? 'bg-success' : 'bg-warning'
                          }`} />
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onPreview(service)}
                            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
                            title="Preview"
                          >
                            <Icon name="EyeIcon" size={18} className="text-foreground" />
                          </button>
                          <button
                            onClick={() => onEdit(service)}
                            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
                            title="Edit"
                          >
                            <Icon name="PencilIcon" size={18} className="text-secondary" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(service.id || '')}
                            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
                            title="Delete"
                          >
                            <Icon name="TrashIcon" size={18} className="text-error" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        {sortedServices.length === 0 ? (
          <div className="bg-card rounded-lg shadow-neutral-md p-8 text-center">
            <Icon name="DocumentTextIcon" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-medium text-foreground">No services found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          sortedServices.map((service) => {
            const lastModified = service.updatedAt || service.createdAt;
            const formattedDate = lastModified 
              ? new Date(lastModified).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'N/A';
            
            return (
              <div key={service.id} className="bg-card rounded-lg shadow-neutral-md p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg">{service.title}</h3>
                    <code className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded mt-2 inline-block">
                      {service.slug}
                    </code>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {service.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="space-y-2">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        service.isActive ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        service.isActive ? 'bg-success' : 'bg-warning'
                      }`} />
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <p className="text-xs text-muted-foreground">{formattedDate}</p>
                  </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreview(service)}
                    className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
                    title="Preview"
                  >
                    <Icon name="EyeIcon" size={20} className="text-foreground" />
                  </button>
                  <button
                    onClick={() => onEdit(service)}
                    className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
                    title="Edit"
                  >
                    <Icon name="PencilIcon" size={20} className="text-secondary" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(service.id || '')}
                    className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
                    title="Delete"
                  >
                    <Icon name="TrashIcon" size={20} className="text-error" />
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-card rounded-lg shadow-neutral-xl max-w-md w-full p-6 animate-slide-down">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                <Icon name="ExclamationTriangleIcon" size={24} className="text-error" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Delete Service</h3>
                <p className="text-muted-foreground text-sm">
                  Are you sure you want to delete this service? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-3 bg-muted text-foreground rounded-md font-medium transition-smooth hover:bg-muted/80 press-scale"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-error text-error-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;