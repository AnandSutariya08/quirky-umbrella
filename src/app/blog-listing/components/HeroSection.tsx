import Icon from '@/components/ui/AppIcon';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20 overflow-hidden pt-28 sm:pt-32 md:pt-36 lg:pt-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(250,0,172,0.1),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(39,78,255,0.1),transparent_50%)]" />
      <div className="pointer-events-none absolute -left-10 top-12 h-44 w-44 rounded-full bg-primary/20 blur-3xl animate-float-soft" />
      <div className="pointer-events-none absolute -right-8 bottom-16 h-40 w-40 rounded-full bg-secondary/20 blur-3xl animate-float" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full mb-6 stat-pop">
            <Icon name="SparklesIcon" size={20} className="text-foreground" />
            <span className="text-sm font-semibold text-foreground">Fresh Weekly Insights</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Explore Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Latest Insights
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover thought leadership, industry trends, and actionable strategies to elevate your
            brand and drive meaningful results.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="stat-pop rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-card-foreground backdrop-blur-sm">
              <Icon name="FireIcon" size={16} className="mr-2 inline text-primary" />
              High-impact tactics
            </span>
            <span className="stat-pop rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-card-foreground backdrop-blur-sm">
              <Icon name="ChartBarIcon" size={16} className="mr-2 inline text-secondary" />
              Proven growth patterns
            </span>
            <span className="stat-pop rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-card-foreground backdrop-blur-sm">
              <Icon name="LightBulbIcon" size={16} className="mr-2 inline text-primary" />
              Ideas you can apply today
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default HeroSection;
