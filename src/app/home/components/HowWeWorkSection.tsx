// 'use client';

// import Icon from '@/components/ui/AppIcon';

// interface WorkCard {
//   id: string;
//   title: string;
//   description: string;
//   focusAreas: string[];
//   icon: string;
// }

// const workCards: WorkCard[] = [
//   {
//     id: '1',
//     title: 'AI Automations',
//     description: 'Operational inefficiencies create risk, cost, and lost momentum. We design intelligent automation systems that standardize execution, improve visibility, and enable scalable growth across marketing and eCommerce teams.',
//     focusAreas: [
//       'Structured automation mapping across core workflows',
//       'Unified workflow intelligence across marketing, sales, and ops',
//       'Context-aware automations that respond to real-time signals',
//       'AI-assisted research, reporting and daily insights',
//       'Secure, no-code automation for daily task',
//     ],
//     icon: 'Cog6ToothIcon',
//   },
//   {
//     id: '2',
//     title: 'Intelligent Brand Building',
//     description: 'We build brands through stories that earn trust and performance systems that drive results. Every message is shaped by data, refined by AI, and measured by real business impact.',
//     focusAreas: [
//       'Insight-led brand narratives built to convert',
//       'Performance-first creative testing and scale',
//       'Consistent storytelling across growth channels',
//       'AI-driven optimization for recall and ROI',
//     ],
//     icon: 'LightBulbIcon',
//   },
//   {
//     id: '3',
//     title: 'E-Commerce That Scales',
//     description: 'We design intelligent E-Commerce and customer lifecycle frameworks that turn traffic into revenue and customers into long-term value.',
//     focusAreas: [
//       'Conversion-first storefront and funnel optimization',
//       'AI-led personalization across the shopping journey',
//       'Lifecycle strategies for repeat purchase and retention',
//       'Performance visibility from first click for maximum revenue',
//     ],
//     icon: 'ShoppingCartIcon',
//   },
//   {
//     id: '4',
//     title: 'Human-Led & System-Powered',
//     description: 'AI moves fast—but growth still needs human judgment. With 16+ years of experience, our team of marketers and strategists actively monitors & optimizes supported by intelligent systems working round the clock.',
//     focusAreas: [
//       'Dedicated human oversight',
//       'Proactive, real-time intervention',
//       'Continuous optimization, 24/7',
//       'Clear ownership and accountability',
//     ],
//     icon: 'UserGroupIcon',
//   },
// ];

// export default function HowWeWorkSection() {
//   return (
//     <section className="py-16 lg:py-24 bg-background">
//       <div className="container mx-auto px-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
//               How AI Fits In (Without the Hype)
//             </h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Discover how we combine intelligent automation with human expertise to drive real growth
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8">
//             {workCards.map((card, index) => (
//               <div
//                 key={card.id}
//                 className="bg-card rounded-xl shadow-warm-lg border border-border p-8 hover:shadow-warm-xl transition-smooth group hover:-translate-y-1 motion-safe:animate-slide-up"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className="flex items-start gap-4 mb-6">
//                   <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-smooth">
//                     <Icon name={card.icon as any} size={32} className="text-primary" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-2xl font-bold text-foreground mb-3">
//                       {card.title}
//                     </h3>
//                     <p className="text-muted-foreground leading-relaxed mb-6">
//                       {card.description}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="border-t border-border pt-6">
//                   <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
//                     Focus Areas:
//                   </h4>
//                   <ul className="space-y-3">
//                     {card.focusAreas.map((area, areaIndex) => (
//                       <li key={areaIndex} className="flex items-start gap-3">
//                         <Icon name="CheckCircleIcon" size={20} className="text-primary mt-0.5 flex-shrink-0" />
//                         <span className="text-muted-foreground">{area}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import {
  Settings,
  Lightbulb,
  ShoppingCart,
  Users,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface WorkCard {
  id: string;
  title: string;
  description: string;
  focusAreas: string[];
  icon: any;
  gradient: string;
  glowColor: string;
}

const workCards: WorkCard[] = [
  {
    id: '1',
    title: 'AI Automations',
    description:
      'Operational inefficiencies create risk, cost, and lost momentum. We design intelligent automation systems that standardize execution, improve visibility, and enable scalable growth across marketing and eCommerce teams.',
    focusAreas: [
      'Structured automation mapping across core workflows',
      'Unified workflow intelligence across marketing, sales, and ops',
      'Context-aware automations that respond to real-time signals',
      'AI-assisted research, reporting and daily insights',
      'Secure, no-code automation for daily task',
    ],
    icon: Settings,
    gradient: 'from-secondary to-accent',
    glowColor: 'secondary',
  },
  {
    id: '2',
    title: 'Intelligent Brand Building',
    description:
      'We build brands through stories that earn trust and performance systems that drive results. Every message is shaped by data, refined by AI, and measured by real business impact.',
    focusAreas: [
      'Insight-led brand narratives built to convert',
      'Performance-first creative testing and scale',
      'Consistent storytelling across growth channels',
      'AI-driven optimization for recall and ROI',
    ],
    icon: Lightbulb,
    gradient: 'from-accent to-primary',
    glowColor: 'accent',
  },
  {
    id: '3',
    title: 'E-Commerce That Scales',
    description:
      'We design intelligent E-Commerce and customer lifecycle frameworks that turn traffic into revenue and customers into long-term value.',
    focusAreas: [
      'Conversion-first storefront and funnel optimization',
      'AI-led personalization across the shopping journey',
      'Lifecycle strategies for repeat purchase and retention',
      'Performance visibility from first click for maximum revenue',
    ],
    icon: ShoppingCart,
    gradient: 'from-success to-secondary',
    glowColor: 'success',
  },
  {
    id: '4',
    title: 'Human-Led & System-Powered',
    description:
      'AI moves fast—but growth still needs human judgment. With 16+ years of experience, our team of marketers and strategists actively monitors & optimizes supported by intelligent systems working round the clock.',
    focusAreas: [
      'Dedicated human oversight',
      'Proactive, real-time intervention',
      'Continuous optimization, 24/7',
      'Clear ownership and accountability',
    ],
    icon: Users,
    gradient: 'from-primary to-secondary',
    glowColor: 'primary',
  },
];

