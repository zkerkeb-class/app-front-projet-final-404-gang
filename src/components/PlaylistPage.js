import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PlayIcon, 
  PauseIcon, 
  ClockIcon 
} from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaylist } from '../contexts/PlaylistContext';
import { fetchPlaylistById } from '../services/playlistService';

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { currentTrack, isPlaying, setPlaylistAndPlay } = usePlaylist();
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
        console.error('Error loading playlist:', err);
        setError('Failed to load playlist');
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

  const handlePlayAll = () => {
    if (playlist?.tracks?.length) {
      setPlaylistAndPlay(playlist.tracks, 0);
    }
  };

  const handleTrackClick = (index) => {
    if (playlist?.tracks?.length) {
      setPlaylistAndPlay(playlist.tracks, index);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || 'Playlist not found'}
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto pb-24 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${isDarkMode ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-md`}>
        <div className="px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className={`${isDarkMode ? 'text-white' : 'text-gray-900'} hover:opacity-75`}
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Playlist Info */}
      <div className={`px-4 py-6 ${isDarkMode ? 'bg-gradient-to-b from-zinc-800/50' : 'bg-gradient-to-b from-gray-100'}`}>
        <div className="flex items-end gap-6">
          <img
            src={playlist.images?.large || playlist.images?.medium || '/playlist-placeholder.jpg'}
            alt={playlist.name}
            className="w-48 h-48 shadow-xl rounded-md"
          />
          <div>
            <p className="text-sm font-medium mb-2">Playlist</p>
            <h1 className="text-4xl font-bold mb-4">{playlist.name}</h1>
            {playlist.description && (
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                {playlist.description}
              </p>
            )}
            <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              {playlist.tracks.length} tracks
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-4">
        <button
          onClick={handlePlayAll}
          className="bg-green-500 hover:bg-green-400 text-black rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <PauseIcon className="h-8 w-8" />
          ) : (
            <PlayIcon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Tracks */}
      <div className="px-4">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
              <th className="text-left py-2 w-12">#</th>
              <th className="text-left py-2">Title</th>
              <th className="text-left py-2 hidden md:table-cell">Album</th>
              <th className="text-left py-2 hidden md:table-cell">Added</th>
              <th className="text-right py-2">
                <ClockIcon className="h-5 w-5 inline-block" />
              </th>
            </tr>
          </thead>
          <tbody>
            {playlist.tracks.map((track, index) => (
              <tr
                key={track._id}
                onClick={() => handleTrackClick(index)}
                className={`group hover:bg-white/5 cursor-pointer ${
                  currentTrack?._id === track._id ? 'text-green-500' : ''
                }`}
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
                  {track.album?.title || 'Unknown Album'}
                </td>
                <td className="py-2 hidden md:table-cell text-sm">
                  {new Date(playlist.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 text-right">
                  {formatDuration(track.duration)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlaylistPage; 