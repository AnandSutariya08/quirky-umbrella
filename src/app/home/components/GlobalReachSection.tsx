'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';
interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

interface CountryItem {
  id: string;
  name: string;
  icon: string;
}

interface GlobalReachSectionProps {
  title: string;
  subtitle: string;
  stats: StatItem[];
}

const countries: CountryItem[] = [
  { id: '1', name: 'UK', icon: 'uk' },
  { id: '2', name: 'USA', icon: 'usa' },
  { id: '3', name: 'Europe', icon: 'europe' },
  { id: '4', name: 'Africa', icon: 'africa' },
  { id: '5', name: 'Singapore', icon: 'singapore' },
];

// Country landmark SVG icons (from /public/assets/images)
const CountryIcon = ({ type, className = '' }: { type: string; className?: string }) => {
  const srcByType: Record<string, string> = {
    uk: 'London-white.svg',
    usa: 'New-York-white.svg',
    europe: 'Athens-White.svg',
    africa: 'South-Africa-white.svg',
    singapore: 'Singapore-white.svg',
  };

  const src = srcByType[type];
  if (!src) return null;

  // Use mask so we can tint the SVG to pink reliably.
  return (
    <div
      aria-hidden="true"
      className={`${className} bg-pink-500`}
      style={{
        WebkitMaskImage: `url(/assets/images/${src})`,
        maskImage: `url(/assets/images/${src})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
};

export default function GlobalReachSection({ title, subtitle, stats }: GlobalReachSectionProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isHydrated]);

  // Stats animation
  useEffect(() => {
    if (!isVisible || !isHydrated) return;

    const initialValues: Record<string, number> = {};
    stats.forEach((stat) => {
      initialValues[stat.id] = 0;
    });
    setAnimatedValues(initialValues);

    stats.forEach((stat) => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.value / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedValues((prev) => ({
            ...prev,
            [stat.id]: Math.min(Math.round(increment * currentStep), stat.value),
          }));
        } else {
          clearInterval(timer);
        }
      }, duration / steps);
    });
  }, [isVisible, stats, isHydrated]);

  // Auto-play carousel
  useEffect(() => {
    if (!isHydrated || isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % countries.length);
    }, 3000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHydrated, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + countries.length) % countries.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % countries.length);
  };

  const getVisibleCountries = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + countries.length) % countries.length;
      visible.push({ ...countries[index], offset: i });
    }
    return visible;
  };

  if (!isHydrated) {
    return (
      <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="global-reach"
      className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden"
    >
      {/* Elevated background (soft mesh + grid + vignette) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-100 [background-image:radial-gradient(60%_50%_at_18%_22%,rgba(236,72,153,0.14)_0%,transparent_62%),radial-gradient(55%_45%_at_82%_28%,rgba(168,85,247,0.12)_0%,transparent_60%),radial-gradient(60%_50%_at_50%_92%,hsl(var(--primary)_/_0.10)_0%,transparent_62%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background" />
      </div>

      {/* Floating blobs for depth */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-500/40 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-10 right-10 w-72 h-72 bg-primary/35 rounded-full blur-3xl animate-float-soft"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-down">
          <h2 className="font-heading text-3xl lg:text-5xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Country Scrolling Ticker */}
        <div className="mb-20 overflow-hidden relative group">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          
          <div className="flex space-x-20 animate-scroll-countries whitespace-nowrap py-10 px-6">
            {[...countries, ...countries, ...countries, ...countries].map((country, idx) => (
              <div
                key={`${country.id}-${idx}`}
                className="flex-shrink-0 flex flex-col items-center gap-6 group/item transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative">
                  <CountryIcon
                    type={country.icon}
                    className="w-32 h-40 opacity-40 group-hover/item:opacity-100 transition-all duration-500 group-hover/item:scale-110 drop-shadow-xl"
                  />
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-xl font-bold text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">
                  {country.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="group relative overflow-hidden bg-card rounded-2xl p-8 border border-border shadow-warm-lg transition-all duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-[0_22px_60px_-24px_hsl(var(--primary)_/_0.55)] cursor-default animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover glow / tint (matches primary color) */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -inset-16 bg-primary/12 blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/14 via-transparent to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon
                    name={stat.icon as any}
                    size={28}
                    className="text-primary transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3 transition-all duration-500 group-hover:scale-105">
                  {isVisible ? animatedValues[stat.id] || 0 : 0}
                  {stat.suffix}
                </div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll-countries {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        .animate-scroll-countries {
          animation: scroll-countries 40s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-scroll-countries:hover {
          animation-play-state: paused;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        @keyframes float-soft {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(6px);
          }
        }
        @keyframes slide-down {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slide-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
