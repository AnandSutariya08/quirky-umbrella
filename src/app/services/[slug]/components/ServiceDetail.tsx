'use client';

import type { Service } from '@/types/service';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface ServiceDetailProps {
  service: Service;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-down">
              {service.title}
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 animate-slide-down" style={{ animationDelay: '100ms' }}>
              {service.tagline}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed animate-slide-down" style={{ animationDelay: '200ms' }}>
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* What Is It Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {service.whatIsIt.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {service.whatIsIt.content}
            </p>
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
              {service.deliverables.title}
            </h2>
            <ul className="space-y-4">
              {service.deliverables.items.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <Icon name="CheckCircleIcon" size={24} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-lg text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {service.approach.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
              {service.approach.content}
            </p>
            
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              {service.approach.processTitle}
            </h3>
            <ul className="space-y-4">
              {service.approach.processSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <Icon name="ArrowRightIcon" size={20} className="text-primary mt-1.5 flex-shrink-0" />
                  <span className="text-lg text-muted-foreground">{step.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">
              {service.useCases.title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {service.useCases.industries.map((industry, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl shadow-warm-lg border border-border p-6 hover:shadow-warm-xl transition-smooth"
                >
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="BuildingOfficeIcon" size={24} className="text-primary" />
                    {industry.title}
                  </h3>
                  <ul className="space-y-3">
                    {industry.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <Icon name="CheckCircleIcon" size={18} className="text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary/10 border-y border-primary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {service.cta.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
              {service.cta.content}
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium text-lg transition-smooth hover:shadow-warm-md hover:-translate-y-1 press-scale"
            >
              {service.cta.buttonText}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">
              Frequently Asked Questions (FAQs)
            </h2>
            
            <div className="space-y-6">
              {service.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl shadow-warm-lg border border-border p-6 hover:shadow-warm-xl transition-smooth"
                >
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
