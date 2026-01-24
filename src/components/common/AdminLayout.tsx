'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AdminFooter from './AdminFooter';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  
  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('adminAuthenticated') === 'true';
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        router.push('/admin-login');
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);

  // NOW WE CAN DO CONDITIONAL RETURNS
  
  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="ArrowPathIcon" size={48} className="text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (prevents flash during redirect)
  if (!isAuthenticated) {
    return null;
  }

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/admin-dashboard',
      icon: 'HomeIcon',
    },
    {
      title: 'Services',
      href: '/admin-services-management',
      icon: 'BriefcaseIcon',
    },
    {
      title: 'Blogs',
      href: '/admin-blogs-management',
      icon: 'DocumentTextIcon',
    },
    {
      title: 'Growth Audit',
      href: '/admin-growth-audit',
      icon: 'ChartBarIcon',
    },
    {
      title: 'Bookings',
      href: '/admin-bookings',
      icon: 'CalendarIcon',
    },
  ];

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const handleBackToWebsite = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    document.cookie = 'adminAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/home');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={`hidden lg:block lg:fixed top-0 left-0 h-screen bg-card border-r border-border transition-all duration-300 z-[100] ${isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-6 border-b border-border">
            {!isSidebarCollapsed && (
              <Link
                href="/admin-dashboard"
                className="flex items-center gap-3 transition-smooth hover:opacity-80"
              >
                <img
                  src="/assets/images/ImageToStl.com_QU_Logo-1768912371539.png"
                  alt="Quirky Umbrella Admin Logo"
                  className="h-8 w-auto"
                />
              </Link>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon
                name={isSidebarCollapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'}
                size={20}
                className="text-foreground"
              />
            </button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-smooth press-scale
  ${isActivePath(item.href)
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                  }
  ${isSidebarCollapsed ? "justify-center" : ""}
`}

                title={isSidebarCollapsed ? item.title : undefined}
              >
                <Icon name={item.icon as any} size={20} />
                {!isSidebarCollapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <a
              href="/home"
              onClick={handleBackToWebsite}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium text-foreground transition-smooth hover:bg-muted press-scale ${isSidebarCollapsed ? 'justify-center' : ''
                }`}
              title={isSidebarCollapsed ? 'Back to Website' : undefined}
            >
              <Icon name="ArrowLeftIcon" size={20} />
              {!isSidebarCollapsed && <span>Back to Website</span>}
            </a>
          </div>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-[100] flex items-center justify-between px-6">
        <Link
          href="/admin-dashboard"
          className="flex items-center gap-3 transition-smooth hover:opacity-80"
        >
          <img
            src="/assets/images/ImageToStl.com_QU_Logo-1768912371539.png"
            alt="Quirky Umbrella Admin Logo"
            className="h-8 w-auto"
          />
        </Link>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
          aria-label="Toggle mobile menu"
        >
          <Icon
            name={isMobileSidebarOpen ? 'XMarkIcon' : 'Bars3Icon'}
            size={24}
            className="text-foreground"
          />
        </button>
      </div>

      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-card z-[99] overflow-y-auto animate-slide-down">
          <nav className="px-6 py-8 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-4 rounded-md font-medium transition-smooth
  ${isActivePath(item.href)
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                  }
`}

              >
                <Icon name={item.icon as any} size={20} />
                <span>{item.title}</span>
              </Link>
            ))}

            <div className="pt-6 mt-6 border-t border-border">
              <a
                href="/home"
                onClick={handleBackToWebsite}
                className="flex items-center gap-3 px-6 py-4 rounded-md font-medium text-foreground transition-smooth hover:bg-muted"
              >
                <Icon name="ArrowLeftIcon" size={20} />
                <span>Back to Website</span>
              </a>
            </div>
          </nav>
        </div>
      )}

      <main
        className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          } pt-16 lg:pt-0`}
      >
        {children}
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center px-6 animate-fade-in">
          <div className="bg-card border border-border rounded-lg shadow-warm-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Icon name="ExclamationTriangleIcon" size={24} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Confirm Logout</h3>
                <p className="text-muted-foreground">
                  Are you sure you want to leave the admin panel? You will need to log in again to access admin features.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-6 py-3 bg-muted text-foreground rounded-md font-medium transition-smooth hover:bg-muted/80 press-scale"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md hover:-translate-y-0.5 press-scale"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;