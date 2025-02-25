import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

const TrackContextMenu = ({ track, isOpen, position, onClose }) => {
  const { addToQueue } = usePlayer();
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  const handleAddToQueue = () => {
    addToQueue(track);
    onClose();
  };

  return (
    <div
      className={`fixed z-50 w-48 rounded-md shadow-lg ${
        isDarkMode ? 'bg-zinc-800' : 'bg-white'
      }`}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div className="py-1">
        <button
          onClick={handleAddToQueue}
          className={`w-full text-left px-4 py-2 text-sm ${
            isDarkMode 
              ? 'hover:bg-zinc-700 text-white' 
              : 'hover:bg-gray-100 text-gray-900'
          }`}
        >
          Add to Queue
        </button>
      </div>
    </div>
  );
};

export default TrackContextMenu; 