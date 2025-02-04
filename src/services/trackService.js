const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const formatTrackData = (track) => ({
  _id: track._id,
  title: track.title,
  duration: track.duration,
  genre: track.genre,
  popularity: track.popularity || 0,
  audioUrl: track.audioUrl,
  coverImage: track.images?.medium || track.images?.small || track.images?.thumbnail || 'https://placehold.co/400x400/1DB954/FFFFFF/png?text=Track',
  images: track.images,
  artist: track.artist ? {
    _id: track.artist._id,
    name: track.artist.name,
    genre: track.artist.genre
  } : {
    _id: null,
    name: 'Unknown Artist'
  },
  album: track.album ? {
    _id: track.album._id,
    title: track.album.title,
    coverImage: track.album.images?.medium || track.album.images?.small || track.album.images?.thumbnail,
    releaseDate: track.album.releaseDate
  } : null,
  createdAt: track.createdAt,
  updatedAt: track.updatedAt
});

export const fetchTracks = async (params = {}) => {
  const queryParams = new URLSearchParams({
    sort: params.sort || 'title',
    order: params.order || 'asc',
    limit: params.limit?.toString() || '20',
    offset: params.offset?.toString() || '0',
    ...(params.genre && { genre: params.genre }),
    ...(params.minDuration && { minDuration: params.minDuration }),
    ...(params.maxDuration && { maxDuration: params.maxDuration }),
    ...(params.minPopularity && { minPopularity: params.minPopularity })
  });

  try {
    console.log('Fetching tracks with URL:', `${API_URL}/tracks?${queryParams}`);
    const response = await fetch(`${API_URL}/tracks?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch tracks');
    const data = await response.json();
    console.log('Raw tracks data:', data);
    return Array.isArray(data) ? data.map(formatTrackData) : [];
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
};

export const fetchTrackById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tracks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch track');
    const data = await response.json();
    return formatTrackData(data);
  } catch (error) {
    console.error('Error fetching track:', error);
    throw error;
  }
};

export const fetchSimilarTracks = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tracks/${id}/similar`);
    if (!response.ok) throw new Error('Failed to fetch similar tracks');
    const data = await response.json();
    return Array.isArray(data) ? data.map(formatTrackData) : [];
  } catch (error) {
    console.error('Error fetching similar tracks:', error);
    throw error;
  }
}; 