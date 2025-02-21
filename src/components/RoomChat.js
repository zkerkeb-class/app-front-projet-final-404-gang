import React, { useState, useRef, useEffect } from 'react';
import { useRoom } from '../contexts/RoomContext';
import { useTheme } from '../contexts/ThemeContext';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const RoomChat = () => {
  const [message, setMessage] = useState('');
  const { messages, sendMessage } = useRoom();
  const { isDarkMode } = useTheme();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className={`flex flex-col h-[400px] rounded-lg ${
      isDarkMode ? 'bg-zinc-800' : 'bg-white shadow-sm'
    }`}>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
              isDarkMode ? 'bg-zinc-700' : 'bg-gray-100'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-50">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 px-4 py-2 rounded-full ${
              isDarkMode 
                ? 'bg-zinc-900 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}
          />
          <button
            type="submit"
            className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomChat; 