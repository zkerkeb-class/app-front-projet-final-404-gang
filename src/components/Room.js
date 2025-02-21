import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../contexts/RoomContext';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';
import { ClipboardIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = useState(false);
  const { 
    joinRoom, 
    leaveRoom, 
    participants, 
    isJamMode 
  } = useRoom();
  const { 
    currentTrack, 
    isPlaying, 
    currentTime 
  } = usePlayer();

  useEffect(() => {
    if (roomId) {
      console.log('Joining room:', roomId);
      joinRoom(roomId);
    }

    return () => {
      leaveRoom();
    };
  }, [roomId, joinRoom, leaveRoom]);

  const copyRoomLink = () => {
    const roomUrl = window.location.href;
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Home
        </button>
        <button
          onClick={copyRoomLink}
          className={`flex items-center gap-2 px-4 py-2 rounded-full
            ${isDarkMode 
              ? 'bg-zinc-800 hover:bg-zinc-700' 
              : 'bg-white hover:bg-gray-100'} 
            transition-colors`}
        >
          <ClipboardIcon className="h-5 w-5" />
          {copied ? 'Copied!' : 'Share Room'}
        </button>
      </div>

      {/* Room Info */}
      <div className={`p-6 rounded-lg mb-8 ${
        isDarkMode ? 'bg-zinc-800' : 'bg-white shadow-sm'
      }`}>
        <h1 className="text-2xl font-bold mb-4">Jam Session Room</h1>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm opacity-75">Room ID: {roomId}</span>
          <span className="text-sm opacity-75">
            {participants.length} {participants.length === 1 ? 'person' : 'people'} in the room
          </span>
        </div>
      </div>

      {/* Current Track */}
      {currentTrack && (
        <div className={`p-6 rounded-lg mb-8 ${
          isDarkMode ? 'bg-zinc-800' : 'bg-white shadow-sm'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
          <div className="flex items-center gap-4">
            <img 
              src={currentTrack.album?.images?.small || '/images/placeholder-cover.png'} 
              alt={currentTrack.title}
              className="w-16 h-16 rounded"
            />
            <div>
              <h3 className="font-medium">{currentTrack.title}</h3>
              <p className="text-sm opacity-75">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      )}

      {/* Participants */}
      <div className={`p-6 rounded-lg ${
        isDarkMode ? 'bg-zinc-800' : 'bg-white shadow-sm'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Participants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {participants.map((participant, index) => (
            <div 
              key={participant}
              className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-zinc-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-zinc-600' : 'bg-gray-200'
                }`}>
                  {index + 1}
                </div>
                <span className="truncate">Participant {participant.slice(0, 6)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Room; 