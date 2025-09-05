import React, { useEffect, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange: (html: string) => void;
}

const extensions = [TextStyle, Color, StarterKit];

function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`w-8 h-8 flex items-center justify-center rounded ${
          editor.isActive("bold")
            ? "bg-violet-600 text-white"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
        title="Bold"
      >
        <strong>B</strong>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`w-8 h-8 flex items-center justify-center rounded ${
          editor.isActive("italic")
            ? "bg-violet-600 text-white"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
        title="Italic"
      >
        <em>I</em>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`w-8 h-8 flex items-center justify-center rounded ${
          editor.isActive("strike")
            ? "bg-violet-600 text-white"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
        title="Strikethrough"
      >
        <s>S</s>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 h-8 flex items-center justify-center rounded ${
          editor.isActive("bulletList")
            ? "bg-violet-600 text-white"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
        title="Bullet List"
      >
        • List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 h-8 flex items-center justify-center rounded ${
          editor.isActive("orderedList")
            ? "bg-violet-600 text-white"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
        title="Numbered List"
      >
        1. List
      </button>
    </div>
  );
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = "",
  onContentChange,
}) => {
  const editor = useEditor({
    extensions,
    content: initialContent || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "outline-none prose prose-sm max-w-none dark:prose-invert dark:text-white",
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, { emitUpdate: false });
    }
  }, [editor, initialContent]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleClick = useCallback(() => {
    editor?.chain().focus().run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="p-3 text-gray-500 dark:text-gray-400">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />

      <div
        onClick={handleClick}
        className="p-3 min-h-[120px] bg-white dark:bg-gray-900"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
