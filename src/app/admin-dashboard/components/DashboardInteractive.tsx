'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { servicesService } from '@/lib/services';
import { blogsService } from '@/lib/blogs';
import type { Blog } from '@/types/blog';
import type { Service } from '@/types/service';

const DashboardInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    scheduledBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [recentServices, setRecentServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      fetchDashboardData();
    }
  }, [isHydrated]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch services
      const services = await servicesService.getAll();
      const activeServices = services.filter((s) => s.isActive);

      // Fetch blogs
      const blogs = await blogsService.getAll();
      const publishedBlogs = blogs.filter((b) => b.status === 'published');
      const draftBlogs = blogs.filter((b) => b.status === 'draft');
      const scheduledBlogs = blogs.filter((b) => b.status === 'scheduled');

      // Calculate engagement metrics
      const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
      const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);

      setStats({
        totalServices: services.length,
        activeServices: activeServices.length,
        totalBlogs: blogs.length,
        publishedBlogs: publishedBlogs.length,
        draftBlogs: draftBlogs.length,
        scheduledBlogs: scheduledBlogs.length,
        totalViews,
        totalLikes,
      });

      // Get recent items (last 5)
      setRecentBlogs(blogs.slice(0, 5));
      setRecentServices(services.slice(0, 5));
      setAllServices(services);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success/10 text-success';
      case 'draft':
        return 'bg-warning/10 text-warning';
      case 'scheduled':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-12 bg-card rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-card rounded animate-pulse" />
            ))}
          </div>
          <div className="h-96 bg-card rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your website content and engagement metrics
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow-neutral-md p-6">
                <div className="h-20 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Services Card */}
              <div className="bg-card rounded-lg shadow-neutral-md p-6 hover:shadow-warm-md transition-smooth border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                    <h3 className="text-3xl font-bold text-foreground mt-1">
                      {stats.totalServices}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {stats.activeServices} active
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon name="BriefcaseIcon" size={24} className="text-primary" />
                  </div>
                </div>
                <Link
                  href="/admin-services-management"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1 font-medium"
                >
                  Manage Services
                  <Icon name="ArrowRightIcon" size={16} />
                </Link>
              </div>

              {/* Blogs Card */}
              <div className="bg-card rounded-lg shadow-neutral-md p-6 hover:shadow-warm-md transition-smooth border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Blogs</p>
                    <h3 className="text-3xl font-bold text-foreground mt-1">{stats.totalBlogs}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {stats.publishedBlogs} published
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <Icon name="DocumentTextIcon" size={24} className="text-secondary" />
                  </div>
                </div>
                <Link
                  href="/admin-blogs-management"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1 font-medium"
                >
                  Manage Blogs
                  <Icon name="ArrowRightIcon" size={16} />
                </Link>
              </div>

              {/* Views Card */}
              <div className="bg-card rounded-lg shadow-neutral-md p-6 hover:shadow-warm-md transition-smooth border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                    <h3 className="text-3xl font-bold text-foreground mt-1">
                      {stats.totalViews.toLocaleString()}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">Across all blogs</p>
                  </div>
                  <div className="p-3 bg-success/10 rounded-full">
                    <Icon name="EyeIcon" size={24} className="text-success" />
                  </div>
                </div>
              </div>

              {/* Likes Card */}
              <div className="bg-card rounded-lg shadow-neutral-md p-6 hover:shadow-warm-md transition-smooth border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                    <h3 className="text-3xl font-bold text-foreground mt-1">
                      {stats.totalLikes.toLocaleString()}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">Blog engagement</p>
                  </div>
                  <div className="p-3 bg-error/10 rounded-full">
                    <Icon name="HeartIcon" size={24} className="text-error" />
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Status Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg shadow-neutral-md p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Published</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">
                      {stats.publishedBlogs}
                    </h3>
                  </div>
                  <div className="p-3 bg-success/10 rounded-full">
                    <Icon name="CheckCircleIcon" size={20} className="text-success" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-neutral-md p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">{stats.draftBlogs}</h3>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-full">
                    <Icon name="PencilIcon" size={20} className="text-warning" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-neutral-md p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">
                      {stats.scheduledBlogs}
                    </h3>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <Icon name="ClockIcon" size={20} className="text-secondary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Blogs */}
              <div className="bg-card rounded-lg shadow-neutral-md p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Recent Blogs</h2>
                  <Link
                    href="/admin-blogs-management"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View All
                    <Icon name="ArrowRightIcon" size={14} />
                  </Link>
                </div>
                {recentBlogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="DocumentTextIcon" size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No blogs yet</p>
                    <Link
                      href="/admin-blogs-management"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Create your first blog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentBlogs.map((blog) => (
                      <Link
                        key={blog.id}
                        href={`/admin-blogs-management`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth group"
                      >
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <AppImage
                            src={blog.thumbnailUrl}
                            alt={blog.thumbnailAlt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-smooth">
                            {blog.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(blog.status)}`}
                            >
                              {blog.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(blog.publishedDate || blog.createdAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Services */}
              <div className="bg-card rounded-lg shadow-neutral-md p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Recent Services</h2>
                  <Link
                    href="/admin-services-management"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View All
                    <Icon name="ArrowRightIcon" size={14} />
                  </Link>
                </div>
                {recentServices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="BriefcaseIcon" size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No services yet</p>
                    <Link
                      href="/admin-services-management"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Create your first service
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentServices.map((service) => (
                      <Link
                        key={service.id}
                        href={`/admin-services-management`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth group"
                      >
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                          <Icon name="BriefcaseIcon" size={24} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-smooth">
                            {service.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${service.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}
                            >
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(service.createdAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Services Log/List */}
            <div className="bg-card rounded-lg shadow-neutral-md p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Services Log</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete list of all services
                  </p>
                </div>
                <Link
                  href="/admin-services-management"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1 font-medium"
                >
                  Manage All
                  <Icon name="ArrowRightIcon" size={16} />
                </Link>
              </div>

              {allServices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="BriefcaseIcon" size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-sm mb-2">No services found</p>
                  <Link
                    href="/admin-services-management"
                    className="text-sm text-primary hover:underline inline-block"
                  >
                    Create your first service
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Service
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Tagline
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Created
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Updated
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {allServices.map((service) => (
                        <tr key={service.id} className="hover:bg-muted/30 transition-smooth">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Icon name="BriefcaseIcon" size={20} className="text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{service.title}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  /{service.slug}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                              {service.tagline}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                service.isActive
                                  ? 'bg-success/10 text-success'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {formatDate(service.createdAt)}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {formatDate(service.updatedAt)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin-services-management`}
                                className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
                                title="Manage service"
                              >
                                <Icon name="PencilIcon" size={18} className="text-foreground" />
                              </Link>
                              <a
                                href={`/services/${service.slug}`}
                                target="_blank"
                                className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
                                title="View service"
                              >
                                <Icon name="EyeIcon" size={18} className="text-foreground" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {allServices.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <Link
                    href="/admin-services-management"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-foreground transition-smooth"
                  >
                    <Icon name="ArrowRightIcon" size={16} />
                    Manage All Services
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg shadow-neutral-md p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin-blogs-management"
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon name="PlusIcon" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-smooth">
                      Create Blog
                    </h3>
                    <p className="text-sm text-muted-foreground">Add a new blog post</p>
                  </div>
                </Link>

                <Link
                  href="/admin-services-management"
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth group"
                >
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Icon name="PlusIcon" size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground group-hover:text-secondary transition-smooth">
                      Add Service
                    </h3>
                    <p className="text-sm text-muted-foreground">Create a new service</p>
                  </div>
                </Link>

                <Link
                  href="/home"
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth group"
                >
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Icon name="GlobeAltIcon" size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground group-hover:text-accent transition-smooth">
                      View Website
                    </h3>
                    <p className="text-sm text-muted-foreground">Preview your site</p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardInteractive;
