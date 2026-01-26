'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import DropdownMenu from '@/components/common/DropdownMenu';

interface PublicHeaderProps {
  className?: string;
}

const PublicHeader = ({ className = '' }: PublicHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Scroll detection for glass morphism effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleMouseEnter = (dropdownName: string) => {
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  return (
    <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-[1000] ${className}`}>
      <div
        className={`relative mx-auto transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'mt-4 w-[95%] max-w-7xl rounded-3xl backdrop-blur-xl bg-card/80 border border-border/50 shadow-lg'
            : 'w-full bg-transparent'
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/home"
              className="flex items-center gap-3 transition-smooth hover:opacity-80 press-scale"
              aria-label="Quirky Umbrella Home"
            >
              <img
                src="/assets/images/ImageToStl.com_QU_Logo-1768912371539.png"
                alt="Quirky Umbrella Logo"
                className="h-12 w-auto transition-smooth"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              <Link
                href="/home"
                className={`px-6 py-3 rounded-md font-medium transition-smooth hover:bg-muted press-scale ${
                  isActivePath('/home') ? 'text-primary bg-muted' : 'text-foreground'
                }`}
              >
                Home
              </Link>

              <div className="relative">
                <button
                  onMouseEnter={() => handleMouseEnter('services')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-smooth hover:bg-muted press-scale ${
                    activeDropdown === 'services' ? 'bg-muted text-primary' : 'text-foreground'
                  }`}
                  aria-expanded={activeDropdown === 'services'}
                  aria-haspopup="true"
                >
                  Services
                  <Icon
                    name="ChevronDownIcon"
                    size={16}
                    className={`transition-smooth ${
                      activeDropdown === 'services' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeDropdown === 'services' && (
                  <div onMouseLeave={handleMouseLeave}>
                    <DropdownMenu collection="services" onClose={() => setActiveDropdown(null)} />
                  </div>
                )}
              </div>

              <Link
                href="/discuss"
                className={`px-6 py-3 rounded-md font-medium transition-smooth hover:bg-muted press-scale ${
                  isActivePath('/discuss') ? 'text-primary bg-muted' : 'text-foreground'
                }`}
              >
                Discuss
              </Link>

              <Link
                href="/blogs"
                className={`px-6 py-3 rounded-md font-medium transition-smooth hover:bg-muted press-scale ${
                  isActivePath('/blogs') ? 'text-primary bg-muted' : 'text-foreground'
                }`}
              >
                Blog
              </Link>

              <Link
                href="/about-us"
                className={`px-6 py-3 rounded-md font-medium transition-smooth hover:bg-muted press-scale ${
                  isActivePath('/about-us') ? 'text-primary bg-muted' : 'text-foreground'
                }`}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className={`px-6 py-3 rounded-md font-medium transition-smooth hover:bg-muted press-scale ${
                  isActivePath('/contact') ? 'text-primary bg-muted' : 'text-foreground'
                }`}
              >
                Contact Us
              </Link>

              <Link
                href="/admin-services-management"
                className="ml-2 px-5 py-3 bg-secondary text-secondary-foreground rounded-md font-medium transition-smooth hover:shadow-md hover:-translate-y-0.5 press-scale flex items-center gap-2"
                title="Admin Access"
              >
                <Icon name="Cog6ToothIcon" size={18} />
                Admin
              </Link>
            </nav>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden inline-flex items-center justify-center h-11 w-11 rounded-xl transition-smooth press-scale focus:outline-none ${
                isScrolled
                  ? 'bg-muted/60 hover:bg-muted border border-border/60 shadow-sm'
                  : 'bg-card/50 hover:bg-card/70 backdrop-blur-sm border border-border/40 shadow-sm'
              }`}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon
                name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'}
                size={24}
                className="text-foreground"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom fade to visually merge header into content */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-10 transition-opacity duration-500 ${
          isScrolled
            ? 'opacity-100 bg-gradient-to-b from-card/70 via-card/30 to-transparent'
            : 'opacity-100 bg-gradient-to-b from-transparent via-transparent to-transparent'
        }`}
      />

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[999]">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Panel */}
          <div className="absolute left-0 right-0 top-20 flex justify-center px-3">
            <div className="w-full max-w-md rounded-3xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden animate-slide-down">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <Link
                  href="/home"
                  className="flex items-center gap-3 transition-smooth hover:opacity-80 press-scale"
                  aria-label="Quirky Umbrella Home"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img
                    src="/assets/images/ImageToStl.com_QU_Logo-1768912371539.png"
                    alt="Quirky Umbrella Logo"
                    className="h-10 w-auto"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-muted/60 hover:bg-muted border border-border/60 transition-smooth press-scale focus:outline-none"
                  aria-label="Close menu"
                >
                  <Icon name="XMarkIcon" size={22} className="text-foreground" />
                </button>
              </div>

              <nav className="px-3 py-4 space-y-2 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <Link
                  href="/home"
                  className={`block px-4 py-3 rounded-xl font-semibold transition-smooth hover:bg-muted ${
                    isActivePath('/home') ? 'text-primary bg-muted' : 'text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>

                <div>
                  <button
                    onClick={() => toggleDropdown('services-mobile')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-smooth hover:bg-muted ${
                      activeDropdown === 'services-mobile'
                        ? 'bg-muted text-primary'
                        : 'text-foreground'
                    }`}
                  >
                    Services
                    <Icon
                      name="ChevronDownIcon"
                      size={20}
                      className={`transition-smooth ${
                        activeDropdown === 'services-mobile' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeDropdown === 'services-mobile' && (
                    <div className="mt-2 pl-4 pb-2">
                      <DropdownMenu
                        collection="services"
                        onClose={() => setActiveDropdown(null)}
                        isMobile={true}
                      />
                    </div>
                  )}
                </div>

                <Link
                  href="/about-us"
                  className={`block px-4 py-3 rounded-xl font-semibold transition-smooth hover:bg-muted ${
                    isActivePath('/about-us') ? 'text-primary bg-muted' : 'text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>

                <Link
                  href="/discuss"
                  className={`block px-4 py-3 rounded-xl font-semibold transition-smooth hover:bg-muted ${
                    isActivePath('/discuss') ? 'text-primary bg-muted' : 'text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Discuss
                </Link>

                <Link
                  href="/blogs"
                  className={`block px-4 py-3 rounded-xl font-semibold transition-smooth hover:bg-muted ${
                    isActivePath('/blogs') ? 'text-primary bg-muted' : 'text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>

                <Link
                  href="/contact"
                  className={`block px-4 py-3 rounded-xl font-semibold transition-smooth hover:bg-muted ${
                    isActivePath('/contact') ? 'text-primary bg-muted' : 'text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
