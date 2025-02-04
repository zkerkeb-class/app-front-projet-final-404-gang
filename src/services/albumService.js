const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const formatAlbumData = (album) => ({
  _id: album._id,
  title: album.title,
  releaseDate: album.releaseDate,
  coverImage: album.images?.medium || album.images?.small || album.images?.thumbnail || 'https://placehold.co/400x400/1DB954/FFFFFF/png?text=Album',
  images: album.images,
  artist: album.artist && {
    _id: album.artist._id,
    name: album.artist.name,
    genre: album.artist.genre
  },
  tracks: album.tracks?.map(track => ({
    _id: track._id,
    title: track.title,
    duration: track.duration,
    audioUrl: track.audioUrl,
    coverImage: track.images?.medium || track.images?.small || track.images?.thumbnail,
    artist: track.artist && {
      _id: track.artist._id,
      name: track.artist.name,
      genre: track.artist.genre
    }
  })) || [],
  genre: album.genre,
  popularity: album.popularity || 0,
  createdAt: album.createdAt,
  updatedAt: album.updatedAt
});

export const fetchAlbums = async ({ sort = 'releaseDate', order = 'desc', limit = 20, offset = 0, genre } = {}) => {
  try {
    const queryParams = new URLSearchParams({
      sort,
      order,
      limit: limit.toString(),
      offset: offset.toString(),
      ...(genre && { genre }),
    });

    console.log('Fetching albums with URL:', `${API_URL}/albums?${queryParams}`);
    const response = await fetch(`${API_URL}/albums?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch albums');
    }

    const data = await response.json();
    console.log('Raw albums data:', data);
    return Array.isArray(data) ? data.map(formatAlbumData) : [];
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};

export const fetchAlbumById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/albums/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch album');
    }

    const data = await response.json();
    return formatAlbumData(data);
  } catch (error) {
    console.error('Error fetching album:', error);
    throw error;
  }
};

export const fetchNewReleases = async ({ limit = 20, offset = 0 } = {}) => {
  try {
    const queryParams = new URLSearchParams({
      sort: 'releaseDate',
      order: 'desc',
      limit,
      offset,
    });

    const response = await fetch(`${API_URL}/albums/new-releases?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch new releases');
    }

    const data = await response.json();
    return data.map(formatAlbumData);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    throw error;
  }
};

export const fetchSimilarAlbums = async (albumId, { limit = 10 } = {}) => {
  try {
    const queryParams = new URLSearchParams({ limit });
    const response = await fetch(`${API_URL}/albums/${albumId}/similar?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch similar albums');
    }

    const data = await response.json();
    return data.map(formatAlbumData);
  } catch (error) {
    console.error('Error fetching similar albums:', error);
    throw error;
  }
}; 