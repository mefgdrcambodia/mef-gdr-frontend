// src/services/api/header.service.js

import apiService from './api.service';
import envConfig from '../../config/env.config';

class HeaderService {
  /**
   * Get header configuration
   */
  async getHeaderConfig() {
    const response = await apiService.get(envConfig.endpoints.sections.header);
    
    console.log('Header API Raw Response:', response);
    
    if (response.success && response.data) {
      // The actual data is in response.data.data
      const actualData = response.data.data || response.data;
      
      console.log('Header actualData:', actualData);
      
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

    console.log('Header transformData input:', data);

    return {
      id: data._id || null,
      
      // Names
      nameFullKh: data.mef_name_full || '',
      nameFullEn: data.mef_name_full_en || '',
      nameShortKh: data.mef_name_short || '',
      nameShortEn: data.mef_name_short_en || '',
      
      // Running texts
      runningTextKh: this.extractTexts(data.running_text),
      runningTextEn: this.extractTexts(data.running_text_en),
      
      // Assets
      logo: data.url_logo || '',
      banner: data.url_banner || '', // Keep for backward compatibility
      banners: this.extractBannerUrls(data.banners), // Extract URLs from banners array
      
      // Always active - ignore status field
      isActive: true,
      
      // Meta
      createdBy: data.created_by || null,
      updatedBy: data.updated_by || null,
      createdDate: data.created_date || null,
      updatedDate: data.updated_date || null,
    };
  }

  /**
   * Extract text from array
   */
  extractTexts(textArray) {
    if (!Array.isArray(textArray)) {
      console.log('extractTexts - not an array:', textArray);
      return [];
    }
    const texts = textArray.map(item => item.text || '').filter(Boolean);
    console.log('extractTexts - result:', texts);
    return texts;
  }

  /**
   * Extract banner URLs from banners array
   * Input: [{ url: "https://...", _id: "..." }, ...]
   * Output: ["https://...", "https://..."]
   */
  extractBannerUrls(bannersArray) {
    if (!Array.isArray(bannersArray)) {
      return [];
    }
    
    const urls = bannersArray.map(item => item.url || '').filter(Boolean);
    console.log('extractBannerUrls - result:', urls);
    return urls;
  }

  /**
   * Get banner images (returns array of banner URLs)
   */
  getBanners(data) {
    return data?.banners || [];
  }

  /**
   * Get single banner (returns first banner or default)
   */
  getPrimaryBanner(data) {
    const banners = this.getBanners(data);
    return banners.length > 0 ? banners[0] : data?.banner || '';
  }
}

const headerService = new HeaderService();
export default headerService;