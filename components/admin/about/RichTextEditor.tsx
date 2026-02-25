'use client';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  height = 200,
  disabled = false
}: RichTextEditorProps) {
  const handleInsertTag = (tag: string) => {
    const textarea = document.querySelector('textarea[data-rich-text]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    if (selectedText) {
      newText = value.substring(0, start) + `<${tag}>${selectedText}</${tag}>` + value.substring(end);
    } else {
      newText = value + `<${tag}></${tag}>`;
    }
    
    onChange(newText);
  };

  return (
    <div className="space-y-2">
      <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-600">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded transition-colors font-bold"
              onClick={() => handleInsertTag('strong')}
              disabled={disabled}
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded transition-colors italic"
              onClick={() => handleInsertTag('em')}
              disabled={disabled}
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded transition-colors"
              onClick={() => onChange(value + '\n• ')}
              disabled={disabled}
              title="Bullet List"
            >
              • List
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded transition-colors"
              onClick={() => handleInsertTag('h3')}
              disabled={disabled}
              title="Heading"
            >
              H3
            </button>
          </div>
        </div>
        <textarea
          data-rich-text
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none resize-vertical text-sm font-mono"
          style={{ minHeight: `${height}px` }}
        />
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Tip: Select text and click formatting buttons, or use HTML tags directly
      </p>
    </div>
  );
}
