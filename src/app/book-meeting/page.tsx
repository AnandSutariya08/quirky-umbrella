'use client';

import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import SchedulingSystem from '../contact/components/SchedulingSystem';
import Icon from '@/components/ui/AppIcon';

export default function BookMeetingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <PublicHeader />
      
      <main className="flex-1 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Icon name="CalendarIcon" size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Booking Portal</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-foreground mb-6">
              Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Strategy Session</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to take your business to the next level? Schedule a meeting with our experts to discuss your growth strategy.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <SchedulingSystem />
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}
