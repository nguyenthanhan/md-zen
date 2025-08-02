// Application constants

export const APP_CONFIG = {
  name: 'MD Zen',
  version: '1.0.0',
  description: 'Minimal Markdown Editor',
  github: 'https://github.com/nguyenthanhan/MDZen',
} as const;

export const EDITOR_CONFIG = {
  fontSize: {
    min: 12,
    max: 24,
    default: 16,
  },
  debounce: {
    content: 50,
    preview: 100,
    scroll: 33,
  },
  validation: {
    maxLength: 10000,
  },
} as const;

export const FILE_CONFIG = {
  extensions: {
    markdown: '.md',
    html: '.html',
    pdf: '.pdf',
  },
  mimeTypes: {
    markdown: 'text/markdown',
    html: 'text/html',
    pdf: 'application/pdf',
  },
  defaultFilename: 'document',
} as const;

export const STORAGE_KEYS = {
  content: 'mdzen-content',
  filename: 'mdzen-filename',
  fontSize: 'mdzen-fontSize',
  isDarkMode: 'mdzen-isDarkMode',
  autoSave: 'mdzen-autoSave',
} as const;

export const KEYBOARD_SHORTCUTS = {
  save: 'Ctrl+S',
  copy: 'Ctrl+C',
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y',
  search: 'Ctrl+F',
  replace: 'Ctrl+H',
  selectAll: 'Ctrl+A',
} as const;
