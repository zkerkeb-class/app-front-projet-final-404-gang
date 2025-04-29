const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const formatPlaylistData = (playlist) => ({
  _id: playlist._id,
  name: playlist.name,
  description: playlist.description,
  trackCount: playlist.trackCount || playlist.tracks?.length || 0,
  coverImage: playlist.coverImage || 'https://placehold.co/400x400/1DB954/FFFFFF/png?text=Playlist',
  tracks: (playlist.tracks || []).map(track => ({
    _id: track._id,
    title: track.title,
    artist: track.artist ? {
      _id: track.artist._id,
      name: track.artist.name
    } : null,
    album: track.album ? {
      _id: track.album._id,
      title: track.album.title,
      coverImage: track.album.coverImage
    } : null,
    duration: track.duration,
    audioUrl: track.audioUrl,
    coverImage: track.coverImage || track.album?.coverImage
  })),
  createdAt: playlist.createdAt
});

export const fetchPlaylists = async (params = {}) => {
  const queryParams = new URLSearchParams({
    sort: params.sort || 'name',
    order: params.order || 'asc',
    limit: params.limit?.toString() || '20',
    offset: params.offset?.toString() || '0',
    ...(params.minTracks && { minTracks: params.minTracks }),
    ...(params.maxTracks && { maxTracks: params.maxTracks })
  });

  try {
    console.log('Fetching playlists with URL:', `${API_URL}/playlists?${queryParams}`);
    const response = await fetch(`${API_URL}/playlists?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch playlists');
    const data = await response.json();
    console.log('Raw playlists data:', data);
    return Array.isArray(data) ? data.map(formatPlaylistData) : [];
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

export const fetchPlaylistById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/playlists/${id}`);
    if (!response.ok) throw new Error('Failed to fetch playlist');
    const data = await response.json();
    return formatPlaylistData(data);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
};

export const createPlaylist = async (playlistData) => {
  try {
    const response = await fetch(`${API_URL}/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playlistData)
    });
    if (!response.ok) throw new Error('Failed to create playlist');
    const data = await response.json();
    return formatPlaylistData(data);
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

export const updatePlaylist = async (id, playlistData) => {
  try {
    const response = await fetch(`${API_URL}/playlists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playlistData)
    });
    if (!response.ok) throw new Error('Failed to update playlist');
    const data = await response.json();
    return formatPlaylistData(data);
  } catch (error) {
    console.error('Error updating playlist:', error);
    throw error;
  }
};

export const addTrackToPlaylist = async (playlistId, trackId) => {
  try {
    const response = await fetch(`${API_URL}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trackId })
    });
    if (!response.ok) throw new Error('Failed to add track to playlist');
    const data = await response.json();
    return formatPlaylistData(data);
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    throw error;
  }
};

export const removeTrackFromPlaylist = async (playlistId, trackId) => {
  try {
    const response = await fetch(`${API_URL}/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove track from playlist');
    const data = await response.json();
    return formatPlaylistData(data);
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    throw error;
  }
}; 