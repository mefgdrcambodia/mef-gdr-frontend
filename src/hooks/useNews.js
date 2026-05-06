// src/hooks/useNews.js
import { useState, useEffect, useCallback } from 'react';
import newsService from '../services/api/news.service';

export const useNews = (params = {}) => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await newsService.getAllNews(params);

      if (response.success) {
        setNews(response.data.news || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 0);
        setCategories(response.categories || []);
        setError(null);
      } else {
        setError(response.error);
        setNews([]);
        setCategories([]);
      }
    } catch (err) {
      setError(err.message);
      setNews([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    error,
    news,           // transformed news array
    total,          // total count from pagination
    totalPages,     // total pages from pagination
    categories,     // [ { event: {kh, en} }, { news: {kh, en} }, ... ]
    refetch: fetchData,
  };
};

export const useNewsDetail = (id) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await newsService.getNewsById(id);
      if (response.success) {
        setData(response.data);
        setError(null);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    error,
    news: data,
    refetch: fetchData,
  };
};