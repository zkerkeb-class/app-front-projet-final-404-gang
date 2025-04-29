import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserCircleIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';

const ProfilePage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const stats = [
    { label: 'Playlists', value: '12' },
    { label: 'Followers', value: '234' },
    { label: 'Following', value: '156' },
  ];

  const recentActivity = [
    { type: 'Created playlist', name: 'Chill Vibes 2024', date: '2 days ago' },
    { type: 'Liked song', name: 'Midnight Dreams', date: '3 days ago' },
    { type: 'Followed artist', name: 'Luna Wave', date: '1 week ago' },
  ];

  return (
    <div className={`flex-1 overflow-y-auto pb-24 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <div className={`relative h-80 ${isDarkMode ? 'bg-gradient-to-b from-zinc-800 to-black' : 'bg-gradient-to-b from-gray-100 to-white'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end gap-6">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-full h-full text-gray-300" />
              )}
            </div>
            <div className="flex-1 mb-4">
              <h1 className="text-4xl font-bold text-white mb-2">{user?.username}</h1>
              <div className="flex gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-white">
                    <span className="font-bold">{stat.value}</span>
                    <span className="text-white/80 ml-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h2>
            <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} shadow-lg`}>
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 ${
                    index !== recentActivity.length - 1
                      ? isDarkMode
                        ? 'border-b border-zinc-800'
                        : 'border-b border-gray-200'
                      : ''
                  }`}
                >
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                    <MusicalNoteIcon className="w-6 h-6 text-spotify-green" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activity.type}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                      {activity.name}
                    </p>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                    {activity.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Info */}
          <div className={`rounded-lg ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} p-6 shadow-lg h-fit`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Profile Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                  Email
                </label>
                <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.email}</p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                  Member Since
                </label>
                <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 