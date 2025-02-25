import React, { createContext, useContext, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { usePlayer } from './PlayerContext';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isJamMode, setIsJamMode] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isHost, setIsHost] = useState(false);
  
  const { 
    currentTrack, 
    isPlaying, 
    currentTime,
    togglePlay,
    seek
  } = usePlayer();

  // Initialize WebSocket connection
  const joinRoom = useCallback((roomId) => {
    console.log('Attempting to join room:', roomId);
    const baseUrl = process.env.REACT_APP_API_URL.replace('/api', '');
    console.log('Connecting to Socket.IO at:', baseUrl);
    
    const newSocket = io(baseUrl, {
      transports: ['websocket', 'polling'],
      path: '/socket.io/',
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
      newSocket.emit('join_room', roomId);
    });

    newSocket.on('chat_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('host_status', (status) => {
      setIsHost(status.isHost);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    newSocket.on('room_state', (state) => {
      console.log('Received room state:', state);
      setParticipants(state.participants);
    });

    newSocket.on('participant_joined', ({ id, count }) => {
      console.log('Participant joined:', id);
      setParticipants(prev => [...prev, id]);
    });

    newSocket.on('participant_left', ({ id, count }) => {
      console.log('Participant left:', id);
      setParticipants(prev => prev.filter(p => p !== id));
    });

    newSocket.on('playback_state_changed', (state) => {
      console.log('Playback state changed:', state);
      if (state.isPlaying) {
        seek(state.currentTime);
        togglePlay();
      } else {
        togglePlay();
      }
    });

    setSocket(newSocket);
    setRoomId(roomId);
    setIsJamMode(true);
  }, [togglePlay, seek]);

  // Create a new room and get shareable URL
  const createRoom = useCallback(async () => {
    try {
      console.log('Creating new room...');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const { roomId } = await response.json();
      console.log('Room created:', roomId);
      joinRoom(roomId);
      return `${window.location.origin}/room/${roomId}`;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }, [joinRoom]);

  // Leave current room
  const leaveRoom = useCallback(() => {
    console.log('Leaving room:', roomId);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setRoomId(null);
    setParticipants([]);
    setIsJamMode(false);
  }, [socket, roomId]);

  // Emit playback state changes
  const emitPlaybackState = useCallback((state) => {
    if (socket && isJamMode) {
      console.log('Emitting playback state:', state);
      socket.emit('playback_state_changed', state);
    }
  }, [socket, isJamMode]);

  // Add queue management
  const addToRoomQueue = useCallback((track) => {
    if (socket && isJamMode) {
      socket.emit('add_to_queue', track);
    }
  }, [socket, isJamMode]);

  // Add chat functionality
  const sendMessage = useCallback((message) => {
    if (socket && isJamMode) {
      socket.emit('chat_message', {
        content: message,
        timestamp: Date.now()
      });
    }
  }, [socket, isJamMode]);

  return (
    <RoomContext.Provider
      value={{
        roomId,
        participants,
        isJamMode,
        createRoom,
        joinRoom,
        leaveRoom,
        emitPlaybackState,
        messages,
        sendMessage,
        isHost,
        addToRoomQueue
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}; 