export default function HowWeWorkSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Avoid referencing `window` during prerender; compute after hydration.
    const mql = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mql.matches);
    update();

    // Safari < 14 support
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyMql: any = mql;
    if (anyMql.addEventListener) anyMql.addEventListener('change', update);
    else anyMql.addListener(update);

    return () => {
      if (anyMql.removeEventListener) anyMql.removeEventListener('change', update);
      else anyMql.removeListener(update);
    };
  }, []);

  return (
    <section
      id="how-we-work"
      className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float-soft"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header with stagger animation */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-md mb-6 animate-slide-down">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Our Approach
              </span>
            </div>

            <h2
              className="text-3xl lg:text-5xl font-bold text-foreground mb-4 animate-slide-down"
              style={{ animationDelay: '100ms' }}
            >
              How AI Fits In{' '}
              <span className="relative inline-block">
                <span className="relative z-10">(Without the Hype)</span>
                <span
                  className="absolute bottom-1 left-0 w-full h-3 bg-accent/50 -rotate-1 animate-slide-down"
                  style={{ animationDelay: '200ms' }}
                />
              </span>
            </h2>

            <p
              className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up"
              style={{ animationDelay: '150ms' }}
            >
              Discover how we combine intelligent automation with human expertise to drive real
              growth
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {workCards.map((card, index) => {
              const Icon = card.icon;
              const isHovered = hoveredCard === card.id;
              const isExpanded = expandedCard === card.id;

              return (
                <div
                  key={card.id}
                  className="group relative bg-card/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden transition-all duration-700 hover:shadow-primary/20 hover:-translate-y-3 cursor-pointer"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                >
                  {/* Decorative Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700`}
                  />

                  {/* Animated Corner Glow */}
                  <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 blur-[80px] transition-opacity duration-700 rounded-full`} />

                  <div className="relative p-8 md:p-10 lg:p-12">
                    {/* Floating Icon Container */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-8">
                      <div
                        className={`relative p-6 rounded-3xl bg-gradient-to-br ${card.gradient} shadow-2xl shadow-primary/20 transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0`}
                      >
                        <div className="absolute inset-0 rounded-3xl bg-white/20 animate-pulse" />
                        <Icon className="w-10 h-10 text-white relative z-10" />

                        {/* Magical Particles */}
                        {isHovered && (
                          <div className="absolute inset-0 z-0">
                            <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-ping" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-4">
                        <h3 className="text-3xl font-extrabold text-foreground tracking-tight transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">
                          {card.title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Focus Areas Section */}
                    <div
                      className={`mt-10 pt-10 border-t border-white/10 transition-all duration-700 ease-in-out ${
                        isExpanded || isDesktop
                          ? 'max-h-[800px] opacity-100 translate-y-0'
                          : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                          Strategic Focus
                          <span className={`flex h-2 w-2 rounded-full bg-gradient-to-r ${card.gradient} animate-pulse`} />
                        </h4>
                      </div>

                      <ul className="grid grid-cols-1 gap-4">
                        {card.focusAreas.map((area, areaIndex) => (
                          <li
                            key={areaIndex}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 hover:translate-x-2 transition-all duration-300 group/item"
                            style={{
                              transitionDelay: `${areaIndex * 50}ms`,
                            }}
                          >
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} opacity-20 group-hover/item:opacity-100 transition-all duration-500`}>
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base font-semibold text-muted-foreground group-hover/item:text-foreground transition-colors">
                              {area}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Mobile Dynamic Indicator */}
                    <div className="md:hidden mt-8">
                      <button
                        className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all duration-500 ${
                          isExpanded 
                            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                            : 'bg-white/10 text-foreground border border-white/10'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCard(isExpanded ? null : card.id);
                        }}
                      >
                        {isExpanded ? 'Collapse Details' : 'Explore Capabilities'}
                        <ArrowRight className={`w-5 h-5 transition-transform duration-500 ${isExpanded ? '-rotate-90' : 'group-hover:translate-x-1'}`} />
                      </button>
                    </div>

                    {/* Desktop "Read More" Hint */}
                    <div className="hidden md:flex absolute bottom-8 right-10 items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Details</span>
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-xl shadow-primary/20`}>
                        <ArrowRight className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Sequential Badge */}
                    <div className="absolute top-8 right-8 text-6xl font-black text-white/5 select-none transition-all duration-700 group-hover:text-white/[0.08] group-hover:scale-110">
                      0{card.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-soft {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(10px);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
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
        @keyframes slide-in {
          0% {
            transform: translateX(-10px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </section>
  );
}
