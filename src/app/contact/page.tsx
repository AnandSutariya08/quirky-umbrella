import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import ContactSection from './components/ContactSection';

export const metadata: Metadata = {
  title: 'Contact Us - Quirky Umbrella',
  description:
    "Get in touch with Quirky Umbrella. We'd love to hear from you and discuss how we can help grow your business.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <PublicHeader />

      <main className="w-full max-w-full overflow-x-hidden flex-1">
        <ContactSection />
      </main>

      <ClientFooter />
    </div>
  );
}
