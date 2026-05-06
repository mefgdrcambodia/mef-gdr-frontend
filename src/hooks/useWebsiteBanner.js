// src/hooks/useWebsiteBanner.js
import { useState, useEffect, useCallback } from 'react';
import websiteBannerService from '../services/api/websiteBanner.service';

const useWebsiteBanner = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await websiteBannerService.getWebsiteBanners();
      
      console.log('useWebsiteBanner response:', response);
      
      if (response.success && response.data) {
        setData(response.data);
        console.log('useWebsiteBanner data set:', response.data);
      } else {
        setData(null);
        setError(response.error || 'Failed to fetch website banners');
      }
    } catch (err) {
      console.error('Error fetching website banners:', err);
      setData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getBannerByPath = useCallback((path, lang = 'km') => {
    if (!data) return '';
    return websiteBannerService.getBannerByPath(data, path, lang);
  }, [data]);

  return {
    loading,
    error,
    data,
    getBannerByPath,
    isActive: data?.status ?? true,
    refetch: fetchData,
  };
};

export default useWebsiteBanner;