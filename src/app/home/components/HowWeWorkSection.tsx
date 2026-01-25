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
  ArrowRight
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
    description: 'Operational inefficiencies create risk, cost, and lost momentum. We design intelligent automation systems that standardize execution, improve visibility, and enable scalable growth across marketing and eCommerce teams.',
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
    description: 'We build brands through stories that earn trust and performance systems that drive results. Every message is shaped by data, refined by AI, and measured by real business impact.',
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
    description: 'We design intelligent E-Commerce and customer lifecycle frameworks that turn traffic into revenue and customers into long-term value.',
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
    description: 'AI moves fast—but growth still needs human judgment. With 16+ years of experience, our team of marketers and strategists actively monitors & optimizes supported by intelligent systems working round the clock.',
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
    <section id="how-we-work" className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header with stagger animation */}
          <div className="text-center mb-16">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-md mb-6 animate-slide-down"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Our Approach
              </span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 animate-slide-down" style={{ animationDelay: '100ms' }}>
              How AI Fits In{' '}
              <span className="relative inline-block">
                <span className="relative z-10">(Without the Hype)</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-accent/50 -rotate-1 animate-slide-down" style={{ animationDelay: '200ms' }} />
              </span>
            </h2>
            
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '150ms' }}>
              Discover how we combine intelligent automation with human expertise to drive real growth
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {workCards.map((card, index) => {
              const Icon = card.icon;
              const isHovered = hoveredCard === card.id;
              const isExpanded = expandedCard === card.id;
              
              return (
                <div
                  key={card.id}
                  className="group relative bg-card rounded-2xl shadow-warm-lg border border-border overflow-hidden transition-all duration-500 hover:shadow-warm-xl hover:-translate-y-2 cursor-pointer"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                  }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                >
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Top gradient bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                  
                  {/* Shimmer effect */}
                  <div 
                    className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      animation: isHovered ? 'shimmer 1.5s ease-in-out infinite' : 'none',
                    }}
                  />

                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                      {/* Icon with pulsing background */}
                      <div className={`relative p-4 rounded-xl bg-gradient-to-br ${card.gradient} transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <div className="absolute inset-0 rounded-xl bg-card/20 animate-pulse" />
                        <Icon className="w-8 h-8 text-primary-foreground relative z-10" />
                        
                        {/* Orbiting particles */}
                        {isHovered && (
                          <>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-card rounded-full animate-ping" />
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-card rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
                          </>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-3 transition-all duration-300 group-hover:text-primary">
                          {card.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Focus areas */}
                    <div 
                      className={`border-t border-border pt-6 transition-all duration-500 ${
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden md:max-h-96 md:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
                          Focus Areas
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.gradient} animate-pulse`} />
                        </h4>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {card.focusAreas.length} items
                        </span>
                      </div>
                      
                      <ul className="space-y-3">
                        {card.focusAreas.map((area, areaIndex) => (
                          <li 
                            key={areaIndex} 
                            className="flex items-start gap-3 group/item transition-all duration-300 hover:translate-x-1"
                            style={{
                              animation: isExpanded || isDesktop 
                                ? `slide-in 300ms ease-out ${areaIndex * 50}ms backwards` 
                                : 'none'
                            }}
                          >
                            <div className="relative mt-0.5">
                              <CheckCircle className={`w-5 h-5 transition-all duration-300 ${
                                card.glowColor === 'primary' ? 'text-primary group-hover/item:text-primary' :
                                card.glowColor === 'secondary' ? 'text-secondary group-hover/item:text-secondary' :
                                card.glowColor === 'accent' ? 'text-accent group-hover/item:text-accent' :
                                'text-success group-hover/item:text-success'
                              }`} />
                              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${card.gradient} opacity-0 group-hover/item:opacity-20 blur transition-opacity duration-300`} />
                            </div>
                            <span className="text-card-foreground flex-1 group-hover/item:text-foreground transition-colors duration-300">
                              {area}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Mobile expand button */}
                    <button
                      className="md:hidden mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCard(isExpanded ? null : card.id);
                      }}
                    >
                      {isExpanded ? 'Show Less' : 'View Focus Areas'}
                      <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Hover indicator for desktop */}
                    <div className="hidden md:flex absolute bottom-4 right-4 items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-xs font-medium text-muted-foreground">Explore</span>
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center`}>
                        <ArrowRight className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Card number badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300 shadow-sm">
                    {card.id}
                  </div>

                  {/* Corner accent */}
                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${card.gradient} opacity-0 group-hover:opacity-5 rounded-tl-full transition-opacity duration-500`} />
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-card rounded-2xl shadow-warm-lg border border-border">
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  Ready to transform your marketing?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Let's discuss how we can help you grow with intelligent systems
                </p>
              </div>
              <button className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium shadow-warm-md hover:shadow-warm-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-soft {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes slide-down {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-in {
          0% { transform: translateX(-10px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}