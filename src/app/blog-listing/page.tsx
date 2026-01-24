import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import HeroSection from './components/HeroSection';
import BlogListingInteractive from './components/BlogListingInteractive';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Blog - Quirky Umbrella',
  description:
    'Explore thought leadership, industry insights, and actionable strategies from Quirky Umbrella. Discover the latest trends in brand strategy, digital marketing, content creation, and web development.',
};

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      <main className="pt-20">
        <HeroSection />
        <BlogListingInteractive />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}