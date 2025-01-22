import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bars3Icon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/ThemeContext';

const TopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const isHomePage = location.pathname === '/';
  const showBackButton = !isHomePage;

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className={`sticky top-0 z-10 ${isDarkMode ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-md border-b ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className={`lg:hidden ${isDarkMode ? 'text-white' : 'text-gray-900'} hover:opacity-75`}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className={`${isDarkMode ? 'bg-black/60' : 'bg-white/60'} rounded-full p-2 ${
                showBackButton ? 'text-white hover:bg-[#282828]' : 'text-gray-500 opacity-50 cursor-not-allowed'
              }`}
              disabled={!showBackButton}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate(1)}
              className={`${isDarkMode ? 'bg-black/60' : 'bg-white/60'} rounded-full p-2 text-gray-500 opacity-50 cursor-not-allowed`}
              disabled
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Search Button - Only on home page */}
          {isHomePage && (
            <button
              onClick={() => handleNavigate('/search')}
              className={`hidden sm:flex items-center gap-2 ${
                isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
              }`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Search</span>
            </button>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-gray-900'
            } hover:scale-105 transition-transform`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate('/register')}
              className={`hidden sm:block px-4 py-2 rounded-full ${
                isDarkMode 
                  ? 'text-white hover:text-gray-300' 
                  : 'text-gray-900 hover:text-gray-600'
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => handleNavigate('/login')}
              className="px-6 py-2 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 