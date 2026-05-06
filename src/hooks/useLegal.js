// src/hooks/useLegal.js
import { useState, useEffect, useCallback } from 'react';
import legalService from '../services/api/legal.service';

export const useLegalDocuments = (page = 1, limit = 10, category = '') => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await legalService.getLegalDocuments(page, limit, category);

      if (response.success) {
        setDocuments(response.data.documents || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 0);
        setCategories(response.categories || []);
        setError(null);
      } else {
        setError(response.error);
        setDocuments([]);
        setCategories([]);
      }
    } catch (err) {
      setError(err.message);
      setDocuments([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    error,
    documents,    // transformed document array
    total,        // total count
    totalPages,   // total pages
    categories,   // [ { law: {kh, en} }, { decree: {kh, en} }, ... ]
    refetch: fetchData,
  };
};

export const useLegalDocument = (id) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await legalService.getLegalDocumentById(id);

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
    document: data,
    refetch: fetchData,
  };
};