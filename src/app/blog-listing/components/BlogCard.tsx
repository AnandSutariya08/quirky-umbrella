'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface BlogCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  publishedDate: string;
  author: {
    name: string;
    avatar: string;
    avatarAlt: string;
  };
  category: string;
  readTime: string;
  isFeatured?: boolean;
}

const BlogCard = ({
  slug,
  title,
  excerpt,
  thumbnailUrl,
  thumbnailAlt,
  publishedDate,
  author,
  category,
  readTime,
  isFeatured = false,
}: BlogCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/blogs/${slug}`}
      className={`group block overflow-hidden rounded-2xl border border-border bg-card shadow-neutral transition-smooth hover:-translate-y-1 hover:shadow-neutral-lg card-pop ${
        isFeatured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden ${isFeatured ? 'h-80 md:h-96' : 'h-56'}`}>
        <AppImage
          src={thumbnailUrl}
          alt={thumbnailAlt}
          className={`w-full h-full object-cover transition-smooth ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="inline-block rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-warm">
            {category}
          </span>
        </div>
        {isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-neutral">
              <Icon name="StarIcon" size={16} variant="solid" />
              Featured
            </span>
          </div>
        )}
      </div>

      <div className={`p-6 ${isFeatured ? 'md:p-8' : ''}`}>
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Icon name="CalendarIcon" size={16} />
            {publishedDate}
          </span>
          <span className="flex items-center gap-2">
            <Icon name="ClockIcon" size={16} />
            {readTime}
          </span>
        </div>

        <h3
          className={`mb-3 font-heading font-semibold text-foreground line-clamp-2 transition-smooth group-hover:text-primary ${
            isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}
        >
          {title}
        </h3>

        <p
          className={`text-muted-foreground mb-6 ${
            isFeatured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'
          }`}
        >
          {excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <AppImage
                src={author.avatar}
                alt={author.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{author.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-primary font-semibold text-sm transition-smooth group-hover:gap-3">
            Read full story
            <Icon name="ArrowRightIcon" size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
