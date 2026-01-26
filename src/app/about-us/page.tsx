import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import Discuss from './components/Discuss';

export const metadata: Metadata = {
  title: 'About Us - Quirky Umbrella',
  description:
    'Learn about Quirky Umbrella - our mission, values, and the team dedicated to transforming brands with innovative solutions.',
};

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className=" flex-1">
        <div className="container mx-auto px-6 pt-24 pb-16 lg:pt-28 lg:pb-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About Us</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Welcome to Quirky Umbrella, where innovation meets excellence. We are a
                forward-thinking company dedicated to transforming brands and delivering exceptional
                results for our clients.
              </p>

              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  Our mission is to blend creativity with strategy, delivering exceptional branding
                  solutions that make businesses stand out in today's competitive landscape. We
                  believe in the power of innovation and the importance of understanding our
                  clients' unique needs.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-4">Our Values</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Innovation and creativity in every project</li>
                  <li>Client-centric approach with personalized solutions</li>
                  <li>Transparency and integrity in all our dealings</li>
                  <li>Excellence and quality in delivery</li>
                  <li>Continuous learning and adaptation</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-4">Why Choose Us</h2>
                <p className="text-muted-foreground mb-4">
                  With over 15 years of experience, 500+ completed projects, and a presence in 50+
                  countries, we have the expertise and global reach to help your business succeed.
                  Our team of dedicated professionals is committed to delivering results that exceed
                  expectations.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}
