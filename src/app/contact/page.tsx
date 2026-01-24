import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import ContactSection from './components/ContactSection';
import Footer from '../blog-listing/components/Footer';

export const metadata: Metadata = {
  title: 'Contact Us - Quirky Umbrella',
  description:
    'Get in touch with Quirky Umbrella. We\'d love to hear from you and discuss how we can help grow your business.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <PublicHeader />
      
      <main className="pt-20 w-full max-w-full overflow-x-hidden">
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
