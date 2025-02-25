import React, { useState } from 'react';
import { UsersIcon, ShareIcon } from '@heroicons/react/24/solid';
import { useRoom } from '../contexts/RoomContext';

const JamModeButton = () => {
  const { isJamMode, createRoom, leaveRoom, participants } = useRoom();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleCreateRoom = async () => {
    try {
      const url = await createRoom();
      setShareUrl(url);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    // Show copied notification
  };

  return (
    <>
      <button
        onClick={isJamMode ? leaveRoom : handleCreateRoom}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
          isJamMode ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        <UsersIcon className="h-5 w-5" />
        {isJamMode && <span className="text-sm">{participants.length}</span>}
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Share Room</h3>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleCopyUrl}
                className="p-2 text-green-500 hover:text-green-600"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default JamModeButton; 