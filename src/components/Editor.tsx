import React, { useRef, useState, useEffect } from "react";
import { validateMarkdownLength } from "../lib/markdown";

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  fontSize: number;
  isDarkMode: boolean;
}

const Editor = React.forwardRef<any, EditorProps>(
  ({ content, onContentChange, fontSize }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState<string[]>([content]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isUndoRedo, setIsUndoRedo] = useState(false);
    const [currentLine, setCurrentLine] = useState(1);
    const [isFocused, setIsFocused] = useState(false);

    // Add content to history when it changes (debounced)
    useEffect(() => {
      if (!isUndoRedo && content !== history[historyIndex]) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(content);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }, [content, isUndoRedo, history, historyIndex]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      const valid = validateMarkdownLength(newContent);

      if (valid) {
        setIsUndoRedo(false);
        onContentChange(newContent);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Handle Cmd+Z (Mac) or Ctrl+Z (Windows/Linux) for undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        performUndo();
      }
      // Handle Cmd+Shift+Z (Mac) or Ctrl+Y (Windows/Linux) for redo
      else if (
        ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) ||
        (e.ctrlKey && e.key === "y")
      ) {
        e.preventDefault();
        performRedo();
      }
    };

    const performUndo = () => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setIsUndoRedo(true);
        onContentChange(history[newIndex]);
      }
    };

    const performRedo = () => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setIsUndoRedo(true);
        onContentChange(history[newIndex]);
      }
    };

    // Handle file drop
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      const mdFile = files.find(
        (file) => file.name.endsWith(".md") || file.type === "text/markdown"
      );

      if (mdFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target?.result as string;
          if (validateMarkdownLength(fileContent)) {
            onContentChange(fileContent);
          }
        };
        reader.readAsText(mdFile);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    // Handle focus and blur events
    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    // Handle cursor position to highlight current line
    const handleCursorPosition = () => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const selectionStart = textarea.selectionStart;

        // Create a substring from the beginning to the cursor position
        const textBeforeCursor = textarea.value.substring(0, selectionStart);

        // Count the number of newline characters before the cursor
        const newlineMatches = textBeforeCursor.match(/\n/g);
        const newlineCount = newlineMatches ? newlineMatches.length : 0;

        // The line number is the count of newlines + 1
        const currentLineNumber = newlineCount + 1;

        console.log(
          `Cursor at position ${selectionStart}, newlines before: ${newlineCount}, highlighting line ${currentLineNumber}`
        );
        setCurrentLine(currentLineNumber);
      }
    };

    // Public methods for toolbar actions
    const insertText = (text: string) => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent =
          content.substring(0, start) + text + content.substring(end);

        if (validateMarkdownLength(newContent)) {
          onContentChange(newContent);

          // Set cursor position after inserted text
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              start + text.length;
            textarea.focus();
          }, 0);
        }
      }
    };

    // Expose methods to parent
    React.useImperativeHandle(ref, () => ({
      insertText,
      undo: () => {
        console.log("Undo functionality not implemented for textarea");
      },
      redo: () => {
        console.log("Redo functionality not implemented for textarea");
      },
    }));

    // Generate line numbers
    const renderLineNumbers = () => {
      const lineCount = content.split("\n").length;
      const lines = [];
      for (let i = 1; i <= lineCount; i++) {
        const isCurrentLine = i === currentLine && isFocused;
        lines.push(
          <div
            key={i}
            className={`text-right pr-2 select-none transition-colors duration-150 ${
              isCurrentLine
                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 font-semibold"
                : "text-gray-400 dark:text-gray-600"
            }`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${fontSize * 1.5}px`,
              minHeight: `${fontSize * 1.5}px`,
            }}
          >
            {i}
          </div>
        );
      }
      return lines;
    };

    // Synchronize line numbers scroll with textarea
    const handleScrollWithLineNumbers = (
      e: React.UIEvent<HTMLTextAreaElement>
    ) => {
      const target = e.target as HTMLTextAreaElement;

      // Sync line numbers scroll
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = target.scrollTop;
      }

      // Sync preview scroll
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight - target.clientHeight;
      const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      const preview = document.querySelector(".preview");
      if (preview) {
        const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
        preview.scrollTop = scrollPercentage * previewScrollHeight;
      }
    };

    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-900">
        <div className="flex-1 flex min-h-0">
          {/* Line numbers */}
          <div
            ref={lineNumbersRef}
            className="w-12 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden font-mono text-xs"
            style={{
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            {renderLineNumbers()}
          </div>

          {/* Textarea with line highlighting */}
          <div className="flex-1 relative bg-white dark:bg-gray-900">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onScroll={handleScrollWithLineNumbers}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onKeyUp={handleCursorPosition}
              onClick={handleCursorPosition}
              onInput={handleCursorPosition}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Type your Markdown here or drag & drop a .md file..."
              className="w-full h-full p-4 font-mono resize-none border-0 outline-none bg-transparent text-gray-900 dark:text-gray-100"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${fontSize * 1.5}px`,
              }}
            />
            {/* Line highlight overlay */}
            {isFocused && (
              <div
                className="absolute pointer-events-none transition-all duration-150 bg-green-100 dark:bg-green-900/30 rounded"
                style={{
                  top: `${(currentLine - 1) * fontSize * 1.5 + 16}px`, // 16px for padding
                  left: "16px",
                  right: "16px",
                  height: `${fontSize * 1.5}px`,
                  zIndex: 1,
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default Editor;
