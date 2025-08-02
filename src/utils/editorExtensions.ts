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
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
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
import { validateMarkdownLength } from "@lib/markdown";
import { colors } from "./colors";

/**
 * Create CodeMirror extensions
 */
export const createEditorExtensions = (
  fontSize: number,
  isDarkMode: boolean,
  onContentChange: (content: string) => void,
  onScroll: (event: Event) => void,
  contentChangeTimeoutRef: { current: number | null }
) => {
  const extensions = [
    // Core extensions
    lineNumbers(),
    foldGutter(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    highlightSelectionMatches(),
    markdown(),

    // Keymap
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]),

    // Content change listener
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        if (contentChangeTimeoutRef.current) {
          clearTimeout(contentChangeTimeoutRef.current);
        }

        contentChangeTimeoutRef.current = window.setTimeout(() => {
          const newContent = update.state.doc.toString();
          const valid = validateMarkdownLength(newContent);
          if (valid) {
            onContentChange(newContent);
          }
        }, 50);
      }
    }),

    // Scroll synchronization
    EditorView.domEventHandlers({
      scroll: onScroll,
    }),

    // Theme
    createEditorTheme(fontSize),
  ];

  // Add dark theme if needed
  if (isDarkMode) {
    extensions.push(oneDark);
  }

  return extensions;
};

/**
 * Create editor theme
 */
export const createEditorTheme = (fontSize: number) => {
  return EditorView.theme({
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
      backgroundColor: colors.overlay.light,
      border: `1px solid ${colors.overlay.medium}`,
      cursor: "pointer",
    },
  });
};
