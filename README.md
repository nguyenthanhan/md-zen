[![Release and Deploy](https://github.com/nguyenthanhan/md-zen/workflows/Release%20and%20Deploy/badge.svg)](https://github.com/nguyenthanhan/md-zen/actions/workflows/release-and-deploy.yml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/heimers-projects/md-zen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# MDZen - Minimal Markdown Editor

A clean, real-time Markdown editor with live preview built with React 19 + TypeScript.

## ✨ Features

- **Real-time Preview**: See your Markdown rendered instantly
- **Two-Panel Layout**: Side-by-side editor and preview with CodeMirror
- **Theme Toggle**: Light and dark modes
- **Export Options**: Download as MD, HTML, or PDF
- **Auto-save**: Content saved to localStorage
- **Copy to Clipboard**: One-click copy functionality
- **Responsive Design**: Works on desktop and mobile
- **Clean UI**: Modern interface with smooth animations

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

Visit `http://localhost:5173` to start editing.

## 🛠️ Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **CodeMirror 6** for editing
- **marked** for Markdown parsing
- **DOMPurify** for security

## 📝 Usage

1. Type Markdown in the left panel
2. See live preview on the right
3. Use the top bar to:
   - Edit filename
   - Copy content
   - Download files
   - Toggle theme
   - Adjust settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
