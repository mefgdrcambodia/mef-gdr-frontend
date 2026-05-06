// src/hooks/useHeader.js
import { useState, useEffect, useCallback } from 'react';
import { headerService } from '../services/api';

export const useHeader = (language = 'km') => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await headerService.getHeaderConfig();
      
      console.log('useHeader response:', response);
      
      if (response.success && response.data) {
        setData(response.data);
        console.log('useHeader data set:', response.data);
      } else {
        setData(null);
        setError(response.error || 'Failed to fetch header data');
      }
    } catch (err) {
      console.error('Error fetching header data:', err);
      setData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getOrgName = useCallback((type = 'full') => {
    if (!data) return '';
    
    return language === 'km' 
      ? (type === 'full' ? data.nameFullKh : data.nameShortKh)
      : (type === 'full' ? data.nameFullEn : data.nameShortEn);
  }, [data, language]);

  const getRunningTexts = useCallback(() => {
    if (!data) return [];
    
    const texts = language === 'km' ? data.runningTextKh : data.runningTextEn;
    console.log('useHeader getRunningTexts:', texts);
    return texts || [];
  }, [data, language]);

  const getBanners = useCallback(() => {
    if (!data) return [];
    return data.banners || [];
  }, [data]);

  const getPrimaryBanner = useCallback(() => {
    const banners = getBanners();
    return banners.length > 0 ? banners[0] : data?.banner || '';
  }, [data, getBanners]);

  return {
    loading,
    error,
    data,
    orgNameFull: getOrgName('full'),
    orgNameShort: getOrgName('short'),
    runningTexts: getRunningTexts(),
    logo: data?.logo || '',
    banner: data?.banner || '',
    banners: getBanners(), // This will be an array of URL strings
    primaryBanner: getPrimaryBanner(),
    isActive: data?.isActive ?? true, // Default to true if not set
    refetch: fetchData,
  };
};