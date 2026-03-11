'use client';

import Link from 'next/link';
import { Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react';

const ClientFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Services', href: '/home' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Blog', href: '/blogs' },
      { label: 'Discuss', href: '/discuss' },
    ],
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      href: 'https://wa.me/919971066552?text=Hi%20Quirky%20Umbrella%2C%20I%20want%20to%20connect.',
      icon: MessageCircle,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/quirkyumbrella/',
      icon: Instagram,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/quirky-umbrella/',
      icon: Linkedin,
    },
    {
      name: 'Email',
      href: 'mailto:hello@quirkyumbrella.in?subject=Let%27s%20Connect',
      icon: Mail,
    },
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              href="/home"
              className="flex items-center gap-3 mb-4 transition-smooth hover:opacity-80"
            >
              <img
                src="/assets/images/ImageToStl.com_QU_Logo-1768912371539.png"
                alt="Quirky Umbrella Logo"
                className="h-8 w-auto"
              />
              <span className="font-heading font-semibold text-xl text-foreground">
                Quirky Umbrella
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transforming brands with creative strategies and innovative solutions that drive real
              business results.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.name === 'Email' ? undefined : '_blank'}
                  rel={social.name === 'Email' ? undefined : 'noopener noreferrer'}
                  className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-smooth press-scale"
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-smooth hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-smooth hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {currentYear} Quirky Umbrella. All rights reserved.
            </p>
            {/* <p className="text-muted-foreground text-sm flex items-center gap-1">
              Crafted with{' '}
              <Icon
                name="HeartIcon"
                size={16}
                className="text-error"
                variant="solid"
              />{' '}
              for innovative brands
            </p> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ClientFooter;
