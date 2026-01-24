'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useServices } from '@/contexts/ServicesContext';

interface DropdownItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

interface DropdownMenuProps {
  collection: 'services';
  onClose: () => void;
  isMobile?: boolean;
}

const DropdownMenu = ({ collection, onClose, isMobile = false }: DropdownMenuProps) => {
  const { services, isLoading, error } = useServices();

  const items = useMemo<DropdownItem[]>(() => {
    if (collection === 'services') {
      return services.map((service) => ({
        id: service.id || '',
        title: service.title,
        slug: service.slug,
        description: service.tagline,
      }));
    }
    return [];
  }, [services, collection]);

  if (isMobile) {
    return (
      <div className="space-y-2 animate-slide-down">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-muted rounded-md animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="px-6 py-4 text-error text-sm">{error}</div>
        ) : items.length === 0 ? (
          <div className="px-6 py-4 text-muted-foreground text-sm text-center">
            No services listed
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/services/${item.slug}`}
              onClick={onClose}
              className="block px-6 py-4 rounded-md hover:bg-muted transition-smooth"
            >
              <div className="font-medium text-foreground">{item.title}</div>
              {item.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-popover rounded-md shadow-neutral-lg border border-border overflow-hidden animate-slide-down z-[1100]">
      {isLoading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-muted rounded-md animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <Icon name="ExclamationTriangleIcon" size={32} className="text-error mx-auto mb-3" />
          <p className="text-error text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-smooth hover:shadow-warm press-scale"
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="p-6 text-center">
          <Icon name="InboxIcon" size={32} className="text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground text-sm font-medium">No services listed</p>
          <p className="text-muted-foreground text-xs mt-1">Services will appear here once they are added</p>
        </div>
      ) : (
        <div className="py-2">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={`/services/${item.slug}`}
              onClick={onClose}
              className="block px-6 py-4 hover:bg-muted transition-smooth"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="font-medium text-popover-foreground">
                {item.title}
              </div>
              {item.description && (
                <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;