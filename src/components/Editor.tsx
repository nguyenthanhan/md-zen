import React, { useRef, useEffect } from "react";
import { EditorView } from "@codemirror/view";
import { undo, redo } from "@codemirror/commands";
import { validateMarkdownLength } from "@lib/markdown";
import { createEditorExtensions } from "@utils/editorExtensions";
import { ScrollSyncManager } from "@utils/scrollSync";
import { colors } from "@utils/colors";

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  fontSize: number;
  isDarkMode: boolean;
}

export interface EditorRef {
  insertText: (text: string) => void;
  undo: () => void;
  redo: () => void;
}

const Editor = React.forwardRef<EditorRef, EditorProps>(
  ({ content, onContentChange, fontSize, isDarkMode }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const contentChangeTimeoutRef = useRef<number | null>(null);
    const scrollSyncManager = useRef(new ScrollSyncManager());

    // Handle scroll synchronization
    const handleScroll = (event: Event) => {
      const editorElement = event.target as HTMLElement;
      scrollSyncManager.current.syncEditorToPreview(editorElement);
    };

    // Initialize CodeMirror
    useEffect(() => {
      if (!editorRef.current || viewRef.current) {
        return;
      }

      const extensions = createEditorExtensions(
        fontSize,
        isDarkMode,
        onContentChange,
        handleScroll,
        contentChangeTimeoutRef
      );

      const view = new EditorView({
        doc: content,
        parent: editorRef.current,
        extensions,
      });

      viewRef.current = view;

      return () => {
        if (viewRef.current) {
          viewRef.current.destroy();
          viewRef.current = null;
        }
        if (contentChangeTimeoutRef.current) {
          clearTimeout(contentChangeTimeoutRef.current);
        }
        scrollSyncManager.current.cleanup();
      };
    }, []);

    // Update content when prop changes
    useEffect(() => {
      if (viewRef.current && viewRef.current.state.doc.toString() !== content) {
        const transaction = viewRef.current.state.update({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: content,
          },
        });
        viewRef.current.dispatch(transaction);
      }
    }, [content]);

    // Update theme and font size
    useEffect(() => {
      if (!viewRef.current) return;

      const currentContent = viewRef.current.state.doc.toString();
      const parent = viewRef.current.dom.parentElement;

      viewRef.current.destroy();

      const extensions = createEditorExtensions(
        fontSize,
        isDarkMode,
        onContentChange,
        handleScroll,
        contentChangeTimeoutRef
      );

      const view = new EditorView({
        doc: currentContent,
        parent: parent || editorRef.current!,
        extensions,
      });

      viewRef.current = view;
    }, [isDarkMode, fontSize]);

    // Public methods for toolbar actions
    const insertText = (text: string) => {
      if (viewRef.current) {
        const view = viewRef.current;
        const selection = view.state.selection.main;
        const newContent =
          content.substring(0, selection.from) +
          text +
          content.substring(selection.to);

        if (validateMarkdownLength(newContent)) {
          const transaction = view.state.update({
            changes: {
              from: selection.from,
              to: selection.to,
              insert: text,
            },
            selection: {
              anchor: selection.from + text.length,
            },
          });
          view.dispatch(transaction);
          view.focus();
        }
      }
    };

    // Expose methods to parent
    React.useImperativeHandle(ref, () => ({
      insertText,
      undo: () => {
        if (viewRef.current) {
          undo(viewRef.current);
        }
      },
      redo: () => {
        if (viewRef.current) {
          redo(viewRef.current);
        }
      },
    }));

    return (
      <div
        className="h-full flex flex-col"
        style={{
          backgroundColor: isDarkMode ? colors.gray[900] : colors.white,
        }}
      >
        <div className="flex-1 min-h-0">
          <div
            ref={editorRef}
            className="h-full w-full"
            style={{ minHeight: "400px" }}
          />
        </div>
      </div>
    );
  }
);

Editor.displayName = "Editor";

export default Editor;
