import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { shuffle as shuffleArray } from '../utils/array';
import { fetchTracks } from '../services/trackService';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [originalPlaylist, setOriginalPlaylist] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(new Audio());

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

    // Ensure tracks are properly formatted
    const formattedTracks = tracks.map(track => ({
      ...track,
      artist: track.artist?.name || 'Unknown Artist',
      album: track.album?.title || 'Unknown Album'
    }));

    setOriginalPlaylist(formattedTracks);
    setPlaylist(formattedTracks);
    setCurrentTrackIndex(startIndex);
  }, []);

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
    <PlayerContext.Provider
      value={{
        isFullscreen,
        setIsFullscreen,
        isPlaying,
        setIsPlaying,
        audioRef,
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
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};