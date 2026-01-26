interface BlogContentProps {
  contentHtml: string;
}

const BlogContent = ({ contentHtml }: BlogContentProps) => {
  return (
    <div
      className="prose prose-lg max-w-none mb-16
        prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
        prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
        prose-li:text-foreground prose-li:mb-2
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
        prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-muted prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-img:rounded-lg prose-img:shadow-neutral-md prose-img:my-8"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
};

export default BlogContent;
