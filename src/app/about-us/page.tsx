import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import { Sparkles, Target, Zap, ShieldCheck, Rocket, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Quirky Umbrella',
  description:
    'Learn about Quirky Umbrella - our mission, values, and the team dedicated to transforming brands with innovative solutions.',
};

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-card">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-secondary/5 to-transparent" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="w-full px-6 lg:px-12 relative z-10">
            <div className="max-w-[1400px] mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 shadow-sm mb-8 animate-slide-down">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-black text-primary uppercase tracking-widest">Our Story</span>
              </div>
              
              <h1 className="font-heading text-5xl lg:text-8xl font-black text-foreground leading-[1.1] mb-8 animate-slide-down">
                Transforming Brands Through <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-pan">
                  Intelligent Innovation
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed animate-slide-up">
                We&apos;re not just a marketing agency. We&apos;re a team of visionaries and systems architects dedicated to redefining how brands scale in the AI era.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-foreground text-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none [background-image:radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:40px_40px]" />
          
          <div className="w-full px-6 lg:px-12 relative z-10">
            <div className="max-w-[1400px] mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 animate-slide-in">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/5 border border-background/10 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">Our Mission</span>
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-black leading-tight text-background">
                    Blending <span className="text-primary">Creativity</span> With <span className="text-secondary">Strategy</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                    Our mission is to empower businesses with branding solutions that aren&apos;t just beautiful, but built to win. We translate complex data into compelling human stories.
                  </p>
                  <div className="pt-8 grid grid-cols-2 gap-8 border-t border-background/10">
                    <div>
                      <div className="text-4xl font-black text-background mb-2">15+</div>
                      <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Years Experience</div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-background mb-2">50+</div>
                      <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Countries Served</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative group animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative aspect-square lg:aspect-[4/3] rounded-[3rem] border-8 border-background/5 overflow-hidden bg-muted">
                    <img 
                      src="https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?w=1200&h=900&fit=crop" 
                      alt="Team working" 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-background relative">
          <div className="w-full px-6 lg:px-12 relative z-10">
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-6">Values That Drive Us</h2>
                <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: 'Innovation', icon: Rocket, desc: 'We never settle for the status quo. We push boundaries.', color: 'primary' },
                  { title: 'Integrity', icon: ShieldCheck, desc: 'Transparency is our foundation. We build trust through results.', color: 'secondary' },
                  { title: 'Excellence', icon: Zap, desc: 'Good is never enough. We strive for world-class quality.', color: 'accent' },
                  { title: 'Client-First', icon: Heart, desc: 'Your success is our obsession. We scale together.', color: 'primary' },
                ].map((value, i) => (
                  <div 
                    key={value.title} 
                    className="group p-10 rounded-[2.5rem] bg-card border border-border hover:bg-background hover:border-primary/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-${value.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-4">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <ClientFooter />
    </div>
  );
}
