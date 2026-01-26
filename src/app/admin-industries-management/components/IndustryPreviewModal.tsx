'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

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

interface IndustryPreviewModalProps {
  industry: Industry;
  onClose: () => void;
}

const IndustryPreviewModal = ({ industry, onClose }: IndustryPreviewModalProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-neutral-xl my-8 animate-slide-down">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Icon name="EyeIcon" size={20} className="text-primary" />
            <h2 className="text-xl font-heading font-semibold text-foreground">Preview</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
          >
            <Icon name="XMarkIcon" size={20} className="text-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-heading font-bold text-foreground">{industry.title}</h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  industry.isPublished
                    ? 'bg-success/10 text-success'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    industry.isPublished ? 'bg-success' : 'bg-muted-foreground'
                  }`}
                />
                {industry.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icon name="LinkIcon" size={16} />
                <span className="font-mono">/{industry.slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CalendarIcon" size={16} />
                <span>
                  Updated:{' '}
                  {new Date(industry.updatedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full h-80 rounded-lg overflow-hidden bg-muted">
            <AppImage
              src={industry.imageUrl}
              alt={industry.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Icon name="MagnifyingGlassIcon" size={16} />
                SEO Preview
              </h3>
              <div className="space-y-2">
                <div className="text-lg text-secondary font-medium">{industry.metaTitle}</div>
                <div className="text-sm text-success font-mono">
                  https://quirkyumbrella.com/industries/{industry.slug}
                </div>
                <div className="text-sm text-muted-foreground">{industry.metaDescription}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Content</h3>
              <div
                className="prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: industry.contentHtml }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm press-scale"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryPreviewModal;
