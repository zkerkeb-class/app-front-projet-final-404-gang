import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { PlayerProvider } from './contexts/PlayerContext';
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

function App() {
  return (
    <Router>
      <ThemeProvider>
        <PlaylistProvider>
          <PlayerProvider>
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
            </Routes>
          </PlayerProvider>
        </PlaylistProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
