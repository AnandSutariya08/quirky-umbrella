'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import SchedulingSystem from './SchedulingSystem';

export default function ContactSection() {
  const contactInfo = [
    {
      icon: 'EnvelopeIcon',
      title: 'Email Us',
      content: 'hello@quirkyumbrella.in',
      link: 'mailto:hello@quirkyumbrella.in',
      description: 'Send us an email anytime!',
    },
    {
      icon: 'PhoneIcon',
      title: 'Call Us',
      content: '+91 9971066552',
      link: 'tel:+919971066552',
      description: 'Monday - Friday: 10:00 AM - 6:00 PM IST',
    },
    {
      icon: 'MapPinIcon',
      title: 'Visit Us',
      content: 'Unit 4401, M3M 65th Avenue',
      link: '#',
      description: 'Sector 65, Gurgaon, India',
    },
    {
      icon: 'ClockIcon',
      title: 'Business Hours',
      content: 'Monday - Friday',
      link: '#',
      description: '10:00 AM - 6:00 PM IST',
    },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: 'LinkIcon', href: 'https://linkedin.com/company/quirkyumbrella' },
    { name: 'Twitter', icon: 'XMarkIcon', href: 'https://twitter.com/quirkyumbrella' },
    { name: 'Facebook', icon: 'ShareIcon', href: 'https://facebook.com/quirkyumbrella' },
    { name: 'Instagram', icon: 'CameraIcon', href: 'https://instagram.com/quirkyumbrella' },
  ];

  return (
    <section className="pt-24 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 overflow-x-hidden">
      <div className="container mx-auto px-6 w-full max-w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full mb-6">
            <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Get in Touch</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Let's Start a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Conversation
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or want to discuss your project? We're here to help. Reach out and let's
            create something amazing together.
          </p>
        </div>

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 w-full">
            {/* Contact Information */}
            <div className="space-y-8 w-full min-w-0 lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                  <p className="text-muted-foreground mb-8">
                    We're always happy to hear from you. Choose the best way to reach us.
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  <a
                    href="/book-meeting"
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
                  >
                    <Icon name="CalendarIcon" size={20} />
                    Schedule a Meeting
                  </a>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className="group flex items-start gap-4 p-6 bg-card rounded-xl border border-border hover:shadow-warm-lg hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-smooth">
                      <Icon
                        name={info.icon as any}
                        size={24}
                        className="text-primary group-hover:text-primary-foreground transition-smooth"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      <p className="text-foreground font-medium mb-1">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                    <Icon
                      name="ArrowRightIcon"
                      size={20}
                      className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth"
                    />
                  </a>
                ))}
              </div>

              {/* Social Media */}
              {/* <div className="pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-md font-medium transition-smooth press-scale"
                    >
                      <Icon name={social.icon as any} size={18} />
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div> */}

              {/* Map Placeholder */}
              <div className="pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Our Location</h3>
                <div className="relative h-64 bg-muted rounded-xl overflow-hidden border border-border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Icon
                        name="MapPinIcon"
                        size={48}
                        className="text-muted-foreground mx-auto mb-2"
                      />
                      <p className="text-muted-foreground">Interactive Map</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Unit 4401, M3M 65th Avenue, Sector 65, Gurgaon, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
