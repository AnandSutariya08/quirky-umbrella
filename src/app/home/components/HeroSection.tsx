'use client';

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  heroImage: string;
  heroImageAlt: string;
}

export default function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  heroImage,
  heroImageAlt,
}: HeroSectionProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                {title}
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                {subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <span className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium text-lg">
                  {ctaText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleCTAClick = () => {
    if (ctaLink.startsWith('#')) {
      const element = document.getElementById(ctaLink.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = ctaLink;
    }
  };

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 animate-slide-down text-center lg:text-left">
            <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleCTAClick}
                className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium text-lg transition-smooth hover:shadow-warm-md hover:-translate-y-1 press-scale"
              >
                {ctaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}