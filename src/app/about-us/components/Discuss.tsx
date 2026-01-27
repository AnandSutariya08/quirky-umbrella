'use client';

import Icon from '@/components/ui/AppIcon';

const Discuss = () => {
  return (
    <section className="mb-12 from-primary/5 to-primary/10 rounded-lg p-8 md:p-12">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="ChartBarIcon" size={32} className="text-primary" />
        <h2 className="text-3xl font-semibold text-foreground">Discuss</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-3">About Growth</h3>
          <p className="text-muted-foreground mb-4">
            Growth is at the heart of everything we do. We believe that sustainable business growth
            comes from a combination of strategic thinking, innovative solutions, and a deep
            understanding of market dynamics. Our approach to growth is holistic, focusing on both
            short-term wins and long-term success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className=" p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="ArrowTrendingUpIcon" size={24} className="text-primary" />
              <h4 className="text-lg font-semibold text-foreground">Strategic Growth</h4>
            </div>
            <p className="text-muted-foreground">
              We help businesses identify opportunities for expansion, optimize their operations,
              and build scalable systems that support sustainable growth.
            </p>
          </div>

          <div className=" p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="LightBulbIcon" size={24} className="text-primary" />
              <h4 className="text-lg font-semibold text-foreground">Innovation-Driven</h4>
            </div>
            <p className="text-muted-foreground">
              Innovation is key to staying ahead. We leverage cutting-edge technologies and creative
              solutions to drive growth and competitive advantage.
            </p>
          </div>

          <div className=" p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="UserGroupIcon" size={24} className="text-primary" />
              <h4 className="text-lg font-semibold text-foreground">Customer-Centric</h4>
            </div>
            <p className="text-muted-foreground">
              True growth comes from understanding and serving your customers better. We focus on
              building strong relationships and delivering exceptional value.
            </p>
          </div>

          <div className=" p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="RocketLaunchIcon" size={24} className="text-primary" />
              <h4 className="text-lg font-semibold text-foreground">Measurable Results</h4>
            </div>
            <p className="text-muted-foreground">
              We believe in data-driven growth. Every strategy we implement is tracked, measured,
              and optimized for maximum impact and ROI.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-primary/10 rounded-lg border-l-4 border-primary">
          <p className="text-foreground font-medium">
            Ready to discuss your growth strategy? Let's talk about how we can help you achieve your
            business objectives and unlock your full potential.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Discuss;
