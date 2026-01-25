'use client';

import { useEffect, useMemo, useState } from 'react';
import AppImage from '@/components/ui/AppImage';

interface ClientLogo {
  id: string;
  name: string;
  logo: string;
  alt: string;
}

interface TrustedBySectionProps {
  title: string;
  subtitle: string;
  clients: ClientLogo[];
}

export default function TrustedBySection({
  title,
  subtitle,
  clients,
}: TrustedBySectionProps) {
  const PAGE_SIZE = 9; // 3x3 grid
  const ROTATE_MS = 3000;
  const FADE_MS = 220;

  const [pageStart, setPageStart] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!clients?.length) return;

    const intervalId = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setPageStart((prev) => (prev + PAGE_SIZE) % clients.length);
        setIsFading(false);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => clearInterval(intervalId);
  }, [clients.length]);

  const visibleClients = useMemo(() => {
    if (!clients?.length) return [];

    const next: ClientLogo[] = [];
    for (let i = 0; i < Math.min(PAGE_SIZE, clients.length); i++) {
      next.push(clients[(pageStart + i) % clients.length]);
    }
    return next;
  }, [clients, pageStart]);

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-slide-down">
          <div className="inline-block mb-6">
            <span className="px-6 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide border border-primary/20">
              Trusted Partners
            </span>
          </div>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-warm-lg text-center hover:shadow-warm-xl transition-smooth hover:-translate-y-1">
            <div className="text-4xl font-bold text-primary mb-2">250+</div>
            <div className="text-muted-foreground font-medium">Happy Clients</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-warm-lg text-center hover:shadow-warm-xl transition-smooth hover:-translate-y-1">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground font-medium">Industries Served</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-warm-lg text-center hover:shadow-warm-xl transition-smooth hover:-translate-y-1">
            <div className="text-4xl font-bold text-primary mb-2">16+</div>
            <div className="text-muted-foreground font-medium">Years Experience</div>
          </div>
        </div>

        {/* 3x3 rotating logo grid */}
        <div className="mt-10 flex justify-center">
          <div
            className={`w-full max-w-5xl transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}
          >
            <div className="grid grid-cols-3 gap-x-10 gap-y-10 items-center">
              {visibleClients.map((client) => (
                <div key={client.id} className="flex items-center justify-center" title={client.name}>
                  <AppImage
                    src={client.logo}
                    alt={client.alt}
                    width={260}
                    height={120}
                    className="h-12 w-auto max-w-[220px] object-contain !bg-transparent transition-transform duration-300 hover:scale-[1.04]"
                  />
                </div>
              ))}

              {/* If clients < 9, fill empty cells to keep grid stable */}
              {clients.length < PAGE_SIZE &&
                Array.from({ length: PAGE_SIZE - clients.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-12" />
                ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}