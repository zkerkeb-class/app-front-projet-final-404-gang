import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { usePlaylist } from '../contexts/PlaylistContext';
import { PlayIcon } from '@heroicons/react/24/solid';
import { fetchAlbums } from '../services/albumService';
import { fetchPlaylists } from '../services/playlistService';
import { fetchTracks } from '../services/trackService';
import HorizontalList from '../components/HorizontalList';

const PLACEHOLDER_IMAGES = {
  ALBUM: 'https://placehold.co/400x400/1DB954/FFFFFF/png?text=Album',
  PLAYLIST: 'https://placehold.co/400x400/1DB954/FFFFFF/png?text=Playlist',
  TRACK: 'https://placehold.co/400x400/1DB954/FFFFFF/png?text=Track'
};

const HomePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { setPlaylistAndPlay } = usePlaylist();
  const [newReleases, setNewReleases] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        console.log('Loading content...');
        
        // Fetch new releases (recent albums)
        const albumsData = await fetchAlbums({ 
          sort: 'releaseDate',
          order: 'desc',
          limit: 10 
        });
        console.log('Albums loaded:', albumsData);
        setNewReleases(albumsData);

        // Fetch popular tracks
        const tracksData = await fetchTracks({ 
          sort: 'popularity',
          order: 'desc',
          limit: 10 
        });
        console.log('Tracks loaded:', tracksData);
        setPopularTracks(tracksData);

        // Fetch playlists
        const playlistsData = await fetchPlaylists({ 
          sort: 'popularity',
          order: 'desc',
          limit: 10 
        });
        console.log('Playlists loaded:', playlistsData);
        setPlaylists(playlistsData);

      } catch (err) {
        console.error('Error loading content:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const renderAlbum = (album) => (
    <button
      key={album._id}
      className="group relative text-left w-full p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      onClick={() => navigate(`/album/${album._id}`)}
    >
      <div className="relative aspect-square mb-4">
        <img
          src={album.coverImage || PLACEHOLDER_IMAGES.ALBUM}
          alt={album.title}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        <button
          className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            setPlaylistAndPlay(album.tracks || [], 0);
          }}
        >
          <PlayIcon className="h-6 w-6 text-black" />
        </button>
      </div>
      <h3 className="font-semibold truncate mb-1">{album.title}</h3>
      <p className={`text-sm truncate ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
        {album.artist?.name || 'Unknown Artist'}
      </p>
    </button>
  );

  const renderPlaylist = (playlist) => (
    <button
      key={playlist._id}
      className="group relative text-left w-full p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      onClick={() => navigate(`/playlist/${playlist._id}`)}
    >
      <div className="relative aspect-square mb-4">
        <img
          src={playlist.coverImage || PLACEHOLDER_IMAGES.PLAYLIST}
          alt={playlist.name}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        <button
          className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            setPlaylistAndPlay(playlist.tracks || [], 0);
          }}
        >
          <PlayIcon className="h-6 w-6 text-black" />
        </button>
      </div>
      <h3 className="font-semibold truncate mb-1">{playlist.name}</h3>
      <p className={`text-sm truncate ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
        {playlist.description || `${playlist.tracks?.length || 0} songs`}
      </p>
    </button>
  );

  const renderTrack = (track) => {
    // Extract required data safely
    const artistName = track.artist?.name || 'Unknown Artist';
    const albumTitle = track.album?.title || 'Unknown Album';
    
    // Use the correct image path structure
    const coverImage = track.images?.medium || 
                      track.images?.small || 
                      track.images?.thumbnail ||
                      track.album?.images?.medium ||
                      track.album?.images?.small ||
                      track.album?.images?.thumbnail ||
                      PLACEHOLDER_IMAGES.TRACK;

    console.log('Track image being used:', {
      trackTitle: track.title,
      trackImages: track.images,
      albumImages: track.album?.images,
      selectedImage: coverImage
    });

    return (
      <button
        key={track._id}
        className="group relative text-left w-full p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setPlaylistAndPlay([track], 0)}
      >
        <div className="relative aspect-square mb-4">
          <img
            src={coverImage}
            alt={track.title}
            className="w-full h-full object-cover rounded-lg shadow-lg"
            onError={(e) => {
              console.log('Image load error for track:', track.title);
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGES.TRACK;
            }}
          />
          <button
            className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setPlaylistAndPlay([track], 0);
            }}
          >
            <PlayIcon className="h-6 w-6 text-black" />
          </button>
        </div>
        <h3 className="font-semibold truncate mb-1">{track.title}</h3>
        <p className={`text-sm truncate ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
          {artistName}
        </p>
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto pb-24 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="px-4 py-6">
        {/* New Releases */}
        {newReleases.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">New Releases</h2>
            <HorizontalList items={newReleases} renderItem={renderAlbum} />
          </section>
        )}

        {/* Featured Playlists */}
        {playlists.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Featured Playlists</h2>
            <HorizontalList items={playlists} renderItem={renderPlaylist} />
          </section>
        )}

        {/* Popular Tracks */}
        {popularTracks.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Popular Tracks</h2>
            <HorizontalList items={popularTracks} renderItem={renderTrack} />
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage; 