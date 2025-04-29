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
import { fetchAlbumById } from '../services/albumService';

const AlbumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { currentTrack, isPlaying, setPlaylistAndPlay } = usePlaylist();
  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAlbumById(id);
        setAlbum(data);
      } catch (err) {
        console.error('Error loading album:', err);
        setError('Failed to load album');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlbum();
  }, [id]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayAll = () => {
    if (album?.tracks?.length) {
      setPlaylistAndPlay(album.tracks, 0);
    }
  };

  const handleTrackClick = (index) => {
    if (album?.tracks?.length) {
      setPlaylistAndPlay(album.tracks, index);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || 'Album not found'}
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

      {/* Album Info */}
      <div className={`px-4 py-6 ${isDarkMode ? 'bg-gradient-to-b from-zinc-800/50' : 'bg-gradient-to-b from-gray-100'}`}>
        <div className="flex items-end gap-6">
          <img
            src={album.images?.large || album.images?.medium || '/album-placeholder.jpg'}
            alt={album.title}
            className="w-48 h-48 shadow-xl rounded-md"
          />
          <div>
            <p className="text-sm font-medium mb-2">Album</p>
            <h1 className="text-4xl font-bold mb-4">{album.title}</h1>
            <div className="flex items-center gap-2 text-sm">
              <img
                src={album.artist?.images?.thumbnail || '/artist-placeholder.jpg'}
                alt={album.artist?.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">{album.artist?.name || 'Unknown Artist'}</span>
              <span className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}>
                • {new Date(album.releaseDate).getFullYear()}
                • {album.tracks.length} tracks
              </span>
            </div>
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
              <th className="text-right py-2">
                <ClockIcon className="h-5 w-5 inline-block" />
              </th>
            </tr>
          </thead>
          <tbody>
            {album.tracks.map((track, index) => (
              <tr
                key={track._id}
                onClick={() => handleTrackClick(index)}
                className={`group hover:bg-white/5 cursor-pointer ${
                  currentTrack?._id === track._id ? 'text-green-500' : ''
                }`}
              >
                <td className="py-2">{index + 1}</td>
                <td className="py-2">
                  <div className="font-medium">{track.title}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                    {track.artist?.name || 'Unknown Artist'}
                  </div>
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

export default AlbumPage; 