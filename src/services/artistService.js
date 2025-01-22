const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const formatArtistData = (artist) => ({
  _id: artist._id,
  name: artist.name,
  genre: artist.genre,
  popularity: artist.popularity || 0,
  albums: artist.albums?.map(album => ({
    _id: album._id,
    title: album.title,
    coverImage: album.images?.medium || album.images?.small || album.images?.thumbnail,
    releaseDate: album.releaseDate,
    genre: album.genre
  })) || [],
  tracks: artist.tracks?.map(track => ({
    _id: track._id,
    title: track.title,
    duration: track.duration,
    audioUrl: track.audioUrl,
    coverImage: track.images?.medium || track.images?.small || track.images?.thumbnail,
    genre: track.genre
  })) || [],
  createdAt: artist.createdAt,
  updatedAt: artist.updatedAt
});

export const fetchArtists = async (params = {}) => {
  const queryParams = new URLSearchParams({
    sort: params.sort || 'name',
    order: params.order || 'asc',
    limit: params.limit?.toString() || '20',
    offset: params.offset?.toString() || '0',
    ...(params.genre && { genre: params.genre }),
    ...(params.minPopularity && { minPopularity: params.minPopularity })
  });

  try {
    console.log('Fetching artists with URL:', `${API_URL}/artists?${queryParams}`);
    const response = await fetch(`${API_URL}/artists?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch artists');
    const data = await response.json();
    console.log('Raw artists data:', data);
    return Array.isArray(data) ? data.map(formatArtistData) : [];
  } catch (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }
};

export const fetchArtistById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/artists/${id}`);
    if (!response.ok) throw new Error('Failed to fetch artist');
    const data = await response.json();
    return formatArtistData(data);
  } catch (error) {
    console.error('Error fetching artist:', error);
    throw error;
  }
};

export const fetchTopTracks = async (artistId) => {
  try {
    const response = await fetch(`${API_URL}/artists/${artistId}/top-tracks`);
    if (!response.ok) throw new Error('Failed to fetch top tracks');
    const data = await response.json();
    return Array.isArray(data) ? data.map(track => ({
      _id: track._id,
      title: track.title,
      duration: track.duration,
      audioUrl: track.audioUrl,
      coverImage: track.images?.medium || track.images?.small || track.images?.thumbnail,
      genre: track.genre
    })) : [];
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    throw error;
  }
}; 