'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const NewsletterSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setIsSubmitted(false);
      }, 3000);
    }
  };

  if (!isHydrated) {
    return (
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-card rounded-2xl p-8 shadow-neutral-lg">
            <div className="h-32 bg-muted rounded-md animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-neutral-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
              <Icon name="EnvelopeIcon" size={32} className="text-accent" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground text-lg">
              Get the latest insights, trends, and strategies delivered straight
              to your inbox.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-success/10 border border-success/20 rounded-lg p-6 text-center">
              <Icon
                name="CheckCircleIcon"
                size={48}
                className="text-success mx-auto mb-3"
                variant="solid"
              />
              <p className="text-success font-medium text-lg">
                Thank you for subscribing!
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Check your inbox for a confirmation email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium transition-smooth hover:shadow-warm-md hover:-translate-y-0.5 press-scale whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;