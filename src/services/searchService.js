const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const searchContent = async (query) => {
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    if (response.status === 401) {
      // Handle unauthorized access
      return {
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
      };
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to search');
    }

    const data = await response.json();
    
    // Validate and format the response data
    return {
      tracks: (data.tracks || []).map(track => ({
        id: track.id || track._id,
        name: track.title,
        artist: track.artist,
        duration: track.duration,
        image: track.image,
        audioUrl: track.audioUrl
      })),
      artists: (data.artists || []).map(artist => ({
        id: artist.id || artist._id,
        name: artist.name,
        genre: artist.genre,
        image: artist.image,
        popularity: artist.popularity
      })),
      albums: (data.albums || []).map(album => ({
        id: album.id || album._id,
        name: album.title,
        artist: album.artist,
        image: album.image,
        releaseDate: album.releaseDate
      })),
      playlists: (data.playlists || []).map(playlist => ({
        id: playlist.id || playlist._id,
        name: playlist.name,
        description: playlist.description,
        image: playlist.image
      }))
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Search suggestions for autocomplete
export const getSearchSuggestions = async (query) => {
  try {
    const response = await fetch(
      `${API_URL}/search/suggestions?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      }
    );

    if (response.status === 401) {
      return [];
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get suggestions');
    }

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('Suggestions error:', error);
    return [];
  }
};

// Search by type (tracks, artists, albums, playlists)
export const searchByType = async (query, type) => {
  try {
    const response = await fetch(
      `${API_URL}/search/${type}?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to search ${type}`);
    }

    const data = await response.json();
    return data[type] || [];
  } catch (error) {
    console.error(`Search ${type} error:`, error);
    throw error;
  }
};

// Get trending searches
export const getTrendingSearches = async () => {
  try {
    const response = await fetch(`${API_URL}/search/trending`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    if (response.status === 401) {
      return [];
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get trending searches');
    }

    const data = await response.json();
    return data.trending || [];
  } catch (error) {
    console.error('Trending searches error:', error);
    return [];
  }
};

// Get recent searches for the current user
export const getRecentSearches = async () => {
  try {
    const response = await fetch(`${API_URL}/search/recent`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get recent searches');
    }

    const data = await response.json();
    return data.recent || [];
  } catch (error) {
    console.error('Recent searches error:', error);
    throw error;
  }
};

// Save a search to user's history
export const saveSearchHistory = async (query) => {
  try {
    const response = await fetch(`${API_URL}/search/history`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save search history');
    }

    return true;
  } catch (error) {
    console.error('Save search history error:', error);
    return false;
  }
}; 