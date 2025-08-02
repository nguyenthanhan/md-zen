import React, { useState, useRef } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import Header from "./components/Header";
import { saveToLocalStorage, loadFromLocalStorage } from "./lib/markdown";
import {
  downloadFile,
  downloadAsPDF,
  copyToClipboard,
} from "./utils/fileHelpers";
import { parseMarkdown } from "./lib/markdown";

const App: React.FC = () => {
  const [filename, setFilename] = useState(
    localStorage.getItem("mdzen-filename") || "untitled.md"
  );
  const [content, setContent] = useState(
    loadFromLocalStorage() ||
      `# Welcome to MDZen - Minimal Markdown Editor!

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
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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

  // Download handlers
  const handleDownloadMarkdown = () => {
    downloadFile("mdzen-minimal-markdown-editor.md", content, "text/markdown");
  };

  const handleDownloadHtml = () => {
    const htmlContent = parseMarkdown(content);
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MDZen - Minimal Markdown Editor</title>
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
    downloadFile("mdzen-minimal-markdown-editor.html", fullHtml, "text/html");
  };

  const handleCopyContent = async () => {
    try {
      const success = await copyToClipboard(content);
      if (success) {
        console.log("✅ Content copied to clipboard!");
      } else {
        console.error("❌ Failed to copy content");
      }
    } catch (error) {
      console.error("❌ Copy error:", error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      console.log("Generating PDF...");

      const htmlContent = await parseMarkdown(content);
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MDZen - Minimal Markdown Editor</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem; 
            line-height: 1.6; 
            color: #333;
            background: white;
        }
        /* Hide any potential headers or footers */
        .html2pdf__header,
        .html2pdf__footer,
        [data-html2pdf-page-header],
        [data-html2pdf-page-footer] {
            display: none !important;
        }
        h1, h2, h3, h4, h5, h6 { 
            margin-top: 1.5em; 
            margin-bottom: 0.5em; 
            color: #2d3748; 
        }
        h1 { font-size: 2em; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
        h3 { font-size: 1.25em; }
        p { margin-bottom: 1em; }
        code { 
            background: #f7fafc; 
            padding: 0.2rem 0.4rem; 
            border-radius: 3px; 
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
        }
        pre { 
            background: #f7fafc; 
            padding: 1rem; 
            border-radius: 5px; 
            overflow-x: auto; 
            border: 1px solid #e2e8f0;
            margin: 1em 0;
        }
        pre code { 
            background: none; 
            padding: 0; 
            border-radius: 0; 
        }
        blockquote { 
            border-left: 4px solid #4299e1; 
            margin: 1em 0; 
            padding-left: 1rem; 
            color: #4a5568; 
            background: #f7fafc;
            padding: 1rem;
            border-radius: 0 5px 5px 0;
        }
        ul, ol { margin: 1em 0; padding-left: 2em; }
        li { margin: 0.5em 0; }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 1em 0; 
        }
        th, td { 
            border: 1px solid #e2e8f0; 
            padding: 0.5rem; 
            text-align: left; 
        }
        th { 
            background: #f7fafc; 
            font-weight: 600; 
        }
        a { color: #3182ce; text-decoration: none; }
        a:hover { text-decoration: underline; }
        hr { border: none; border-top: 1px solid #e2e8f0; margin: 2em 0; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

      const success = await downloadAsPDF(
        fullHtml,
        "mdzen-minimal-markdown-editor.pdf"
      );

      if (success) {
        console.log("✅ PDF generated successfully!");
        // Show success message in console instead of alert to avoid UI disruption
        console.log("📄 PDF saved as: mdzen-minimal-markdown-editor.pdf");
      } else {
        console.error("❌ Failed to generate PDF");
        console.log(
          "💡 Tip: Try using browser's print function (Ctrl+P) as alternative"
        );
      }
    } catch (error) {
      console.error("❌ PDF download error:", error);
      console.log(
        "💡 Tip: Try using browser's print function (Ctrl+P) as alternative"
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Calculate content stats
  const lineCount = content.split("\n").length;
  const wordCount =
    content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
  const charCount = content.length;

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      <Header
        filename={filename}
        onFilenameChange={handleFilenameChange}
        wordCount={wordCount}
        charCount={charCount}
        lineCount={lineCount}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        showDownloadDropdown={showDownloadDropdown}
        showSettingsDropdown={showSettingsDropdown}
        onDownloadToggle={() => setShowDownloadDropdown(!showDownloadDropdown)}
        onSettingsToggle={() => setShowSettingsDropdown(!showSettingsDropdown)}
        onDownloadMarkdown={handleDownloadMarkdown}
        onDownloadHtml={handleDownloadHtml}
        onDownloadPDF={handleDownloadPDF}
        onCopyContent={handleCopyContent}
        isGeneratingPDF={isGeneratingPDF}
        fontSize={fontSize}
        autoSave={autoSave}
        onFontSizeChange={handleFontSizeChange}
        onAutoSaveToggle={handleAutoSaveToggle}
      />

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
    </div>
  );
};

export default App;
