const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const PLACEHOLDER_IMAGE = '/images/placeholder-cover.png';

const formatTrackData = (track) => {
  console.log('Raw track before formatting:', track);
  
  const ensureAbsoluteUrl = (url) => {
    if (!url) return null;
    if (url.includes('cloudinary.com')) return url;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/api/') || url.startsWith('/uploads/')) {
      return `${API_URL.replace('/api', '')}${url}`;
    }
    if (url.startsWith('/')) return url;
    return `${API_URL}/${url}`;
  };

  const formatImages = (images) => {
    if (!images) return null;
    
    console.log('Formatting images:', images);
    
    if (images.thumbnail?.includes('cloudinary.com') || 
        images.small?.includes('cloudinary.com') || 
        images.medium?.includes('cloudinary.com')) {
      return {
        thumbnail: images.thumbnail || images.small || images.medium || PLACEHOLDER_IMAGE,
        small: images.small || images.medium || images.thumbnail || PLACEHOLDER_IMAGE,
        medium: images.medium || images.small || images.thumbnail || PLACEHOLDER_IMAGE,
        large: images.large || images.medium || PLACEHOLDER_IMAGE
      };
    }

    const formatted = {
      thumbnail: typeof images.thumbnail === 'string' ? ensureAbsoluteUrl(images.thumbnail) : PLACEHOLDER_IMAGE,
      small: typeof images.small === 'string' ? ensureAbsoluteUrl(images.small) : PLACEHOLDER_IMAGE,
      medium: typeof images.medium === 'string' ? ensureAbsoluteUrl(images.medium) : PLACEHOLDER_IMAGE,
      large: typeof images.large === 'string' ? ensureAbsoluteUrl(images.large) : PLACEHOLDER_IMAGE
    };
    
    console.log('Formatted images:', formatted);
    return formatted;
  };

  let trackImages = track.images ? formatImages(track.images) : null;
  
  if (!trackImages && track.album?.images) {
    trackImages = formatImages(track.album.images);
  }
  
  if (!trackImages) {
    trackImages = {
      thumbnail: PLACEHOLDER_IMAGE,
      small: PLACEHOLDER_IMAGE,
      medium: PLACEHOLDER_IMAGE,
      large: PLACEHOLDER_IMAGE
    };
  }

  const formatted = {
    _id: track._id,
    title: track.title,
    duration: track.duration,
    genre: track.genre,
    popularity: track.popularity || 0,
    audioUrl: track.audioUrl,
    images: trackImages,
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
      images: formatImages(track.album.images),
      releaseDate: track.album.releaseDate
    } : null,
    createdAt: track.createdAt,
    updatedAt: track.updatedAt
  };

  console.log('Formatted track data:', formatted);
  return formatted;
};

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

export const fetchPopularTracks = async (limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/tracks?sort=popularity&order=desc&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch popular tracks');
    const data = await response.json();
    console.log('Raw popular tracks data:', data);
    return Array.isArray(data) ? data.map(formatTrackData) : [];
  } catch (error) {
    console.error('Error fetching popular tracks:', error);
    throw error;
  }
}; 