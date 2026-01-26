import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import HeroSection from './components/HeroSection';
import BlogListingInteractive from './components/BlogListingInteractive';
import NewsletterSection from './components/NewsletterSection';

export const metadata: Metadata = {
  title: 'Blog - Quirky Umbrella',
  description:
    'Explore thought leadership, industry insights, and actionable strategies from Quirky Umbrella. Discover the latest trends in brand strategy, digital marketing, content creation, and web development.',
};

export default function BlogListingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-1">
        <HeroSection />
        <BlogListingInteractive />
        <NewsletterSection />
      </main>

      <ClientFooter />
    </div>
  );
}
