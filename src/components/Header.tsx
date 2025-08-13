import React from "react";
import DownloadDropdown from "./DownloadDropdown";
import SettingsDropdown from "./SettingsDropdown";
import { getBaseFilename } from "@utils/common";
import { APP_CONFIG } from "@utils/constants";

interface HeaderProps {
  filename: string;
  onFilenameChange: (filename: string) => void;
  wordCount: number;
  charCount: number;
  lineCount: number;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  showDownloadDropdown: boolean;
  showSettingsDropdown: boolean;
  onDownloadToggle: () => void;
  onSettingsToggle: () => void;
  onDownloadMarkdown: () => void;
  onDownloadHtml: () => void;
  onDownloadPDF: () => void;
  onCopyContent: () => void;
  isGeneratingPDF?: boolean;
  fontSize: number;
  autoSave: boolean;
  onFontSizeChange: (size: number) => void;
  onAutoSaveToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  filename,
  onFilenameChange,
  wordCount,
  charCount,
  lineCount,
  isDarkMode,
  onThemeToggle,
  showDownloadDropdown,
  showSettingsDropdown,
  onDownloadToggle,
  onSettingsToggle,
  onDownloadMarkdown,
  onDownloadHtml,
  onDownloadPDF,
  onCopyContent,
  isGeneratingPDF = false,
  fontSize,
  autoSave,
  onFontSizeChange,
  onAutoSaveToggle,
}) => {
  // Handle base filename change and add .md extension
  const handleFilenameChange = (baseFilename: string) => {
    onFilenameChange(baseFilename + ".md");
  };

  const baseFilename = getBaseFilename(filename);
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {/* Filename input with fixed .md extension */}
        <div className="relative flex items-center w-32 sm:w-48 md:w-64">
          <input
            type="text"
            value={baseFilename}
            onChange={(e) => handleFilenameChange(e.target.value)}
            className="flex-1 px-3 py-1.5 pr-10 text-sm font-medium text-gray-900 dark:text-gray-100 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="filename"
          />
          <span className="absolute right-3 text-sm font-medium text-gray-500 dark:text-gray-400 pointer-events-none">
            .md
          </span>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
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

      {/* App Logo - Centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <img
            src={isDarkMode ? "/logo-dark.svg" : "/logo.svg"}
            alt="MDZen"
            className="w-10 h-10 transition-transform duration-200 group-hover:scale-110"
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            MDZen
          </h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {/* Copy Button */}
        <button
          onClick={onCopyContent}
          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          title="Copy content to clipboard"
        >
          <svg
            className="w-5 h-5"
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
        </button>

        <DownloadDropdown
          isVisible={showDownloadDropdown}
          onToggle={onDownloadToggle}
          onDownloadMarkdown={onDownloadMarkdown}
          onDownloadHtml={onDownloadHtml}
          onDownloadPDF={onDownloadPDF}
          isGeneratingPDF={isGeneratingPDF}
        />

        <button
          onClick={onThemeToggle}
          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          title="Toggle theme"
        >
          {isDarkMode ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        <SettingsDropdown
          isVisible={showSettingsDropdown}
          onToggle={onSettingsToggle}
          fontSize={fontSize}
          autoSave={autoSave}
          onFontSizeChange={onFontSizeChange}
          onAutoSaveToggle={onAutoSaveToggle}
        />

        <a
          href={APP_CONFIG.github}
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
  );
};

export default Header;
