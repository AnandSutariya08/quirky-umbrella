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
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-[1000] ${className}`}
    >
      <div
        className={`mx-auto transition-all duration-700 ease-in-out ${
          isScrolled
            ? 'mt-4 w-[95%] max-w-7xl rounded-3xl backdrop-blur-xl bg-card/80 border border-border/50 shadow-lg'
            : 'w-full bg-card shadow-neutral-md'
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20 px-6">
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
                isActivePath('/home')
                  ? 'text-primary bg-muted' :'text-foreground'
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
                  <DropdownMenu
                    collection="services"
                    onClose={() => setActiveDropdown(null)}
                  />
                </div>
              )}
            </div>

            <Link
              href="/about-us"
              className={`px-6 py-3 rounded-md font-medium transition-smooth hover:bg-muted press-scale ${
                isActivePath('/about-us')
                  ? 'text-primary bg-muted' :'text-foreground'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/discuss"
              className={`px-6 py-3 rounded-md font-medium transition-smooth hover:bg-muted press-scale ${
                isActivePath('/discuss')
                  ? 'text-primary bg-muted' :'text-foreground'
              }`}
            >
              Discuss
            </Link>

            <Link
              href="/blogs"
              className={`px-6 py-3 rounded-md font-medium transition-smooth hover:bg-muted press-scale ${
                isActivePath('/blogs')
                  ? 'text-primary bg-muted' :'text-foreground'
              }`}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className="ml-4 px-7 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md hover:-translate-y-0.5 press-scale"
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
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-smooth press-scale"
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

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-card z-[999] overflow-y-auto animate-slide-down">
          <nav className="container mx-auto px-6 py-8 space-y-2">
            <Link
              href="/home"
              className={`block px-6 py-4 rounded-md font-medium transition-smooth hover:bg-muted ${
                isActivePath('/home')
                  ? 'text-primary bg-muted' :'text-foreground'
              }`}
            >
              Home
            </Link>

            <div>
              <button
                onClick={() => toggleDropdown('services-mobile')}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-md font-medium transition-smooth hover:bg-muted ${
                  activeDropdown === 'services-mobile' ? 'bg-muted text-primary' : 'text-foreground'
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
                <div className="mt-2 pl-6">
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
              className={`block px-6 py-4 rounded-md font-medium transition-smooth hover:bg-muted ${
                isActivePath('/about-us')
                  ? 'text-primary bg-muted' :'text-foreground'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/discuss"
              className={`block px-6 py-4 rounded-md font-medium transition-smooth hover:bg-muted ${
                isActivePath('/discuss')
                  ? 'text-primary bg-muted' :'text-foreground'
              }`}
            >
              Discuss
            </Link>

            <Link
              href="/blogs"
              className={`block px-6 py-4 rounded-md font-medium transition-smooth hover:bg-muted ${
                isActivePath('/blogs')
                  ? 'text-primary bg-muted' :'text-foreground'
              }`}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className="block mt-6 px-7 py-4 bg-primary text-primary-foreground rounded-md font-medium text-center transition-smooth hover:shadow-warm-md press-scale"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;