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

const ServiceForm = ({ service, onSave, onCancel }: ServiceFormProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    contentHtml: '',
    imageUrl: '',
    status: "draft' as 'published' | 'draft",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        slug: service.slug,
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,
        contentHtml: service.contentHtml,
        imageUrl: service.imageUrl,
        status: service.status,
      });
      setImagePreview(service.imageUrl);
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, imageUrl: 'Please select a valid image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imageUrl: 'Image size must be less than 5MB' }));
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onloadstart = () => setUploadProgress(10);
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 90;
        setUploadProgress(progress);
      }
    };
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setFormData((prev) => ({ ...prev, imageUrl: result }));
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    };
    reader.readAsDataURL(file);
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

    if (!formData.metaTitle.trim()) {
      newErrors.metaTitle = 'Meta title is required';
    } else if (formData.metaTitle.length > 60) {
      newErrors.metaTitle = 'Meta title should be 60 characters or less';
    }

    if (!formData.metaDescription.trim()) {
      newErrors.metaDescription = 'Meta description is required';
    } else if (formData.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description should be 160 characters or less';
    }

    if (!formData.contentHtml.trim()) {
      newErrors.contentHtml = 'Content is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image is required';
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

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={`w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth ${
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
            <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-2">
              Slug <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className={`w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth ${
                errors.slug ? 'border-error' : 'border-input'
              }`}
              placeholder="service-slug"
            />
            {errors.slug && (
              <p className="mt-2 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors.slug}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              URL: /services/{formData.slug || 'service-slug'}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="metaTitle" className="block text-sm font-medium text-foreground mb-2">
            Meta Title <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => handleChange('metaTitle', e.target.value)}
            maxLength={60}
            className={`w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth ${
              errors.metaTitle ? 'border-error' : 'border-input'
            }`}
            placeholder="Enter meta title for SEO"
          />
          <div className="mt-2 flex items-center justify-between">
            {errors.metaTitle ? (
              <p className="text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors.metaTitle}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Optimal length: 50-60 characters</p>
            )}
            <span
              className={`text-xs ${
                formData.metaTitle.length > 60 ? 'text-error' : 'text-muted-foreground'
              }`}
            >
              {formData.metaTitle.length}/60
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Meta Description <span className="text-error">*</span>
          </label>
          <textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
            maxLength={160}
            rows={3}
            className={`w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth resize-none ${
              errors.metaDescription ? 'border-error' : 'border-input'
            }`}
            placeholder="Enter meta description for SEO"
          />
          <div className="mt-2 flex items-center justify-between">
            {errors.metaDescription ? (
              <p className="text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors.metaDescription}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Optimal length: 150-160 characters</p>
            )}
            <span
              className={`text-xs ${
                formData.metaDescription.length > 160 ? 'text-error' : 'text-muted-foreground'
              }`}
            >
              {formData.metaDescription.length}/160
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Service Image <span className="text-error">*</span>
          </label>
          <div className="space-y-4">
            {imagePreview && (
              <div className="relative w-full h-64 rounded-md overflow-hidden bg-muted">
                <AppImage
                  src={imagePreview}
                  alt="Service preview showing uploaded image"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setFormData((prev) => ({ ...prev, imageUrl: '' }));
                  }}
                  className="absolute top-2 right-2 p-2 bg-error text-error-foreground rounded-md hover:shadow-warm-md transition-smooth press-scale"
                  title="Remove image"
                >
                  <Icon name="TrashIcon" size={18} />
                </button>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-md p-8 text-center transition-smooth ${
                errors.imageUrl ? 'border-error' : 'border-border hover:border-accent'
              }`}
            >
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Icon name="PhotoIcon" size={32} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-foreground font-medium">
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </label>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-foreground font-medium">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {errors.imageUrl && (
              <p className="text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors.imageUrl}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Content <span className="text-error">*</span>
          </label>
          <RichTextEditor
            value={formData.contentHtml}
            onChange={(value) => handleChange('contentHtml', value)}
            error={errors.contentHtml}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status <span className="text-error">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-4 h-4 text-accent focus:ring-accent"
              />
              <span className="text-foreground">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-4 h-4 text-accent focus:ring-accent"
              />
              <span className="text-foreground">Published</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-muted text-foreground rounded-md font-medium transition-smooth hover:bg-muted/80 press-scale"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
          >
            {service ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
