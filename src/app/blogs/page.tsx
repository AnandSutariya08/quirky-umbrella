import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import HeroSection from '../blog-listing/components/HeroSection';
import BlogListingServer from './components/BlogListingServer';
import NewsletterSection from '../blog-listing/components/NewsletterSection';
import Footer from '../blog-listing/components/Footer';
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
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      <main className="pt-20">
        <HeroSection />
        <BlogListingServer initialBlogs={blogs} />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
