'use client';

import { useState, useMemo } from 'react';
import BlogCard from '../../blog-listing/components/BlogCard';
import FilterBar from '../../blog-listing/components/FilterBar';
import Icon from '@/components/ui/AppIcon';
import type { Blog } from '@/types/blog';

interface BlogListingServerProps {
  initialBlogs: Blog[];
}

const BlogListingServer = ({ initialBlogs }: BlogListingServerProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

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

  // Use initial blogs from server
  const blogPosts = initialBlogs || [];

  const categories = useMemo(() => {
    return Array.from(new Set(blogPosts.map((post) => post.category)));
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentPosts.map((post) => (
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
                isFeatured={post.isFeatured}
              />
            ))}
          </div>

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

export default BlogListingServer;
