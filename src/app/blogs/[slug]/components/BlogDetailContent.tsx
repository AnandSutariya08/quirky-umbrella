'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogHeader from '@/app/blog-detail/components/BlogHeader';
import BlogContent from '@/app/blog-detail/components/BlogContent';
import SocialShare from '@/app/blog-detail/components/SocialShare';
// import RelatedPosts from '@/blog-detail/components/RelatedPosts';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { blogsService } from '@/lib/blogs';
import type { Blog } from '@/types/blog';
import RelatedPosts from '@/app/blog-detail/components/RelatedPosts';

interface BlogDetailContentProps {
  blog: Blog;
}

const BlogDetailContent = ({ blog: initialBlog }: BlogDetailContentProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (isHydrated && initialBlog) {
      // Increment views (non-blocking)
      if (initialBlog.id) {
        blogsService.incrementViews(initialBlog.id).catch(console.error);
      }

      // Fetch related blogs (same category, excluding current)
      blogsService
        .getPublished()
        .then((allBlogs) => {
          const related = allBlogs
            .filter((b) => b.id !== initialBlog.id && b.category === initialBlog.category)
            .slice(0, 3);
          setRelatedBlogs(related);
        })
        .catch(console.error);
    }
  }, [isHydrated, initialBlog]);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Convert related blogs to the format expected by RelatedPosts component
  const relatedPosts = relatedBlogs.map((b) => ({
    id: b.id || '',
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    category: b.category,
    image: b.thumbnailUrl,
    alt: b.thumbnailAlt,
    readTime: b.readTime,
    publishDate: formatDate(b.publishedDate),
  }));

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20">
      <div className="container mx-auto px-6">
        <article className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-8 group"
          >
            <Icon
              name="ArrowLeftIcon"
              size={20}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="font-medium">Back to Blog</span>
          </button>

          <BlogHeader
            title={initialBlog.title}
            author={initialBlog.author.name}
            publishDate={formatDate(initialBlog.publishedDate)}
            readTime={initialBlog.readTime}
            category={initialBlog.category}
          />

          <div className="relative h-96 rounded-lg overflow-hidden mb-12 shadow-neutral-lg animate-slide-down">
            <AppImage
              src={initialBlog.featuredImage}
              alt={initialBlog.featuredImageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <BlogContent contentHtml={initialBlog.contentHtml} />

          <SocialShare title={initialBlog.title} url={currentUrl} />

          {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
        </article>
      </div>
    </div>
  );
};

export default BlogDetailContent;
