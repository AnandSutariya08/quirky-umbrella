'use client';

import HeroSection from './HeroSection';
import GrowthAuditForm from './GrowthAuditForm';
import HowWeWorkSection from './HowWeWorkSection';
import GlobalReachSection from './GlobalReachSection';
import TrustedBySection from './TrustedBySection';

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
      <GrowthAuditForm />
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
    </>
  );
}