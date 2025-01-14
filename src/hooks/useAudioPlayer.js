import { useState, useRef, useEffect } from 'react';
import { usePlaylist } from '../contexts/PlaylistContext';

export const REPEAT_MODES = {
  OFF: 'OFF',
  ALL: 'ALL',
  ONE: 'ONE'
};

const useAudioPlayer = () => {
  const audioRef = useRef(null);
  const { playNext, playPrevious, toggleShuffle: togglePlaylistShuffle, isShuffled } = usePlaylist();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [repeatMode, setRepeatMode] = useState(REPEAT_MODES.OFF);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (repeatMode === REPEAT_MODES.ONE) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext(repeatMode);
      }
    };

    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, playNext]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (value) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const updateVolume = (value) => {
    if (!audioRef.current) return;
    const newVolume = parseFloat(value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleRepeatMode = () => {
    setRepeatMode(current => {
      switch (current) {
        case REPEAT_MODES.OFF:
          return REPEAT_MODES.ALL;
        case REPEAT_MODES.ALL:
          return REPEAT_MODES.ONE;
        case REPEAT_MODES.ONE:
          return REPEAT_MODES.OFF;
        default:
          return REPEAT_MODES.OFF;
      }
    });
  };

  const toggleShuffle = () => {
    togglePlaylistShuffle();
  };

  return {
    audioRef,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    isLoading,
    repeatMode,
    shuffle: isShuffled,
    togglePlay,
    seek,
    toggleMute,
    updateVolume,
    toggleRepeatMode,
    toggleShuffle,
    playNext: () => playNext(repeatMode),
    playPrevious,
  };
};

export default useAudioPlayer; 