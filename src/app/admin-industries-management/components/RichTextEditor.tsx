'use client';

import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const insertFormatting = (before: string, after: string = '') => {
    if (!editorRef.current || !isHydrated) return;

    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: 'BoldIcon', label: 'Bold', action: () => insertFormatting('<strong>', '</strong>') },
    { icon: 'ItalicIcon', label: 'Italic', action: () => insertFormatting('<em>', '</em>') },
    { icon: 'UnderlineIcon', label: 'Underline', action: () => insertFormatting('<u>', '</u>') },
    { icon: 'ListBulletIcon', label: 'Bullet List', action: () => insertFormatting('<ul>\n  <li>', '</li>\n</ul>') },
    { icon: 'NumberedListIcon', label: 'Numbered List', action: () => insertFormatting('<ol>\n  <li>', '</li>\n</ol>') },
    { icon: 'LinkIcon', label: 'Link', action: () => insertFormatting('<a href="URL">', '</a>') },
    { icon: 'PhotoIcon', label: 'Image', action: () => insertFormatting('<img src="URL" alt="Description" />') },
  ];

  if (!isHydrated) {
    return (
      <div className="border border-border rounded-lg bg-card">
        <div className="border-b border-border px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="w-8 h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 bg-muted/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
              title={button.label}
              type="button"
            >
              <Icon name={button.icon as any} size={18} className="text-foreground" />
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-md text-sm font-medium transition-smooth hover:bg-muted/80 press-scale"
          type="button"
        >
          <Icon name={showPreview ? 'CodeBracketIcon' : 'EyeIcon'} size={16} />
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      <div className="p-4">
        {!showPreview ? (
          <textarea
            ref={editorRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-64 px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono text-sm"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          />
        ) : (
          <div
            className="min-h-[16rem] px-4 py-3 bg-background border border-border rounded-md prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value || '<p class="text-muted-foreground">No content to preview</p>' }}
          />
        )}
      </div>

      <div className="border-t border-border px-4 py-2 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Character count: {value.length}</span>
          <span>HTML tags supported</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;