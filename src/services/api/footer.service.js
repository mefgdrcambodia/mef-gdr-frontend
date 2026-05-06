// src/services/api/footer.service.js

import apiService from './api.service';
import envConfig from '../../config/env.config';

class FooterService {
  /**
   * Get footer configuration
   */
  async getFooterConfig() {
    const response = await apiService.get(envConfig.endpoints.sections.footer);
    
    console.log('Footer API Raw Response:', response);
    
    // The API service returns { success: true, data: { success: true, data: {...} } }
    // We need to access the inner data
    if (response.success && response.data) {
      // The actual footer data is in response.data.data
      const actualData = response.data.data || response.data;
      
      console.log('Actual footer data:', actualData);
      
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

    console.log('Footer transformData input:', data);

    const transformed = {
      id: data._id || null,
      email: data.email || '',
      title: data.title || '',
      titleEn: data.title_en || '',
      fullAddress: data.full_address || '',
      fullAddressEn: data.full_address_en || '',
      copyRight: data.copy_right || '',
      copyRightEn: data.copy_right_en || '',
      copyRightBelow: data.copy_right_below || '',
      copyRightBelowEn: data.copy_right_below_en || '',
      urlMef: data.url_mef || '',
      status: data.status ?? false,
    };

    console.log('Footer transformData output:', transformed);

    return transformed;
  }
}

const footerService = new FooterService();
export default footerService;