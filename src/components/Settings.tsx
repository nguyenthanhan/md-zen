import React from 'react';

interface SettingsProps {
  fontSize: number;
  autoSave: boolean;
  onFontSizeChange: (size: number) => void;
  onAutoSaveToggle: () => void;
}

const Settings: React.FC<SettingsProps> = ({ fontSize, autoSave, onFontSizeChange, onAutoSaveToggle }) => {
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFontSizeChange(Number(e.target.value));
  };

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300">
      <h2 className="text-lg font-semibold mb-2">Settings</h2>

      <div className="flex items-center mb-4">
        <label className="mr-2">Font Size:</label>
        <input 
          type="number" 
          value={fontSize} 
          onChange={handleFontSizeChange} 
          min={12}
          max={24}
          className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded"
        />
      </div>

      <div className="flex items-center">
        <label className="mr-2">Auto-save:</label>
        <input 
          type="checkbox" 
          checked={autoSave} 
          onChange={onAutoSaveToggle}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default Settings;

