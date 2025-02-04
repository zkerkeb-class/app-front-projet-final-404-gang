import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaylist } from '../contexts/PlaylistContext';
import { PlayIcon, ClockIcon } from '@heroicons/react/24/solid';
import { fetchAlbumById } from '../services/albumService';

const AlbumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { setPlaylistAndPlay } = usePlaylist();
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
        setError(err.message);
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

  if (!album) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Album not found</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto pb-24 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`px-4 py-6 ${isDarkMode ? 'bg-gradient-to-b from-green-900/50' : 'bg-gradient-to-b from-green-100'}`}>
        <div className="flex items-end gap-6">
          <img
            src={album.images?.large || '/album-placeholder.jpg'}
            alt={album.title}
            className="w-48 h-48 object-cover shadow-xl"
          />
          <div>
            <p className="text-sm font-medium mb-2">Album</p>
            <h1 className="text-4xl font-bold mb-4">{album.title}</h1>
            <button
              className="hover:underline font-medium"
              onClick={() => navigate(`/artist/${album.artist?._id}`)}
            >
              {album.artist?.name || 'Unknown Artist'}
            </button>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              {new Date(album.releaseDate).getFullYear()} • {album.tracks?.length || 0} songs
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-4">
        <button
          onClick={() => album.tracks?.length && setPlaylistAndPlay(album.tracks, 0)}
          disabled={!album.tracks?.length}
          className="bg-green-500 hover:bg-green-400 text-black rounded-full p-4 shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Tracks List */}
      <div className="px-4">
        {album.tracks?.length > 0 ? (
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
                  className="group hover:bg-white/5 cursor-pointer"
                  onClick={() => setPlaylistAndPlay(album.tracks, index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPlaylistAndPlay(album.tracks, index);
                    }
                  }}
                >
                  <td className="py-2">{track.trackNumber || index + 1}</td>
                  <td className="py-2">
                    <div className="font-medium">{track.title}</div>
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
            No tracks in this album
          </p>
        )}
      </div>
    </div>
  );
};

export default AlbumPage; 