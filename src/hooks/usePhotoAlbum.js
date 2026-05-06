// src/hooks/usePhotoAlbum.js
import { useState, useEffect, useCallback } from 'react';
import photoAlbumService from '../services/api/photoAlbum.service';

const usePhotoAlbum = (initialPage = 1, initialLimit = 9) => {
  const [albums, setAlbums] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlbums = useCallback(async (page = initialPage, limit = initialLimit, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const result = await photoAlbumService.getPhotoAlbums(page, limit, search);
      
      if (result.success) {
        setAlbums(result.data.albums || []);
        setPagination(result.pagination);
      } else {
        setError(result.error || 'Failed to fetch photo albums');
        setAlbums([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching photo albums');
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }, [initialPage, initialLimit]);

  const fetchAlbumById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await photoAlbumService.getPhotoAlbumById(id);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch album');
        return null;
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the album');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchAlbums(newPage, pagination.limit);
    }
  }, [fetchAlbums, pagination.limit, pagination.totalPages]);

  const refresh = useCallback(() => {
    fetchAlbums(pagination.page, pagination.limit);
  }, [fetchAlbums, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchAlbums(initialPage, initialLimit);
  }, [fetchAlbums, initialPage, initialLimit]);

  return {
    albums,
    pagination,
    loading,
    error,
    fetchAlbums,
    fetchAlbumById,
    changePage,
    refresh,
  };
};

export default usePhotoAlbum;