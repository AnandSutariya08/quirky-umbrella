import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import { blogsService } from '@/lib/blogs';
import BlogDetailContent from './components/BlogDetailContent';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

// Enable ISR - revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const blog = await blogsService.getBySlug(params.slug);

    if (!blog || blog.status !== 'published') {
      return {
        title: 'Blog Post Not Found - Quirky Umbrella',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    return {
      title: `${blog.title} - Quirky Umbrella Blog`,
      description: blog.excerpt,
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        images: [
          {
            url: blog.featuredImage,
            alt: blog.featuredImageAlt,
          },
        ],
        type: 'article',
        publishedTime: blog.publishedDate?.toISOString(),
        authors: [blog.author.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt,
        images: [blog.featuredImage],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post - Quirky Umbrella',
      description: 'Read our latest blog post.',
    };
  }
}

function BlogDetailLoading() {
  return (
    <div className="min-h-screen bg-transparent pt-28 sm:pt-32 md:pt-36 lg:pt-40pb-20">
      <div className="container mx-auto px-6">
        <article className="max-w-4xl mx-auto">
          <div className="h-12 bg-muted rounded-lg animate-pulse mb-6" />
          <div className="h-6 bg-muted rounded-lg animate-pulse mb-4 w-2/3" />
          <div className="relative h-96 rounded-lg overflow-hidden mb-12 bg-muted animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export default async function BlogPage({ params }: BlogPageProps) {
  let blog;

  try {
    blog = await blogsService.getBySlug(params.slug);
  } catch (error) {
    console.error('Error fetching blog:', error);
    notFound();
  }

  if (!blog || blog.status !== 'published') {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1">
        <Suspense fallback={<BlogDetailLoading />}>
          <BlogDetailContent blog={blog} />
        </Suspense>
      </main>
      <ClientFooter />
    </div>
  );
}
