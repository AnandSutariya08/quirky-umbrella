'use client';

import type { Service } from '@/types/service';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Layout, ShieldCheck, Target, Zap } from 'lucide-react';

interface ServiceDetailProps {
  service: Service;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Advanced Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-slide-down">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-widest">Premium Service</span>
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-black text-foreground mb-8 tracking-tighter leading-[0.9] animate-slide-down">
              {service.title}
            </h1>
            
            <div className="grid lg:grid-cols-2 gap-12 items-end animate-slide-up" style={{ animationDelay: '200ms' }}>
              <p className="text-xl lg:text-2xl text-muted-foreground font-medium leading-relaxed">
                {service.tagline}
              </p>
              <p className="text-lg text-muted-foreground/80 leading-relaxed border-l-2 border-primary/30 pl-8">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Left Column: What & Deliverables */}
            <div className="lg:col-span-7 space-y-24">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black tracking-tight">{service.whatIsIt.title}</h2>
                </div>
                <div className="bg-card/30 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-2xl">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
                    {service.whatIsIt.content}
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black tracking-tight">{service.deliverables.title}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.deliverables.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-base font-bold text-foreground/80 group-hover:text-foreground transition-colors">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Approach & Floating CTA */}
            <div className="lg:col-span-5 space-y-12">
              <div className="sticky top-32 space-y-8">
                <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <h3 className="text-2xl font-black mb-6 relative z-10">{service.approach.title}</h3>
                  <p className="text-white/80 leading-relaxed mb-8 relative z-10 font-medium">
                    {service.approach.content}
                  </p>

                  <div className="space-y-4 relative z-10">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">{service.approach.processTitle}</h4>
                    <div className="space-y-3">
                      {service.approach.processSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all cursor-default">
                          <span className="text-xs font-black w-6 h-6 rounded-lg bg-white text-primary flex items-center justify-center">{index + 1}</span>
                          <span className="text-sm font-bold">{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="mt-10 w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary rounded-2xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    Start Project
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                <div className="p-8 rounded-[2rem] bg-card border border-border shadow-xl">
                  <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Need custom?</h4>
                  <p className="text-muted-foreground font-medium mb-6">We can tailor our systems to your specific business architecture.</p>
                  <Link href="/discuss" className="text-primary font-black flex items-center gap-2 hover:gap-3 transition-all">
                    Book a strategy session <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases - Modern Grid */}
      <section className="py-24 bg-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6">
              {service.useCases.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.useCases.industries.map((industry, index) => (
              <div
                key={index}
                className="group p-8 rounded-[2rem] bg-background border border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Layout className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-6">
                  {industry.title}
                </h3>
                <ul className="space-y-4">
                  {industry.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                      <span className="text-muted-foreground font-medium leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs - Clean Accordion Style */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-16 text-center">
              Service <span className="text-primary">FAQ</span>
            </h2>

            <div className="grid gap-4">
              {service.faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-card rounded-3xl border border-border overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                    <h3 className="text-xl font-black text-foreground pr-8">{faq.question}</h3>
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-open:rotate-180 transition-transform">
                      <ArrowRight className="w-5 h-5 rotate-90" />
                    </div>
                  </summary>
                  <div className="px-8 pb-8">
                    <p className="text-lg text-muted-foreground leading-relaxed border-t border-border pt-6">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
              {service.cta.title}
            </h2>
            <p className="text-xl lg:text-2xl text-background/60 leading-relaxed max-w-2xl mx-auto">
              {service.cta.content}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xl shadow-2xl hover:bg-primary/90 hover:-translate-y-1 transition-all"
              >
                {service.cta.buttonText}
              </Link>
              <Link
                href="/discuss"
                className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-xl hover:bg-white/20 transition-all"
              >
                View Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
