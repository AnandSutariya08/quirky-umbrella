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

interface IndustryTableRowProps {
  industry: Industry;
  onEdit: (industry: Industry) => void;
  onDelete: (id: string) => void;
  onPreview: (industry: Industry) => void;
}

const IndustryTableRow = ({ industry, onEdit, onDelete, onPreview }: IndustryTableRowProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(industry.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/50 transition-smooth">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
              <AppImage
                src={industry.imageUrl}
                alt={industry.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-foreground">{industry.title}</div>
              <div className="text-sm text-muted-foreground">/{industry.slug}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
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
        </td>
        <td className="px-6 py-4 text-sm text-muted-foreground">
          {new Date(industry.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreview(industry)}
              className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
              title="Preview"
            >
              <Icon name="EyeIcon" size={18} className="text-foreground" />
            </button>
            <button
              onClick={() => onEdit(industry)}
              className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
              title="Edit"
            >
              <Icon name="PencilIcon" size={18} className="text-foreground" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-md hover:bg-error/10 transition-smooth press-scale"
              title="Delete"
            >
              <Icon name="TrashIcon" size={18} className="text-error" />
            </button>
          </div>
        </td>
      </tr>

      {showDeleteConfirm && (
        <tr>
          <td colSpan={4} className="px-6 py-4 bg-error/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="ExclamationTriangleIcon" size={20} className="text-error" />
                <span className="text-sm text-foreground">
                  Are you sure you want to delete "{industry.title}"?
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-smooth press-scale"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium bg-error text-error-foreground rounded-md hover:shadow-md transition-smooth press-scale"
                >
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default IndustryTableRow;
