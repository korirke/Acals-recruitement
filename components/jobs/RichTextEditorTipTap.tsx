"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from "lucide-react";
import { Button } from "@/components/careers/ui/button";

export function RichTextEditorTipTap(props: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: props.placeholder || "Write the job description...",
      }),
    ],

    content: props.value || "",

    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[220px] px-4 py-3",
      },
    },

    onUpdate: ({ editor }) => {
      props.onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const next = props.value || "";
    const current = editor.getHTML();

    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [props.value, editor]);

  if (!editor) {
    return (
      <div className="rounded-md border border-border bg-background p-4 text-sm text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  const ToolbarButton = (p: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    label: string;
    icon: React.ReactNode;
  }) => (
    <Button
      type="button"
      variant={p.active ? "default" : "outline"}
      size="sm"
      onClick={p.onClick}
      disabled={p.disabled}
      className="h-9 px-2"
      aria-label={p.label}
      title={p.label}
    >
      {p.icon}
    </Button>
  );

  return (
    <div className="rounded-md border border-border bg-background overflow-hidden">
      <div className="flex flex-wrap gap-2 p-2 border-b border-border bg-muted/20">
        <ToolbarButton
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          icon={<Bold className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          icon={<Italic className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          icon={<List className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          icon={<ListOrdered className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          icon={<Quote className="h-4 w-4" />}
        />

        <div className="w-px bg-border mx-1" />

        <ToolbarButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={<Undo className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={<Redo className="h-4 w-4" />}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}