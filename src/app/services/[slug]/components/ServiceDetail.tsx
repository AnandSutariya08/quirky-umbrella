// 'use client';

// import type { Service } from '@/types/service';
// import Link from 'next/link';
// import { ArrowRight, CheckCircle, Layout, ShieldCheck, Target, Zap } from 'lucide-react';

// interface ServiceDetailProps {
//   service: Service;
// }

// export default function ServiceDetail({ service }: ServiceDetailProps) {
//   return (
//     <div className="bg-background relative">
//       {/* Dynamic Background Elements */}
//       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
//         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
//         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
//         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
//       </div>

//       {/* Hero Section */}
//       <section className="relative min-h-[90vh] flex items-center z-10 overflow-hidden">
//         <div className="w-full">
//           <div className="px-6 lg:px-20">
//             <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
//               <div className="space-y-8 animate-slide-up">
//                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
//                   <Zap className="w-3.5 h-3.5 text-primary" />
//                   <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">{service.tagline}</span>
//                 </div>

//                 <h1 className="text-5xl lg:text-8xl font-black text-foreground tracking-tight leading-[1.05]">
//                   {service.title}
//                 </h1>

//                 <p className="text-xl lg:text-2xl text-muted-foreground/90 font-medium leading-relaxed border-l-4 border-primary/20 pl-6 max-w-2xl">
//                   {service.description}
//                 </p>
//               </div>

