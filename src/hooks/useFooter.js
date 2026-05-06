// src/hooks/useFooter.js
import { useState, useEffect, useCallback } from 'react';
import { footerService } from '../services/api';

export const useFooter = (language = 'km') => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await footerService.getFooterConfig();
      
      console.log('useFooter response:', response);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setData(null);
        setError(response.error || 'Failed to fetch footer data');
      }
    } catch (err) {
      console.error('useFooter error:', err);
      setData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Extract contact info - directly from data
  const contact = {
    titleKh: data?.title || '',
    titleEn: data?.titleEn || '',
    email: data?.email || '',
  };

  // Extract address - directly from data
  const address = {
    km: data?.fullAddress || '',
    en: data?.fullAddressEn || '',
  };

  // Extract copyright - directly from data
  const copyright = {
    textKh: data?.copyRight || '',
    textEn: data?.copyRightEn || '',
    belowKh: data?.copyRightBelow || '',
    belowEn: data?.copyRightBelowEn || '',
  };

  // Extract email
  const email = data?.email || '';

  // Extract map URL
  const mapUrl = data?.urlMef || '';

  console.log('useFooter return values:', { contact, address, copyright, email, mapUrl });

  return {
    loading,
    error,
    data,
    contact,
    address,
    copyright,
    email,
    mapUrl,
    refetch: fetchData,
  };
};