[![Release and Deploy](https://github.com/nguyenthanhan/md-zen/workflows/Release%20and%20Deploy/badge.svg)](https://github.com/nguyenthanhan/md-zen/actions/workflows/release-and-deploy.yml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/heimers-projects/md-zen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

# MDZen - Minimal Markdown Editor

A minimalist, real-time Markdown editor and preview application built with React 19 + Vite + TypeScript.

## ✨ Features

- **Real-time Preview**: See your Markdown rendered as HTML instantly as you type
- **Two-Panel Layout**: Side-by-side editor and preview panels with CodeMirror integration
- **Editable Filename**: Customize your document name with auto-save
- **Theme Toggle**: Switch between light and dark modes with beautiful SVG icons
- **Settings Dropdown**: Configure font size and auto-save preferences in a clean dropdown
- **Copy to Clipboard**: One-click copy of markdown content with professional icon
- **Download Options**:
  - Download as `.md` file (Markdown)
  - Download as `.html` file (Rendered HTML with styling)
  - Download as `.pdf` file (PDF with professional formatting)
- **Smart Line Highlighting**: Current cursor line is highlighted and follows cursor position during scroll
- **Content Statistics**: Live word, character, and line count (responsive)
- **Security**: HTML output is sanitized using DOMPurify to prevent XSS attacks
- **Auto-save**: Content automatically saved to localStorage
- **Responsive Design**: Mobile-friendly layout with adaptive UI
- **Modern UI**: Clean dropdown menus, consistent styling, and smooth animations
- **Optimized Layout**: Streamlined action buttons in logical order: Copy → Download → Theme → Settings → GitHub
- **Toast Notifications**: User-friendly feedback for actions like copy and download
- **Keyboard Shortcuts**: Basic keyboard shortcuts for common operations (save, copy, undo, redo, search, replace, select all)
- **Auto-completion**: Basic CodeMirror autocompletion for enhanced editing experience

## 📋 Checklist

- [ ] **Drag & Drop**: Drop `.md` files to load content
- [ ] **File Import**: Import existing markdown files

## 🛠️ Tech Stack

- **Framework**: React 19.1.0 + TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4
- **Package Manager**: pnpm 10.12.4
- **Styling**: Tailwind CSS 3.4.17 with Typography plugin
- **Markdown Parser**: marked 16.1.1
- **HTML Sanitizer**: DOMPurify 3.2.6
- **PDF Generation**: html2pdf.js 0.10.3
- **Code Editor**: CodeMirror 6 with Markdown language support
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

### Development Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint

# Create a new release (patch, minor, or major)
pnpm release:patch
pnpm release:minor
pnpm release:major

# Extract changelog for a specific version
pnpm changelog 1.0.0
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Editor.tsx           # CodeMirror-based Markdown editor with line highlighting
│   ├── Preview.tsx          # HTML preview panel with sanitization
│   ├── Header.tsx           # Top bar with filename, stats, and action buttons
│   ├── DownloadDropdown.tsx # Download options dropdown (MD, HTML, PDF)
│   ├── SettingsDropdown.tsx # Settings dropdown (font size, auto-save)
│   ├── Toast.tsx            # Toast notification component
│   └── slider.css           # Custom slider styles for settings
├── lib/
│   └── markdown.ts          # Markdown parsing & sanitization utilities
├── utils/
│   └── fileHelpers.ts       # File operations (download, copy, PDF generation)
├── types/
│   └── html2pdf.d.ts        # TypeScript declarations for html2pdf
├── assets/                  # Static assets and icons
├── styles/                  # Additional styling files
├── App.tsx                  # Main application component (state management)
├── main.tsx                 # Application entry point
├── index.css                # Global styles with Tailwind
└── vite-env.d.ts           # Vite environment types

scripts/
├── release.sh              # Automated release script
└── extract-changelog.js    # Changelog extraction utility

.github/workflows/
├── deploy.yaml             # Production deployment workflow
└── release.yml             # GitHub release workflow
```

## 🚀 Deployment

### Automated Deployment

This project includes GitHub Actions workflows for automated deployment:

- **Production Deployment**: Automatically deploys to Vercel when tags are pushed
- **Release Management**: Creates GitHub releases with changelog extraction

### Manual Deployment

1. Build the project:

   ```bash
   pnpm build
   ```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## 🔒 Security

- All HTML output is sanitized using DOMPurify
- Script tags and dangerous attributes are stripped
- No code execution or eval() is used
- Safe URI schemes only for links and images

## 🎯 Usage

1. **Writing**: Type Markdown in the left panel using the enhanced CodeMirror editor
2. **Preview**: See the rendered HTML in the right panel
3. **Filename**: Edit the filename in the top bar (auto-saves on blur)
4. **Copy**: Click the copy icon to copy markdown content to clipboard
5. **Download**: Click the download icon to open dropdown with MD, HTML, and PDF options
6. **Theme**: Click the theme toggle button (sun/moon icons) in the top bar
7. **Settings**: Click the settings gear icon to open dropdown with font size and auto-save options
8. **Statistics**: View live word, character, and line counts in the top bar (hidden on mobile)
9. **Responsive**: UI adapts to different screen sizes with mobile-optimized layout
10. **Notifications**: Toast notifications provide feedback for user actions

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

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Keep components modular and reusable
- Maintain consistent UI/UX patterns

## 🆕 Recent Improvements

### UI/UX Enhancements

- **Copy to Clipboard**: Added one-click copy functionality with professional icon
- **Smart Line Highlighting**: Fixed highlighting to follow cursor position during scroll
- **Optimized Button Layout**: Reorganized action buttons in logical order: Copy → Download → Theme → Settings → GitHub
- **Streamlined Interface**: Removed drag & drop clutter for cleaner UI
- **Modular Components**: Refactored large App.tsx into smaller, focused components
- **Dropdown Menus**: Replaced modal settings with clean dropdown interface
- **SVG Icons**: Upgraded from emoji to professional SVG icons for better consistency
- **Responsive Design**: Improved mobile experience with adaptive layouts
- **Download Options**: Added PDF export with professional formatting
- **Toast Notifications**: Added user-friendly feedback system

### Code Quality

- **Scroll Position Tracking**: Enhanced scroll handling for accurate line highlighting
- **State Management**: Improved state management for precise highlight positioning
- **Code Cleanup**: Removed unused drag & drop code and console logs
- **Component Separation**: Split functionality into Header, DownloadDropdown, and SettingsDropdown
- **Type Safety**: Enhanced TypeScript interfaces and prop definitions
- **Performance**: Optimized re-renders and event handling
- **Maintainability**: Cleaner code structure with better separation of concerns
- **CodeMirror Integration**: Upgraded to CodeMirror 6 for better editing experience

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Copyright

Copyright (c) 2025 MDZen Contributors
