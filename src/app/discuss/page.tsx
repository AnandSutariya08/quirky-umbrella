import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import Discuss from '@/app/about-us/components/Discuss';

export const metadata: Metadata = {
  title: 'Discuss - Quirky Umbrella',
  description: 'Discuss growth strategies and innovative solutions with Quirky Umbrella. Learn about our approach to sustainable business growth and measurable results.',
};

export default function DiscussPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      
      <main className="flex-1">
        <div className="container mx-auto px-6 pt-24 pb-16 lg:pt-28 lg:pb-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Discuss
            </h1>
            
            <Discuss />
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}
