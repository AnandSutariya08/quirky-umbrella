'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SocialShareProps {
  title: string;
  url: string;
}

const SocialShare = ({ title, url }: SocialShareProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleShare = (platform: string) => {
    if (!isHydrated) return;

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    if (!isHydrated) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center gap-4 py-8 border-y border-border">
        <span className="text-sm font-medium text-muted-foreground">Share this article:</span>
        <div className="flex gap-3">
          <button className="p-3 rounded-full bg-muted text-foreground transition-smooth">
            <Icon name="ShareIcon" size={20} />
          </button>
          <button className="p-3 rounded-full bg-muted text-foreground transition-smooth">
            <Icon name="ShareIcon" size={20} />
          </button>
          <button className="p-3 rounded-full bg-muted text-foreground transition-smooth">
            <Icon name="ShareIcon" size={20} />
          </button>
          <button className="p-3 rounded-full bg-muted text-foreground transition-smooth">
            <Icon name="LinkIcon" size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-8 border-y border-border">
      <span className="text-sm font-medium text-muted-foreground">Share this article:</span>
      <div className="flex gap-3">
        <button
          onClick={() => handleShare('twitter')}
          className="p-3 rounded-full bg-muted text-foreground transition-smooth hover:bg-secondary hover:text-secondary-foreground hover:-translate-y-1 press-scale"
          aria-label="Share on Twitter"
        >
          <Icon name="ShareIcon" size={20} />
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="p-3 rounded-full bg-muted text-foreground transition-smooth hover:bg-secondary hover:text-secondary-foreground hover:-translate-y-1 press-scale"
          aria-label="Share on Facebook"
        >
          <Icon name="ShareIcon" size={20} />
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="p-3 rounded-full bg-muted text-foreground transition-smooth hover:bg-secondary hover:text-secondary-foreground hover:-translate-y-1 press-scale"
          aria-label="Share on LinkedIn"
        >
          <Icon name="ShareIcon" size={20} />
        </button>
        <button
          onClick={handleCopyLink}
          className="p-3 rounded-full bg-muted text-foreground transition-smooth hover:bg-accent hover:text-accent-foreground hover:-translate-y-1 press-scale relative"
          aria-label="Copy link"
        >
          <Icon name={copied ? 'CheckIcon' : 'LinkIcon'} size={20} />
          {copied && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap">
              Link copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SocialShare;