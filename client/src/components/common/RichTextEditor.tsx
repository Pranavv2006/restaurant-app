import React, { useEffect, useCallback } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";

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
        isBold: ed.isActive("bold"),
        canBold: ed.can().chain().toggleBold().run(),
        isItalic: ed.isActive("italic"),
        canItalic: ed.can().chain().toggleItalic().run(),
        isStrike: ed.isActive("strike"),
        canStrike: ed.can().chain().toggleStrike().run(),
        isCode: ed.isActive("code"),
        canCode: ed.can().chain().toggleCode().run(),
        isBulletList: ed.isActive("bulletList"),
        isOrderedList: ed.isActive("orderedList"),
        isCodeBlock: ed.isActive("codeBlock"),
        isBlockquote: ed.isActive("blockquote"),
        canUndo: ed.can().chain().undo().run(),
        canRedo: ed.can().chain().redo().run(),
      };
    },
  });

  if (!editor) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-2 control-group">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editorState.canBold}
        className={
          editorState.isBold
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        B
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editorState.canItalic}
        className={
          editorState.isItalic
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        I
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editorState.canStrike}
        className={
          editorState.isStrike
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        S
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editorState.canCode}
        className={
          editorState.isCode
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
          editorState.isBulletList
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
          editorState.isOrderedList
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
          editorState.isCodeBlock
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
          editorState.isBlockquote
            ? "is-active px-2 py-1 rounded bg-violet-600 text-white"
            : "px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
        }
      >
        “ ”
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
        className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
      >
        Undo
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
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
