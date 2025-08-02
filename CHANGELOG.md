# Changelog

All notable changes to the project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-27

### Added

- **Real-time Markdown Editor**: Built with React 19 + TypeScript and Vite
- **Two-Panel Layout**: Side-by-side editor and preview panels with CodeMirror integration
- **Theme Support**: Light and dark mode toggle with Tailwind CSS
- **File Operations**:
  - Copy Markdown content to clipboard
  - Download as `.md` file
  - Download rendered HTML
  - Download as PDF using html2pdf.js
  - Drag & drop `.md` files to load content
- **Content Statistics**: Live word, character, and line count display
- **Auto-save**: Content automatically saved to localStorage
- **Security**: HTML output sanitized using DOMPurify to prevent XSS attacks
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Editable Filename**: Customize document name with auto-save functionality
- **Line Highlighting**: Current cursor line highlighted in light green
- **GitHub Actions CI/CD**: Automated deployment and release workflows
- **Vercel Integration**: Production deployment configuration
- **Release Scripts**: Automated version bumping and changelog management
- **TypeScript Support**: Full type safety throughout the application

### Changed

- Upgraded from version 0.0.0 to 1.0.0 for initial production release
- Enhanced build process with TypeScript compilation
- Improved development workflow with pnpm package manager

### Fixed

- Initial release - no known issues

## [1.0.2] - 2025-08-03

### Changed

- Added copy to clipboard functionality
- Added toast notifications
- Added keyboard shortcuts and auto-completion
- Fixed line highlighting to follow cursor during scroll
- Removed drag & drop (moved to planned features)
- Improved PDF generation reliability

---

## [Unreleased]

---

_This changelog will be updated with each new release to document all changes, improvements, and new features._
