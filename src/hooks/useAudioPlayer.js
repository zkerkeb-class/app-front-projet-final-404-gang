import { useState, useEffect, useCallback } from 'react';
import { usePlaylist } from '../contexts/PlaylistContext';
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
  const [repeatMode, setRepeatMode] = useState(REPEAT_MODES.OFF);
  const [shuffle, setShuffle] = useState(false);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const { currentTrack, playNext: playlistNext, playPrevious: playlistPrevious, toggleShuffle: togglePlaylistShuffle } = usePlaylist();
  const { audioRef } = usePlayer();

  // Update audio source when track changes
  useEffect(() => {
    if (currentTrack?.audioUrl && audioRef.current.src !== currentTrack.audioUrl) {
      console.log('Loading track:', currentTrack.title);
      console.log('Audio URL:', currentTrack.audioUrl);
      
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing audio:', error);
            setError(error.message);
          });
        }
      }
    } else {
      console.warn('No audio URL available for track:', currentTrack);
    }
  }, [currentTrack, isPlaying, audioRef]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === REPEAT_MODES.ONE) {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.error('Error replaying track:', error);
        });
      } else {
        playlistNext(repeatMode);
      }
    };
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
      
      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMessage = 'Playback aborted by user';
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error while loading track';
            break;
          case error.MEDIA_ERR_DECODE:
            errorMessage = 'Error decoding track';
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Track format not supported';
            break;
        }
      }
      
      setError(errorMessage);
      setIsPlaying(false);
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
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
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', () => setError(null));
    };
  }, [currentTrack, isPlaying, volume, isMuted, repeatMode, playlistNext, audioRef]);

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
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Error in togglePlay:', error);
          setError(error.message);
        });
      }
    }
  }, [isPlaying, currentTrack, audioRef]);

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
    setRepeatMode(current => {
      switch (current) {
        case REPEAT_MODES.OFF:
          return REPEAT_MODES.ALL;
        case REPEAT_MODES.ALL:
          return REPEAT_MODES.ONE;
        case REPEAT_MODES.ONE:
          return REPEAT_MODES.OFF;
        default:
          return REPEAT_MODES.OFF; // eslint-disable-line default-case
      }
    });
  }, []);

  const toggleShuffleMode = useCallback(() => {
    setShuffle(current => !current);
    togglePlaylistShuffle();
  }, [togglePlaylistShuffle]);

  const handlePlayNext = useCallback(() => {
    playlistNext(repeatMode);
  }, [playlistNext, repeatMode]);

  const handlePlayPrevious = useCallback(() => {
    playlistPrevious();
  }, [playlistPrevious]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      audioRef.current.muted = !prev;
      return !prev;
    });
  }, [audioRef]);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatMode,
    shuffle,
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