import React, { useState } from 'react';
import { CommandLineIcon } from '@heroicons/react/24/outline';

const KeyboardShortcutsTooltip = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'Space', description: 'Play/Pause' },
    { key: 'Shift + →', description: 'Next track' },
    { key: 'Shift + ←', description: 'Previous track' },
    { key: '↑', description: 'Volume up' },
    { key: '↓', description: 'Volume down' },
    { key: 'M', description: 'Mute/Unmute' },
    { key: 'R', description: 'Toggle repeat' },
    { key: 'S', description: 'Toggle shuffle' },
    { key: 'F', description: 'Toggle fullscreen' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        aria-label="Keyboard shortcuts"
      >
        <CommandLineIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Keyboard Shortcuts</h3>
          <div className="space-y-2">
            {shortcuts.map(({ key, description }) => (
              <div key={key} className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {key}
                </kbd>
                <span className="text-gray-600 dark:text-gray-400">
                  {description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyboardShortcutsTooltip; 