'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Zap, TrendingUp, Users, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  heroImage?: string;
  heroImageAlt?: string;
}

export default function HeroSection({
  title = 'Transform your marketing with AI',
  subtitle = "We build intelligent systems that amplify your team's capabilities, not replace them. Data-driven decisions, automated workflows, measurable results.",
  ctaText = 'Start Your Transformation',
  ctaLink = '#contact',
  heroImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
  heroImageAlt = 'Marketing analytics dashboard',
}: HeroSectionProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const rafRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageParallaxRef = useRef<HTMLDivElement | null>(null);
  const blobARef = useRef<HTMLDivElement | null>(null);
  const blobBRef = useRef<HTMLDivElement | null>(null);
  const blobCRef = useRef<HTMLDivElement | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      reducedMotionRef.current =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      reducedMotionRef.current = false;
    }

    if (reducedMotionRef.current) return;

    const el = sectionRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;

      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const img = imageParallaxRef.current;
        const a = blobARef.current;
        const b = blobBRef.current;
        const c = blobCRef.current;

        if (img) {
          img.style.transform = `translate3d(${nx * 12}px, ${ny * 12}px, 0) rotate(${nx * 2}deg)`;
        }
        if (a) {
          a.style.transform = `translate3d(${nx * -20}px, ${ny * -16}px, 0) scale(${1 + Math.abs(nx) * 0.1})`;
        }
        if (b) {
          b.style.transform = `translate3d(${nx * 25}px, ${ny * 18}px, 0) scale(${1 + Math.abs(ny) * 0.1})`;
        }
        if (c) {
          c.style.transform = `translate3d(${nx * 16}px, ${ny * -12}px, 0) rotate(${nx * -20}deg)`;
        }
      });
    };

    const handleLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (imageParallaxRef.current)
          imageParallaxRef.current.style.transform = 'translate3d(0,0,0) rotate(0deg)';
        if (blobARef.current) blobARef.current.style.transform = 'translate3d(0,0,0) scale(1)';
        if (blobBRef.current) blobBRef.current.style.transform = 'translate3d(0,0,0) scale(1)';
        if (blobCRef.current) blobCRef.current.style.transform = 'translate3d(0,0,0) rotate(0deg)';
      });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHydrated]);

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
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-blue-50 to-green-50 min-h-screen flex items-center justify-center"
    >
      {/* Animated background with enhanced blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={blobARef}
          className="absolute -top-10 -left-20 h-[420px] w-[420px] rounded-full bg-pink-400/20 blur-3xl transition-all duration-700 ease-out"
          style={{
            animation: 'float-soft 10s ease-in-out infinite',
          }}
        />
        <div
          ref={blobBRef}
          className="absolute top-32 -right-24 h-[520px] w-[520px] rounded-full bg-blue-400/18 blur-3xl transition-all duration-700 ease-out"
          style={{
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '900ms',
          }}
        />
        <div
          ref={blobCRef}
          className="absolute -bottom-24 left-1/3 h-[520px] w-[520px] rounded-full bg-green-400/15 blur-3xl transition-all duration-700 ease-out"
          style={{
            animation: 'drift-x 14s ease-in-out infinite',
          }}
        />

        {/* Enhanced floating particles with staggered delays */}
        {[
          { left: '10%', top: '15%', size: 12, delay: '0s', color: 'bg-pink-500' },
          { left: '15%', top: '35%', size: 8, delay: '0.6s', color: 'bg-blue-500' },
          { left: '85%', top: '20%', size: 12, delay: '1.2s', color: 'bg-green-500' },
          { left: '80%', top: '70%', size: 8, delay: '0.9s', color: 'bg-pink-500' },
          { left: '5%', top: '60%', size: 10, delay: '1.5s', color: 'bg-blue-500' },
          { left: '90%', top: '45%', size: 10, delay: '0.3s', color: 'bg-green-500' },
        ].map((particle, i) => (
          <div
            key={i}
            className={`absolute ${particle.color}/25 rounded-full blur-[0.5px]`}
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation:
                i % 2 === 0
                  ? `float ${5 + i}s ease-in-out infinite`
                  : `float-soft ${6 + i}s ease-in-out infinite`,
              animationDelay: particle.delay,
            }}
          />
        ))}

        {/* subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(26,26,26,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.6)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="w-full relative z-10 px-6 lg:px-20 py-16 lg:py-24">
        <div className="w-full">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center justify-center gap-3 rounded-full border border-pink-200 bg-white/70 px-6 py-2.5 backdrop-blur-md shadow-sm animate-slide-down">
                <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-pink-600">
                  AI-led marketing systems • human judgment
                </span>
              </div>

              <h1 className="font-heading text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight animate-slide-down">
                <span className="text-slate-900 drop-shadow-2xl">Smarter Marketing.</span>
                <span className="block mt-4 bg-gradient-to-r from-pink-500 via-blue-600 to-emerald-500 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-pan pb-4 filter drop-shadow-sm">
                  Real Systems, Real Growth.
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-slate-600/95 font-semibold leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-slide-up">
                {subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start animate-slide-up">
                <button
                  onClick={handleCTAClick}
                  className="group relative px-10 py-5 bg-pink-500 text-white rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(236,72,153,0.3)] hover:shadow-[0_20px_60px_rgba(236,72,153,0.4)] transition-all duration-500 hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10">{ctaText}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-full top-0 h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                </button>
                <a
                  href="/services/workflow-automations"
                  className="px-8 py-4 bg-white/70 backdrop-blur-md border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                >
                  Explore Services
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto lg:mx-0 pt-6">
                {[
                  { k: '250+', v: 'Brands helped', icon: Users, color: 'text-pink-500' },
                  { k: '16+ yrs', v: 'Experience', icon: Zap, color: 'text-blue-500' },
                  { k: 'Systems', v: 'Not hype', icon: TrendingUp, color: 'text-green-500' },
                ].map((item) => (
                  <div
                    key={item.k}
                    className="group relative rounded-3xl border border-slate-100 bg-white/60 backdrop-blur-sm p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-pink-100"
                  >
                    <item.icon className={`w-5 h-5 ${item.color} mb-3 opacity-60 group-hover:opacity-100 transition-opacity`} />
                    <div className="text-xl font-black text-slate-900 leading-none">
                      {item.k}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">
                      {item.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: hero visual */}
            <div className="relative mx-auto w-full animate-fade-in lg:max-w-2xl group/hero">
              <div
                ref={imageParallaxRef}
                className="group relative rounded-[2.5rem] border-[8px] border-white/90 bg-white/50 backdrop-blur-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden will-change-transform aspect-[4/3] lg:aspect-[4/3] scale-100 group-hover/hero:scale-[1.02] transition-all duration-700 ease-out"
              >
                <div className="absolute inset-0 z-10 pointer-events-none border border-white/40 rounded-[2.3rem]" />
                <img
                  src={heroImage}
                  alt={heroImageAlt}
                  className="w-full h-full object-cover transform scale-[1.02] group-hover:scale-110 transition-transform duration-[5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-blue-500/20 mix-blend-overlay z-20" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                
                {/* Floating chips - Refined for premium feel */}
                <div className="pointer-events-none absolute inset-0 hidden sm:block z-30">
                  <div className="absolute left-8 top-8 rounded-2xl bg-white/95 backdrop-blur-xl p-4 shadow-2xl border border-white/50 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-200">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">Automation-first</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency redefined</div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute right-8 bottom-16 rounded-2xl bg-white/95 backdrop-blur-xl p-4 shadow-2xl border border-white/50 animate-float-soft"
                    style={{ animationDelay: '700ms' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-200">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">Real Growth</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Measurable impact</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements for more "pop" */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-500/20 blur-[100px] rounded-full -z-10 animate-pulse" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500/20 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* Animated rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-pink-200/20 rounded-full -z-20 animate-[spin_20s_linear_infinite] opacity-50" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-blue-200/10 rounded-full -z-20 animate-[spin_30s_linear_infinite_reverse] opacity-30" />

              {/* Mobile scroll hint - centered */}
              <div className="mt-8 flex flex-col items-center gap-2 text-slate-400 lg:hidden">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50">Discover More</span>
                <ChevronDown className="w-4 h-4 animate-bounce opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
