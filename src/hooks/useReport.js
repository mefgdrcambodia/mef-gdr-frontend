import { useState, useEffect, useCallback } from 'react';
import reportService from '../services/api/report.service';

const useReports = (initialPage = 1, initialLimit = 10, initialCategory = '') => {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async (page = initialPage, limit = initialLimit, category = initialCategory) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reportService.getReports(page, limit, category);
      
      if (result.success) {
        setReports(result.data.reports || []);
        setCategories(result.categories);
        setPagination(result.pagination);
      } else {
        setError(result.error || 'Failed to fetch reports');
        setReports([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [initialPage, initialLimit, initialCategory]);

  const fetchReportById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reportService.getReportById(id);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch report');
        return null;
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the report');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchReports(newPage, pagination.limit, initialCategory);
    }
  }, [fetchReports, pagination.limit, pagination.totalPages, initialCategory]);

  const changeCategory = useCallback((newCategory) => {
    fetchReports(1, pagination.limit, newCategory);
  }, [fetchReports, pagination.limit]);

  const refresh = useCallback(() => {
    fetchReports(pagination.page, pagination.limit, initialCategory);
  }, [fetchReports, pagination.page, pagination.limit, initialCategory]);

  useEffect(() => {
    fetchReports(initialPage, initialLimit, initialCategory);
  }, [fetchReports, initialPage, initialLimit, initialCategory]);

  return {
    reports,
    categories,
    pagination,
    loading,
    error,
    fetchReports,
    fetchReportById,
    changePage,
    changeCategory,
    refresh,
  };
};

export default useReports;