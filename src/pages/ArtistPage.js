import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaylist } from '../contexts/PlaylistContext';
import { PlayIcon, ClockIcon } from '@heroicons/react/24/solid';
import { fetchArtistById } from '../services/artistService';

const ArtistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { setPlaylistAndPlay } = usePlaylist();
  const [artist, setArtist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtist = async () => {
      try {
        setIsLoading(true);
        const data = await fetchArtistById(id);
        setArtist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtist();
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

  if (!artist) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Artist not found</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto pb-24 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`px-4 py-6 ${isDarkMode ? 'bg-gradient-to-b from-blue-900/50' : 'bg-gradient-to-b from-blue-100'}`}>
        <div className="flex items-end gap-6">
          <img
            src={artist.images?.large || '/placeholder.jpg'}
            alt={artist.name}
            className="w-48 h-48 object-cover rounded-full shadow-xl"
          />
          <div>
            <p className="text-sm font-medium mb-2">Artist</p>
            <h1 className="text-4xl font-bold mb-4">{artist.name}</h1>
            <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              {artist.genres?.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-4">
        <button
          onClick={() => artist.popularTracks?.length && setPlaylistAndPlay(artist.popularTracks, 0)}
          disabled={!artist.popularTracks?.length}
          className="bg-green-500 hover:bg-green-400 text-black rounded-full p-4 shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Popular Tracks */}
      <div className="px-4">
        <h2 className="text-2xl font-bold mb-4">Popular</h2>
        {artist.popularTracks?.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
                <th className="text-left py-2 w-12">#</th>
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2 hidden md:table-cell">Album</th>
                <th className="text-right py-2">
                  <ClockIcon className="h-5 w-5 inline-block" />
                </th>
              </tr>
            </thead>
            <tbody>
              {artist.popularTracks.map((track, index) => (
                <tr
                  key={track._id}
                  className="group hover:bg-white/5 cursor-pointer"
                  onClick={() => setPlaylistAndPlay(artist.popularTracks, index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPlaylistAndPlay(artist.popularTracks, index);
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
                      <div className="font-medium">{track.title}</div>
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
                  <td className="py-2 text-right">
                    {formatDuration(track.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
            No tracks available
          </p>
        )}
      </div>

      {/* Albums */}
      <div className="px-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {artist.albums?.map((album) => (
            <button
              key={album._id}
              className={`group p-4 rounded-lg transition-all duration-300 hover:bg-white/5 text-left`}
              onClick={() => navigate(`/album/${album._id}`)}
            >
              <div className="relative aspect-square mb-4">
                <img
                  src={album.images?.medium || '/placeholder.jpg'}
                  alt={album.title}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                <button
                  className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle play album
                  }}
                >
                  <PlayIcon className="h-6 w-6 text-black" />
                </button>
              </div>
              <h3 className="font-semibold truncate mb-1">{album.title}</h3>
              <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                {new Date(album.releaseDate).getFullYear()}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistPage; 