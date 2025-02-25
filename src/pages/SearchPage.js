import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import useSearch from '../hooks/useSearch';
import SearchResults from '../components/SearchResults';
import SearchSkeleton from '../components/SearchSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const SearchPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { query, setQuery, results, isLoading, error } = useSearch();

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

  const hasResults = Object.values(results).some(array => array.length > 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-10 p-4 backdrop-blur-md bg-opacity-90">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-full ${
          isDarkMode ? 'bg-[#242424] text-white' : 'bg-white text-black'
        } shadow-lg`}>
          <MagnifyingGlassIcon className="h-6 w-6" />
          <input
            type="text"
            placeholder={user ? "What do you want to listen to?" : "Search music..."}
            className="bg-transparent w-full focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-spotify-green border-t-transparent" />
          )}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {query ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <SearchSkeleton />
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : !hasResults ? (
                <div className="text-center py-8 text-gray-500">
                  No results found for "{query}"
                </div>
              ) : (
                <SearchResults results={results} />
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4">Browse All</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {genres.map((genre, index) => (
                  <motion.button
                    key={index}
                    className={`${genre.color} aspect-square rounded-lg p-4 relative overflow-hidden hover:scale-105 transition-transform`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-bold text-white text-xl">{genre.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchPage; 