//               {service.imageUrl ? (
//                 <div className="relative aspect-video lg:aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 group animate-fade-in">
//                   <img 
//                     src={service.imageUrl} 
//                     alt={service.title}
//                     className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
//                   <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem]" />
//                 </div>
//               ) : (
//                 <div className="relative aspect-video lg:aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-muted/20 flex items-center justify-center animate-fade-in">
//                   <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent" />
//                   <Zap className="w-20 h-20 text-primary/20" />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Main Content Grid */}
//       <section className="py-24 relative z-10 bg-background/50 backdrop-blur-sm border-t border-border/50">
//         <div className="container mx-auto px-6">
//           <div className="grid lg:grid-cols-12 gap-16">
//             {/* Left Column: What & Deliverables */}
//             <div className="lg:col-span-7 space-y-24">
//               <div className="space-y-8">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
//                     <Target className="w-6 h-6 text-primary" />
//                   </div>
//                   <h2 className="text-3xl lg:text-4xl font-black tracking-tight">{service.whatIsIt.title}</h2>
//                 </div>
//                 <div className="bg-card/30 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-2xl">
//                   <p className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
//                     {service.whatIsIt.content}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-10">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
//                     <ShieldCheck className="w-6 h-6 text-secondary" />
//                   </div>
//                   <h2 className="text-3xl lg:text-4xl font-black tracking-tight">{service.deliverables.title}</h2>
//                 </div>
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   {service.deliverables.items.map((item, index) => (
//                     <div 
//                       key={index} 
//                       className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex items-start gap-4"
//                     >
//                       <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
//                         <CheckCircle className="w-5 h-5 text-primary" />
//                       </div>
//                       <span className="text-base font-bold text-foreground/80 group-hover:text-foreground transition-colors">{item.text}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Right Column: Approach & Floating CTA */}
//             <div className="lg:col-span-5 space-y-12">
//               <div className="sticky top-32 space-y-8">
//                 <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
//                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

//                   <h3 className="text-2xl font-black mb-6 relative z-10">{service.approach.title}</h3>
//                   <p className="text-white/80 leading-relaxed mb-8 relative z-10 font-medium">
//                     {service.approach.content}
//                   </p>

//                   <div className="space-y-4 relative z-10">
//                     <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">{service.approach.processTitle}</h4>
//                     <div className="space-y-3">
//                       {service.approach.processSteps.map((step, index) => (
//                         <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all cursor-default">
//                           <span className="text-xs font-black w-6 h-6 rounded-lg bg-white text-primary flex items-center justify-center">{index + 1}</span>
//                           <span className="text-sm font-bold">{step.text}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <Link
//                     href="/contact"
//                     className="mt-10 w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary rounded-2xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
//                   >
//                     Start Project
//                     <ArrowRight className="w-5 h-5" />
//                   </Link>
//                 </div>

//                 <div className="p-8 rounded-[2rem] bg-card border border-border shadow-xl">
//                   <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Need custom?</h4>
//                   <p className="text-muted-foreground font-medium mb-6">We can tailor our systems to your specific business architecture.</p>
//                   <Link href="/discuss" className="text-primary font-black flex items-center gap-2 hover:gap-3 transition-all">
//                     Book a strategy session <ArrowRight className="w-4 h-4" />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Use Cases - Modern Grid */}
//       <section className="py-24 bg-card/50 relative overflow-hidden">
//         <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
//         <div className="container mx-auto px-6 relative z-10">
//           <div className="max-w-4xl mx-auto text-center mb-16">
//             <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6">
//               {service.useCases.title}
//             </h2>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {service.useCases.industries.map((industry, index) => (
//               <div
//                 key={index}
//                 className="group p-8 rounded-[2rem] bg-background border border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
//               >
//                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
//                   <Layout className="w-7 h-7 text-primary" />
//                 </div>
//                 <h3 className="text-2xl font-black text-foreground mb-6">
//                   {industry.title}
//                 </h3>
//                 <ul className="space-y-4">
//                   {industry.items.map((item, itemIndex) => (
//                     <li key={itemIndex} className="flex items-start gap-3">
//                       <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
//                       <span className="text-muted-foreground font-medium leading-snug">{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQs - Clean Accordion Style */}
//       <section className="py-24">
//         <div className="container mx-auto px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-16 text-center">
//               Service <span className="text-primary">FAQ</span>
//             </h2>

//             <div className="grid gap-4">
//               {service.faqs.map((faq, index) => (
//                 <details
//                   key={index}
//                   className="group bg-card rounded-3xl border border-border overflow-hidden [&_summary::-webkit-details-marker]:hidden"
//                 >
//                   <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
//                     <h3 className="text-xl font-black text-foreground pr-8">{faq.question}</h3>
//                     <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-open:rotate-180 transition-transform">
//                       <ArrowRight className="w-5 h-5 rotate-90" />
//                     </div>
//                   </summary>
//                   <div className="px-8 pb-8">
//                     <p className="text-lg text-muted-foreground leading-relaxed border-t border-border pt-6">
//                       {faq.answer}
//                     </p>
//                   </div>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-32 bg-foreground text-background relative overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] bg-[size:60px_60px]" />
//         <div className="container mx-auto px-6 relative z-10">
//           <div className="max-w-4xl mx-auto text-center space-y-10">
//             <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
//               {service.cta.title}
//             </h2>
//             <p className="text-xl lg:text-2xl text-background/60 leading-relaxed max-w-2xl mx-auto">
//               {service.cta.content}
//             </p>
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
//               <Link
//                 href="/contact"
//                 className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xl shadow-2xl hover:bg-primary/90 hover:-translate-y-1 transition-all"
//               >
//                 {service.cta.buttonText}
//               </Link>
//               <Link
//                 href="/discuss"
//                 className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-xl hover:bg-white/20 transition-all"
//               >
//                 View Case Studies
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
'use client';

import type { Service } from '@/types/service';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Layout, ShieldCheck, Target, Zap, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface ServiceDetailProps {
  service: Service;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen font-body">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>


      {/* Hero Section - Editorial Layout */}
      <section className="relative z-10 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
          {/* Tagline */}
          <div className="mb-8 md:mb-12">
            <span className="inline-block px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-[0.3em] rounded-full">
              {service.tagline}
            </span>
          </div>

          {/* Title & Description Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16 md:mb-24">
            <div className="lg:col-span-7">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading text-foreground leading-[0.95] tracking-tight mb-6 md:mb-8">
                {service.title}
              </h1>
            </div>
            <div className="lg:col-span-5 lg:pt-4">
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          {/* Hero Image */}
          {service.imageUrl && (
            <div className="relative aspect-[16/10] md:aspect-[21/9] max-w-5xl mx-auto rounded-3xl overflow-hidden border-4 border-primary/20 group shadow-2xl">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          )}
        </div>
      </section>

      {/* Content Section - Magazine Layout */}
      <section className="relative z-10 py-20 md:py-32 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-20 md:space-y-32">
              {/* What Is It */}
              <article className="space-y-6">
                <div className="flex items-baseline gap-4 pb-6 border-b-2 border-primary">
                  <span className="text-6xl md:text-7xl font-black font-heading text-primary/20">01</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-heading text-foreground tracking-tight">
                    {service.whatIsIt.title}
                  </h2>
                </div>
                <div className="bg-muted/50 rounded-3xl p-8 md:p-10 border border-border">
                  <p className="text-lg md:text-xl text-card-foreground leading-relaxed whitespace-pre-line">
                    {service.whatIsIt.content}
                  </p>
                </div>
              </article>

              {/* Deliverables */}
              <article className="space-y-8">
                <div className="flex items-baseline gap-4 pb-6 border-b-2 border-secondary">
                  <span className="text-6xl md:text-7xl font-black font-heading text-secondary/20">02</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-heading text-foreground tracking-tight">
                    {service.deliverables.title}
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.deliverables.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-base font-bold text-foreground">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {/* Use Cases */}
              <article className="space-y-8">
                <div className="flex items-baseline gap-4 pb-6 border-b-2 border-accent">
                  <span className="text-6xl md:text-7xl font-black font-heading text-accent/20">03</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-heading text-foreground tracking-tight">
                    {service.useCases.title}
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {service.useCases.industries.map((industry, index) => (
                    <div key={index} className="bg-card rounded-3xl p-8 border-2 border-border hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-500">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                        <Layout className="w-7 h-7 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-black font-heading text-foreground mb-6">
                        {industry.title}
                      </h3>
                      <ul className="space-y-3 pl-6 border-l-4 border-accent/30">
                        {industry.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-muted-foreground leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 space-y-8">
                {/* Approach Card */}
                <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground p-8 md:p-10 rounded-3xl shadow-2xl shadow-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                  <h3 className="text-2xl md:text-3xl font-black font-heading mb-6 tracking-tight relative z-10">
                    {service.approach.title}
                  </h3>
                  <p className="text-primary-foreground/90 leading-relaxed mb-8 relative z-10">
                    {service.approach.content}
                  </p>

                  <div className="space-y-4 mb-8 relative z-10">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground/60">
                      {service.approach.processTitle}
                    </h4>
                    <div className="space-y-3">
                      {service.approach.processSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                          <span className="text-sm font-black w-8 h-8 rounded-lg flex items-center justify-center bg-white text-primary flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-sm font-bold text-primary-foreground">{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="block w-full text-center px-8 py-4 bg-white text-primary rounded-2xl font-black text-lg hover:scale-[1.02] hover:shadow-xl transition-all relative z-10"
                  >
                    Start Project →
                  </Link>
                </div>

                {/* Custom Solution */}
                <div className="p-8 rounded-3xl bg-accent/10 border-2 border-accent/20 hover:border-accent/40 transition-all">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-accent-foreground/70 mb-4">
                    Need Custom?
                  </h4>
                  <p className="text-foreground/80 mb-6">
                    We can tailor our systems to your specific business architecture.
                  </p>
                  <Link href="/discuss" className="text-primary font-black flex items-center gap-2 hover:gap-3 transition-all group">
                    Book Strategy Session
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-foreground tracking-tight mb-16 text-center">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>

          <div className="space-y-4">
            {service.faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-3xl border-2 border-border bg-card overflow-hidden hover:border-primary/30 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-muted/30 transition-colors"
                >
                  <h3 className="text-lg md:text-xl font-black font-heading text-foreground pr-8">
                    {faq.question}
                  </h3>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                    {openFaq === index ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 md:px-8 pb-6 md:pb-8 bg-muted/20 animate-slide-down">
                    <div className="pt-4 border-t border-border">
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-40 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent animate-gradient-pan" style={{ backgroundSize: '200% 200%' }} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="text-center space-y-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight leading-none text-background">
              {service.cta.title}
            </h2>
            <p className="text-xl md:text-2xl text-background/70 leading-relaxed max-w-3xl mx-auto">
              {service.cta.content}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xl hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30 transition-all"
              >
                {service.cta.buttonText}
              </Link>
              <Link
                href="/discuss"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-background/20 bg-background/10 backdrop-blur-sm text-background font-black text-xl hover:bg-background/20 transition-all"
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