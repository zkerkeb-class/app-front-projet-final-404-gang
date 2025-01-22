import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon, BuildingLibraryIcon, PlusCircleIcon, HeartIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: HomeIcon, text: 'Home', to: '/' },
    { icon: MagnifyingGlassIcon, text: 'Search', to: '/search' },
    { icon: BuildingLibraryIcon, text: 'Your Library', to: '/library' }
  ];

  const playlists = [
    'Playlist #1',
    'Mes favoris 2024',
    'Rock Classics',
    'Chill Mix',
    'Découvertes de la semaine',
  ];

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button 
          className="md:hidden fixed inset-0 z-40 bg-black/60 cursor-default"
          onClick={onClose}
          onKeyDown={handleKeyDown}
          aria-label="Close sidebar"
          tabIndex={0}
        />
      )}
      
      <div className={`
        fixed top-0 left-0 h-full w-[240px] bg-black text-white
        md:relative md:translate-x-0
        transform transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        z-50
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/">
              <img src="/spotify-white.png" alt="Spotify" className="h-10" />
            </Link>
            <button 
              onClick={onClose}
              className="md:hidden p-1 hover:bg-[#282828] rounded-full"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Main Menu */}
          <nav className="mb-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="flex items-center h-10 gap-4 text-[#B3B3B3] hover:text-white transition-colors group"
              >
                <item.icon className="h-6 w-6" />
                <span className="font-bold text-sm">{item.text}</span>
              </Link>
            ))}
          </nav>

          {/* Library Controls */}
          <div className="mt-6 space-y-4">
            <button className="flex items-center h-10 gap-4 text-[#B3B3B3] hover:text-white transition-colors w-full group">
              <PlusCircleIcon className="h-6 w-6" />
              <span className="font-bold text-sm">Create Playlist</span>
            </button>
            <button className="flex items-center h-10 gap-4 text-[#B3B3B3] hover:text-white transition-colors w-full group">
              <HeartIcon className="h-6 w-6" />
              <span className="font-bold text-sm">Liked Songs</span>
            </button>
          </div>

          {/* Separator */}
          <div className="my-4 border-t border-[#282828]" />

          {/* Playlists */}
          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {playlists.map((playlist, index) => (
              <button
                key={index}
                className="w-full text-left py-1 text-sm text-[#B3B3B3] hover:text-white transition-colors"
              >
                {playlist}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 