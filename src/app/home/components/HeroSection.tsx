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

              <h1 className="font-heading text-4xl lg:text-6xl font-black leading-[1.05] tracking-tight animate-slide-down">
                <span className="text-slate-900 drop-shadow-sm">Smarter Marketing.</span>
                <span className="block mt-2 bg-gradient-to-r from-pink-500 via-blue-500 to-green-500 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-pan pb-2">
                  Real Systems, Real Growth.
                </span>
              </h1>

              <p className="text-base lg:text-lg text-slate-600/90 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-slide-up">
                {subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up">
                <button
                  onClick={handleCTAClick}
                  className="group relative px-8 py-4 bg-pink-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10">{ctaText}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <div className="relative mx-auto w-full animate-fade-in">
              <div
                ref={imageParallaxRef}
                className="group relative rounded-[3rem] border-8 border-white bg-white shadow-2xl overflow-hidden will-change-transform aspect-video lg:aspect-[16/10]"
              >
                <img
                  src={heroImage}
                  alt={heroImageAlt}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[3s]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-blue-500/10 mix-blend-overlay" />
                
                {/* Floating chips - Refined for premium feel */}
                <div className="pointer-events-none absolute inset-0 hidden sm:block">
                  <div className="absolute left-8 top-8 rounded-2xl bg-white/90 backdrop-blur-xl p-4 shadow-xl border border-white/50 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-pink-500" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">Automation-first</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Less chaos, more momentum</div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute right-8 bottom-24 rounded-2xl bg-white/90 backdrop-blur-xl p-4 shadow-xl border border-white/50 animate-float-soft"
                    style={{ animationDelay: '700ms' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">Measurable growth</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Signals → decisions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile scroll hint - centered */}
              <div className="mt-12 flex flex-col items-center gap-2 text-slate-400 lg:hidden">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Explore</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
