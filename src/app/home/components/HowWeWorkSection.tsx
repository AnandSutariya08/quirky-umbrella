'use client';

import Icon from '@/components/ui/AppIcon';

interface WorkCard {
  id: string;
  title: string;
  description: string;
  focusAreas: string[];
  icon: string;
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
    icon: 'Cog6ToothIcon',
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
    icon: 'LightBulbIcon',
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
    icon: 'ShoppingCartIcon',
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
    icon: 'UserGroupIcon',
  },
];

export default function HowWeWorkSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How AI Fits In (Without the Hype)
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how we combine intelligent automation with human expertise to drive real growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {workCards.map((card, index) => (
              <div
                key={card.id}
                className="bg-card rounded-xl shadow-warm-lg border border-border p-8 hover:shadow-warm-xl transition-smooth group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-smooth">
                    <Icon name={card.icon as any} size={32} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                    Focus Areas:
                  </h4>
                  <ul className="space-y-3">
                    {card.focusAreas.map((area, areaIndex) => (
                      <li key={areaIndex} className="flex items-start gap-3">
                        <Icon name="CheckCircleIcon" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
