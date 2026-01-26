'use client';

import { useState } from 'react';
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

interface IndustryCardProps {
  industry: Industry;
  onEdit: (industry: Industry) => void;
  onDelete: (id: string) => void;
  onPreview: (industry: Industry) => void;
}

const IndustryCard = ({ industry, onEdit, onDelete, onPreview }: IndustryCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(industry.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="h-40 overflow-hidden bg-muted">
        <AppImage
          src={industry.imageUrl}
          alt={industry.imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{industry.title}</h3>
            <p className="text-sm text-muted-foreground truncate">/{industry.slug}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
              industry.isPublished ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                industry.isPublished ? 'bg-success' : 'bg-muted-foreground'
              }`}
            />
            {industry.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="text-xs text-muted-foreground mb-4">
          Updated:{' '}
          {new Date(industry.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>

        {!showDeleteConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreview(industry)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium transition-smooth hover:bg-muted/80 press-scale"
            >
              <Icon name="EyeIcon" size={16} />
              Preview
            </button>
            <button
              onClick={() => onEdit(industry)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-smooth hover:shadow-warm press-scale"
            >
              <Icon name="PencilIcon" size={16} />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2.5 bg-error/10 text-error rounded-md transition-smooth hover:bg-error/20 press-scale"
            >
              <Icon name="TrashIcon" size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-error">
              <Icon name="ExclamationTriangleIcon" size={18} />
              <span>Delete this industry?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium transition-smooth hover:bg-muted/80 press-scale"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-error text-error-foreground rounded-md text-sm font-medium transition-smooth hover:shadow-md press-scale"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryCard;
