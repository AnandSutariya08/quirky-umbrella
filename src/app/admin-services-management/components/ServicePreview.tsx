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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-[1000] p-4 overflow-y-auto">
      <div className="bg-card rounded-[2.5rem] shadow-neutral-xl max-w-5xl w-full my-8 animate-slide-up border border-border overflow-hidden">
        <div className="sticky top-0 bg-card/80 backdrop-blur-md p-8 border-b border-border flex items-center justify-between z-10">
          <div>
            <h2 className="text-3xl font-black font-heading text-foreground tracking-tight">
              Review: {service.title}
            </h2>
            <p className="text-muted-foreground font-bold mt-1 uppercase tracking-widest text-xs">
              Preview Mode • {service.isActive ? 'Live' : 'Draft'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-muted/50 hover:bg-muted text-foreground transition-all press-scale border border-border"
            title="Close preview"
          >
            <Icon name="XMarkIcon" size={28} />
          </button>
        </div>

        <div className="p-10 space-y-12 bg-muted/5">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
                  {service.tagline}
                </span>
                <h1 className="text-5xl md:text-6xl font-black font-heading text-foreground leading-[0.95] tracking-tighter mb-6">
                  {service.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>

              {service.imageUrl && (
                <div className="relative rounded-3xl overflow-hidden border-4 border-primary/10 shadow-2xl group bg-muted/20">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-auto max-h-[500px] object-contain group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-card border-2 border-border shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Icon name="GlobeAltIcon" size={24} />
                  <span className="text-sm font-black uppercase tracking-widest">Target URL</span>
                </div>
                <div className="bg-muted p-4 rounded-2xl font-mono text-sm break-all border border-border">
                  /services/{service.slug}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/20 space-y-4">
                <div className="flex items-center gap-3">
                  <Icon name="CheckCircleIcon" size={24} />
                  <span className="text-sm font-black uppercase tracking-widest">Status Overview</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/20">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${service.isActive ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="font-black text-lg">
                    {service.isActive ? 'Active on Site' : 'Hidden from Site'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-black font-heading flex items-center gap-3">
                <Icon name="DocumentTextIcon" size={24} className="text-primary" />
                {service.whatIsIt.title}
              </h3>
              <div className="p-6 bg-card rounded-3xl border border-border/50 text-muted-foreground leading-relaxed whitespace-pre-line font-medium">
                {service.whatIsIt.content}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black font-heading flex items-center gap-3">
                <Icon name="ListBulletIcon" size={24} className="text-secondary" />
                {service.deliverables.title}
              </h3>
              <div className="grid gap-3">
                {service.deliverables.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                    <Icon name="CheckCircleIcon" size={20} className="text-primary" />
                    <span className="font-bold text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card/80 backdrop-blur-md p-8 border-t border-border flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-8 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xl hover:scale-[1.02] hover:shadow-xl transition-all press-scale"
          >
            Finished Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicePreview;
