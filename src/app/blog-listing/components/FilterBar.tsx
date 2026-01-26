'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}

const FilterBar = ({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: FilterBarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const timeoutId = setTimeout(() => {
      onSearchChange(localSearchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, isHydrated, onSearchChange]);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-neutral mb-8">
        <div className="h-10 bg-muted rounded-md animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-neutral mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 relative">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search articles..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
          />
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-muted text-foreground rounded-md font-medium transition-smooth hover:bg-muted/80 press-scale w-full justify-center"
          >
            <Icon name="FunnelIcon" size={20} />
            Filters
            <Icon
              name="ChevronDownIcon"
              size={16}
              className={`transition-smooth ${isMobileFilterOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block lg:flex-shrink-0`}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange('All')}
              className={`px-4 py-2 rounded-md font-medium transition-smooth press-scale ${
                selectedCategory === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-md font-medium transition-smooth press-scale ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
