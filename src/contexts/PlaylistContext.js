import React, { createContext, useContext, useState, useCallback } from 'react';
import { shuffle as shuffleArray } from '../utils/array';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [originalPlaylist, setOriginalPlaylist] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);

  const setPlaylistAndPlay = useCallback((tracks, startIndex = 0) => {
    setOriginalPlaylist(tracks);
    setPlaylist(tracks);
    setCurrentTrackIndex(startIndex);
    setIsShuffled(false);
  }, []);

  const toggleShuffle = useCallback(() => {
    if (isShuffled) {
      // Revenir à la playlist originale
      const currentTrack = playlist[currentTrackIndex];
      setPlaylist(originalPlaylist);
      setCurrentTrackIndex(originalPlaylist.findIndex(track => track.id === currentTrack.id));
    } else {
      // Mélanger la playlist en gardant la piste actuelle en première position
      const currentTrack = playlist[currentTrackIndex];
      const remainingTracks = playlist.filter((_, index) => index !== currentTrackIndex);
      const shuffledTracks = shuffleArray(remainingTracks);
      setPlaylist([currentTrack, ...shuffledTracks]);
      setCurrentTrackIndex(0);
    }
    setIsShuffled(!isShuffled);
  }, [playlist, currentTrackIndex, originalPlaylist, isShuffled]);

  const playNext = useCallback((repeatMode) => {
    if (currentTrackIndex < 0 || playlist.length === 0) return;

    if (currentTrackIndex === playlist.length - 1) {
      if (repeatMode === 'ALL') {
        setCurrentTrackIndex(0);
      }
    } else {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  }, [currentTrackIndex, playlist.length]);

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