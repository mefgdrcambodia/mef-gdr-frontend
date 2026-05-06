// src/hooks/useSpeech.js
import { useState, useEffect, useCallback } from 'react';
import speechService from '../services/api/speech.service';

const useSpeech = (initialPage = 1, initialLimit = 10) => {
  const [speeches, setSpeeches] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpeeches = useCallback(async (page = initialPage, limit = initialLimit, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const result = await speechService.getSpeeches(page, limit, search);
      
      if (result.success) {
        setSpeeches(result.data.speeches || []);
        setPagination(result.pagination);
      } else {
        setError(result.error || 'Failed to fetch speeches');
        setSpeeches([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching speeches');
      setSpeeches([]);
    } finally {
      setLoading(false);
    }
  }, [initialPage, initialLimit]);

  const fetchSpeechById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await speechService.getSpeechById(id);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch speech');
        return null;
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the speech');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchSpeeches(newPage, pagination.limit);
    }
  }, [fetchSpeeches, pagination.limit, pagination.totalPages]);

  const refresh = useCallback(() => {
    fetchSpeeches(pagination.page, pagination.limit);
  }, [fetchSpeeches, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchSpeeches(initialPage, initialLimit);
  }, [fetchSpeeches, initialPage, initialLimit]);

  return {
    speeches,
    pagination,
    loading,
    error,
    fetchSpeeches,
    fetchSpeechById,
    changePage,
    refresh,
  };
};

export default useSpeech;