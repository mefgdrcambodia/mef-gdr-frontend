// src/hooks/useManagementStructure.js
import { useState, useEffect, useCallback } from 'react';
import managementStructureService from '../services/api/managementStructure.service';

const useManagementStructure = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await managementStructureService.getManagementStructure();
      
      console.log('useManagementStructure response:', response);
      
      if (response.success && response.data) {
        setData(response.data);
        console.log('useManagementStructure data set:', response.data);
      } else {
        setData(null);
        setError(response.error || 'Failed to fetch management structure data');
      }
    } catch (err) {
      console.error('Error fetching management structure data:', err);
      setData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getOrgChartImage = useCallback((lang = 'km') => {
    if (!data) return '';
    return managementStructureService.getOrgChartImage(data, lang);
  }, [data]);

  return {
    loading,
    error,
    data,
    orgChartImage: getOrgChartImage,
    isActive: data?.isActive ?? true,
    refetch: fetchData,
  };
};

export default useManagementStructure; // Change to default export