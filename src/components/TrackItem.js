import React, { useState, useCallback, useEffect } from 'react';
import TrackContextMenu from './TrackContextMenu';

const PLACEHOLDER_IMAGE = '/images/placeholder-cover.png';

const getImageUrl = (track) => {
  if (!track) return PLACEHOLDER_IMAGE;
  
  // First try track images
  if (track.images?.medium || track.images?.small || track.images?.thumbnail) {
    const image = track.images.medium || track.images.small || track.images.thumbnail;
    console.log('Using track image:', image);
    return image;
  }
  
  // Then try album images
  if (track.album?.images?.medium || track.album?.images?.small || track.album?.images?.thumbnail) {
    const image = track.album.images.medium || track.album.images.small || track.album.images.thumbnail;
    console.log('Using album image:', image);
    return image;
  }

  console.log('No valid image found for track:', track.title);
  return PLACEHOLDER_IMAGE;
};

const TrackItem = ({ track }) => {
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
  });

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.pageX, y: e.pageY },
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);

  useEffect(() => {
    if (contextMenu.isOpen) {
      const handleClick = () => closeContextMenu();
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu.isOpen, closeContextMenu]);

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        className="track-item"
      >
        <img
          src={getImageUrl(track)}
          alt={track.title}
          className="w-12 h-12 rounded"
          onError={(e) => {
            console.log('Image load error for track:', track.title, 'URL:', e.target.src);
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>
      <TrackContextMenu
        track={track}
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={closeContextMenu}
      />
    </>
  );
};

export default TrackItem; 