import React, { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { shuffle as shuffleArray } from '../utils/array';
import { fetchTracks } from '../services/trackService';
import KeyboardShortcutsHandler from '../components/KeyboardShortcutsHandler';
import CrossfadeHandler from '../components/CrossfadeHandler';

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
  const [isQueueVisible, setIsQueueVisible] = useState(false);
  const [repeatMode, setRepeatMode] = useState('OFF');
  
  const [queue, setQueue] = useState([]);
  const audioRef = useRef(new Audio());
  const nextAudioRef = useRef(new Audio());

  const formatTrackData = useCallback((track) => {
    if (!track) return null;
    
    console.log('Raw track data in PlayerContext:', track);
    console.log('Track album:', track.album);
    console.log('Track images:', track.images);
    
    return {
      ...track,
      artist: track.artist?.name || track.artist || 'Unknown Artist',
      album: track.album ? {
        ...track.album,
        title: track.album.title || track.album.name || 'Unknown Album'
      } : null,
      audioUrl: track.audioUrl,
      images: track.images || track.album?.images || {}
    };
  }, []);

  const currentTrack = useMemo(() => {
    const track = playlist[currentTrackIndex];
    console.log('Current track before formatting:', track);
    const formatted = track ? formatTrackData(track) : null;
    console.log('Current track after formatting:', formatted);
    return formatted;
  }, [playlist, currentTrackIndex, formatTrackData]);

  const addToQueue = useCallback((track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const playNextFromQueue = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const newQueue = queue.slice(1);
      setQueue(newQueue);
      
      const newPlaylist = [...playlist];
      newPlaylist.splice(currentTrackIndex + 1, 0, nextTrack);
      setPlaylist(newPlaylist);
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  }, [queue, playlist, currentTrackIndex]);

  const togglePlay = useCallback(() => {
    if (!currentTrack?.audioUrl) {
      console.warn('No track loaded');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            setError(error.message);
            setIsPlaying(false);
          });
      }
    }
  }, [currentTrack, isPlaying]);

  const setPlaylistAndPlay = useCallback((tracks, startIndex = 0) => {
    if (!Array.isArray(tracks) || tracks.length === 0) {
      console.warn('Invalid tracks data provided to setPlaylistAndPlay');
      return;
    }

    const formattedTracks = tracks.map(track => formatTrackData(track));
    console.log('Setting playlist with tracks:', formattedTracks);
    console.log('Starting playback at index:', startIndex);

    setOriginalPlaylist(formattedTracks);
    setPlaylist(formattedTracks);
    setCurrentTrackIndex(startIndex);
    setTimeout(() => setIsPlaying(true), 100);
  }, [formatTrackData]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const playTrack = async () => {
      if (!currentTrack) return;
      
      if (currentTrack?.audioUrl) {
        console.log('Loading track:', currentTrack.title, 'URL:', currentTrack.audioUrl);
        
        try {
          if (audio.src !== currentTrack.audioUrl) {
            audio.src = currentTrack.audioUrl;
            audio.load();
          }
          
          if (isPlaying) {
            console.log('Attempting to play track...');
            await audio.play();
            console.log('Playback started successfully');
          }
        } catch (error) {
          console.error('Error playing track:', error);
          setError(error.message);
          setIsPlaying(false);
        }
      } else {
        console.warn('No audio URL available for track:', currentTrack);
      }
    };

    playTrack();
  }, [currentTrack, isPlaying]);

  const toggleShuffle = useCallback(() => {
    if (isShuffled) {
      const currentTrack = playlist[currentTrackIndex];
      const newPlaylist = [...originalPlaylist];
      setPlaylist(newPlaylist);
      const newIndex = newPlaylist.findIndex(track => track?._id === currentTrack?._id);
      setCurrentTrackIndex(newIndex >= 0 ? newIndex : 0);
    } else {
      const currentTrack = playlist[currentTrackIndex];
      const remainingTracks = playlist.filter((_, index) => index !== currentTrackIndex);
      const shuffledTracks = shuffleArray([...remainingTracks]);
      const newPlaylist = [currentTrack, ...shuffledTracks];
      setPlaylist(newPlaylist);
      setCurrentTrackIndex(0);
    }
    setIsShuffled(!isShuffled);
  }, [playlist, currentTrackIndex, originalPlaylist, isShuffled]);

  const playNext = useCallback((repeatMode = 'OFF') => {
    if (queue.length > 0) {
      playNextFromQueue();
      setIsPlaying(true);
    } else {
      if (currentTrackIndex === playlist.length - 1) {
        if (repeatMode === 'ALL') {
          setCurrentTrackIndex(0);
          setIsPlaying(true);
        } else if (repeatMode === 'ONE') {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(error => {
            console.error('Error replaying track:', error);
          });
        }
      } else {
        const nextIndex = currentTrackIndex + 1;
        if (playlist[nextIndex]?.audioUrl) {
          setCurrentTrackIndex(nextIndex);
          setIsPlaying(true);
        } else {
          console.error('Next track has no audio URL:', playlist[nextIndex]);
        }
      }
    }
  }, [queue.length, playNextFromQueue, currentTrackIndex, playlist, audioRef]);

  const playPrevious = useCallback(() => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prevIndex => prevIndex - 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex]);

  const toggleRepeatMode = useCallback(() => {
    setRepeatMode(current => {
      switch (current) {
        case 'OFF':
          return 'ALL';
        case 'ALL':
          return 'ONE';
        case 'ONE':
          return 'OFF';
        default:
          return 'OFF';
      }
    });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        isFullscreen,
        setIsFullscreen,
        isPlaying,
        setIsPlaying,
        currentTrack,
        audioRef,
        queue,
        addToQueue,
        removeFromQueue,
        clearQueue,
        isQueueVisible,
        setIsQueueVisible,
        playNext,
        playPrevious,
        togglePlay,
        toggleRepeatMode,
        toggleShuffle,
        repeatMode,
        isShuffled,
        setPlaylistAndPlay,
        error,
        isLoading
      }}
    >
      <KeyboardShortcutsHandler />
      <CrossfadeHandler />
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