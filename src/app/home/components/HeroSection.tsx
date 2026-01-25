// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import AppImage from '@/components/ui/AppImage';
// import Icon from '@/components/ui/AppIcon';

// interface HeroSectionProps {
//   title: string;
//   subtitle: string;
//   ctaText: string;
//   ctaLink: string;
//   heroImage: string;
//   heroImageAlt: string;
// }

// export default function HeroSection({
//   title,
//   subtitle,
//   ctaText,
//   ctaLink,
//   heroImage,
//   heroImageAlt,
// }: HeroSectionProps) {
//   const [isHydrated, setIsHydrated] = useState(false);
//   const rafRef = useRef<number | null>(null);
//   const sectionRef = useRef<HTMLElement | null>(null);
//   const imageParallaxRef = useRef<HTMLDivElement | null>(null);
//   const blobARef = useRef<HTMLDivElement | null>(null);
//   const blobBRef = useRef<HTMLDivElement | null>(null);
//   const blobCRef = useRef<HTMLDivElement | null>(null);
//   const reducedMotionRef = useRef(false);

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   useEffect(() => {
//     if (!isHydrated) return;

//     // Respect reduced motion
//     try {
//       reducedMotionRef.current =
//         typeof window !== 'undefined' &&
//         window.matchMedia &&
//         window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//     } catch {
//       reducedMotionRef.current = false;
//     }

//     if (reducedMotionRef.current) return;

//     const el = sectionRef.current;
//     if (!el) return;

//     const handleMove = (e: MouseEvent) => {
//       // Desktop/larger screens only (keep mobile smooth)
//       if (window.innerWidth < 768) return;

//       const rect = el.getBoundingClientRect();
//       const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
//       const ny = (e.clientY - rect.top) / rect.height - 0.5;

//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//       rafRef.current = requestAnimationFrame(() => {
//         const img = imageParallaxRef.current;
//         const a = blobARef.current;
//         const b = blobBRef.current;
//         const c = blobCRef.current;

//         if (img) {
//           img.style.transform = `translate3d(${nx * 10}px, ${ny * 10}px, 0)`;
//         }
//         if (a) {
//           a.style.transform = `translate3d(${nx * -18}px, ${ny * -14}px, 0)`;
//         }
//         if (b) {
//           b.style.transform = `translate3d(${nx * 22}px, ${ny * 16}px, 0)`;
//         }
//         if (c) {
//           c.style.transform = `translate3d(${nx * 14}px, ${ny * -10}px, 0)`;
//         }
//       });
//     };

//     const handleLeave = () => {
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//       rafRef.current = requestAnimationFrame(() => {
//         if (imageParallaxRef.current) imageParallaxRef.current.style.transform = 'translate3d(0,0,0)';
//         if (blobARef.current) blobARef.current.style.transform = 'translate3d(0,0,0)';
//         if (blobBRef.current) blobBRef.current.style.transform = 'translate3d(0,0,0)';
//         if (blobCRef.current) blobCRef.current.style.transform = 'translate3d(0,0,0)';
//       });
//     };

//     el.addEventListener('mousemove', handleMove);
//     el.addEventListener('mouseleave', handleLeave);

//     return () => {
//       el.removeEventListener('mousemove', handleMove);
//       el.removeEventListener('mouseleave', handleLeave);
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     };
//   }, [isHydrated]);

//   if (!isHydrated) {
//     return (
//       <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
//         <div className="container mx-auto px-6 py-16 lg:py-24">
//           <div className="max-w-4xl mx-auto">
//             <div className="space-y-6 text-center lg:text-left">
//               <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
//                 {title}
//               </h1>
//               <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
//                 {subtitle}
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//                 <span className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium text-lg">
//                   {ctaText}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   const handleCTAClick = () => {
//     if (ctaLink.startsWith('#')) {
//       const element = document.getElementById(ctaLink.substring(1));
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth' });
//       }
//     } else {
//       window.location.href = ctaLink;
//     }
//   };

//   const resolvedHeroImage =
//     heroImage && heroImage.trim().length > 0
//       ? heroImage
//       : '/assets/images/hero-growth.jpg';
//   const resolvedHeroAlt =
//     heroImageAlt && heroImageAlt.trim().length > 0
//       ? heroImageAlt
//       : 'Abstract growth illustration';

//   return (
//     <section
//       ref={(node) => {
//         sectionRef.current = node;
//       }}
//       className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"
//     >
//       {/* Animated background */}
//       <div className="pointer-events-none absolute inset-0">
//         <div
//           ref={(n) => {
//             blobARef.current = n;
//           }}
//           className="absolute -top-10 -left-20 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl animate-float-soft will-change-transform"
//         />
//         <div
//           ref={(n) => {
//             blobBRef.current = n;
//           }}
//           className="absolute top-32 -right-24 h-[520px] w-[520px] rounded-full bg-secondary/18 blur-3xl animate-float will-change-transform"
//           style={{ animationDelay: '900ms' }}
//         />
//         <div
//           ref={(n) => {
//             blobCRef.current = n;
//           }}
//           className="absolute -bottom-24 left-1/3 h-[520px] w-[520px] rounded-full bg-accent/15 blur-3xl animate-drift-x will-change-transform"
//         />

//         {/* subtle grid overlay */}
//         <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(26,26,26,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.6)_1px,transparent_1px)] [background-size:72px_72px]" />

//         {/* floating particles */}
//         <div className="absolute left-10 top-24 h-3 w-3 rounded-full bg-primary/25 blur-[0.5px] animate-float" />
//         <div className="absolute left-24 top-44 h-2 w-2 rounded-full bg-secondary/25 blur-[0.5px] animate-float-soft" style={{ animationDelay: '600ms' }} />
//         <div className="absolute right-16 top-28 h-3 w-3 rounded-full bg-accent/30 blur-[0.5px] animate-float" style={{ animationDelay: '1.2s' }} />
//         <div className="absolute right-24 bottom-28 h-2 w-2 rounded-full bg-primary/20 blur-[0.5px] animate-float-soft" style={{ animationDelay: '900ms' }} />
//       </div>

//       <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
//         <div className="mx-auto max-w-6xl">
//           <div className="grid items-center gap-12 lg:grid-cols-2">
//             {/* Left: copy */}
//             <div className="text-center lg:text-left">
//               <div className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-card/70 px-4 py-2 backdrop-blur-sm shadow-warm mb-6 animate-slide-down">
//                 <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
//                 <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
//                   AI-led marketing systems • human judgment
//                 </span>
//               </div>

//               <h1 className="font-heading text-4xl lg:text-6xl font-bold leading-[1.06] animate-slide-down">
//                 <span className="text-foreground">{title}</span>
//                 <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-pan">
//                   Real systems. Real outcomes.
//                 </span>
//               </h1>

//               <p className="mt-5 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 animate-slide-up">
//                 {subtitle}
//               </p>

//               <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up">
//                 <button
//                   onClick={handleCTAClick}
//                   className="btn-aurora btn-cta inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium text-lg shadow-warm-md hover:shadow-warm-xl press-scale focus-ring"
//                 >
//                   {ctaText}
//                   <Icon name="ArrowRightIcon" size={18} />
//                 </button>
//                 <a
//                   href="/services/workflow-automations"
//                   className="btn-aurora inline-flex items-center justify-center gap-2 px-8 py-4 bg-card/70 backdrop-blur-sm border border-border rounded-md font-medium text-lg shadow-neutral hover:shadow-neutral-lg press-scale focus-ring"
//                 >
//                   Explore Services
//                   <Icon name="SparklesIcon" size={18} />
//                 </a>
//               </div>

//               <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
//                 {[
//                   { k: '250+', v: 'Brands helped' },
//                   { k: '16+ yrs', v: 'Experience' },
//                   { k: 'Systems', v: 'Not hype' },
//                 ].map((item) => (
//                   <div
//                     key={item.k}
//                     className="stat-pop card-pop rounded-2xl border border-border bg-card/60 backdrop-blur-sm px-4 py-4 shadow-neutral transition-smooth hover:-translate-y-1 hover:shadow-warm-lg hover:border-primary/20"
//                   >
//                     <div className="text-lg sm:text-xl font-bold text-foreground whitespace-nowrap">
//                       {item.k}
//                     </div>
//                     <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 leading-snug break-words">
//                       {item.v}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right: hero visual */}
//             <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
//               <div
//                 ref={(n) => {
//                   imageParallaxRef.current = n;
//                 }}
//                 className="group relative rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-warm-xl overflow-hidden will-change-transform"
//               >
//                 <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%] opacity-40 animate-shimmer" />
//                 <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11]">
//                   <AppImage
//                     src={resolvedHeroImage}
//                     alt={resolvedHeroAlt}
//                     fill
//                     sizes="(min-width: 1024px) 560px, (min-width: 640px) 600px, 100vw"
//                     className="img-pop object-cover group-hover:scale-[1.02]"
//                   />
//                 </div>

//                 {/* floating chips */}
//                 {/* Desktop/tablet: floating overlay (no overlap issues on mobile) */}
//                 <div className="pointer-events-none absolute inset-0 hidden sm:block">
//                   <div className="absolute left-4 top-4 md:left-6 md:top-6 rounded-2xl border border-border bg-card/80 backdrop-blur-md px-3 md:px-4 py-2.5 md:py-3 shadow-neutral-md animate-float max-w-[200px] md:max-w-[240px]">
//                     <div className="flex items-center gap-2 min-w-0">
//                       <Icon name="BoltIcon" size={18} className="text-primary" />
//                       <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap truncate min-w-0">
//                         Automation-first
//                       </span>
//                     </div>
//                     <div className="text-[11px] md:text-xs text-muted-foreground mt-1 leading-snug break-words">
//                       Less chaos, more momentum
//                     </div>
//                   </div>

//                   <div
//                     className="absolute right-4 top-6 md:right-6 md:top-10 rounded-2xl border border-border bg-card/80 backdrop-blur-md px-3 md:px-4 py-2.5 md:py-3 shadow-neutral-md animate-float-soft max-w-[200px] md:max-w-[240px]"
//                     style={{ animationDelay: '700ms' }}
//                   >
//                     <div className="flex items-center gap-2 min-w-0">
//                       <Icon name="ChartBarIcon" size={18} className="text-secondary" />
//                       <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap truncate min-w-0">
//                         Measurable growth
//                       </span>
//                     </div>
//                     <div className="text-[11px] md:text-xs text-muted-foreground mt-1 leading-snug break-words">
//                       Signals → decisions
//                     </div>
//                   </div>

//                   <div
//                     className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-2xl border border-border bg-card/80 backdrop-blur-md px-4 py-3 shadow-neutral-md animate-float max-w-[260px]"
//                     style={{ animationDelay: '1.1s' }}
//                   >
//                     <div className="flex items-center gap-2 min-w-0">
//                       <Icon name="UserGroupIcon" size={18} className="text-foreground" />
//                       <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap truncate min-w-0">
//                         Human-led
//                       </span>
//                     </div>
//                     <div className="text-[11px] md:text-xs text-muted-foreground mt-1 leading-snug break-words">
//                       AI supports, humans steer
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Mobile: chips become a clean responsive grid (no overlay) */}
//               <div className="mt-4 grid grid-cols-1 gap-3 sm:hidden">
//                 {[
//                   {
//                     icon: 'BoltIcon',
//                     title: 'Automation-first',
//                     desc: 'Less chaos, more momentum',
//                     tone: 'text-primary',
//                   },
//                   {
//                     icon: 'ChartBarIcon',
//                     title: 'Measurable growth',
//                     desc: 'Signals → decisions',
//                     tone: 'text-secondary',
//                   },
//                   {
//                     icon: 'UserGroupIcon',
//                     title: 'Human-led',
//                     desc: 'AI supports, humans steer',
//                     tone: 'text-foreground',
//                   },
//                 ].map((chip) => (
//                   <div
//                     key={chip.title}
//                     className="card-pop rounded-2xl border border-border bg-card/70 backdrop-blur-sm px-4 py-3 shadow-neutral hover:shadow-neutral-md"
//                   >
//                     <div className="flex items-center gap-2 min-w-0">
//                       <Icon name={chip.icon as any} size={18} className={chip.tone} />
//                       <span className="text-sm font-semibold text-foreground truncate min-w-0">
//                         {chip.title}
//                       </span>
//                     </div>
//                     <div className="text-xs text-muted-foreground mt-1 leading-snug break-words">
//                       {chip.desc}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* little scroll hint */}
//               <div className="mt-6 flex justify-center lg:justify-end">
//                 <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
//                   <span>Scroll</span>
//                   <Icon name="ChevronDownIcon" size={18} className="animate-bounce" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


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
  title = "Transform your marketing with AI",
  subtitle = "We build intelligent systems that amplify your team's capabilities, not replace them. Data-driven decisions, automated workflows, measurable results.",
  ctaText = "Start Your Transformation",
  ctaLink = "#contact",
  heroImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
  heroImageAlt = "Marketing analytics dashboard"
}: HeroSectionProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
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

      setMousePos({ x: nx, y: ny });

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
      setIsHovering(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (imageParallaxRef.current) imageParallaxRef.current.style.transform = 'translate3d(0,0,0) rotate(0deg)';
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
      className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-blue-50 to-green-50"
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
              animation: i % 2 === 0 ? `float 6s ease-in-out infinite` : `float-soft 10s ease-in-out infinite`,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div 
                className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-500/20 bg-white/70 px-4 py-2 backdrop-blur-sm shadow-lg mb-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-white/90 cursor-default"
                style={{
                  animation: 'slide-down 250ms ease-out',
                }}
              >
                <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-900/80">
                  AI-led marketing systems • human judgment
                </span>
              </div>

              <h1 
                className="text-4xl lg:text-6xl font-bold leading-[1.06]"
                style={{
                  animation: 'slide-down 250ms ease-out',
                }}
              >
                <span className="text-gray-900 inline-block transition-all duration-300 hover:scale-105 hover:text-pink-600">
                  {title}
                </span>
                <span 
                  className="block mt-2 bg-gradient-to-r from-pink-500 via-blue-500 to-green-500 bg-[length:200%_100%] bg-clip-text text-transparent"
                  style={{
                    animation: 'gradient-pan 10s ease-in-out infinite',
                  }}
                >
                  Real systems. Real outcomes.
                </span>
              </h1>

              <p 
                className="mt-5 text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0"
                style={{
                  animation: 'slide-up 250ms ease-out',
                }}
              >
                {subtitle}
              </p>

              <div 
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                style={{
                  animation: 'slide-up 250ms ease-out',
                }}
              >
                <button
                  onClick={handleCTAClick}
                  className="btn-aurora btn-cta inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium text-lg shadow-warm-md hover:shadow-warm-xl press-scale focus-ring"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 bg-[length:200%_100%] animate-[shimmer_2.25s_linear_infinite]" />
                  <span className="relative z-10">{ctaText}</span>
                  <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                {/* <a
                  href="/services/workflow-automations"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-md font-medium text-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-white hover:border-pink-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Explore Services
                  <Sparkles className="w-5 h-5 transition-all duration-300 group-hover:rotate-12 group-hover:text-pink-500" />
                </a> */}
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
                {[
                  { k: '250+', v: 'Brands helped', color: 'pink' },
                  { k: '16+ yrs', v: 'Experience', color: 'blue' },
                  { k: 'Systems', v: 'Not hype', color: 'green' },
                ].map((item, idx) => (
                  <div
                    key={item.k}
                    className={`group relative rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-sm px-4 py-4 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default overflow-hidden ${
                      item.color === 'pink' ? 'hover:border-pink-300' :
                      item.color === 'blue' ? 'hover:border-blue-300' :
                      'hover:border-green-300'
                    }`}
                    style={{
                      animation: `slide-up 250ms ease-out ${idx * 100}ms backwards`,
                    }}
                  >
                    <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 ${
                      item.color === 'pink' ? 'bg-gradient-to-br from-pink-400 to-pink-600' :
                      item.color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                      'bg-gradient-to-br from-green-400 to-green-600'
                    }`} />
                    <div className="relative z-10">
                      <div className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap transition-all duration-300 group-hover:scale-110">
                        {item.k}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600 mt-1 leading-snug break-words">
                        {item.v}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: hero visual */}
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div
                ref={imageParallaxRef}
                className="group relative rounded-3xl border border-gray-200 bg-white/50 backdrop-blur-sm shadow-2xl overflow-hidden transition-all duration-700 ease-out hover:shadow-pink-500/20 hover:border-pink-300"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Shimmer effect */}
                <div 
                  className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200%_100%] opacity-60 z-10 pointer-events-none"
                  style={{
                    animation: 'shimmer 2.25s linear infinite',
                  }}
                />
                
                {/* Image container */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11] overflow-hidden">
                  <img
                    src={heroImage}
                    alt={heroImageAlt}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                  />
                  
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-blue-500/0 to-green-500/0 transition-all duration-700 group-hover:from-pink-500/10 group-hover:via-blue-500/10 group-hover:to-green-500/10" />
                </div>

                {/* Floating chips - desktop/tablet only */}
                <div className="pointer-events-none absolute inset-0 hidden sm:block">
                  {[
                    {
                      icon: Zap,
                      title: 'Automation-first',
                      desc: 'Less chaos, more momentum',
                      color: 'pink',
                      position: 'left-4 top-4 md:left-6 md:top-6',
                      delay: '0s',
                    },
                    {
                      icon: TrendingUp,
                      title: 'Measurable growth',
                      desc: 'Signals → decisions',
                      color: 'blue',
                      position: 'right-4 top-6 md:right-6 md:top-10',
                      delay: '700ms',
                    },
                    {
                      icon: Users,
                      title: 'Human-led',
                      desc: 'AI supports, humans steer',
                      color: 'green',
                      position: 'bottom-6 left-1/2 -translate-x-1/2',
                      delay: '1.1s',
                    },
                  ].map((chip) => {
                    const Icon = chip.icon;
                    return (
                      <div
                        key={chip.title}
                        className={`absolute ${chip.position} rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-md px-3 md:px-4 py-2.5 md:py-3 shadow-lg max-w-[200px] md:max-w-[240px] transition-all duration-500 hover:scale-110 hover:shadow-xl ${
                          chip.color === 'pink' ? 'hover:border-pink-300 hover:bg-pink-50' :
                          chip.color === 'blue' ? 'hover:border-blue-300 hover:bg-blue-50' :
                          'hover:border-green-300 hover:bg-green-50'
                        }`}
                        style={{
                          animation: chip.delay === '0s' ? 'float 6s ease-in-out infinite' : 'float-soft 10s ease-in-out infinite',
                          animationDelay: chip.delay,
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon 
                            className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 hover:rotate-12 ${
                              chip.color === 'pink' ? 'text-pink-500' :
                              chip.color === 'blue' ? 'text-blue-500' :
                              'text-green-500'
                            }`}
                          />
                          <span className="text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap truncate min-w-0">
                            {chip.title}
                          </span>
                        </div>
                        <div className="text-[11px] md:text-xs text-gray-600 mt-1 leading-snug break-words">
                          {chip.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile: chips as grid */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:hidden">
                {[
                  {
                    icon: Zap,
                    title: 'Automation-first',
                    desc: 'Less chaos, more momentum',
                    color: 'pink',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Measurable growth',
                    desc: 'Signals → decisions',
                    color: 'blue',
                  },
                  {
                    icon: Users,
                    title: 'Human-led',
                    desc: 'AI supports, humans steer',
                    color: 'green',
                  },
                ].map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <div
                      key={chip.title}
                      className={`rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm px-4 py-3 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                        chip.color === 'pink' ? 'hover:border-pink-300' :
                        chip.color === 'blue' ? 'hover:border-blue-300' :
                        'hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon 
                          className={`w-5 h-5 ${
                            chip.color === 'pink' ? 'text-pink-500' :
                            chip.color === 'blue' ? 'text-blue-500' :
                            'text-green-500'
                          }`}
                        />
                        <span className="text-sm font-semibold text-gray-900 truncate min-w-0">
                          {chip.title}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1 leading-snug break-words">
                        {chip.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scroll hint */}
              <div className="mt-6 flex justify-center lg:justify-end">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600 transition-all duration-300 hover:text-pink-500 cursor-default">
                  <span>Scroll</span>
                  <ChevronDown 
                    className="w-5 h-5"
                    style={{
                      animation: 'bounce 1s infinite',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-soft {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(6px); }
        }
        @keyframes drift-x {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(18px); }
        }
        @keyframes gradient-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes slide-down {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-up {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
}