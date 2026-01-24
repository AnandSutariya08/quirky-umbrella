'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Service } from '@/types/service';
import Link from 'next/link';

interface ServicePreviewProps {
  service: Service;
  onClose: () => void;
}

const ServicePreview = ({ service, onClose }: ServicePreviewProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4 overflow-y-auto">
      <div className="bg-card rounded-lg shadow-neutral-xl max-w-4xl w-full my-8 animate-slide-down">
        <div className="sticky top-0 bg-card p-6 border-b border-border flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              Preview: {service.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              This is how your service will appear to visitors
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
            title="Close preview"
          >
            <Icon name="XMarkIcon" size={24} className="text-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="GlobeAltIcon" size={20} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Service URL</span>
            </div>
            <div className="pl-7">
              <Link
                href={`/services/${service.slug}`}
                target="_blank"
                className="text-lg text-primary hover:underline cursor-pointer"
              >
                /services/{service.slug}
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Service Preview</h3>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  service.isActive ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  service.isActive ? 'bg-success' : 'bg-warning'
                }`} />
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{service.title}</h1>
                <p className="text-xl text-muted-foreground">{service.tagline}</p>
              </div>

              <div className="prose max-w-none">
                <p className="text-muted-foreground">{service.description}</p>
              </div>

              <div className="border-t border-border pt-4">
                <h2 className="text-xl font-semibold text-foreground mb-2">{service.whatIsIt.title}</h2>
                <p className="text-muted-foreground whitespace-pre-line">{service.whatIsIt.content}</p>
              </div>

              <div className="border-t border-border pt-4">
                <h2 className="text-xl font-semibold text-foreground mb-3">{service.deliverables.title}</h2>
                <ul className="space-y-2">
                  {service.deliverables.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Icon name="CheckCircleIcon" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <h2 className="text-xl font-semibold text-foreground mb-2">{service.approach.title}</h2>
                <p className="text-muted-foreground whitespace-pre-line mb-4">{service.approach.content}</p>
                <h3 className="font-semibold text-foreground mb-2">{service.approach.processTitle}</h3>
                <ul className="space-y-2">
                  {service.approach.processSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Icon name="ArrowRightIcon" size={20} className="text-primary mt-1.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{step.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <h2 className="text-xl font-semibold text-foreground mb-3">{service.useCases.title}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.useCases.industries.map((industry, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">{industry.title}</h3>
                      <ul className="space-y-1">
                        {industry.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Icon name="CheckCircleIcon" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h2 className="text-xl font-semibold text-foreground mb-2">{service.cta.title}</h2>
                <p className="text-muted-foreground whitespace-pre-line mb-3">{service.cta.content}</p>
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium">
                  {service.cta.buttonText}
                </button>
              </div>

              <div className="border-t border-border pt-4">
                <h2 className="text-xl font-semibold text-foreground mb-3">FAQs</h2>
                <div className="space-y-3">
                  {service.faqs.map((faq, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-1">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Slug:</span>
                <code className="ml-2 text-secondary bg-secondary/10 px-2 py-1 rounded">
                  {service.slug}
                </code>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 text-foreground">{service.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card p-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicePreview;