import React, { useRef, useEffect } from "react";
import "./slider.css";

interface SettingsDropdownProps {
  isVisible: boolean;
  onToggle: () => void;
  fontSize: number;
  autoSave: boolean;
  onFontSizeChange: (size: number) => void;
  onAutoSaveToggle: () => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  isVisible,
  onToggle,
  fontSize,
  autoSave,
  onFontSizeChange,
  onAutoSaveToggle,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        title="Settings"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
        </svg>
      </button>

      {/* Settings Dropdown */}
      {isVisible && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Font Size
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {fontSize}px
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min={12}
                  max={24}
                  step={1}
                  value={fontSize}
                  onChange={(e) => onFontSizeChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg font-size-slider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                      ((fontSize - 12) / (24 - 12)) * 100
                    }%, #d1d5db ${
                      ((fontSize - 12) / (24 - 12)) * 100
                    }%, #d1d5db 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>12px</span>
                  <span>18px</span>
                  <span>24px</span>
                </div>
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
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
