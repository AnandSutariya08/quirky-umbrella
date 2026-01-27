'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import BlogHeader from './BlogHeader';
import BlogContent from './BlogContent';
import SocialShare from './SocialShare';
import RelatedPosts from './RelatedPosts';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { blogsService } from '@/lib/blogs';
import type { Blog } from '@/types/blog';

const BlogDetailInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      const slug = searchParams.get('slug');
      if (slug) {
        fetchBlog(slug);
      } else {
        setError('Blog post not found');
        setIsLoading(false);
      }
    }
  }, [isHydrated, searchParams]);

  const fetchBlog = async (slug: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedBlog = await blogsService.getBySlug(slug);

      if (!fetchedBlog) {
        setError('Blog post not found');
        setIsLoading(false);
        return;
      }

      if (fetchedBlog.status !== 'published') {
        setError('This blog post is not published');
        setIsLoading(false);
        return;
      }

      setBlog(fetchedBlog);

      // Increment views (non-blocking)
      if (fetchedBlog.id) {
        blogsService.incrementViews(fetchedBlog.id).catch(console.error);
      }

      // Fetch related blogs (same category, excluding current)
      const allBlogs = await blogsService.getPublished();
      const related = allBlogs
        .filter((b) => b.id !== fetchedBlog.id && b.category === fetchedBlog.category)
        .slice(0, 3);
      setRelatedBlogs(related);
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog post. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-transparent pt-32 pb-20">
        <div className="container mx-auto px-6">
          <article className="max-w-4xl mx-auto">
            <div className="h-12 bg-muted rounded-lg animate-pulse mb-6" />
            <div className="h-6 bg-muted rounded-lg animate-pulse mb-4 w-2/3" />
            <div className="relative h-96 rounded-lg overflow-hidden mb-12 bg-muted animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-transparent pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center py-20">
            <Icon name="ExclamationTriangleIcon" size={64} className="text-error mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
              {error || 'Blog post not found'}
            </h2>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/blogs')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-transparent pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-20">
      <div className="container mx-auto px-6">
        <article className="max-w-4xl mx-auto">
          <BlogHeader
            title={blog.title}
            author={blog.author.name}
            publishDate={formatDate(blog.publishedDate)}
            readTime={blog.readTime}
            category={blog.category}
          />

          <div className="relative h-96 rounded-lg overflow-hidden mb-12 shadow-neutral-lg animate-slide-down">
            <AppImage
              src={blog.featuredImage}
              alt={blog.featuredImageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <BlogContent contentHtml={blog.contentHtml} />

          <SocialShare title={blog.title} url={currentUrl} />

          {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
        </article>
      </div>
    </div>
  );
};

export default BlogDetailInteractive;
