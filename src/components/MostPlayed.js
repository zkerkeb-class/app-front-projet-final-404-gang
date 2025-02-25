import React, { useState, useEffect } from 'react';
import { playHistoryService } from '../services/playHistoryService';
import { PlayIcon } from '@heroicons/react/24/solid';

const MostPlayed = () => {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    // Charge les stats initiales
    setTopTracks(playHistoryService.getMostPlayed());

    // Met à jour toutes les minutes
    const interval = setInterval(() => {
      setTopTracks(playHistoryService.getMostPlayed());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {topTracks.map(([songId, playCount], index) => (
        <div 
          key={songId}
          className="group bg-spotify-gray/20 hover:bg-spotify-gray/40 rounded-md p-4 transition-all duration-200 cursor-pointer"
        >
          <div className="relative mb-4">
            <div className="absolute top-2 left-2 w-6 h-6 bg-spotify-black/60 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {index + 1}
            </div>
            <img 
              src={track.albumCover} 
              alt={track.album}
              className="w-full aspect-square object-cover rounded-md shadow-lg"
            />
            <button className="absolute right-2 bottom-2 w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-xl">
              <PlayIcon className="w-5 h-5 text-black" />
            </button>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-white truncate">
              {track.title}
            </div>
            <div className="text-sm text-spotify-lightgray truncate">
              {track.artist}
            </div>
            <div className="text-xs text-spotify-lightgray">
              {playCount} écoutes
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MostPlayed; 