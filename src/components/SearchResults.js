import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaylist } from '../contexts/PlaylistContext';
import { PlayIcon } from '@heroicons/react/24/solid';

const SearchResults = ({ results }) => {
  const { isDarkMode } = useTheme();
  const { setPlaylistAndPlay } = usePlaylist();

  const ResultSection = ({ title, items, type }) => {
    if (!items || items.length === 0) return null;

    return (
      <section className="mb-8">
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className={`group p-4 rounded-lg transition-all hover:bg-opacity-100 ${
                isDarkMode ? 'bg-zinc-900/50 hover:bg-zinc-800' : 'bg-white hover:bg-gray-100'
              } cursor-pointer`}
            >
              <div className="relative">
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded-md shadow-lg mb-4"
                />
                <button
                  onClick={() => setPlaylistAndPlay(item)}
                  className="absolute bottom-2 right-2 p-3 rounded-full bg-spotify-green text-black opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg hover:scale-105"
                >
                  <PlayIcon className="h-6 w-6" />
                </button>
              </div>
              <h3 className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.name}
              </h3>
              <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {type === 'tracks' ? item.artist : type === 'albums' ? item.artist : 'Playlist'}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div>
      <ResultSection title="Songs" items={results.tracks} type="tracks" />
      <ResultSection title="Artists" items={results.artists} type="artists" />
      <ResultSection title="Albums" items={results.albums} type="albums" />
      <ResultSection title="Playlists" items={results.playlists} type="playlists" />
    </div>
  );
};

export default SearchResults; 