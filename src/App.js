import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import NowPlayingBar from './components/NowPlayingBar';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <PlaylistProvider>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={<Login />}
            />
            <Route 
              path="/register" 
              element={<Register />}
            />
            <Route
              path="/*"
              element={
                <div className="flex">
                  <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                  <HomePage onMenuClick={() => setIsSidebarOpen(true)} />
                  <NowPlayingBar />
                </div>
              }
            />
          </Routes>
        </Router>
      </PlaylistProvider>
    </ThemeProvider>
  );
}

export default App;
