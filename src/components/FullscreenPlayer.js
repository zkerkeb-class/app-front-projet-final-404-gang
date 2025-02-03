import React, { useEffect } from 'react';
import { usePlaylist } from '../contexts/PlaylistContext';
import useWaveform from '../hooks/useWaveform';
import useAudioPlayer, { REPEAT_MODES } from '../hooks/useAudioPlayer';
import {
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
} from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';

const ImageWithFallback = ({ track, className }) => {
  // Get the best available image
  const getImageUrl = () => {
    if (!track) return '/placeholder.jpg';
    
    // Check album images first
    if (track.album?.images) {
      const { large, medium, small, thumbnail } = track.album.images;
      return large || medium || small || thumbnail;
    }
    
    // Then check track images
    if (track.images) {
      const { large, medium, small, thumbnail } = track.images;
      return large || medium || small || thumbnail;
    }

    return '/placeholder.jpg';
  };

  return (
    <img
      src={getImageUrl()}
      alt={track?.title || 'Track cover'}
      className={className}
      onError={(e) => {
        e.target.src = '/placeholder.jpg';
      }}
    />
  );
};

const FullscreenPlayer = ({ onClose }) => {
  const { currentTrack } = usePlaylist();
  const {
    currentTime,
    duration,
    seek,
    repeatMode,
    shuffle,
    toggleRepeatMode,
    toggleShuffleMode,
    playNext,
    playPrevious,
  } = useAudioPlayer();
  const { canvasRef, isLoading: isWaveformLoading } = useWaveform(currentTrack?.audioUrl);
  const { isDarkMode } = useTheme();
  const { audioRef, isPlaying, setIsFullscreen, setIsPlaying } = usePlayer();

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  useEffect(() => {
    if (currentTrack && audioRef.current.src !== currentTrack.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }, [currentTrack, audioRef]);

  if (!currentTrack) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
      isDarkMode ? 'bg-black bg-opacity-90' : 'bg-white bg-opacity-95'
    }`}>
      <button
        onClick={() => setIsFullscreen(false)}
        className={`absolute top-4 right-4 ${
          isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
        }`}
        aria-label="Fermer"
      >
        <XMarkIcon className="h-8 w-8" />
      </button>

      <div className="flex flex-col items-center w-full max-w-6xl px-4 sm:px-8 lg:px-16">
        <div className="relative mb-8 rounded-lg overflow-hidden group w-full max-w-3xl">
          <ImageWithFallback
            track={currentTrack}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-white rounded-full p-4 transform hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <PauseIcon className="h-12 w-12 text-black" />
              ) : (
                <PlayIcon className="h-12 w-12 text-black" />
              )}
            </button>
          </div>
        </div>

        <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-center mb-8`}>
          <h1 className="text-4xl font-bold mb-2">{currentTrack.title}</h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {currentTrack.artist?.name || 'Unknown Artist'}
          </p>
          {currentTrack.album?.title && (
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              {currentTrack.album.title}
            </p>
          )}
        </div>

        <div className="mb-8 w-full max-w-3xl">
          <canvas
            ref={canvasRef}
            width="800"
            height="100"
            className={`w-full ${isWaveformLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          />
        </div>

        <div className="flex flex-col items-center w-full max-w-3xl">
          <div className="flex items-center gap-6 mb-4">
            <button
              onClick={toggleShuffleMode}
              className={`${
                shuffle ? 'text-green-500' : isDarkMode ? 'text-white' : 'text-gray-900'
              } hover:scale-105 transition-transform`}
              aria-label="Lecture aléatoire"
            >
              <ArrowsRightLeftIcon className="h-6 w-6" />
            </button>

            <button
              onClick={playPrevious}
              className={`${isDarkMode ? 'text-white' : 'text-gray-900'} hover:scale-105 transition-transform`}
              aria-label="Précédent"
            >
              <BackwardIcon className="h-8 w-8" />
            </button>

            <button
              onClick={togglePlay}
              className={`${isDarkMode ? 'bg-white text-black' : 'bg-gray-900 text-white'} rounded-full p-4 hover:scale-105 transition-transform`}
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? (
                <PauseIcon className="h-8 w-8" />
              ) : (
                <PlayIcon className="h-8 w-8" />
              )}
            </button>

            <button
              onClick={() => playNext()}
              className={`${isDarkMode ? 'text-white' : 'text-gray-900'} hover:scale-105 transition-transform`}
              aria-label="Suivant"
            >
              <ForwardIcon className="h-8 w-8" />
            </button>

            <button
              onClick={toggleRepeatMode}
              className={`${
                repeatMode !== REPEAT_MODES.OFF ? 'text-green-500' : isDarkMode ? 'text-white' : 'text-gray-900'
              } hover:scale-105 transition-transform relative`}
              aria-label="Mode répétition"
            >
              {repeatMode === REPEAT_MODES.ONE ? (
                <ArrowPathIcon className="h-6 w-6" />
              ) : (
                <ArrowPathRoundedSquareIcon className="h-6 w-6" />
              )}
              {repeatMode === REPEAT_MODES.ONE && (
                <span className="absolute -top-1 -right-1 text-xs font-bold">1</span>
              )}
            </button>
          </div>

          <div className="w-full flex items-center gap-2">
            <span className={`text-xs w-10 text-right ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
              {formatTime(currentTime)}
            </span>
            <div className={`flex-1 h-1 rounded-full relative group ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                aria-label="Progression"
              />
              <div
                className={`h-full rounded-full relative ${
                  isDarkMode ? 'bg-white' : 'bg-gray-900'
                }`}
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              >
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDarkMode ? 'bg-white' : 'bg-gray-900'
                }`} />
              </div>
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'} w-12`}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenPlayer;