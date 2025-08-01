# MDZen

A minimalist, real-time Markdown editor and preview application built with React + Vite + TypeScript.

## ✨ Features

- **Real-time Preview**: See your Markdown rendered as HTML instantly as you type
- **Two-Panel Layout**: Side-by-side editor and preview panels
- **Editable Filename**: Customize your document name with auto-save
- **Theme Toggle**: Switch between light and dark modes
- **Settings Panel**: Configure font size and auto-save preferences
- **File Operations**:
  - Copy Markdown content to clipboard
  - Download as `.md` file
  - Download rendered HTML
  - Download as PDF
  - Drag & drop `.md` files to load content
- **Line Highlighting**: Current cursor line is highlighted in light green
- **Content Statistics**: Live word, character, and line count
- **Security**: HTML output is sanitized using DOMPurify to prevent XSS attacks
- **Auto-save**: Content automatically saved to localStorage
- **Responsive Design**: Mobile-friendly layout

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS with Typography plugin
- **Markdown Parser**: marked
- **HTML Sanitizer**: DOMPurify
- **PDF Generation**: html2pdf.js
- **Dark Mode**: CSS classes with Tailwind

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone or download this project
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── Editor.tsx      # Markdown input editor with line highlighting
│   ├── Preview.tsx     # HTML preview panel
│   ├── Toolbar.tsx     # Toolbar component (legacy)
│   ├── Settings.tsx    # Settings component (legacy)
│   └── Toast.tsx       # Toast notification component
├── lib/
│   └── markdown.ts     # Markdown parsing & sanitization
├── utils/
│   └── fileHelpers.ts  # File operations (download, copy, etc.)
├── types/
│   └── html2pdf.d.ts   # TypeScript declarations for html2pdf
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## 🔒 Security

- All HTML output is sanitized using DOMPurify
- Script tags and dangerous attributes are stripped
- No code execution or eval() is used
- Safe URI schemes only for links and images

## 🎯 Usage

1. **Writing**: Type Markdown in the left panel
2. **Preview**: See the rendered HTML in the right panel
3. **Filename**: Edit the filename in the top bar (auto-saves on blur)
4. **Theme**: Click the theme toggle button (☀️/🌙) in the top bar
5. **Settings**: Click the settings gear icon to configure font size and auto-save
6. **Copy**: Use the copy button to copy Markdown to clipboard
7. **Download**: Use the download dropdown for MD, HTML, or PDF formats
8. **Import**: Drag and drop a `.md` file onto the editor
9. **Statistics**: View live word, character, and line counts in the top bar

## 📝 Supported Markdown Features

- Headings (H1-H6)
- **Bold** and _italic_ text
- Lists (ordered and unordered)
- Links and images
- Code blocks and inline code
- Blockquotes
- Tables
- Horizontal rules
- Strikethrough text

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
