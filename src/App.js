import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { RoomProvider } from './contexts/RoomContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PlaylistPage from './pages/PlaylistPage';
import AlbumPage from './pages/AlbumPage';
import ArtistPage from './pages/ArtistPage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import PlaylistsPage from './pages/PlaylistsPage';
import AlbumsPage from './pages/AlbumsPage';
import ArtistsPage from './pages/ArtistsPage';
import LikedSongsPage from './pages/LikedSongsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Room from './components/Room';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <PlayerProvider>
            <RoomProvider>
              <PlaylistProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="playlists" element={<PlaylistsPage />} />
                    <Route path="playlist/:id" element={<PlaylistPage />} />
                    <Route path="albums" element={<AlbumsPage />} />
                    <Route path="album/:id" element={<AlbumPage />} />
                    <Route path="artists" element={<ArtistsPage />} />
                    <Route path="artist/:id" element={<ArtistPage />} />
                    <Route path="liked-songs" element={<LikedSongsPage />} />
                  </Route>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/room/:roomId" element={<Room />} />
                </Routes>
              </PlaylistProvider>
            </RoomProvider>
          </PlayerProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
