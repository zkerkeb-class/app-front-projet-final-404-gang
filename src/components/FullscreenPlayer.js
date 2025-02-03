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
      return track.album.images.large || 
             track.album.images.medium || 
             track.album.images.small || 
             track.album.images.thumbnail;
    }
    
    // Then check track images
    if (track.images) {
      return track.images.large || 
             track.images.medium || 
             track.images.small || 
             track.images.thumbnail;
    }

    // If no images found, return placeholder
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

const FullscreenPlayer = () => {
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
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setIsPlaying(true);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-zinc-900/95' : 'bg-white/95'}`}>
      {/* Header - Refined spacing and opacity */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 lg:px-8 lg:py-6">
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <img 
                src="/spotify-logo.png" 
                alt="Logo" 
                className="w-5 h-5"
                onError={(e) => e.target.style.display = 'none'} 
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-[11px] uppercase tracking-wider ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                Playing from Playlist
              </span>
              <span className={`text-sm font-medium mt-0.5 ${
                isDarkMode ? 'text-white' : 'text-zinc-900'
              }`}>
                Study Session - lofi beats to focus/work to
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsFullscreen(false)}
            className={`p-2 hover:scale-105 transition-transform ${
              isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main content - Improved layout and spacing */}
      <div className="h-full w-full flex flex-col lg:flex-row items-center justify-center px-4 pt-20 pb-8 lg:px-28 lg:pt-16 lg:pb-16 max-w-screen-2xl mx-auto">
        {/* Album Art - Adjusted size and shadow */}
        <div className="w-full max-w-sm lg:w-[600px] aspect-square mb-8 lg:mb-0 relative">
          <div className="relative w-full h-full rounded-md overflow-hidden shadow-[0_32px_48px_-12px_rgba(0,0,0,0.3)]">
            {currentTrack && (
              <ImageWithFallback
                track={currentTrack}
                className="w-full h-full object-cover"
              />
            )}
            <div className="lg:hidden absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
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
        </div>

        {/* Track Info and Controls - Refined typography and spacing */}
        <div className="w-full lg:w-[45%] lg:pl-24 flex flex-col items-center lg:items-start">
          <div className={`text-center lg:text-left ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
            <h1 className="text-3xl lg:text-[4rem] font-bold mb-2 lg:mb-4 leading-tight">
              {currentTrack.title}
            </h1>
            <p className={`text-lg lg:text-2xl font-medium ${
              isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              {currentTrack.artist?.name}
            </p>
          </div>

          {/* Waveform - Refined for desktop */}
          <div className="hidden lg:block w-full my-12">
            <canvas
              ref={canvasRef}
              width="800"
              height="80"
              className={`w-full ${isWaveformLoading ? 'opacity-0' : 'opacity-60'} transition-opacity`}
            />
          </div>

          {/* Progress bar - Improved interaction */}
          <div className="w-full flex items-center gap-2 mt-8 lg:mt-4 mb-8">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              {formatTime(currentTime)}
            </span>
            <div className={`flex-1 h-1 rounded-full relative group ${
              isDarkMode ? 'bg-zinc-600' : 'bg-zinc-200'
            }`}>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`h-full rounded-full ${isDarkMode ? 'bg-white' : 'bg-zinc-900'}`}
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              >
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDarkMode ? 'bg-white' : 'bg-zinc-900'
                }`} />
              </div>
            </div>
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Playback controls - Refined sizing and spacing */}
          <div className="flex items-center justify-center lg:justify-start gap-8">
            <button
              onClick={toggleShuffleMode}
              className={`transition-all hover:scale-110 ${
                shuffle ? 'text-green-500' : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ArrowsRightLeftIcon className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            <button
              onClick={playPrevious}
              className={`transition-all hover:scale-110 ${
                isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <BackwardIcon className="h-7 w-7 lg:h-8 lg:w-8" />
            </button>

            <button
              onClick={togglePlay}
              className={`p-4 rounded-full transition-transform hover:scale-110 ${
                isDarkMode ? 'bg-white text-black' : 'bg-zinc-900 text-white'
              }`}
            >
              {isPlaying ? (
                <PauseIcon className="h-8 w-8 lg:h-9 lg:w-9" />
              ) : (
                <PlayIcon className="h-8 w-8 lg:h-9 lg:w-9" />
              )}
            </button>

            <button
              onClick={playNext}
              className={`transition-all hover:scale-110 ${
                isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ForwardIcon className="h-7 w-7 lg:h-8 lg:w-8" />
            </button>

            <button
              onClick={toggleRepeatMode}
              className={`transition-all hover:scale-110 relative ${
                repeatMode !== REPEAT_MODES.OFF 
                  ? 'text-green-500' 
                  : isDarkMode 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {repeatMode === REPEAT_MODES.ONE ? (
                <ArrowPathIcon className="h-5 w-5 lg:h-6 lg:w-6" />
              ) : (
                <ArrowPathRoundedSquareIcon className="h-5 w-5 lg:h-6 lg:w-6" />
              )}
              {repeatMode === REPEAT_MODES.ONE && (
                <span className="absolute -top-1 -right-1 text-xs font-bold">1</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenPlayer;