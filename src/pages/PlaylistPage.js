import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaylist } from '../contexts/PlaylistContext';
import { PlayIcon, ClockIcon } from '@heroicons/react/24/solid';
import { fetchPlaylistById } from '../services/playlistService';

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { setPlaylistAndPlay } = usePlaylist();
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPlaylistById(id);
        setPlaylist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaylist();
  }, [id]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  if (!playlist) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Playlist not found</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto pb-24 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`px-4 py-6 ${isDarkMode ? 'bg-gradient-to-b from-indigo-900/50' : 'bg-gradient-to-b from-indigo-100'}`}>
        <div className="flex items-end gap-6">
          <img
            src={playlist.images?.large || '/playlist-placeholder.jpg'}
            alt={playlist.name}
            className="w-48 h-48 object-cover shadow-xl"
          />
          <div>
            <p className="text-sm font-medium mb-2">Playlist</p>
            <h1 className="text-4xl font-bold mb-4">{playlist.name}</h1>
            <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              {playlist.description}
            </p>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              {playlist.tracks?.length || 0} songs
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-4">
        <button
          onClick={() => playlist.tracks?.length && setPlaylistAndPlay(playlist.tracks, 0)}
          disabled={!playlist.tracks?.length}
          className="bg-green-500 hover:bg-green-400 text-black rounded-full p-4 shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Tracks List */}
      <div className="px-4">
        {playlist.tracks?.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
                <th className="text-left py-2 w-12">#</th>
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2 hidden md:table-cell">Album</th>
                <th className="text-left py-2 hidden md:table-cell">Date added</th>
                <th className="text-right py-2">
                  <ClockIcon className="h-5 w-5 inline-block" />
                </th>
              </tr>
            </thead>
            <tbody>
              {playlist.tracks.map((track, index) => (
                <tr
                  key={track._id}
                  className="group hover:bg-white/5 cursor-pointer"
                  onClick={() => setPlaylistAndPlay(playlist.tracks, index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPlaylistAndPlay(playlist.tracks, index);
                    }
                  }}
                >
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={track.images?.thumbnail || track.album?.images?.thumbnail || '/placeholder.jpg'}
                        alt={track.title}
                        className="w-10 h-10 rounded"
                      />
                      <div>
                        <div className="font-medium">{track.title}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                          {track.artist?.name || 'Unknown Artist'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 hidden md:table-cell">
                    <button
                      className="hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/album/${track.album?._id}`);
                      }}
                    >
                      {track.album?.title || 'Unknown Album'}
                    </button>
                  </td>
                  <td className="py-2 hidden md:table-cell text-sm">
                    {new Date(track.addedAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="py-2 text-right">
                    {formatDuration(track.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
            No tracks in this playlist
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage; 