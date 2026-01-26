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

export default function TrustedBySection({ title, subtitle, clients }: TrustedBySectionProps) {
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
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
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

        {/* Infinite scrolling logo carousel */}
        <div className="mt-10 overflow-hidden relative">
          {/* Left/Right masks for smoother fading */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 hidden md:block" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 hidden md:block" />

          <div className="flex space-x-12 animate-scroll-left whitespace-nowrap py-10">
            {[...clients, ...clients].map((client, idx) => (
              <div
                key={`${client.id}-${idx}`}
                className="flex-shrink-0 flex items-center justify-center min-w-[120px] md:min-w-[180px] grayscale hover:grayscale-0 transition-all duration-300"
                title={client.name}
              >
                <AppImage
                  src={client.logo}
                  alt={client.alt}
                  width={200}
                  height={80}
                  className="h-8 md:h-12 w-auto object-contain !bg-transparent opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        <style jsx global>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll-left {
            animation: scroll-left 40s linear infinite;
            display: flex;
            width: max-content;
          }
          .animate-scroll-left:hover {
            animation-play-state: paused;
          }
          @media (max-width: 768px) {
            .animate-scroll-left {
              animation-duration: 25s;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
