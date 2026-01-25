'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function BlogDetailRedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const slug = searchParams.get('slug');
    if (slug) {
      // Redirect to new clean URL format
      router.replace(`/blogs/${slug}`);
    } else {
      // If no slug, redirect to blog listing
      router.replace('/blogs');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}

export default function BlogDetailRedirect() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <BlogDetailRedirectContent />
    </Suspense>
  );
}
