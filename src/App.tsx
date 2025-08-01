import React, { useState, useRef } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import { saveToLocalStorage, loadFromLocalStorage } from "./lib/markdown";

const App: React.FC = () => {
  const [filename, setFilename] = useState(
    localStorage.getItem("mdzen-filename") || "untitled.md"
  );
  const [content, setContent] = useState(
    loadFromLocalStorage() ||
      `# Welcome to MDZen!

Start typing your **Markdown** here and see the live preview on the right!

## Markdown Formatting Examples

### Headers
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header

### Text Formatting
**Bold text** or __bold text__
*Italic text* or _italic text_
***Bold and italic*** or ___bold and italic___
~~Strikethrough text~~
\`inline code\`

### Lists
#### Unordered List
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

#### Ordered List
1. First item
2. Second item
3. Third item

### Links and Images
[Link text](https://example.com)
![Alt text](https://example.com/image.jpg)

### Code Blocks
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

### Blockquotes
> This is a blockquote
> 
> It can span multiple lines
> 
> > And be nested

### Tables
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

### Horizontal Rules
---

### Task Lists
- [x] Completed task
- [ ] Pending task
- [ ] Another task

**Happy writing!** 🚀`
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [autoSave, setAutoSave] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (autoSave) {
      saveToLocalStorage(newContent);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleFilenameChange = (newFilename: string) => {
    setFilename(newFilename);
    // Auto-save filename to localStorage
    localStorage.setItem("mdzen-filename", newFilename);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const handleAutoSaveToggle = () => {
    setAutoSave(!autoSave);
  };

  // Close settings modal when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showSettings && !target.closest(".settings-modal")) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings]);

  // Calculate content stats
  const lineCount = content.split("\n").length;
  const wordCount =
    content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
  const charCount = content.length;

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      {/* Filename Input Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onBlur={(e) => handleFilenameChange(e.target.value)}
            className="px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter filename..."
          />

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
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            title="Toggle theme"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            title="Settings"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
            </svg>
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

      <div className="flex flex-1 min-h-0">
        {/* Editor Panel */}
        <div className="w-1/2 border-r-2 border-gray-300 dark:border-gray-600 flex flex-col min-h-0">
          <Editor
            ref={editorRef}
            content={content}
            onContentChange={handleContentChange}
            fontSize={fontSize}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col min-h-0">
          <Preview content={content} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="settings-modal absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-80">
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
                    onChange={(e) =>
                      handleFontSizeChange(Number(e.target.value))
                    }
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
                    onChange={handleAutoSaveToggle}
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
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
