import React, { useEffect, useCallback } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange: (html: string) => void;
}

const extensions = [TextStyle, StarterKit];

function MenuBar({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      const ed = ctx.editor;
      return {
        isBold: ed ? ed.isActive("bold") : false,
        canBold: ed ? ed.can().chain().toggleBold().run() : false,
        isItalic: ed ? ed.isActive("italic") : false,
        canItalic: ed ? ed.can().chain().toggleItalic().run() : false,
        isStrike: ed ? ed.isActive("strike") : false,
        canStrike: ed ? ed.can().chain().toggleStrike().run() : false,
        isCode: ed ? ed.isActive("code") : false,
        canCode: ed ? ed.can().chain().toggleCode().run() : false,
        canClearMarks: ed ? ed.can().chain().unsetAllMarks().run() : false,
        isParagraph: ed ? ed.isActive("paragraph") : false,
        isHeading1: ed ? ed.isActive("heading", { level: 1 }) : false,
        isHeading2: ed ? ed.isActive("heading", { level: 2 }) : false,
        isHeading3: ed ? ed.isActive("heading", { level: 3 }) : false,
        isHeading4: ed ? ed.isActive("heading", { level: 4 }) : false,
        isHeading5: ed ? ed.isActive("heading", { level: 5 }) : false,
        isHeading6: ed ? ed.isActive("heading", { level: 6 }) : false,
        isBulletList: ed ? ed.isActive("bulletList") : false,
        isOrderedList: ed ? ed.isActive("orderedList") : false,
        isCodeBlock: ed ? ed.isActive("codeBlock") : false,
        isBlockquote: ed ? ed.isActive("blockquote") : false,
        canUndo: ed ? ed.can().chain().undo().run() : false,
        canRedo: ed ? ed.can().chain().redo().run() : false,
      };
    },
  });

  // ✅ Safe fallback so TS knows we always have an object to read from
  const state = editorState ?? {
    isBold: false,
    canBold: false,
    isItalic: false,
    canItalic: false,
    isStrike: false,
    canStrike: false,
    isCode: false,
    canCode: false,
    canClearMarks: false,
    isParagraph: false,
    isHeading1: false,
    isHeading2: false,
    isHeading3: false,
    isHeading4: false,
    isHeading5: false,
    isHeading6: false,
    isBulletList: false,
    isOrderedList: false,
    isCodeBlock: false,
    isBlockquote: false,
    canUndo: false,
    canRedo: false,
  };

  if (!editor) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-2 control-group">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!state.canBold}
        className={
          state.isBold
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        B
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!state.canItalic}
        className={
          state.isItalic
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        I
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!state.canStrike}
        className={
          state.isStrike
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        S
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!state.canCode}
        className={
          state.isCode
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        {"</>"}
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          state.isBulletList
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        • List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          state.isOrderedList
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        1. List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={
          state.isCodeBlock
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        Code block
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          state.isBlockquote
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        “ ”
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!state.canUndo}
        className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
      >
        Undo
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!state.canRedo}
        className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
      >
        Redo
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
          "prose prose-sm max-w-full focus:outline-none dark:prose-invert dark:text-white",
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  // handle external changes to initialContent
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (initialContent && initialContent !== current) {
      editor.commands.setContent(initialContent, false);
    }
  }, [editor, initialContent]);

  // cleanup
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleFocusPreserve = useCallback(() => {
    editor?.chain().focus().run();
  }, [editor]);

  if (!editor)
    return (
      <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
        Loading editor...
      </div>
    );

  return (
    <div className="w-full">
      <div className="mb-2">
        <MenuBar editor={editor} />
      </div>

      <div
        onClick={handleFocusPreserve}
        className="border rounded-lg p-2 min-h-[120px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
