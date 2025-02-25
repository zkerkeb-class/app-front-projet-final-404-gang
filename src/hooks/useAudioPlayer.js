import { useState, useEffect, useCallback } from 'react';
import { usePlayer } from '../contexts/PlayerContext';

export const REPEAT_MODES = {
  OFF: 'OFF',
  ALL: 'ALL',
  ONE: 'ONE'
};

const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const { 
    currentTrack,
    playNext: playerPlayNext,
    playPrevious: playerPlayPrevious,
    isShuffled,
    toggleRepeatMode: playerToggleRepeat,
    toggleShuffle: playerToggleShuffle,
    repeatMode,
    audioRef
  } = usePlayer();

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleLoadedMetadata = () => {
      console.log('Track loaded:', currentTrack?.title);
      console.log('Duration:', audio.duration);
      setDuration(audio.duration);
      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Error playing after metadata load:', error);
          setError(error.message);
        });
      }
    };
    const handleError = (e) => {
      console.error('Audio error:', e);
      const error = e.target.error;
      let errorMessage = 'Unknown error playing track';
      
      switch (error?.code) {
        case error?.MEDIA_ERR_ABORTED:
          errorMessage = 'Playback aborted by user';
          break;
        case error?.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error while loading track';
          break;
        case error?.MEDIA_ERR_DECODE:
          errorMessage = 'Error decoding track';
          break;
        case error?.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Track format not supported';
          break;
        default:
          errorMessage = 'Unknown error playing track';
          break;
      }
      
      setError(errorMessage);
      setIsPlaying(false);
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', () => setError(null));

    // Update volume and mute state
    audio.volume = volume;
    audio.muted = isMuted;

    return () => {
      // Remove event listeners
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', () => setError(null));
    };
  }, [currentTrack, isPlaying, volume, isMuted, repeatMode, playerPlayNext, audioRef]);

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
            console.log('Playback started in useAudioPlayer');
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Error in togglePlay:', error);
            setError(error.message);
            setIsPlaying(false);
          });
      }
    }
  }, [currentTrack, isPlaying, setIsPlaying]);

  // Add effect to handle audio state changes
  useEffect(() => {
    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, setIsPlaying]);

  const seek = useCallback((time) => {
    if (!audioRef.current.duration) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, [audioRef]);

  const updateVolume = useCallback((newVolume) => {
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  }, [audioRef]);

  const toggleRepeatMode = useCallback(() => {
    playerToggleRepeat();
  }, [playerToggleRepeat]);

  const toggleShuffleMode = useCallback(() => {
    playerToggleShuffle();
  }, [playerToggleShuffle]);

  const handlePlayNext = useCallback(() => {
    playerPlayNext(repeatMode);
  }, [playerPlayNext, repeatMode]);

  const handlePlayPrevious = useCallback(() => {
    playerPlayPrevious();
  }, [playerPlayPrevious]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      audioRef.current.muted = !prev;
      return !prev;
    });
  }, [audioRef]);

  // Add back the track ending handler
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (repeatMode === 'ONE') {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.error('Error replaying track:', error);
        });
      } else {
        playerPlayNext(repeatMode);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [audioRef, repeatMode, playerPlayNext]);

  // Add debug logging for play state changes
  useEffect(() => {
    console.log('Play state changed:', isPlaying);
  }, [isPlaying]);

  // Add debug logging for track changes
  useEffect(() => {
    console.log('Current track in useAudioPlayer:', currentTrack);
  }, [currentTrack]);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatMode,
    shuffle: isShuffled,
    error,
    isMuted,
    togglePlay,
    seek,
    updateVolume,
    toggleRepeatMode,
    toggleShuffleMode,
    playNext: handlePlayNext,
    playPrevious: handlePlayPrevious,
    toggleMute,
    audioRef,
    setCurrentTime,
    setIsPlaying
  };
};

export default useAudioPlayer;