'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import RichTextEditor from './RichTextEditor';

interface Industry {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  contentHtml: string;
  imageUrl: string;
  imageAlt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IndustryFormModalProps {
  industry: Industry | null;
  onClose: () => void;
  onSave: (industry: Omit<Industry, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const IndustryFormModal = ({ industry, onClose, onSave }: IndustryFormModalProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    contentHtml: '',
    imageUrl: '',
    imageAlt: '',
    isPublished: false,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsHydrated(true);
    if (industry) {
      setFormData({
        title: industry.title,
        slug: industry.slug,
        metaTitle: industry.metaTitle,
        metaDescription: industry.metaDescription,
        contentHtml: industry.contentHtml,
        imageUrl: industry.imageUrl,
        imageAlt: industry.imageAlt,
        isPublished: industry.isPublished,
      });
    }
  }, [industry]);

  useEffect(() => {
    if (isHydrated) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isHydrated]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      const mockUrl = `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80`;
      setFormData((prev) => ({
        ...prev,
        imageUrl: mockUrl,
        imageAlt: `${formData.title} industry workspace with modern office equipment and professional team collaboration`,
      }));
      setIsUploading(false);
      setUploadProgress(0);
    }, 1200);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    if (!formData.metaTitle.trim()) {
      newErrors.metaTitle = 'Meta title is required';
    }
    if (!formData.metaDescription.trim()) {
      newErrors.metaDescription = 'Meta description is required';
    }
    if (formData.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description must be under 160 characters';
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

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-neutral-xl my-8 animate-slide-down">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            {industry ? 'Edit Industry' : 'Add New Industry'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
            type="button"
          >
            <Icon name="XMarkIcon" size={20} className="text-foreground" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.title ? 'border-error' : 'border-border'
                }`}
                placeholder="e.g., Technology Solutions"
              />
              {errors.title && <p className="mt-1 text-sm text-error">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slug <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className={`w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.slug ? 'border-error' : 'border-border'
                }`}
                placeholder="technology-solutions"
              />
              {errors.slug && <p className="mt-1 text-sm text-error">{errors.slug}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Meta Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
              className={`w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.metaTitle ? 'border-error' : 'border-border'
              }`}
              placeholder="Technology Solutions - Quirky Umbrella"
              maxLength={60}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.metaTitle && <p className="text-sm text-error">{errors.metaTitle}</p>}
              <p className="text-xs text-muted-foreground ml-auto">
                {formData.metaTitle.length}/60 characters
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Meta Description <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
              }
              className={`w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none ${
                errors.metaDescription ? 'border-error' : 'border-border'
              }`}
              placeholder="Brief description for search engines..."
              rows={3}
              maxLength={160}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.metaDescription && (
                <p className="text-sm text-error">{errors.metaDescription}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Featured Image <span className="text-error">*</span>
            </label>
            <div className="space-y-3">
              {formData.imageUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <AppImage
                    src={formData.imageUrl}
                    alt={formData.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '', imageAlt: '' }))}
                    className="absolute top-2 right-2 p-2 bg-error text-error-foreground rounded-md hover:shadow-md transition-smooth press-scale"
                  >
                    <Icon name="TrashIcon" size={16} />
                  </button>
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-md cursor-pointer transition-smooth ${
                    errors.imageUrl
                      ? 'border-error hover:border-error/80'
                      : 'border-border hover:border-accent'
                  } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon name="PhotoIcon" size={20} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </label>
                {isUploading && (
                  <div className="mt-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {uploadProgress}% uploaded
                    </p>
                  </div>
                )}
              </div>
              {errors.imageUrl && <p className="text-sm text-error">{errors.imageUrl}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content HTML <span className="text-error">*</span>
            </label>
            <RichTextEditor
              value={formData.contentHtml}
              onChange={(value) => setFormData((prev) => ({ ...prev, contentHtml: value }))}
              placeholder="Write your industry content here..."
            />
            {errors.contentHtml && <p className="mt-1 text-sm text-error">{errors.contentHtml}</p>}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
              className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-accent cursor-pointer"
            />
            <label
              htmlFor="isPublished"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Publish immediately
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-muted text-foreground rounded-md font-medium transition-smooth hover:bg-muted/80 press-scale"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm press-scale"
            >
              {industry ? 'Update Industry' : 'Create Industry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndustryFormModal;
