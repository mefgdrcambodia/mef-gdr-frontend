// src/services/api/websiteBanner.service.js
import apiService from './api.service';
import envConfig from '../../config/env.config';

class WebsiteBannerService {
  /**
   * Get website banners configuration
   */
  async getWebsiteBanners() {
    const response = await apiService.get(envConfig.endpoints.websiteBanner.get);
    
    console.log('Website Banner API Response:', response);
    
    if (response.success && response.data) {
      // The actual data is in response.data.data
      const actualData = response.data.data || response.data;
      
      console.log('Website Banner actualData:', actualData);
      
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

    return {
      id: data._id || null,
      aboutGeneralDepartment: data.url_about_general_department || '',
      documentCollection: data.url_document_collection || '',
      newsAndEvent: data.url_new_and_event || '',
      report: data.url_report || '',
      status: data.status ?? true,
      createdBy: data.created_by || null,
      updatedBy: data.updated_by || null,
      createdDate: data.created_date || null,
      updatedDate: data.updated_date || null,
    };
  }

  /**
   * Get banner URL based on page path
   */
  getBannerByPath(banners, path, lang = 'km') {
    if (!banners) return '';
    
    // Map page paths to banner URLs
    const pathMap = {
      // About section
      '/about': banners.aboutGeneralDepartment,
      '/about/management': banners.aboutGeneralDepartment,
      '/about/roles': banners.aboutGeneralDepartment,
      '/about/director-message': banners.aboutGeneralDepartment,
      '/about/speech': banners.aboutGeneralDepartment,
      '/about/vision-mission': banners.aboutGeneralDepartment,
      '/about/history': banners.aboutGeneralDepartment,
      '/about/leadership': banners.aboutGeneralDepartment,
      
      // News section
      '/news': banners.newsAndEvent,
      '/news/photos': banners.newsAndEvent,
      '/news/videos': banners.newsAndEvent,
      
      // Reports section
      '/reports': banners.report,
      '/reports/ssmr': banners.report,
      '/reports/drp': banners.report,
      
      // Legal section
      '/legal': banners.documentCollection,
      '/legal/law': banners.documentCollection,
      '/legal/sub-decree': banners.documentCollection,
      '/legal/circular': banners.documentCollection,
      '/legal/declaration': banners.documentCollection,
      
      // Contact
      '/contact': banners.aboutGeneralDepartment,
    };
    
    // Find matching banner
    for (const [route, bannerUrl] of Object.entries(pathMap)) {
      if (path === route || path.startsWith(route + '/')) {
        return bannerUrl;
      }
    }
    
    // Default banner
    return banners.aboutGeneralDepartment || '';
  }
}

const websiteBannerService = new WebsiteBannerService();
export default websiteBannerService;