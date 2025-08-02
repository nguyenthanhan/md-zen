import React, { useRef, useEffect } from "react";
import { validateMarkdownLength } from "@lib/markdown";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter,
} from "@codemirror/view";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from "@codemirror/language";
import {
  defaultKeymap,
  history,
  historyKeymap,
  undo,
  redo,
} from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  fontSize: number;
  isDarkMode: boolean;
}

const Editor = React.forwardRef<any, EditorProps>(
  ({ content, onContentChange, fontSize, isDarkMode }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const isScrollingSyncRef = useRef(false);
    const contentChangeTimeoutRef = useRef<number | null>(null);
    const scrollSyncTimeoutRef = useRef<number | null>(null);

    // Create extensions array - extracted to avoid duplication
    const createExtensions = () => [
      // A line number gutter
      lineNumbers(),
      // A gutter with code folding markers
      foldGutter(),
      // Replace non-printable characters with placeholders
      highlightSpecialChars(),
      // The undo history
      history(),
      // Replace native cursor/selection with our own
      drawSelection(),
      // Show a drop cursor when dragging over the editor
      dropCursor(),
      // Allow multiple cursors/selections
      EditorState.allowMultipleSelections.of(true),
      // Re-indent lines when typing specific input
      indentOnInput(),
      // Highlight syntax with a default style
      syntaxHighlighting(defaultHighlightStyle),
      // Highlight matching brackets near cursor
      bracketMatching(),
      // Automatically close brackets
      closeBrackets(),
      // Load the autocompletion system
      autocompletion(),
      // Allow alt-drag to select rectangular regions
      rectangularSelection(),
      // Change the cursor to a crosshair when holding alt
      crosshairCursor(),
      // Style the current line specially
      highlightActiveLine(),
      // Style the gutter for current line specially
      highlightActiveLineGutter(),
      // Highlight text that matches the selected text
      highlightSelectionMatches(),
      // Markdown language support
      markdown(),
      // Keymap with all the standard bindings
      keymap.of([
        // Closed-brackets aware backspace
        ...closeBracketsKeymap,
        // A large set of basic bindings
        ...defaultKeymap,
        // Search-related keys
        ...searchKeymap,
        // Redo/undo keys
        ...historyKeymap,
        // Code folding bindings
        ...foldKeymap,
        // Autocompletion keys
        ...completionKeymap,
        // Keys related to the linter system
        ...lintKeymap,
      ]),
      // Content change listener with optimized debouncing
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          // Clear existing timeout immediately
          if (contentChangeTimeoutRef.current) {
            clearTimeout(contentChangeTimeoutRef.current);
          }

          // Use shorter debounce for better responsiveness
          contentChangeTimeoutRef.current = setTimeout(() => {
            const newContent = update.state.doc.toString();
            const valid = validateMarkdownLength(newContent);
            if (valid) {
              onContentChange(newContent);
            }
          }, 50); // Reduced to 50ms for better responsiveness
        }
      }),
      // Scroll synchronization with throttling
      EditorView.domEventHandlers({
        scroll: (event) => {
          if (isScrollingSyncRef.current) return;

          // Throttle scroll events to reduce lag
          if (scrollSyncTimeoutRef.current) return;

          const editorElement = event.target as HTMLElement;
          const scrollTop = editorElement.scrollTop;
          const scrollHeight =
            editorElement.scrollHeight - editorElement.clientHeight;
          const scrollPercentage =
            scrollHeight > 0 ? scrollTop / scrollHeight : 0;

          // Throttle scroll sync to 30fps (33ms) for better performance
          scrollSyncTimeoutRef.current = setTimeout(() => {
            const preview = document.querySelector(".preview");
            if (preview && !isScrollingSyncRef.current) {
              isScrollingSyncRef.current = true;

              const previewScrollHeight =
                preview.scrollHeight - preview.clientHeight;
              const targetScrollTop = scrollPercentage * previewScrollHeight;

              // Use direct assignment for better performance
              preview.scrollTop = targetScrollTop;

              // Reset sync flag quickly
              setTimeout(() => {
                isScrollingSyncRef.current = false;
              }, 10);
            }
            scrollSyncTimeoutRef.current = null;
          }, 33); // 30fps throttling for better performance
        },
      }),
      // Theme
      EditorView.theme({
        "&": {
          fontSize: `${fontSize}px`,
          height: "100%",
        },
        ".cm-content": {
          padding: "1rem",
          fontFamily:
            "ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          lineHeight: "1.5",
        },
        ".cm-content[contenteditable]": {
          "-webkit-user-select": "text",
          "-moz-user-select": "text",
          "-ms-user-select": "text",
          "user-select": "text",
          spellcheck: "false",
        },
        ".cm-focused": {
          outline: "none",
        },
        ".cm-editor": {
          height: "100%",
        },
        ".cm-scroller": {
          height: "100%",
        },
        ".cm-foldGutter": {
          width: "20px",
          paddingRight: "4px",
        },
        ".cm-foldGutter .cm-gutterElement": {
          textAlign: "center",
          fontSize: "14px",
        },
        ".cm-foldPlaceholder": {
          margin: "0 6px",
          padding: "2px 4px",
          borderRadius: "3px",
          backgroundColor: "rgba(128, 128, 128, 0.2)",
          border: "1px solid rgba(128, 128, 128, 0.3)",
          cursor: "pointer",
        },
      }),
      // Add dark theme if needed
      ...(isDarkMode ? [oneDark] : []),
    ];

    // Initialize CodeMirror once
    useEffect(() => {
      if (!editorRef.current || viewRef.current) {
        return;
      }

      console.log("Initializing CodeMirror editor");

      const view = new EditorView({
        doc: content,
        parent: editorRef.current,
        extensions: createExtensions(),
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
        if (scrollSyncTimeoutRef.current) {
          clearTimeout(scrollSyncTimeoutRef.current);
        }
      };
    }, []);

    // Update content when prop changes (but not when user is typing)
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

      // Recreate editor with new theme/font settings
      const currentContent = viewRef.current.state.doc.toString();
      const parent = viewRef.current.dom.parentElement;

      viewRef.current.destroy();

      const extensions = [
        // A line number gutter
        lineNumbers(),
        // A gutter with code folding markers
        foldGutter(),
        // Replace non-printable characters with placeholders
        highlightSpecialChars(),
        // The undo history
        history(),
        // Replace native cursor/selection with our own
        drawSelection(),
        // Show a drop cursor when dragging over the editor
        dropCursor(),
        // Allow multiple cursors/selections
        EditorState.allowMultipleSelections.of(true),
        // Re-indent lines when typing specific input
        indentOnInput(),
        // Highlight syntax with a default style
        syntaxHighlighting(defaultHighlightStyle),
        // Highlight matching brackets near cursor
        bracketMatching(),
        // Automatically close brackets
        closeBrackets(),
        // Load the autocompletion system
        autocompletion(),
        // Allow alt-drag to select rectangular regions
        rectangularSelection(),
        // Change the cursor to a crosshair when holding alt
        crosshairCursor(),
        // Style the current line specially
        highlightActiveLine(),
        // Style the gutter for current line specially
        highlightActiveLineGutter(),
        // Highlight text that matches the selected text
        highlightSelectionMatches(),
        // Markdown language support
        markdown(),
        // Keymap with all the standard bindings
        keymap.of([
          // Closed-brackets aware backspace
          ...closeBracketsKeymap,
          // A large set of basic bindings
          ...defaultKeymap,
          // Search-related keys
          ...searchKeymap,
          // Redo/undo keys
          ...historyKeymap,
          // Code folding bindings
          ...foldKeymap,
          // Autocompletion keys
          ...completionKeymap,
          // Keys related to the linter system
          ...lintKeymap,
        ]),
        // Content change listener
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            const valid = validateMarkdownLength(newContent);
            if (valid) {
              onContentChange(newContent);
            }
          }
        }),
        // Scroll synchronization
        EditorView.domEventHandlers({
          scroll: (event) => {
            if (isScrollingSyncRef.current) return;

            const editorElement = event.target as HTMLElement;
            const scrollTop = editorElement.scrollTop;
            const scrollHeight =
              editorElement.scrollHeight - editorElement.clientHeight;
            const scrollPercentage =
              scrollHeight > 0 ? scrollTop / scrollHeight : 0;

            // Sync with preview using requestAnimationFrame for smoother scrolling
            const preview = document.querySelector(".preview");
            if (preview) {
              isScrollingSyncRef.current = true;
              requestAnimationFrame(() => {
                const previewScrollHeight =
                  preview.scrollHeight - preview.clientHeight;
                const targetScrollTop = scrollPercentage * previewScrollHeight;

                // Use smooth scrolling
                preview.scrollTo({
                  top: targetScrollTop,
                  behavior: "auto", // Use 'auto' for immediate sync, 'smooth' for animated
                });

                setTimeout(() => {
                  isScrollingSyncRef.current = false;
                }, 100);
              });
            }
          },
        }),
        EditorView.theme({
          "&": {
            fontSize: `${fontSize}px`,
            height: "100%",
          },
          ".cm-content": {
            padding: "1rem",
            fontFamily:
              "ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            lineHeight: "1.5",
          },
          ".cm-content[contenteditable]": {
            "-webkit-user-select": "text",
            "-moz-user-select": "text",
            "-ms-user-select": "text",
            "user-select": "text",
            spellcheck: "false",
          },
          ".cm-focused": {
            outline: "none",
          },
          ".cm-editor": {
            height: "100%",
          },
          ".cm-scroller": {
            height: "100%",
          },
          ".cm-foldGutter": {
            width: "20px",
            paddingRight: "2px",
          },
          ".cm-foldGutter .cm-gutterElement": {
            textAlign: "center",
            fontSize: "14px",
          },
          ".cm-foldPlaceholder": {
            margin: "0 6px",
            padding: "2px 4px",
            borderRadius: "3px",
            backgroundColor: "rgba(128, 128, 128, 0.2)",
            border: "1px solid rgba(128, 128, 128, 0.3)",
            cursor: "pointer",
          },
        }),
      ];

      if (isDarkMode) {
        extensions.push(oneDark);
      }

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
      <div className="h-full flex flex-col bg-white dark:bg-gray-900">
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

export default Editor;
