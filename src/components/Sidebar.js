import React from 'react';
import { HomeIcon, MagnifyingGlassIcon, BuildingLibraryIcon, PlusCircleIcon, HeartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();

  const menuItems = [
    { icon: HomeIcon, text: 'Accueil', active: true },
    { icon: MagnifyingGlassIcon, text: 'Rechercher' },
    { icon: BuildingLibraryIcon, text: 'Bibliothèque' },
  ];

  const playlists = [
    'Playlist #1',
    'Mes favoris 2024',
    'Rock Classics',
    'Chill Mix',
    'Découvertes de la semaine',
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className={`lg:hidden fixed inset-0 z-40 ${
            isDarkMode ? 'bg-black bg-opacity-50' : 'bg-gray-600 bg-opacity-50'
          }`}
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Fermer le menu"
        />
      )}
      
      <div className={`
        fixed top-0 left-0 h-screen w-64 p-6 z-50
        ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex justify-between items-center mb-8">
          <img 
            src="/spotify-white.png" 
            alt="Spotify"
            className="h-10"
          />
          <button 
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-zinc-800 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav>
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`flex items-center w-full py-2 px-4 mb-2 rounded-lg 
                ${isDarkMode 
                  ? 'hover:bg-zinc-800' 
                  : 'hover:bg-gray-200'} 
                ${
                  item.active 
                    ? isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'
                    : ''
                }`}
            >
              <item.icon className="h-6 w-6 mr-4" />
              <span className="font-medium">{item.text}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8">
          <div className="space-y-4">
            <button 
              className={`flex items-center text-sm font-medium ${
                isDarkMode 
                  ? 'text-zinc-400 hover:text-white' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <PlusCircleIcon className="h-6 w-6 mr-2" />
              Créer une playlist
            </button>
            <button className="flex items-center text-sm font-medium text-zinc-400 hover:text-white">
              <HeartIcon className="h-6 w-6 mr-2" />
              Titres likés
            </button>
          </div>

          <div className={`mt-6 border-t pt-6 ${
            isDarkMode ? 'border-zinc-800' : 'border-gray-200'
          }`}>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-400px)]">
              {playlists.map((playlist, index) => (
                <button
                  key={index}
                  className={`block text-sm w-full text-left ${
                    isDarkMode 
                      ? 'text-zinc-400 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {playlist}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 