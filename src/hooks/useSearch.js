import { useState, useEffect, useCallback } from 'react';
import { searchContent } from '../services/searchService';
import { useAuth } from '../contexts/AuthContext'; // Import auth context

const useSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCache] = useState(new Map());
  const { user } = useAuth(); // Get auth state

  const debouncedSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
      });
      return;
    }

    // Check cache first
    const cacheKey = searchQuery.toLowerCase();
    if (searchCache.has(cacheKey)) {
      setResults(searchCache.get(cacheKey));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await searchContent(searchQuery);
      
      // Validate the response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      setResults(data);
      // Cache the results
      searchCache.set(cacheKey, data);
    } catch (err) {
      setError(err.message);
      setResults({
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchCache]);

  // Clear cache when user auth state changes
  useEffect(() => {
    searchCache.clear();
  }, [user, searchCache]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        debouncedSearch(query);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, debouncedSearch]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error
  };
};

export default useSearch; 