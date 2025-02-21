import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { QueueListIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const Queue = () => {
  const { 
    queue, 
    removeFromQueue, 
    clearQueue,
    currentTrack,
    isQueueVisible 
  } = usePlayer();
  const { isDarkMode } = useTheme();

  if (!isQueueVisible || !queue.length) {
    return null;
  }

  return (
    <div className={`fixed right-0 top-0 bottom-0 w-80 ${
      isDarkMode ? 'bg-zinc-900 border-l border-zinc-800' : 'bg-white border-l border-gray-200'
    } shadow-lg transform transition-transform z-40 overflow-hidden`}>
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QueueListIcon className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Queue</h2>
          </div>
          <button
            onClick={clearQueue}
            className="p-2 hover:bg-zinc-800 rounded-full"
            aria-label="Clear queue"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-full pb-24">
        {/* Now Playing */}
        {currentTrack && (
          <div className="p-4 border-b border-zinc-800">
            <div className="text-sm text-zinc-400 mb-2">Now Playing</div>
            <div className="flex items-center space-x-3">
              <img
                src={currentTrack.album?.images?.thumbnail || '/images/placeholder-cover.png'}
                alt={currentTrack.title}
                className="w-12 h-12 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder-cover.png';
                }}
              />
              <div>
                <div className="font-medium">{currentTrack.title}</div>
                <div className="text-sm text-zinc-400">{currentTrack.artist}</div>
              </div>
            </div>
          </div>
        )}

        {/* Queue */}
        <div className="p-4">
          <div className="text-sm text-zinc-400 mb-2">Next Up</div>
          {queue.map((track, index) => (
            <div
              key={`${track._id}-${index}`}
              className="flex items-center space-x-3 p-2 hover:bg-zinc-800 rounded-md group"
            >
              <img
                src={track.album?.images?.thumbnail || '/images/placeholder-cover.png'}
                alt={track.title}
                className="w-12 h-12 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder-cover.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{track.title}</div>
                <div className="text-sm text-zinc-400 truncate">{track.artist}</div>
              </div>
              <button
                onClick={() => removeFromQueue(index)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-zinc-700 rounded-full"
                aria-label="Remove from queue"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Queue; 