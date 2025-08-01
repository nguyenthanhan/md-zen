import React from "react";
import {
  downloadFile,
  copyToClipboard,
  downloadAsPDF,
} from "../utils/fileHelpers";
import { parseMarkdown } from "../lib/markdown";
import Toast from "./Toast";

interface ToolbarProps {
  content: string;
  isDarkMode: boolean;
  fontSize: number;
  autoSave: boolean;
  wordCount: number;
  charCount: number;
  lineCount: number;
  onThemeToggle: () => void;
  onFontSizeChange: (size: number) => void;
  onAutoSaveToggle: () => void;
  onInsertText: (text: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  content,
  isDarkMode,
  fontSize,
  autoSave,
  wordCount,
  charCount,
  lineCount,
  onThemeToggle,
  onFontSizeChange,
  onAutoSaveToggle,
  onInsertText,
  onUndo,
  onRedo,
  onClear,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = React.useState(false);
  const [toast, setToast] = React.useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });
  const downloadDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        downloadDropdownRef.current &&
        !downloadDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDownloadDropdown(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDownloadDropdown(false);
      }
    };

    if (showDownloadDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showDownloadDropdown]);

  // Format button handlers
  const handleBold = () => {
    onInsertText("**bold text**");
  };

  const handleItalic = () => {
    onInsertText("*italic text*");
  };

  const handleHeading = () => {
    onInsertText("# Heading");
  };

  const handleLink = () => {
    onInsertText("[link text](http://example.com)");
  };

  const handleImage = () => {
    onInsertText("![alt text](image-url.jpg)");
  };

  // File operation handlers
  const handleCopyMarkdown = async () => {
    const success = await copyToClipboard(content);
    setToast({
      message: success
        ? "Markdown copied to clipboard!"
        : "Failed to copy to clipboard",
      type: success ? "success" : "error",
      isVisible: true,
    });
  };

  const handleDownloadMarkdown = () => {
    downloadFile("mdzen-document.md", content, "text/markdown");
  };

  const handleDownloadHtml = () => {
    const htmlContent = parseMarkdown(content);
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MDZen Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 1rem; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;
    downloadFile("mdzen-document.html", fullHtml, "text/html");
  };

  const handleDownloadPDF = async () => {
    try {
      const htmlContent = await parseMarkdown(content);
      const success = await downloadAsPDF(htmlContent, "mdzen-document.pdf");
      setToast({
        message: success
          ? "PDF downloaded successfully!"
          : "Failed to generate PDF",
        type: success ? "success" : "error",
        isVisible: true,
      });
    } catch (error) {
      console.error("PDF download error:", error);
      setToast({
        message: "Failed to generate PDF",
        type: "error",
        isVisible: true,
      });
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          MDZen
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            {" - A minimalist Markdown editor"}
          </span>
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            title="Settings"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
            </svg>
          </button>

          <button
            onClick={onThemeToggle}
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            title="Toggle theme"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <a
            href="https://github.com/nguyenthanhan/MDZen"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            title="View on GitHub"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-1">
          {/* Formatting buttons */}
          <button
            onClick={handleBold}
            className="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="Bold (Ctrl+B)"
          >
            B
          </button>

          <button
            onClick={handleItalic}
            className="w-8 h-8 flex items-center justify-center text-sm italic text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="Italic (Ctrl+I)"
          >
            I
          </button>

          <button
            onClick={handleHeading}
            className="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="Heading"
          >
            H
          </button>

          <button
            onClick={handleLink}
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="Link"
          >
            🔗
          </button>

          <button
            onClick={handleImage}
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="Image"
          >
            🖼️
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-2"></div>

          {/* Edit actions */}
          <button
            onClick={onUndo}
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>

          <button
            onClick={onRedo}
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>

          <button
            onClick={onClear}
            className="w-8 h-8 flex items-center justify-center text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            title="Clear all"
          >
            ✕
          </button>
        </div>

        {/* Export buttons and stats */}
        <div className="flex items-center space-x-3">
          {/* Stats */}
          <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {wordCount}
              </span>
              <span className="ml-1">words</span>
            </span>
            <span className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {charCount}
              </span>
              <span className="ml-1">chars</span>
            </span>
            <span className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {lineCount}
              </span>
              <span className="ml-1">lines</span>
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
            title="Copy Markdown to clipboard"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>Copy</span>
          </button>

          {/* Download Dropdown */}
          <div className="relative" ref={downloadDropdownRef}>
            <button
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
              title="Download options"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  showDownloadDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDownloadDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      handleDownloadMarkdown();
                      setShowDownloadDropdown(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>Markdown (.md)</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDownloadHtml();
                      setShowDownloadDropdown(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 2v7a1 1 0 001 1h7"
                      />
                    </svg>
                    <span>HTML (.html)</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDownloadPDF();
                      setShowDownloadDropdown(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6"
                      />
                    </svg>
                    <span>PDF (.pdf)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-80">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Font Size
                </h3>
                <div className="flex items-center">
                  <label className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                    Size:
                  </label>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(Number(e.target.value))}
                    min={12}
                    max={24}
                    className="w-16 p-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    px
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Auto-save
                </h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={onAutoSaveToggle}
                    className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Enable auto-save
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default Toolbar;
