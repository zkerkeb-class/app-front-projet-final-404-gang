import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NowPlayingBar from './NowPlayingBar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-spotify-black text-white flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-spotify">
          <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Now Playing Bar */}
      <div className="h-24 bg-spotify-gray border-t border-[#282828] flex-shrink-0">
        <NowPlayingBar />
      </div>
    </div>
  );
};

export default Layout; 