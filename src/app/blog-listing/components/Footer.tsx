import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/home' },
      { label: 'Services', href: '/home' },
      { label: 'Industries', href: '/home' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Blog', href: '/blogs' },
      { label: 'Case Studies', href: '/home' },
      { label: 'Insights', href: '/blogs' },
      { label: 'News', href: '/blogs' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/home' },
      { label: 'Terms of Service', href: '/home' },
      { label: 'Cookie Policy', href: '/home' },
      { label: 'Disclaimer', href: '/home' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'XMarkIcon', href: '#' },
    { name: 'LinkedIn', icon: 'LinkIcon', href: '#' },
    { name: 'Facebook', icon: 'ShareIcon', href: '#' },
    { name: 'Instagram', icon: 'CameraIcon', href: '#' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link
              href="/home"
              className="flex items-center gap-3 mb-4 transition-smooth hover:opacity-80"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 8C15.163 8 8 15.163 8 24C8 27.866 9.686 31.343 12.343 33.657L24 44L35.657 33.657C38.314 31.343 40 27.866 40 24C40 15.163 32.837 8 24 8Z"
                  fill="#FA00AC"
                />
                <path
                  d="M24 12C17.373 12 12 17.373 12 24C12 26.761 13.104 29.261 14.929 31.071L24 38.828L33.071 31.071C34.896 29.261 36 26.761 36 24C36 17.373 30.627 12 24 12Z"
                  fill="#274EFF"
                />
                <circle cx="24" cy="24" r="6" fill="#DAF304" />
              </svg>
              <span className="font-heading font-semibold text-xl text-foreground">
                Quirky Umbrella
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transforming brands with creative strategies and innovative
              solutions that drive real business results.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center bg-muted rounded-full transition-smooth hover:bg-primary hover:text-primary-foreground press-scale"
                  aria-label={social.name}
                >
                  <Icon name={social.icon as any} size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Company
            </h3>
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

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Resources
            </h3>
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

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
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

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {currentYear} Quirky Umbrella. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Crafted with{' '}
              <Icon
                name="HeartIcon"
                size={16}
                className="inline text-error"
                variant="solid"
              />{' '}
              for innovative brands
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;