'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [readingProgress, setReadingProgress] = useState(0);
  const articleScrollRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const updateReadingProgress = () => {
      const scrollContainer = articleScrollRef.current;
      if (!scrollContainer) {
        setReadingProgress(0);
        return;
      }

      const scrollTop = scrollContainer.scrollTop;
      const scrollableHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const progress = scrollableHeight > 0 ? Math.min((scrollTop / scrollableHeight) * 100, 100) : 0;
      setReadingProgress(progress);
    };

    const scrollContainer = articleScrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', updateReadingProgress, { passive: true });
    updateReadingProgress();

    return () => {
      scrollContainer.removeEventListener('scroll', updateReadingProgress);
    };
  }, [isHydrated, initialBlog.contentHtml]);

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-20">
      <div className="pointer-events-none absolute -top-16 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6">
        <button
          onClick={() => router.push('/blogs')}
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-muted-foreground shadow-neutral backdrop-blur-sm transition-smooth hover:-translate-x-0.5 hover:text-foreground"
        >
          <Icon
            name="ArrowLeftIcon"
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="font-medium">Back to Blog</span>
        </button>

        <article className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div className="overflow-hidden rounded-3xl border border-border bg-card/90 shadow-neutral-lg backdrop-blur-sm">
            <div className="h-1 bg-border/70">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-200"
                style={{ width: `${readingProgress}%` }}
              />
            </div>

            <div
              ref={articleScrollRef}
              className="scrollbar-quirky h-[calc(100vh-12rem)] overflow-y-auto p-6 sm:h-[calc(100vh-13rem)] sm:p-8 lg:h-[calc(100vh-14rem)] lg:p-12"
            >
              <BlogHeader
                title={initialBlog.title}
                excerpt={initialBlog.excerpt}
                author={initialBlog.author}
                publishDate={formatDate(initialBlog.publishedDate)}
                readTime={initialBlog.readTime}
                category={initialBlog.category}
                tags={initialBlog.tags}
              />

              <div className="relative mb-12 h-72 overflow-hidden rounded-2xl shadow-neutral-lg sm:h-96">
                <AppImage
                  src={initialBlog.featuredImage}
                  alt={initialBlog.featuredImageAlt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>

              <div className="mx-auto max-w-prose">
                <BlogContent contentHtml={initialBlog.contentHtml} />
              </div>

              <div className="mt-12 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 p-6 sm:p-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Enjoyed this story?
                </p>
                <h3 className="mb-3 font-heading text-2xl font-semibold text-foreground">
                  Keep the momentum going
                </h3>
                <p className="mb-5 text-card-foreground">
                  Explore more practical guides and fresh perspectives from our team.
                </p>
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-smooth hover:shadow-warm-md hover:-translate-y-0.5"
                >
                  Read More Articles
                  <Icon name="ArrowRightIcon" size={16} />
                </Link>
              </div>

              <div className="mt-12 xl:hidden">
                <SocialShare title={initialBlog.title} url={currentUrl} />
              </div>
            </div>
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-32 space-y-6">
              <div className="rounded-2xl border border-border bg-card/95 p-6 shadow-neutral">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  At a glance
                </p>
                <div className="space-y-4 text-sm">
                  <p className="flex items-center gap-3 text-foreground">
                    <Icon name="CalendarIcon" size={18} className="text-primary" />
                    {formatDate(initialBlog.publishedDate)}
                  </p>
                  <p className="flex items-center gap-3 text-foreground">
                    <Icon name="ClockIcon" size={18} className="text-primary" />
                    {initialBlog.readTime} min read
                  </p>
                  <p className="flex items-center gap-3 text-foreground">
                    <Icon name="ChartBarSquareIcon" size={18} className="text-primary" />
                    {Math.round(readingProgress)}% read
                  </p>
                  <p className="flex items-center gap-3 text-foreground">
                    <Icon name="TagIcon" size={18} className="text-primary" />
                    {initialBlog.category}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/95 p-6 shadow-neutral">
                <SocialShare title={initialBlog.title} url={currentUrl} />
              </div>
            </div>
          </aside>
        </article>

        <article className="mx-auto max-w-6xl">
          {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
        </article>
      </div>
    </div>
  );
};

export default BlogDetailContent;
