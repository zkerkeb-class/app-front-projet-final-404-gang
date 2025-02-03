import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
          isDarkMode 
            ? 'bg-zinc-800 hover:bg-zinc-700' 
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <UserCircleIcon className="h-8 w-8 text-gray-500" />
        <span className={`text-sm font-medium ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {user?.username || 'User'}
        </span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none ${
            isDarkMode 
              ? 'bg-zinc-800 border border-zinc-700' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => navigate('/profile')}
                className={`${
                  active 
                    ? isDarkMode 
                      ? 'bg-zinc-700' 
                      : 'bg-gray-100'
                    : ''
                } ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } group flex w-full items-center px-4 py-2 text-sm`}
              >
                Profile
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => navigate('/settings')}
                className={`${
                  active 
                    ? isDarkMode 
                      ? 'bg-zinc-700' 
                      : 'bg-gray-100'
                    : ''
                } ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } group flex w-full items-center px-4 py-2 text-sm`}
              >
                Settings
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active 
                    ? isDarkMode 
                      ? 'bg-zinc-700' 
                      : 'bg-gray-100'
                    : ''
                } ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } group flex w-full items-center px-4 py-2 text-sm`}
              >
                Logout
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileMenu; 