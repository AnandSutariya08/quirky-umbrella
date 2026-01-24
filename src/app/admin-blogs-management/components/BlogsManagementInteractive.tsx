'use client';

import { useState, useEffect } from 'react';
import BlogsTable from './BlogsTable';
import BlogEditor from './BlogEditor';
import Icon from '@/components/ui/AppIcon';
import { blogsService } from '@/lib/blogs';
import type { Blog } from '@/types/blog';

const BlogsManagementInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      fetchBlogs();
    }
  }, [isHydrated]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const fetchedBlogs = await blogsService.getAll();
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showNotification('error', 'Failed to load blogs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCreateNew = () => {
    setEditingBlog(undefined);
    setIsEditing(true);
  };

  const handleEdit = (id: string) => {
    const blog = blogs.find(b => b.id === id);
    setEditingBlog(blog);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setDeletingBlogId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deletingBlogId) {
      try {
        await blogsService.delete(deletingBlogId);
        setBlogs(blogs.filter(blog => blog.id !== deletingBlogId));
        setShowDeleteConfirm(false);
        setDeletingBlogId(null);
        showNotification('success', 'Blog deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        showNotification('error', 'Failed to delete blog. Please try again.');
      }
    }
  };

  const handleSave = async (data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
    try {
      if (editingBlog && editingBlog.id) {
        await blogsService.update(editingBlog.id, data);
        showNotification('success', 'Blog updated successfully');
      } else {
        await blogsService.create(data);
        showNotification('success', 'Blog created successfully');
      }
      
      await fetchBlogs();
      setIsEditing(false);
      setEditingBlog(undefined);
    } catch (error) {
      console.error('Error saving blog:', error);
      showNotification('error', 'Failed to save blog. Please try again.');
    }
  };

  const handleBulkAction = async (action: string, ids: string[]) => {
    try {
      if (action === 'delete') {
        await Promise.all(ids.map(id => blogsService.delete(id)));
        showNotification('success', `${ids.length} blog(s) deleted successfully`);
      } else {
        const status = action === 'publish' ? 'published' : 'draft';
        await Promise.all(
          ids.map(id => blogsService.update(id, { status: status as 'published' | 'draft' }))
        );
        showNotification('success', `${ids.length} blog(s) updated successfully`);
      }
      await fetchBlogs();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      showNotification('error', 'Failed to perform action. Please try again.');
    }
  };

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blogs management...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isEditing ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Blogs Management
              </h1>
              <p className="text-muted-foreground">
                Create, edit, and manage your blog content with advanced publishing tools
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale flex items-center justify-center gap-2"
            >
              <Icon name="PlusIcon" size={20} />
              Create New Post
            </button>
          </div>

          {notification && (
            <div
              className={`flex items-center gap-3 p-4 rounded-md animate-slide-down ${
                notification.type === 'success' ?'bg-success/10 text-success' :'bg-error/10 text-error'
              }`}
            >
              <Icon
                name={notification.type === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'}
                size={20}
              />
              <span className="font-medium">{notification.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="DocumentTextIcon" size={24} className="text-success" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {blogs.filter(b => b.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">Published Posts</div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="PencilIcon" size={24} className="text-warning" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {blogs.filter(b => b.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">Draft Posts</div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name="ClockIcon" size={24} className="text-secondary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {blogs.filter(b => b.status === 'scheduled').length}
              </div>
              <div className="text-sm text-muted-foreground">Scheduled Posts</div>
            </div>
          </div>

          <BlogsTable
            blogs={blogs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkAction={handleBulkAction}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingBlog(undefined);
              }}
              className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
            >
              <Icon name="ArrowLeftIcon" size={24} className="text-foreground" />
            </button>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <p className="text-muted-foreground">
                {editingBlog ? 'Update your blog content and settings' : 'Create engaging content for your audience'}
              </p>
            </div>
          </div>

          <BlogEditor
            blog={editingBlog}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setEditingBlog(undefined);
            }}
          />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full animate-slide-down">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="ExclamationTriangleIcon" size={24} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Delete Blog Post</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this blog post? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingBlogId(null);
                }}
                className="px-6 py-2.5 bg-background border border-input text-foreground rounded-md font-medium transition-smooth hover:bg-muted press-scale"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 bg-error text-error-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogsManagementInteractive;