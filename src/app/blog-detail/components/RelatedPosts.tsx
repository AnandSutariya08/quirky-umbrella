import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  alt: string;
  readTime: number;
  publishDate: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  return (
    <section className="mt-20 pt-16 border-t border-border">
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blogs/${post.slug}`}
            className="group bg-card rounded-lg overflow-hidden shadow-neutral hover:shadow-neutral-lg transition-smooth hover:-translate-y-2"
          >
            <div className="relative h-56 overflow-hidden">
              <AppImage
                src={post.image}
                alt={post.alt}
                className="w-full h-full object-cover transition-smooth group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-smooth">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="CalendarIcon" size={16} />
                  <span>{post.publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="ClockIcon" size={16} />
                  <span>{post.readTime} min</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;