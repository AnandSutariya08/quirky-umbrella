'use client';

import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const RichTextEditor = ({ value, onChange, error }: RichTextEditorProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="border border-input rounded-md overflow-hidden">
        <div className="bg-muted p-3 border-b border-border">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-8 h-8 bg-background rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="h-96 bg-background animate-pulse" />
      </div>
    );
  }

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatButtons = [
    { icon: 'BoldIcon', title: 'Bold', before: '<strong>', after: '</strong>' },
    { icon: 'ItalicIcon', title: 'Italic', before: '<em>', after: '</em>' },
    { icon: 'UnderlineIcon', title: 'Underline', before: '<u>', after: '</u>' },
    { icon: 'LinkIcon', title: 'Link', before: '<a href="url">', after: '</a>' },
    { icon: 'ListBulletIcon', title: 'Bullet List', before: '<ul>\n  <li>', after: '</li>\n</ul>' },
    {
      icon: 'NumberedListIcon',
      title: 'Numbered List',
      before: '<ol>\n  <li>',
      after: '</li>\n</ol>',
    },
  ];

  const insertHeading = (level: number) => {
    insertFormatting(`<h${level}>`, `</h${level}>`);
  };

  const insertParagraph = () => {
    insertFormatting('<p>', '</p>');
  };

  return (
    <div
      className={`border rounded-md overflow-hidden transition-smooth ${
        error ? 'border-error' : 'border-input'
      }`}
    >
      <div className="bg-muted p-3 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1">
            {formatButtons.map((button) => (
              <button
                key={button.title}
                type="button"
                onClick={() => insertFormatting(button.before, button.after)}
                className="p-2 rounded hover:bg-background transition-smooth press-scale"
                title={button.title}
              >
                <Icon name={button.icon as any} size={18} className="text-foreground" />
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-border" />

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => insertHeading(1)}
              className="px-3 py-2 rounded hover:bg-background transition-smooth press-scale text-sm font-medium text-foreground"
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => insertHeading(2)}
              className="px-3 py-2 rounded hover:bg-background transition-smooth press-scale text-sm font-medium text-foreground"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertHeading(3)}
              className="px-3 py-2 rounded hover:bg-background transition-smooth press-scale text-sm font-medium text-foreground"
              title="Heading 3"
            >
              H3
            </button>
            <button
              type="button"
              onClick={insertParagraph}
              className="px-3 py-2 rounded hover:bg-background transition-smooth press-scale text-sm font-medium text-foreground"
              title="Paragraph"
            >
              P
            </button>
          </div>

          <div className="w-px h-6 bg-border" />

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded transition-smooth press-scale text-sm font-medium ${
              showPreview
                ? 'bg-accent text-accent-foreground'
                : 'bg-background text-foreground hover:bg-background/80'
            }`}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="p-6 bg-background min-h-96 max-h-96 overflow-y-auto">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: value || '<p class="text-muted-foreground">No content to preview</p>',
            }}
          />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-96 max-h-96 p-6 bg-background text-foreground font-mono text-sm resize-none focus:outline-none"
          placeholder="Enter HTML content here..."
          spellCheck={false}
        />
      )}

      {error && (
        <div className="p-3 bg-error/10 border-t border-error">
          <p className="text-sm text-error flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            {error}
          </p>
        </div>
      )}

      <div className="p-3 bg-muted border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>HTML Editor - Use standard HTML tags for formatting</span>
          <span>{value.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
