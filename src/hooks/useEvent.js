// src/hooks/useEvent.js
import { useState, useEffect } from 'react';
import { eventService } from '../services/api';

export const useRoleAndResponsibility = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(eventService.getFallbackRoleData());
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await eventService.getRoleAndResponsibility();
      
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    error,
    data,
    refetch: fetchData,
  };
};

export const useMessage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(eventService.getFallbackMessageData());
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await eventService.getMessage();
      
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    error,
    data,
    refetch: fetchData,
  };
};