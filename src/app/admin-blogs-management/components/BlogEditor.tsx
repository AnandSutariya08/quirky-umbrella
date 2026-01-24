'use client';

import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import type { Blog } from '@/types/blog';

interface BlogEditorProps {
  blog?: Blog;
  onSave: (data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => void;
  onCancel: () => void;
}

const BlogEditor = ({ blog, onSave, onCancel }: BlogEditorProps) => {
  const [formData, setFormData] = useState<Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>>(
    blog || {
      title: '',
      slug: '',
      excerpt: '',
      contentHtml: '',
      thumbnailUrl: '',
      thumbnailAlt: '',
      featuredImage: '',
      featuredImageAlt: '',
      category: '',
      tags: [],
      author: {
        name: '',
        avatar: '',
        avatarAlt: '',
      },
      readTime: 5,
      isFeatured: false,
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
    }
  );

  const [tagInput, setTagInput] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState(formData.thumbnailUrl);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(formData.featuredImage);
  const [authorAvatarPreview, setAuthorAvatarPreview] = useState(formData.author.avatar);
  const [seoScore, setSeoScore] = useState(0);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [publishedDate, setPublishedDate] = useState<string>('');
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const authorAvatarInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blog) {
      setFormData(blog);
      setThumbnailPreview(blog.thumbnailUrl);
      setFeaturedImagePreview(blog.featuredImage);
      setAuthorAvatarPreview(blog.author.avatar);
      if (blog.publishedDate) {
        setPublishedDate(new Date(blog.publishedDate).toISOString().split('T')[0]);
      }
      if (blog.scheduledDate) {
        setScheduledDate(new Date(blog.scheduledDate).toISOString().split('T')[0]);
      }
    }
  }, [blog]);

  useEffect(() => {
    if (contentRef.current && formData.contentHtml) {
      contentRef.current.innerHTML = formData.contentHtml;
    }
  }, []);

  useEffect(() => {
    calculateSeoScore();
  }, [formData.title, formData.metaTitle, formData.metaDescription, formData.contentHtml]);

  const calculateSeoScore = () => {
    let score = 0;
    if (formData.title.length > 0 && formData.title.length <= 60) score += 20;
    if (formData.metaTitle.length > 0 && formData.metaTitle.length <= 60) score += 20;
    if (formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160) score += 30;
    if (formData.contentHtml.length > 300) score += 30;
    setSeoScore(score);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAuthorChange = (field: 'name' | 'avatar' | 'avatarAlt', value: string) => {
    setFormData(prev => ({
      ...prev,
      author: {
        ...prev.author,
        [field]: value,
      },
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    handleInputChange('title', value);
    if (!blog) {
      handleInputChange('slug', generateSlug(value));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleInputChange('tags', formData.tags.filter(t => t !== tag));
  };

  const handleImageUpload = (type: 'thumbnail' | 'featured' | 'authorAvatar', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (type === 'thumbnail') {
          setThumbnailPreview(imageUrl);
          handleInputChange('thumbnailUrl', imageUrl);
        } else if (type === 'featured') {
          setFeaturedImagePreview(imageUrl);
          handleInputChange('featuredImage', imageUrl);
        } else if (type === 'authorAvatar') {
          setAuthorAvatarPreview(imageUrl);
          handleAuthorChange('avatar', imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      handleInputChange('contentHtml', contentRef.current.innerHTML);
    }
  };

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const handleSubmit = (status: 'published' | 'draft' | 'scheduled') => {
    const finalData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'> = {
      ...formData,
      status,
      publishedDate: status === 'published' && publishedDate ? new Date(publishedDate) : undefined,
      scheduledDate: status === 'scheduled' && scheduledDate ? new Date(scheduledDate) : undefined,
    };
    onSave(finalData);
  };

  const getSeoScoreColor = () => {
    if (seoScore >= 80) return 'text-success';
    if (seoScore >= 50) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter blog title"
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="blog-post-slug"
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Author Name *
            </label>
            <input
              type="text"
              value={formData.author.name}
              onChange={(e) => handleAuthorChange('name', e.target.value)}
              placeholder="Author name"
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Read Time (minutes) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.readTime}
              onChange={(e) => handleInputChange('readTime', parseInt(e.target.value) || 5)}
              placeholder="5"
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
              required
            >
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Development">Development</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add tag and press Enter"
              className="flex-1 px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-md font-medium transition-smooth hover:shadow-warm press-scale"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-foreground text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-error transition-smooth"
                >
                  <Icon name="XMarkIcon" size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Thumbnail Image (for listing) *
          </label>
          <div className="space-y-3">
            {thumbnailPreview && (
              <div className="w-full h-48 rounded-md overflow-hidden border border-border">
                <AppImage
                  src={thumbnailPreview}
                  alt={formData.thumbnailAlt || "Thumbnail preview"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="text"
              value={formData.thumbnailAlt}
              onChange={(e) => handleInputChange('thumbnailAlt', e.target.value)}
              placeholder="Thumbnail alt text (required for accessibility)"
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
              required
            />
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('thumbnail', e)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md font-medium text-foreground hover:bg-muted transition-smooth press-scale"
            >
              <Icon name="PhotoIcon" size={20} className="inline mr-2" />
              Upload Thumbnail
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Featured Image (for detail page) *
          </label>
          <div className="space-y-3">
            {featuredImagePreview && (
              <div className="w-full h-48 rounded-md overflow-hidden border border-border">
                <AppImage
                  src={featuredImagePreview}
                  alt={formData.featuredImageAlt || "Featured image preview"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="text"
              value={formData.featuredImageAlt}
              onChange={(e) => handleInputChange('featuredImageAlt', e.target.value)}
              placeholder="Featured image alt text (required for accessibility)"
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
              required
            />
            <input
              ref={featuredImageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('featured', e)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => featuredImageInputRef.current?.click()}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md font-medium text-foreground hover:bg-muted transition-smooth press-scale"
            >
              <Icon name="PhotoIcon" size={20} className="inline mr-2" />
              Upload Featured Image
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Author Avatar
          </label>
          <div className="space-y-3">
            {authorAvatarPreview && (
              <div className="w-24 h-24 rounded-full overflow-hidden border border-border">
                <AppImage
                  src={authorAvatarPreview}
                  alt={formData.author.avatarAlt || "Author avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="text"
              value={formData.author.avatarAlt}
              onChange={(e) => handleAuthorChange('avatarAlt', e.target.value)}
              placeholder="Author avatar alt text"
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
            />
            <input
              ref={authorAvatarInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('authorAvatar', e)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => authorAvatarInputRef.current?.click()}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md font-medium text-foreground hover:bg-muted transition-smooth press-scale"
            >
              <Icon name="PhotoIcon" size={20} className="inline mr-2" />
              Upload Author Avatar
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
            className="w-4 h-4 text-primary focus:ring-primary"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-foreground">
            Mark as Featured
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Excerpt
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            placeholder="Brief summary for listing pages"
            rows={3}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth resize-none"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Content Editor</h3>
        
        <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md border border-border">
          <button
            type="button"
            onClick={() => applyFormatting('bold')}
            className="p-2 hover:bg-background rounded transition-smooth press-scale"
            title="Bold"
          >
            <Icon name="BoldIcon" size={18} className="text-foreground" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('italic')}
            className="p-2 hover:bg-background rounded transition-smooth press-scale"
            title="Italic"
          >
            <Icon name="ItalicIcon" size={18} className="text-foreground" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('underline')}
            className="p-2 hover:bg-background rounded transition-smooth press-scale"
            title="Underline"
          >
            <Icon name="UnderlineIcon" size={18} className="text-foreground" />
          </button>
          <div className="w-px bg-border" />
          <button
            type="button"
            onClick={() => applyFormatting('insertUnorderedList')}
            className="p-2 hover:bg-background rounded transition-smooth press-scale"
            title="Bullet List"
          >
            <Icon name="ListBulletIcon" size={18} className="text-foreground" />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('insertOrderedList')}
            className="p-2 hover:bg-background rounded transition-smooth press-scale"
            title="Numbered List"
          >
            <Icon name="NumberedListIcon" size={18} className="text-foreground" />
          </button>
          <div className="w-px bg-border" />
          <button
            type="button"
            onClick={() => applyFormatting('formatBlock', 'h2')}
            className="px-3 py-2 hover:bg-background rounded transition-smooth press-scale text-sm font-medium"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('formatBlock', 'h3')}
            className="px-3 py-2 hover:bg-background rounded transition-smooth press-scale text-sm font-medium"
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('formatBlock', 'p')}
            className="px-3 py-2 hover:bg-background rounded transition-smooth press-scale text-sm font-medium"
            title="Paragraph"
          >
            P
          </button>
        </div>

        <div
          ref={contentRef}
          contentEditable
          onInput={handleContentChange}
          className="min-h-[400px] p-6 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth prose prose-sm max-w-none"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            lineHeight: '1.65',
          }}
        />
        <p className="text-sm text-muted-foreground">
          {formData.contentHtml.length} characters
        </p>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">SEO Optimization</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Score:</span>
            <span className={`text-lg font-bold ${getSeoScoreColor()}`}>{seoScore}/100</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Meta Title ({formData.metaTitle.length}/60)
          </label>
          <input
            type="text"
            value={formData.metaTitle}
            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
            placeholder="SEO-optimized title"
            maxLength={60}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Meta Description ({formData.metaDescription.length}/160)
          </label>
          <textarea
            value={formData.metaDescription}
            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
            placeholder="Compelling description for search results"
            maxLength={160}
            rows={3}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth resize-none"
          />
        </div>

        <div className="p-4 bg-muted rounded-md">
          <h4 className="text-sm font-semibold text-foreground mb-2">Search Preview</h4>
          <div className="space-y-1">
            <div className="text-secondary text-sm">
              {formData.metaTitle || 'Your blog title will appear here'}
            </div>
            <div className="text-xs text-success">
              https://quirkyumbrella.com/blog/{formData.slug || 'your-slug'}
            </div>
            <div className="text-sm text-muted-foreground">
              {formData.metaDescription || 'Your meta description will appear here'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Publishing Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Publish Date
            </label>
            <input
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Scheduled Date (for scheduled posts)
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:outline-none focus:ring-2 ring-accent ring-offset-2 ring-offset-background transition-smooth"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-background border border-input text-foreground rounded-md font-medium transition-smooth hover:bg-muted press-scale"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('draft')}
          className="px-6 py-3 bg-muted text-foreground rounded-md font-medium transition-smooth hover:bg-muted/80 press-scale"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('scheduled')}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
        >
          Schedule
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('published')}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
        >
          Publish Now
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;