'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import RichTextEditor from './RichTextEditor';

interface Service {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  contentHtml: string;
  imageUrl: string;
  status: 'published' | 'draft';
  lastModified: string;
}

interface ServiceFormProps {
  service: Service | null;
  onSave: (service: Omit<Service, 'id' | 'lastModified'>) => void;
  onCancel: () => void;
}

import ImageUpload from './ImageUpload';

const ServiceForm = ({ service, onSave, onCancel }: ServiceFormProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    imageUrl: '',
    status: 'draft' as 'published' | 'draft',
    whatIsIt: { title: 'What Is It?', content: '' },
    deliverables: { title: 'Deliverables', items: [] },
    approach: { title: 'Our Approach', content: '', processTitle: 'The Process', processSteps: [] },
    useCases: { title: 'Use Cases', industries: [] },
    cta: { title: 'Ready to Start?', content: '', buttonText: 'Contact Us' },
    faqs: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (service) {
      setFormData({
        ...formData,
        ...service,
      });
    }
  }, [service]);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-neutral-md p-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse w-48" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 bg-muted rounded animate-pulse w-24 mb-2" />
                <div className="h-12 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.tagline.trim()) {
      newErrors.tagline = 'Tagline is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-neutral-md">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-semibold text-foreground">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
            title="Close"
          >
            <Icon name="XMarkIcon" size={24} className="text-foreground" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-4 py-3 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.title ? 'border-error' : 'border-input'
                }`}
                placeholder="Enter service title"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <Icon name="ExclamationCircleIcon" size={16} />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-foreground mb-2">
                Tagline <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="tagline"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className={`w-full px-4 py-3 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.tagline ? 'border-error' : 'border-input'
                }`}
                placeholder="Enter short tagline"
              />
            </div>
          </div>

          <div>
            <ImageUpload
              currentImageUrl={formData.imageUrl}
              onUploadComplete={(url) => handleChange('imageUrl', url)}
              onImageRemove={() => handleChange('imageUrl', '')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Brief Description <span className="text-error">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none ${
              errors.description ? 'border-error' : 'border-input'
            }`}
            placeholder="Enter service description"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-muted text-foreground rounded-md font-medium hover:bg-muted/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:shadow-warm-md"
          >
            {service ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
