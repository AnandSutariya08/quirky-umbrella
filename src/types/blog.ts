export interface BlogAuthor {
  name: string;
  avatar: string;
  avatarAlt: string;
}

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  featuredImage: string;
  featuredImageAlt: string;
  category: string;
  tags: string[];
  author: BlogAuthor;
  readTime: number; // in minutes
  isFeatured: boolean;
  status: 'published' | 'draft' | 'scheduled';
  metaTitle: string;
  metaDescription: string;
  publishedDate?: Date;
  scheduledDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  views?: number;
  likes?: number;
}
