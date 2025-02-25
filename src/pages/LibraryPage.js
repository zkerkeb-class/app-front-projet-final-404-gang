import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const LibraryPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('playlists');

  const tabs = [
    { id: 'playlists', name: 'Playlists', path: '/playlists' },
    { id: 'artists', name: 'Artists', path: '/artists' },
    { id: 'albums', name: 'Albums', path: '/albums' },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-black'
                : isDarkMode
                ? 'text-white hover:bg-[#282828]'
                : 'text-gray-900 hover:bg-gray-200'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {/* This will be populated by the specific list components */}
      </div>
    </div>
  );
};

export default LibraryPage; 