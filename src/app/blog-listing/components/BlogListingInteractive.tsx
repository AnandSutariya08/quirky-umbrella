'use client';

import { useState, useEffect, useCallback } from 'react';
import BlogCard from './BlogCard';
import FilterBar from './FilterBar';
import Icon from '@/components/ui/AppIcon';
import { blogsService } from '@/lib/blogs';
import type { Blog } from '@/types/blog';

const BlogListingInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 9;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      fetchBlogs();
    }
  }, [isHydrated]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedBlogs = await blogsService.getPublished();
      setBlogs(fetchedBlogs);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatReadTime = (minutes: number): string => {
    return `${minutes} min read`;
  };

  // Use blogs from Firestore, fallback to empty array if loading
  const blogPosts = blogs.length > 0 ? blogs : [];

  const categories = Array.from(new Set(blogPosts.map((post) => post.category)));

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);
  const featuredPost = currentPosts.find((post) => post.isFeatured) || currentPosts[0];
  const gridPosts = featuredPost
    ? currentPosts.filter((post) => post.slug !== featuredPost.slug)
    : currentPosts;

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!isHydrated || isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="h-20 bg-muted rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center py-20">
          <Icon name="ExclamationTriangleIcon" size={64} className="text-error mx-auto mb-4" />
          <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
            Error Loading Blogs
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />

      {currentPosts.length === 0 ? (
        <div className="text-center py-20">
          <Icon name="DocumentTextIcon" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
            No articles found
          </h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{currentPosts.length}</span>{' '}
              of <span className="font-semibold text-foreground">{filteredPosts.length}</span>{' '}
              stories
            </p>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages || 1}
            </p>
          </div>

          {featuredPost && (
            <div className="mb-8">
              <BlogCard
                key={featuredPost.id}
                id={featuredPost.id || ''}
                slug={featuredPost.slug}
                title={featuredPost.title}
                excerpt={featuredPost.excerpt}
                thumbnailUrl={featuredPost.thumbnailUrl}
                thumbnailAlt={featuredPost.thumbnailAlt}
                publishedDate={formatDate(featuredPost.publishedDate)}
                author={featuredPost.author}
                category={featuredPost.category}
                readTime={formatReadTime(featuredPost.readTime)}
                isFeatured={true}
              />
            </div>
          )}

          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {gridPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id || ''}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  thumbnailUrl={post.thumbnailUrl}
                  thumbnailAlt={post.thumbnailAlt}
                  publishedDate={formatDate(post.publishedDate)}
                  author={post.author}
                  category={post.category}
                  readTime={formatReadTime(post.readTime)}
                  isFeatured={false}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-card text-foreground border border-border transition-smooth hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed press-scale"
                aria-label="Previous page"
              >
                <Icon name="ChevronLeftIcon" size={20} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md font-medium transition-smooth press-scale ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground border border-border hover:bg-muted'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-card text-foreground border border-border transition-smooth hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed press-scale"
                aria-label="Next page"
              >
                <Icon name="ChevronRightIcon" size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogListingInteractive;
