interface BlogContentProps {
  contentHtml: string;
}

const BlogContent = ({ contentHtml }: BlogContentProps) => {
  return (
    <div
      className="prose prose-lg lg:prose-xl max-w-none mb-0 text-foreground
        prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground prose-headings:text-balance
        prose-h2:relative prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:border-b prose-h2:border-border prose-h2:pb-3 prose-h2:before:absolute prose-h2:before:-left-4 prose-h2:before:top-3 prose-h2:before:h-8 prose-h2:before:w-1 prose-h2:before:rounded-full prose-h2:before:bg-primary/60
        prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-card-foreground
        prose-p:text-foreground prose-p:leading-[1.95] prose-p:mb-7
        prose-a:text-primary prose-a:font-semibold prose-a:no-underline prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:my-8 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-3
        prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-3
        prose-li:text-foreground
        prose-blockquote:my-10 prose-blockquote:rounded-2xl prose-blockquote:border prose-blockquote:border-primary/20 prose-blockquote:bg-primary/5 prose-blockquote:px-6 prose-blockquote:py-5 prose-blockquote:italic prose-blockquote:text-card-foreground
        prose-code:rounded prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:text-sm prose-code:font-mono prose-code:text-foreground
        prose-pre:rounded-xl prose-pre:bg-muted prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:shadow-neutral
        prose-img:my-10 prose-img:rounded-2xl prose-img:shadow-neutral-md prose-img:ring-1 prose-img:ring-border
        [&>p:first-of-type]:text-xl [&>p:first-of-type]:leading-[1.85] [&>p:first-of-type]:text-card-foreground
        [&>p:first-of-type:first-letter]:float-left [&>p:first-of-type:first-letter]:mr-3 [&>p:first-of-type:first-letter]:mt-2 [&>p:first-of-type:first-letter]:font-heading [&>p:first-of-type:first-letter]:text-6xl [&>p:first-of-type:first-letter]:font-bold [&>p:first-of-type:first-letter]:text-primary
        [&_.blog-note]:my-8 [&_.blog-note]:rounded-xl [&_.blog-note]:border [&_.blog-note]:border-border [&_.blog-note]:bg-muted/60 [&_.blog-note]:p-5 [&_.blog-note]:shadow-sm [&_.blog-note_strong]:mr-2"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
};

export default BlogContent;
