import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SearchSkeleton = () => {
  const { isDarkMode } = useTheme();
  const sections = ['Songs', 'Artists', 'Albums', 'Playlists'];

  const SkeletonItem = () => (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-zinc-900/50' : 'bg-gray-100'}`}>
      <div className={`w-full aspect-square rounded-md mb-4 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'} animate-pulse`} />
      <div className={`h-4 w-3/4 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'} animate-pulse mb-2`} />
      <div className={`h-3 w-1/2 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'} animate-pulse`} />
    </div>
  );

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section}>
          <div className={`h-8 w-48 rounded mb-4 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'} animate-pulse`} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSkeleton; 