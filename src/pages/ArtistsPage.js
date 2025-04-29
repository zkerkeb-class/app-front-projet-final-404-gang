import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { PlayIcon } from '@heroicons/react/24/solid';
import { fetchArtists } from '../services/artistService';

const ArtistsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        setIsLoading(true);
        const data = await fetchArtists({ sort: 'popularity', order: 'desc' });
        setArtists(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtists();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto pb-24 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Artists</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {artists.map((artist) => (
            <button
              key={artist._id}
              className={`group p-4 rounded-lg transition-all duration-300 hover:bg-white/5 text-left`}
              onClick={() => navigate(`/artist/${artist._id}`)}
            >
              <div className="relative aspect-square mb-4">
                <img
                  src={artist.images?.medium || '/placeholder.jpg'}
                  alt={artist.name}
                  className="w-full h-full object-cover rounded-full shadow-lg"
                />
                <button
                  className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle play artist's popular tracks
                    
                  }}
                >
                  <PlayIcon className="h-6 w-6 text-black" />
                </button>
              </div>
              <h3 className="font-semibold text-center truncate mb-1">{artist.name}</h3>
              <p className={`text-sm text-center truncate ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                Artist
              </p>
              {artist.genres?.length > 0 && (
                <p className={`text-xs text-center truncate ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                  {artist.genres[0]}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistsPage; 