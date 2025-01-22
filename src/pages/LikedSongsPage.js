import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaylist } from '../contexts/PlaylistContext';
import { HeartIcon, PlayIcon, ClockIcon } from '@heroicons/react/24/solid';

const LikedSongsPage = () => {
  const { isDarkMode } = useTheme();
  const { setPlaylistAndPlay } = usePlaylist();
  const [likedSongs] = useState([]); // This would be managed by a proper likes context

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayAll = () => {
    if (likedSongs.length) {
      setPlaylistAndPlay(likedSongs, 0);
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto pb-24 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`px-4 py-6 ${isDarkMode ? 'bg-gradient-to-b from-purple-900/50' : 'bg-gradient-to-b from-purple-100'}`}>
        <div className="flex items-end gap-6">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center shadow-xl">
            <HeartIcon className="w-24 h-24 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Playlist</p>
            <h1 className="text-4xl font-bold mb-4">Liked Songs</h1>
            <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              {likedSongs.length} songs
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-4">
        <button
          onClick={handlePlayAll}
          disabled={!likedSongs.length}
          className="bg-green-500 hover:bg-green-400 text-black rounded-full p-4 shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Songs List */}
      <div className="px-4">
        {likedSongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg mb-2">Songs you like will appear here</p>
            <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              Save songs by tapping the heart icon
            </p>
          </div>
        ) : (
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
              {likedSongs.map((song, index) => (
                <tr
                  key={song._id}
                  className="group hover:bg-white/5 cursor-pointer"
                  onClick={() => setPlaylistAndPlay(likedSongs, index)}
                >
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={song.images?.thumbnail || song.album?.images?.thumbnail || '/placeholder.jpg'}
                        alt={song.title}
                        className="w-10 h-10 rounded"
                      />
                      <div>
                        <div className="font-medium">{song.title}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                          {song.artist?.name || 'Unknown Artist'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 hidden md:table-cell">
                    {song.album?.title || 'Unknown Album'}
                  </td>
                  <td className="py-2 hidden md:table-cell text-sm">
                    {new Date(song.addedAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="py-2 text-right">
                    {formatDuration(song.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LikedSongsPage; 