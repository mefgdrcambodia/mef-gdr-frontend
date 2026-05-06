// src/services/api/managementStructure.service.js
import apiService from './api.service';
import envConfig from '../../config/env.config';

class ManagementStructureService {
  /**
   * Get management structure data (organization chart image)
   */
  async getManagementStructure() {
    const response = await apiService.get(envConfig.endpoints.managementStructure.get);
    
    console.log('Management Structure API Response:', response);
    
    if (response.success && response.data) {
      // The actual data is in response.data.data
      const actualData = response.data.data || response.data;
      
      console.log('Management Structure actualData:', actualData);
      
      return {
        success: true,
        data: this.transformData(actualData),
      };
    }
    
    return {
      success: false,
      data: null,
      error: response.error,
    };
  }

  /**
   * Transform API data
   */
  transformData(data) {
    if (!data) return null;

    // Get image URL based on current language
    // The API returns url_image.kh and url_image.en
    const getImageUrl = (lang = 'km') => {
      if (data.url_image) {
        return lang === 'km' ? data.url_image.kh : data.url_image.en;
      }
      return null;
    };

    return {
      id: data._id || null,
      imageKh: data.url_image?.kh || '',
      imageEn: data.url_image?.en || '',
      articleKh: data.article?.kh || '',
      articleEn: data.article?.en || '',
      isActive: data.status ?? true,
      createdBy: data.created_by || null,
      updatedBy: data.updated_by || null,
      createdDate: data.created_date || null,
      updatedDate: data.updated_date || null,
      getImageUrl,
    };
  }

  /**
   * Get organization chart image based on language
   */
  getOrgChartImage(data, lang = 'km') {
    if (!data) return '';
    return lang === 'km' ? data.imageKh : data.imageEn;
  }
}

const managementStructureService = new ManagementStructureService();
export default managementStructureService;