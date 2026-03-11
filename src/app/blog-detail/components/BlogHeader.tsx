import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface BlogHeaderProps {
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    avatarAlt: string;
  };
  publishDate: string;
  readTime: number;
  category: string;
  tags?: string[];
}

const BlogHeader = ({ title, excerpt, author, publishDate, readTime, category, tags }: BlogHeaderProps) => {
  return (
    <div className="mb-12 animate-slide-down">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          {category}
        </span>
        <span className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Reader Favorite
        </span>
      </div>

      <h1 className="mb-6 font-heading text-4xl font-bold text-foreground text-balance md:text-5xl lg:text-6xl">
        {title}
      </h1>

      <p className="mb-8 max-w-3xl text-lg leading-relaxed text-card-foreground sm:text-xl">
        {excerpt}
      </p>

      <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-border bg-background/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-primary/20">
            <AppImage src={author.avatar} alt={author.avatarAlt} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Written by</p>
            <p className="font-semibold text-foreground">{author.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2">
            <Icon name="CalendarDaysIcon" size={16} className="text-primary" />
            {publishDate}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2">
            <Icon name="ClockIcon" size={16} className="text-primary" />
            {readTime} min read
          </span>
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-muted/70 px-3 py-1 text-xs font-medium text-card-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogHeader;
