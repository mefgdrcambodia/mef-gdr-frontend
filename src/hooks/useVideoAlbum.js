// src/hooks/useVideoAlbum.js
import { useState, useEffect, useCallback } from 'react';
import videoAlbumService from '../services/api/videoAlbum.service';

export const useVideoAlbum = (initialPage = 1, initialLimit = 10) => {
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = useCallback(async (page = initialPage, limit = initialLimit, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const result = await videoAlbumService.getVideos(page, limit, search);
      
      if (result.success) {
        setVideos(result.data.videos || []);
        setPagination(result.pagination);
      } else {
        setError(result.error || 'Failed to fetch videos');
        setVideos([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [initialPage, initialLimit]);

  const fetchVideoById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await videoAlbumService.getVideoById(id);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch video');
        return null;
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the video');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchVideos(newPage, pagination.limit);
    }
  }, [fetchVideos, pagination.limit, pagination.totalPages]);

  const refresh = useCallback(() => {
    fetchVideos(pagination.page, pagination.limit);
  }, [fetchVideos, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchVideos(initialPage, initialLimit);
  }, [fetchVideos, initialPage, initialLimit]);

  return {
    videos,
    pagination,
    loading,
    error,
    fetchVideos,
    fetchVideoById,
    changePage,
    refresh,
  };
};

export default useVideoAlbum;