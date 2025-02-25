import { useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import useAudioPlayer from '../hooks/useAudioPlayer';

const KeyboardShortcutsHandler = () => {
  const { 
    togglePlay, 
    updateVolume, 
    volume,
    toggleMute,
    playNext,
    playPrevious,
    toggleRepeatMode,
    toggleShuffleMode
  } = useAudioPlayer();
  const { isFullscreen, setIsFullscreen } = usePlayer();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          if (e.shiftKey) playNext();
          break;
        case 'ArrowLeft':
          if (e.shiftKey) playPrevious();
          break;
        case 'ArrowUp':
          e.preventDefault();
          updateVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          updateVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyR':
          toggleRepeatMode();
          break;
        case 'KeyS':
          toggleShuffleMode();
          break;
        case 'KeyF':
          setIsFullscreen(!isFullscreen);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    togglePlay, 
    playNext, 
    playPrevious, 
    updateVolume, 
    volume, 
    toggleMute,
    toggleRepeatMode,
    toggleShuffleMode,
    isFullscreen,
    setIsFullscreen
  ]);

  return null;
};

export default KeyboardShortcutsHandler; 