// src/hooks/useDepartments.js
import { useState, useEffect, useCallback, useRef } from 'react';
import departmentService from '../services/api/department.service';

export const useDepartmentDetail = (options = {}) => {
  const { 
    autoFetch = true, 
    departmentType = null,
    fetchAll = true,
    parallel = true 
  } = options;
  
  const [departments, setDepartments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [progress, setProgress] = useState({});
  
  // Use refs to prevent infinite loops
  const hasFetched = useRef(false);
  const isFetching = useRef(false);

  const fetchSingleDepartment = useCallback(async (type) => {
    if (isFetching.current) return;
    isFetching.current = true;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await departmentService.getDepartmentByType(type);
      
      if (result.success) {
        setDepartments(prev => ({
          ...prev,
          [result.type]: result.data
        }));
        return result;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  const fetchAllDepartments = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    
    setLoading(true);
    setError(null);
    setErrors([]);
    
    const onProgress = (type, result) => {
      setProgress(prev => ({
        ...prev,
        [type]: result.success ? 'loaded' : 'failed'
      }));
      
      if (!result.success) {
        setErrors(prev => [...prev, { type, error: result.error }]);
      }
    };
    
    try {
      const result = await departmentService.getAllDepartments({ 
        parallel, 
        onProgress 
      });
      
      if (result.success || result.partialSuccess) {
        setDepartments(result.departments);
        if (result.errors.length > 0) {
          setErrors(result.errors);
        }
        return result;
      } else {
        setError('Failed to load departments');
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [parallel]);

  // Use a single effect with proper dependencies
  useEffect(() => {
    if (autoFetch && !hasFetched.current && !isFetching.current) {
      hasFetched.current = true;
      
      if (fetchAll) {
        fetchAllDepartments();
      } else if (departmentType) {
        fetchSingleDepartment(departmentType);
      }
    }
  }, [autoFetch, fetchAll, departmentType, fetchAllDepartments, fetchSingleDepartment]);

  const refetch = useCallback(() => {
    hasFetched.current = false;
    setDepartments({});
    setErrors([]);
    setProgress({});
    
    if (fetchAll) {
      return fetchAllDepartments();
    } else if (departmentType) {
      return fetchSingleDepartment(departmentType);
    }
  }, [fetchAll, departmentType, fetchAllDepartments, fetchSingleDepartment]);

  const getDepartment = useCallback((type) => {
    return departments[type] || null;
  }, [departments]);

  const getDepartmentsList = useCallback((lang = 'km') => {
    return departmentService.getDepartmentsSummary(departments, lang);
  }, [departments]);

  return {
    departments,
    loading,
    error,
    errors,
    progress,
    getDepartment,
    getDepartmentsList,
    refetch,
    fetchSingleDepartment,
    fetchAllDepartments,
  };
};