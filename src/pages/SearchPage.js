import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/ThemeContext';

const SearchPage = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const genres = [
    { name: 'Pop', color: 'bg-purple-500' },
    { name: 'Hip-Hop', color: 'bg-orange-500' },
    { name: 'Rock', color: 'bg-red-500' },
    { name: 'Electronic', color: 'bg-blue-500' },
    { name: 'Jazz', color: 'bg-yellow-500' },
    { name: 'R&B', color: 'bg-pink-500' },
    { name: 'Classical', color: 'bg-green-500' },
    { name: 'Metal', color: 'bg-gray-500' },
  ];

  return (
    <div className="p-6">
      {/* Search Input */}
      <div className="mb-8">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-full ${
          isDarkMode ? 'bg-[#242424] text-white' : 'bg-white text-black'
        }`}>
          <MagnifyingGlassIcon className="h-6 w-6" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            className="bg-transparent w-full focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Browse All */}
      <h2 className="text-2xl font-bold mb-4">Browse All</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {genres.map((genre, index) => (
          <button
            key={index}
            className={`${genre.color} aspect-square rounded-lg p-4 relative overflow-hidden hover:scale-105 transition-transform`}
          >
            <span className="font-bold text-white text-xl">{genre.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchPage; 