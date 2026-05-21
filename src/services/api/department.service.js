// src/services/api/department.service.js
import apiService from './api.service';
import envConfig from '../../config/env.config';

class DepartmentService {
  // Cache to prevent multiple identical requests
  static cache = new Map();
  
  /**
   * Get single department by type
   */
  async getDepartmentByType(departmentType, options = {}) {
    const { forceRefresh = false } = options;
    const cacheKey = `department_${departmentType}`;
    
    // Check cache
    if (!forceRefresh && DepartmentService.cache.has(cacheKey)) {
      return DepartmentService.cache.get(cacheKey);
    }
    
    try {
      const endpoint = envConfig.endpoints.department.getByType(departmentType);
      const response = await apiService.get(endpoint);
      
      if (response && response.success && response.data) {
        const body = response.data;
        const department = body.data || body;
        
        const result = {
          success: true,
          type: departmentType,
          data: this.transformDepartmentData(department, departmentType),
        };
        
        // Store in cache
        DepartmentService.cache.set(cacheKey, result);
        
        return result;
      }
      
      const errorResult = {
        success: false,
        type: departmentType,
        data: null,
        error: response?.error || `Failed to fetch ${departmentType} data`,
      };
      
      DepartmentService.cache.set(cacheKey, errorResult);
      return errorResult;
    } catch (error) {
      const errorResult = {
        success: false,
        type: departmentType,
        data: null,
        error: error.message || 'An error occurred while fetching data',
      };
      
      DepartmentService.cache.set(cacheKey, errorResult);
      return errorResult;
    }
  }

  /**
   * Get all departments (5 departments) for a single page
   */
  async getAllDepartments(options = {}) {
    const { parallel = true, onProgress = null, forceRefresh = false } = options;
    
    const endpoints = envConfig.endpoints.department.getAllEndpoints();
    
    if (parallel) {
      // Fetch all departments in parallel
      try {
        const promises = endpoints.map(async (endpoint) => {
          const result = await this.getDepartmentByType(endpoint.type, { forceRefresh });
          if (onProgress) onProgress(endpoint.type, result);
          return result;
        });
        
        const results = await Promise.all(promises);
        
        // Organize results by type
        const departments = {};
        const errors = [];
        
        results.forEach(result => {
          if (result.success) {
            departments[result.type] = result.data;
          } else {
            errors.push({ type: result.type, error: result.error });
          }
        });
        
        return {
          success: errors.length === 0,
          departments,
          errors,
          allLoaded: errors.length === 0,
          partialSuccess: errors.length > 0 && Object.keys(departments).length > 0,
        };
      } catch (error) {
        
        return {
          success: false,
          departments: {},
          errors: [{ error: error.message }],
          allLoaded: false,
          partialSuccess: false,
        };
      }
    } else {
      // Sequential fetching
      const departments = {};
      const errors = [];
      
      for (const endpoint of endpoints) {
        const result = await this.getDepartmentByType(endpoint.type, { forceRefresh });
        if (result.success) {
          departments[result.type] = result.data;
        } else {
          errors.push({ type: result.type, error: result.error });
        }
        if (onProgress) onProgress(endpoint.type, result);
      }
      
      return {
        success: errors.length === 0,
        departments,
        errors,
        allLoaded: errors.length === 0,
        partialSuccess: errors.length > 0 && Object.keys(departments).length > 0,
      };
    }
  }

