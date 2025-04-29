/* eslint-disable jsx-a11y/media-has-caption */

import React, { useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  BackwardIcon,
  ForwardIcon,
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/solid';
import useAudioPlayer, { REPEAT_MODES } from '../hooks/useAudioPlayer';
import FullscreenPlayer from './FullscreenPlayer';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import KeyboardShortcutsTooltip from './KeyboardShortcutsTooltip';
import QueueButton from './QueueButton';
import Queue from './Queue';
import JamModeButton from './JamModeButton';
import { useRoom } from '../contexts/RoomContext';

const formatTime = (time) => {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const PLACEHOLDER_IMAGE = '/images/placeholder-cover.png';

const NowPlayingBar = () => {
  const {
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    isLoading,
    repeatMode,
    shuffle,
    seek,
    toggleMute,
    updateVolume,
    toggleRepeatMode,
    toggleShuffleMode,
    playNext,
    playPrevious,
    setCurrentTime,
  } = useAudioPlayer();
  
  const { 
    isFullscreen, 
    setIsFullscreen, 
    audioRef,
    currentTrack,
    togglePlay,
  } = usePlayer();
  const { isDarkMode } = useTheme();
  const { isJamMode, emitPlaybackState } = useRoom();

  const getImageUrl = (track) => {
    if (!track) {
      console.log('No track provided to getImageUrl');
      return PLACEHOLDER_IMAGE;
    }
    
    console.log('Getting image for track:', {
      trackId: track._id,
      title: track.title,
      albumImages: track.album?.images,
      trackImages: track.images
    });
    
    // First try track images
    if (track.images?.thumbnail || track.images?.small || track.images?.medium) {
      const image = track.images.thumbnail || track.images.small || track.images.medium;
      console.log('Using track image:', image);
      return image;
    }
    
    // Then try album images
    if (track.album?.images?.thumbnail || track.album?.images?.small || track.album?.images?.medium) {
      const image = track.album.images.thumbnail || track.album.images.small || track.album.images.medium;
      console.log('Using album image:', image);
      return image;
    }

    console.log('No valid image found, using placeholder');
    return PLACEHOLDER_IMAGE;
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audioRef, setCurrentTime]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    updateVolume(newVolume);
  };

  const handleTogglePlay = () => {
    togglePlay();
    if (isJamMode) {
      emitPlaybackState({ 
        isPlaying: !isPlaying, 
        currentTime: currentTime 
      });
    }
  };

  const handleSeek = (newTime) => {
    seek(newTime);
    if (isJamMode) {
      emitPlaybackState({ 
        isPlaying: isPlaying, 
        currentTime: newTime 
      });
    }
  };

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 px-2 sm:px-4 py-2 sm:py-3 ${
        isDarkMode 
          ? 'bg-zinc-900 border-t border-zinc-800 text-white' 
          : 'bg-gray-100 border-t border-gray-200 text-gray-900'
      }`}>
        <audio
          ref={audioRef}
          preload="metadata"
          aria-label={`Lecture de ${currentTrack?.title || 'Aucun titre'} par ${currentTrack?.artist || 'Aucun artiste'}`}
        >
          <track 
            kind="captions"
            srcLang="fr"
            label="Français"
            src={currentTrack?.captionsUrl || ''}
          />
        </audio>
        
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center w-1/3 min-w-0">
            <img
              src={getImageUrl(currentTrack)}
              alt={currentTrack?.title || "Album cover"}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded mr-2 sm:mr-4 flex-shrink-0"
              onError={(e) => {
                console.log('Image load error for URL:', e.target.src);
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-medium truncate">
                  {currentTrack?.title || "Aucun titre"}
                </h4>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className={`${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  aria-label="Mode plein écran"
                >
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                </button>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'} truncate`}>
                {typeof currentTrack?.artist === 'object' 
                  ? currentTrack?.artist?.name 
                  : currentTrack?.artist || "Aucun artiste"}
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleShuffleMode}
                className={`transition-colors ${
                  shuffle 
                    ? 'text-green-500' 
                    : isDarkMode 
                      ? 'text-zinc-400 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-900'
                }`}
                aria-label="Toggle shuffle"
              >
                <ArrowsRightLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <button 
                className={`transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                aria-label="Titre précédent"
                onClick={playPrevious}
              >
                <BackwardIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              
              <button
                onClick={handleTogglePlay}
                disabled={isLoading}
                className={`p-2 rounded-full bg-white hover:scale-105 transition-transform ${
                  isLoading ? 'opacity-50' : ''
                }`}
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? (
                  <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
                ) : (
                  <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
                )}
              </button>

              <button 
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Titre suivant"
                onClick={() => playNext()}
              >
                <ForwardIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <button
                onClick={toggleRepeatMode}
                className={`transition-colors relative ${
                  repeatMode !== 'OFF'
                    ? 'text-green-500'
                    : isDarkMode
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-gray-500 hover:text-gray-900'
                }`}
                aria-label="Toggle repeat"
              >
                {repeatMode === 'ONE' ? (
                  <ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ArrowPathRoundedSquareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                {repeatMode === 'ONE' && (
                  <span className="absolute -top-1 -right-1 text-xs font-bold">1</span>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="hidden sm:flex items-center gap-2 w-full max-w-md mt-2">
              <span className={`text-xs w-10 text-right ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                {formatTime(currentTime)}
              </span>
              <div className={`flex-1 h-1 rounded-full relative group ${isDarkMode ? 'bg-zinc-600' : 'bg-gray-300'}`}>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                  aria-label="Progression de la lecture"
                />
                <div
                  className={`h-full rounded-full relative ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`}
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-xs text-zinc-400 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center justify-end w-1/3 gap-2">
            <KeyboardShortcutsTooltip />
            <QueueButton />
            <JamModeButton />
            <button
              onClick={toggleMute}
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted || volume === 0 ? (
                <SpeakerXMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <SpeakerWaveIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
            
            <div className="w-16 sm:w-24 h-1 bg-zinc-600 rounded-full relative group">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                aria-label="Volume"
              />
              <div
                className="h-full bg-white rounded-full relative"
                style={{ width: `${volume * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isFullscreen && <FullscreenPlayer />}
      <Queue />
    </>
  );
};

export default NowPlayingBar;