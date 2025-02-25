import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/ThemeContext';
import { fetchPlaylists } from '../services/playlistService';

const PlaylistsPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPlaylists({ limit: 50 });
        setPlaylists(data);
        setError(null);
      } catch (err) {
        console.error('Error loading playlists:', err);
        setError('Failed to load playlists');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Playlists</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {playlists.map((playlist) => (
          <button
            key={playlist._id}
            onClick={() => navigate(`/playlist/${playlist._id}`)}
            className={`group p-4 rounded-md ${
              isDarkMode ? 'bg-[#181818] hover:bg-[#282828]' : 'bg-white hover:bg-gray-100'
            } transition-colors`}
          >
            <div className="relative aspect-square mb-4">
              <img
                src={playlist.images?.medium || '/playlist-placeholder.jpg'}
                alt={playlist.name}
                className="w-full h-full object-cover rounded-md shadow-lg"
              />
              <button
                className="absolute right-2 bottom-2 w-10 h-10 bg-green-500 rounded-full shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-green-400"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement play functionality
                }}
              >
                <PlayIcon className="h-5 w-5 text-black" />
              </button>
            </div>
            <h3 className="font-bold truncate mb-1">{playlist.name}</h3>
            <p className={`text-sm truncate ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {playlist.trackCount || 0} tracks
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsPage; 