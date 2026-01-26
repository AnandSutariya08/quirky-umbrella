import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import HeroSection from '../blog-listing/components/HeroSection';
import BlogListingServer from './components/BlogListingServer';
import NewsletterSection from '../blog-listing/components/NewsletterSection';
import { blogsService } from '@/lib/blogs';

export const metadata: Metadata = {
  title: 'Blog - Quirky Umbrella',
  description:
    'Explore thought leadership, industry insights, and actionable strategies from Quirky Umbrella. Discover the latest trends in brand strategy, digital marketing, content creation, and web development.',
};

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

export default async function BlogsPage() {
  // Server-side fetch for better SEO
  const blogs = await blogsService.getPublished();

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-1">
        <HeroSection />
        <BlogListingServer initialBlogs={blogs} />
        <NewsletterSection />
      </main>

      <ClientFooter />
    </div>
  );
}
