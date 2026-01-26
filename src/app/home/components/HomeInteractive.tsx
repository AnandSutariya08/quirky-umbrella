'use client';

import HeroSection from './HeroSection';
import GrowthAuditForm from './GrowthAuditForm';
import HowWeWorkSection from './HowWeWorkSection';
import GlobalReachSection from './GlobalReachSection';
import TrustedBySection from './TrustedBySection';
import { ArrowRight } from 'lucide-react';

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
      <div className="mt-20 mb-20 px-6 text-center animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="inline-flex flex-col md:flex-row items-center gap-8 p-8 md:p-10 bg-card/50 backdrop-blur-md rounded-[2rem] shadow-warm-xl border border-border/50 max-w-4xl mx-auto w-full transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
              Ready to transform your marketing?
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Let's discuss how we can help you grow with intelligent systems.
            </p>
          </div>
          <button className="group relative px-8 py-4 bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 w-full md:w-auto overflow-hidden">
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300 relative z-10" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </>
  );
}
