'use client';

import { useState, useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

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
  const [isHydrated, setIsHydrated] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredClient, setHoveredClient] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || !scrollContainerRef.current || clients.length === 0) return;

    const container = scrollContainerRef.current;
    let animationFrameId: number | null = null;
    let scrollAmount = 0;
    const scrollSpeed = 0.8; // pixels per frame
    let isPaused = false;

    const scroll = () => {
      if (!isPaused && container) {
        scrollAmount += scrollSpeed;
        container.scrollLeft = scrollAmount;

        // Calculate the width of one set of clients (we have 3 sets)
        const singleSetWidth = container.scrollWidth / 3;

        // When we've scrolled through one full set, jump back to the start
        // This creates a seamless loop since the second set looks identical to the first
        if (scrollAmount >= singleSetWidth) {
          scrollAmount = scrollAmount - singleSetWidth;
          // Use scrollTo for smoother transition
          container.scrollTo({
            left: scrollAmount,
            behavior: 'auto' // Instant jump for seamless effect
          });
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    // Pause on hover for better UX
    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Start animation after a short delay to ensure layout is ready
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scroll);
    }, 200);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHydrated, clients.length]);

  if (!isHydrated) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                Trusted Partners
              </span>
            </div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {clients.slice(0, 6).map((client) => (
              <div
                key={client.id}
                className="bg-card rounded-2xl p-8 flex items-center justify-center shadow-warm-lg border border-border min-w-[200px] h-40 flex-shrink-0"
              >
                <div className="w-full h-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Duplicate clients multiple times for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients, ...clients];

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

        {/* Infinite Scrolling Logos */}
        <div className="relative pt-12 pb-4">
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-hidden scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'auto'
            }}
          >
            {duplicatedClients.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="group relative bg-card rounded-2xl p-6 flex flex-col items-center justify-center shadow-warm-lg border border-border min-w-[220px] h-52 flex-shrink-0 hover:shadow-warm-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 overflow-visible"
                onMouseEnter={() => setHoveredClient(client.id)}
                onMouseLeave={() => setHoveredClient(null)}
              >
                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Company Name on Hover - Positioned at top */}
                <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-30 ${hoveredClient === client.id
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}>
                  <span className="text-xs font-semibold text-foreground bg-card/95 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-warm-lg whitespace-nowrap">
                    {client.name}
                  </span>
                </div>

                {/* Logo */}
                <div className="relative z-10 w-full h-20 flex items-center justify-center mt-2">
                  <AppImage
                    src={client.logo}
                    alt={client.alt}
                    className={`w-full h-full object-contain transition-all duration-300 ${hoveredClient === client.id
                      ? 'grayscale-0 scale-110'
                      : 'grayscale opacity-70 group-hover:opacity-100'
                      }`}
                  />
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
              </div>
            ))}
          </div>

          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none z-20" />
        </div>


      </div>
    </section>
  );
}