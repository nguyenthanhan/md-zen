# MDZen - Minimal Markdown Editor

A minimalist, real-time Markdown editor and preview application built with React + Vite + TypeScript.

## ✨ Features

- **Real-time Preview**: See your Markdown rendered as HTML instantly as you type
- **Two-Panel Layout**: Side-by-side editor and preview panels
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

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS with Typography plugin
- **Markdown Parser**: marked
- **HTML Sanitizer**: DOMPurify
- **PDF Generation**: html2pdf.js
- **Text Editor**: Custom textarea with line highlighting
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
│   ├── Editor.tsx           # Markdown input editor with line highlighting
│   ├── Preview.tsx          # HTML preview panel
│   ├── Header.tsx           # Top bar with filename, stats, and action buttons
│   ├── DownloadDropdown.tsx # Download options dropdown
│   ├── SettingsDropdown.tsx # Settings dropdown
├── lib/
│   └── markdown.ts          # Markdown parsing and utilities
├── utils/
│   └── fileHelpers.ts       # File operations and PDF generation
└── App.tsx                  # Main application component

## 🚧 Planned Features

- **Drag & Drop**: Drop `.md` files to load content
- **File Import**: Import existing markdown files
- **Export Templates**: Custom export templates
- **Collaboration**: Real-time collaboration features
- **Plugins**: Extensible plugin system
│   ├── Header.tsx           # Top bar with filename, stats, and action buttons
│   ├── DownloadDropdown.tsx # Download options dropdown (MD, HTML, PDF)
│   ├── SettingsDropdown.tsx # Settings dropdown (font size, auto-save)
│   └── Toast.tsx            # Toast notification component
├── lib/
│   └── markdown.ts          # Markdown parsing & sanitization
├── utils/
│   └── fileHelpers.ts       # File operations (download, copy, PDF generation)
├── types/
│   └── html2pdf.d.ts        # TypeScript declarations for html2pdf
├── App.tsx                  # Main application component (state management)
├── main.tsx                 # Application entry point
└── index.css                # Global styles with Tailwind

scripts/
├── release.sh          # Automated release script
└── extract-changelog.js # Changelog extraction utility

.github/workflows/
├── deploy.yaml         # Production deployment workflow
└── release.yml         # GitHub release workflow
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

1. **Writing**: Type Markdown in the left panel
2. **Preview**: See the rendered HTML in the right panel
3. **Filename**: Edit the filename in the top bar (auto-saves on blur)
4. **Copy**: Click the copy icon to copy markdown content to clipboard
5. **Download**: Click the download icon to open dropdown with MD, HTML, and PDF options
6. **Theme**: Click the theme toggle button (sun/moon icons) in the top bar
7. **Settings**: Click the settings gear icon to open dropdown with font size and auto-save options
8. **Statistics**: View live word, character, and line counts in the top bar (hidden on mobile)
9. **Responsive**: UI adapts to different screen sizes with mobile-optimized layout

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

### Code Quality

- **Scroll Position Tracking**: Enhanced scroll handling for accurate line highlighting
- **State Management**: Improved state management for precise highlight positioning
- **Code Cleanup**: Removed unused drag & drop code and console logs
- **Component Separation**: Split functionality into Header, DownloadDropdown, and SettingsDropdown
- **Type Safety**: Enhanced TypeScript interfaces and prop definitions
- **Performance**: Optimized re-renders and event handling
- **Maintainability**: Cleaner code structure with better separation of concerns

## 🚧 Planned Features

- **Drag & Drop**: Drop `.md` files to load content
- **File Import**: Import existing markdown files
- **Export Templates**: Custom export templates
- **Collaboration**: Real-time collaboration features
- **Plugins**: Extensible plugin system
- **Custom Themes**: Additional themes and styling options

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🔄 Release Process

This project uses automated release management:

1. **Version Bumping**: Use `pnpm release:patch|minor|major` to bump version
2. **Changelog**: Updates are automatically extracted from CHANGELOG.md
3. **GitHub Release**: Creates a new release with changelog content
4. **Deployment**: Automatically deploys to production

For more details, see the `scripts/` directory and GitHub Actions workflows.
