'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import type { Blog } from '@/types/blog';

interface BlogsTableProps {
  blogs: Blog[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBulkAction: (action: string, ids: string[]) => void;
}

const formatDate = (date: Date | undefined): string => {
  if (!date) return 'Not published';
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};

const BlogsTable = ({ blogs, onEdit, onDelete, onBulkAction }: BlogsTableProps) => {
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bulkAction, setBulkAction] = useState<string>('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBlogs(filteredBlogs.map((blog) => blog.id || '').filter((id) => id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleSelectBlog = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedBlogs([...selectedBlogs, id]);
    } else {
      setSelectedBlogs(selectedBlogs.filter((blogId) => blogId !== id));
    }
  };

  const handleBulkActionSubmit = () => {
    if (bulkAction && selectedBlogs.length > 0) {
      onBulkAction(bulkAction, selectedBlogs);
      setSelectedBlogs([]);
      setBulkAction('');
    }
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

  const categories = Array.from(new Set(blogs.map((blog) => blog.category)));

  const filteredBlogs = blogs.filter((blog) => {
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || blog.category === filterCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Icon
              name="MagnifyingGlassIcon"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {selectedBlogs.length > 0 && (
          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="flex-1 lg:flex-initial px-4 py-2.5 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
            >
              <option value="">Bulk Actions</option>
              <option value="publish">Publish</option>
              <option value="unpublish">Unpublish</option>
              <option value="delete">Delete</option>
            </select>
            <button
              onClick={handleBulkActionSubmit}
              disabled={!bulkAction}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="hidden lg:block bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedBlogs.length === filteredBlogs.length && filteredBlogs.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-input accent-primary cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Blog Post
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Published
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Engagement
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-muted/50 transition-smooth">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedBlogs.includes(blog.id)}
                      onChange={(e) => handleSelectBlog(blog.id, e.target.checked)}
                      className="w-4 h-4 rounded border-input accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <AppImage
                          src={blog.featuredImage}
                          alt={blog.featuredImageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">{blog.title}</div>
                        <div className="text-sm text-muted-foreground truncate">{blog.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{blog.author.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 bg-muted text-foreground text-xs font-medium rounded-full">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {formatDate(blog.publishedDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(blog.status)}`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="EyeIcon" size={16} />
                        <span>{blog.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="HeartIcon" size={16} />
                        <span>{blog.likes || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(blog.id || '')}
                        className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
                        title="Edit blog"
                      >
                        <Icon name="PencilIcon" size={18} className="text-foreground" />
                      </button>
                      <a
                        href={`/blogs/${blog.slug}`}
                        target="_blank"
                        className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
                        title="Preview blog"
                      >
                        <Icon name="EyeIcon" size={18} className="text-foreground" />
                      </a>
                      <button
                        className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
                        title="View analytics"
                      >
                        <Icon name="ChartBarIcon" size={18} className="text-foreground" />
                      </button>
                      <button
                        onClick={() => onDelete(blog.id || '')}
                        className="p-2 hover:bg-error/10 rounded-md transition-smooth press-scale"
                        title="Delete blog"
                      >
                        <Icon name="TrashIcon" size={18} className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="bg-card rounded-lg border border-border p-4 space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedBlogs.includes(blog.id || '')}
                onChange={(e) => handleSelectBlog(blog.id || '', e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-input accent-primary cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <AppImage
                      src={blog.thumbnailUrl}
                      alt={blog.thumbnailAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground mb-1 line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{blog.slug}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Author</div>
                    <div className="text-sm text-foreground">{blog.author.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Category</div>
                    <span className="inline-flex px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full">
                      {blog.category}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Published</div>
                    <div className="text-sm text-foreground">{formatDate(blog.publishedDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(blog.status)}`}
                    >
                      {blog.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon name="EyeIcon" size={16} />
                    <span>{blog.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="HeartIcon" size={16} />
                    <span>{blog.likes || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(blog.id || '')}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-smooth hover:shadow-warm press-scale"
                  >
                    Edit
                  </button>
                  <a
                    href={`/blogs/${blog.slug}`}
                    target="_blank"
                    className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
                    title="Preview blog"
                  >
                    <Icon name="EyeIcon" size={20} className="text-foreground" />
                  </a>
                  <button
                    className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
                    title="View analytics"
                  >
                    <Icon name="ChartBarIcon" size={20} className="text-foreground" />
                  </button>
                  <button
                    onClick={() => onDelete(blog.id || '')}
                    className="p-2 hover:bg-error/10 rounded-md transition-smooth press-scale"
                    title="Delete blog"
                  >
                    <Icon name="TrashIcon" size={20} className="text-error" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Icon name="DocumentTextIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No blogs found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

export default BlogsTable;
