import React from 'react';
import { QueueListIcon } from '@heroicons/react/24/outline';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

const QueueButton = () => {
  const { queue, isQueueVisible, setIsQueueVisible } = usePlayer();
  const { isDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsQueueVisible(!isQueueVisible)}
      className={`relative p-2 rounded-full transition-colors ${
        isDarkMode 
          ? 'hover:bg-zinc-800' 
          : 'hover:bg-gray-100'
      }`}
      aria-label="Toggle queue"
    >
      <QueueListIcon className="h-5 w-5" />
      {queue.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {queue.length}
        </span>
      )}
    </button>
  );
};

export default QueueButton; 