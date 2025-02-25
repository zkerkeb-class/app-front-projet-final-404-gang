import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { shuffle as shuffleArray } from '../utils/array';
import { fetchTracks } from '../services/trackService';
import { usePlayer } from './PlayerContext';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [originalPlaylist, setOriginalPlaylist] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setPlaylistAndPlay: playerSetPlaylistAndPlay } = usePlayer();

  // Fetch initial tracks
  useEffect(() => {
    const loadInitialTracks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching initial tracks...');
        const tracks = await fetchTracks({ 
          sort: 'popularity',
          order: 'desc',
          limit: 20 
        });
        console.log('Received tracks:', tracks);
        
        if (!Array.isArray(tracks)) {
          throw new Error('Received invalid tracks data');
        }
        
        if (tracks.length === 0) {
          console.log('No tracks received from API');
        }
        
        setOriginalPlaylist(tracks);
        setPlaylist(tracks);
      } catch (err) {
        console.error('Error loading tracks:', err);
        setError(err.message || 'Failed to load tracks');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTracks();
  }, []);

  const setPlaylistAndPlay = useCallback((tracks, startIndex = 0) => {
    if (!Array.isArray(tracks) || tracks.length === 0) {
      console.warn('Invalid tracks data provided to setPlaylistAndPlay');
      return;
    }

    // Let PlayerContext handle the playlist
    playerSetPlaylistAndPlay(tracks, startIndex);
  }, [playerSetPlaylistAndPlay]);

  const toggleShuffle = useCallback(() => {
    if (isShuffled) {
      // Return to original playlist
      const currentTrack = playlist[currentTrackIndex];
      setPlaylist(originalPlaylist);
      setCurrentTrackIndex(originalPlaylist.findIndex(track => track?._id === currentTrack?._id));
    } else {
      // Shuffle playlist keeping current track first
      const currentTrack = playlist[currentTrackIndex];
      const remainingTracks = playlist.filter((_, index) => index !== currentTrackIndex);
      const shuffledTracks = shuffleArray(remainingTracks);
      setPlaylist([currentTrack, ...shuffledTracks]);
      setCurrentTrackIndex(0);
    }
    setIsShuffled(!isShuffled);
  }, [playlist, currentTrackIndex, originalPlaylist, isShuffled]);

  const playNext = useCallback((repeatMode = 'OFF') => {
    if (playlist.length === 0) return;

    setCurrentTrackIndex(prevIndex => {
      if (prevIndex === playlist.length - 1) {
        return repeatMode === 'ALL' ? 0 : prevIndex;
      }
      return prevIndex + 1;
    });
  }, [playlist.length]);

  const playPrevious = useCallback(() => {
    if (currentTrackIndex <= 0 || playlist.length === 0) return;
    setCurrentTrackIndex(currentTrackIndex - 1);
  }, [currentTrackIndex, playlist.length]);

  const currentTrack = playlist[currentTrackIndex];

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        currentTrack,
        currentTrackIndex,
        isShuffled,
        isLoading,
        error,
        setPlaylistAndPlay,
        toggleShuffle,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};