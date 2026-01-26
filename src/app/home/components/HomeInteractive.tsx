'use client';

import HeroSection from './HeroSection';
import GrowthAuditForm from './GrowthAuditForm';
import HowWeWorkSection from './HowWeWorkSection';
import GlobalReachSection from './GlobalReachSection';
import TrustedBySection from './TrustedBySection';
import { 
  ArrowRight
} from 'lucide-react';

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

interface ClientLogo {
  id: string;
  name: string;
  logo: string;
  alt: string;
}

interface HomeInteractiveProps {
  heroData: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    heroImage: string;
    heroImageAlt: string;
  };
  statsData: {
    title: string;
    subtitle: string;
    stats: StatItem[];
  };
  clientsData: {
    title: string;
    subtitle: string;
    clients: ClientLogo[];
  };
}

export default function HomeInteractive({
  heroData,
  statsData,
  clientsData,
}: HomeInteractiveProps) {
  return (
    <>
      <HeroSection
        title={heroData.title}
        subtitle={heroData.subtitle}
        ctaText={heroData.ctaText}
        ctaLink={heroData.ctaLink}
        heroImage={heroData.heroImage}
        heroImageAlt={heroData.heroImageAlt}
      />
      <HowWeWorkSection />
      <GlobalReachSection
        title={statsData.title}
        subtitle={statsData.subtitle}
        stats={statsData.stats}
      />
      <TrustedBySection
        title={clientsData.title}
        subtitle={clientsData.subtitle}
        clients={clientsData.clients}
      />
      <GrowthAuditForm />
       <div className="mt-16 text-center animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-card rounded-2xl shadow-warm-lg border border-border">
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  Ready to transform your marketing?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Let's discuss how we can help you grow with intelligent systems
                </p>
              </div>
              <button className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium shadow-warm-md hover:shadow-warm-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
    </>
  );
}