  /**
   * Transform department data for detail view
   */
  transformDepartmentData(department, departmentType = 'unknown') {
    // Helper to strip HTML
    const stripHtml = (html) => {
      if (!html) return '';
      // For browser environment
      if (typeof document !== 'undefined') {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
      }
      // For Node environment (fallback)
      return html.replace(/<[^>]*>/g, '');
    };
    
    // Transform main job_to_do array
    const jobToDo = Array.isArray(department.job_to_do) 
      ? department.job_to_do.map(job => ({
          kh: job.kh || '',
          en: job.en || '',
          id: job._id || null,
        }))
      : [];

    // Transform office_one
    const officeOne = department.office_one ? {
      titleKh: stripHtml(department.office_one.title?.kh || ''),
      titleEn: stripHtml(department.office_one.title?.en || ''),
      jobToDo: Array.isArray(department.office_one.job_to_do)
        ? department.office_one.job_to_do.map(job => ({
            kh: job.kh || '',
            en: job.en || '',
          }))
        : [],
    } : null;

    // Transform office_two
    const officeTwo = department.office_two ? {
      titleKh: stripHtml(department.office_two.title?.kh || ''),
      titleEn: stripHtml(department.office_two.title?.en || ''),
      jobToDo: Array.isArray(department.office_two.job_to_do)
        ? department.office_two.job_to_do.map(job => ({
            kh: job.kh || '',
            en: job.en || '',
          }))
        : [],
    } : null;

    // Transform office_three
    const officeThree = department.office_three ? {
      titleKh: stripHtml(department.office_three.title?.kh || ''),
      titleEn: stripHtml(department.office_three.title?.en || ''),
      jobToDo: Array.isArray(department.office_three.job_to_do)
        ? department.office_three.job_to_do.map(job => ({
            kh: job.kh || '',
            en: job.en || '',
          }))
        : [],
    } : null;

    // Get department name based on type
    const departmentName = this.getDepartmentName(departmentType);

    return {
      id: department._id || null,
      type: departmentType,
      name: departmentName,
      titleKh: stripHtml(department.title?.kh || ''),
      titleEn: stripHtml(department.title?.en || ''),
      descriptionKh: stripHtml(department.description?.kh || ''),
      descriptionEn: stripHtml(department.description?.en || ''),
      jobToDo: jobToDo,
      officeOne: officeOne,
      officeTwo: officeTwo,
      officeThree: officeThree,
      status: department.status ?? true,
      createdBy: department.created_by?.email || department.created_by || null,
      updatedBy: department.updated_by?.email || department.updated_by || null,
      createdDate: department.created_date || null,
      updatedDate: department.updated_date || null,
    };
  }

  /**
   * Get department display name
   */
  getDepartmentName(departmentType) {
    const names = {
      'resettlement-one': { en: 'Department of Resettlement One', kh: 'នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ១' },
      'resettlement-two': { en: 'Department of Resettlement Two', kh: 'នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ២' },
      'resettlement-three': { en: 'Department of Resettlement Three', kh: 'នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ៣' },
      'general': { en: 'General Department', kh: 'នាយកដ្ឋានកិច្ចការទូទៅ' },
      'manage-data': { en: 'Data Management Department', kh: 'នាយកដ្ឋានត្រួតពិនិត្យផ្ទៃក្នុង និងគ្រប់គ្រងទិន្នន័យ' },
    };
    return names[departmentType] || { en: 'Department', kh: 'នាយកដ្ឋាន' };
  }

  /**
   * Get office title
   */
  getOfficeTitle(department, officeType, lang = 'km') {
    if (!department) return '';
    
    let office = null;
    if (officeType === 'one') office = department.officeOne;
    else if (officeType === 'two') office = department.officeTwo;
    else if (officeType === 'three') office = department.officeThree;
    
    if (!office) return '';
    return lang === 'km' ? office.titleKh : office.titleEn;
  }

  /**
   * Get all offices data with their responsibilities
   */
  getAllOfficesWithResponsibilities(department, lang = 'km') {
    if (!department) return [];
    
    const offices = [];
    
    if (department.officeOne && department.officeOne.jobToDo) {
      offices.push({
        type: 'one',
        title: lang === 'km' ? department.officeOne.titleKh : department.officeOne.titleEn,
        duties: department.officeOne.jobToDo.map(job => lang === 'km' ? job.kh : job.en),
      });
    }
    
    if (department.officeTwo && department.officeTwo.jobToDo) {
      offices.push({
        type: 'two',
        title: lang === 'km' ? department.officeTwo.titleKh : department.officeTwo.titleEn,
        duties: department.officeTwo.jobToDo.map(job => lang === 'km' ? job.kh : job.en),
      });
    }
    
    if (department.officeThree && department.officeThree.jobToDo) {
      offices.push({
        type: 'three',
        title: lang === 'km' ? department.officeThree.titleKh : department.officeThree.titleEn,
        duties: department.officeThree.jobToDo.map(job => lang === 'km' ? job.kh : job.en),
      });
    }
    
    return offices;
  }

  /**
   * Clear cache
   */
  clearCache() {
    DepartmentService.cache.clear();
  }
}

const departmentService = new DepartmentService();
export default departmentService;