import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserCircleIcon, BellIcon, ShieldCheckIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', name: 'Account', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.username}
                    className={`w-full px-3 py-2 rounded-md border ${
                      isDarkMode 
                        ? 'bg-zinc-800 border-zinc-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-spotify-green focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className={`w-full px-3 py-2 rounded-md border ${
                      isDarkMode 
                        ? 'bg-zinc-800 border-zinc-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-spotify-green focus:border-transparent`}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Appearance
              </h3>
              <div className="flex items-center justify-between p-4 rounded-lg border ${
                isDarkMode ? 'border-zinc-800' : 'border-gray-200'
              }">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <MoonIcon className="h-6 w-6 text-white" />
                  ) : (
                    <SunIcon className="h-6 w-6 text-gray-900" />
                  )}
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    Theme Mode
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-full bg-spotify-green text-black font-medium hover:scale-105 transition-transform"
                >
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 rounded-full bg-spotify-green text-black font-medium hover:scale-105 transition-transform">
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Notification Preferences
            </h3>
            {['New Followers', 'Playlist Updates', 'Artist Updates', 'New Features'].map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isDarkMode ? 'border-zinc-800' : 'border-gray-200'
                }`}
              >
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-spotify-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spotify-green"></div>
                </label>
              </div>
            ))}
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Privacy Settings
            </h3>
            {[
              'Make my profile public',
              'Show my playlists to followers',
              'Allow others to see what I\'m listening to',
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isDarkMode ? 'border-zinc-800' : 'border-gray-200'
                }`}
              >
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-spotify-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spotify-green"></div>
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto pb-24 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className={`space-y-1 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} rounded-lg p-2`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-spotify-green text-black'
                      : isDarkMode
                      ? 'text-white hover:bg-zinc-800'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className={`lg:col-span-3 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 