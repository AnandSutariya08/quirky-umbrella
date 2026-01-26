'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface BlogHeaderProps {
  title: string;
  author: string;
  publishDate: string;
  readTime: number;
  category: string;
}

const BlogHeader = ({ title, author, publishDate, readTime, category }: BlogHeaderProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="UserCircleIcon" size={20} />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="CalendarIcon" size={20} />
            <span>{publishDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="ClockIcon" size={20} />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 animate-slide-down">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium transition-smooth hover:bg-primary/20">
          {category}
        </span>
      </div>
      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon name="UserCircleIcon" size={20} />
          <span>{author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="CalendarIcon" size={20} />
          <span>{publishDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="ClockIcon" size={20} />
          <span>{readTime} min read</span>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
