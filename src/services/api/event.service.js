// src/services/api/event.service.js

import apiService from './api.service';
import envConfig from '../../config/env.config';

class EventService {
  /**
   * Get role and responsibility
   */
  async getRoleAndResponsibility() {
    const response = await apiService.get(envConfig.endpoints.events.roleAndResponsibility);
    
    console.log('Role API Raw Response:', response);
    
    if (response.success && response.data) {
      // The actual data is in response.data.data
      const actualData = response.data.data || response.data;
      
      return {
        success: true,
        data: this.transformRoleData(actualData),
      };
    }
    
    return {
      success: false,
      data: this.getFallbackRoleData(),
      error: response.error,
    };
  }

  /**
   * Get message
   */
  async getMessage() {
    const response = await apiService.get(envConfig.endpoints.events.message);
    
    console.log('Message API Raw Response:', response);
    
    if (response.success && response.data) {
      // The actual data is in response.data.data
      const actualData = response.data.data || response.data;
      
      return {
        success: true,
        data: this.transformMessageData(actualData),
      };
    }
    
    return {
      success: false,
      data: this.getFallbackMessageData(),
      error: response.error,
    };
  }

  /**
   * Transform role and responsibility data
   */
  transformRoleData(data) {
    if (!data) return this.getFallbackRoleData();

    console.log('Role transformData input:', data);

    return {
      id: data._id || null,
      
      // Title
      titleKh: data.title?.kh || 'តួនាទី និងការទទួលខុសត្រូវ',
      titleEn: data.title?.en || 'Roles & Responsibilities',
      
      // Article/Content (HTML)
      articleKh: data.article?.kh || '',
      articleEn: data.article?.en || '',
      
      // Status
      isActive: data.status ?? false,
      
      // Meta
      createdBy: data.created_by || null,
      updatedBy: data.updated_by || null,
      createdDate: data.created_date || null,
      updatedDate: data.updated_date || null,
    };
  }

  /**
   * Transform message data
   */
  transformMessageData(data) {
    if (!data) return this.getFallbackMessageData();

    console.log('Message transformData input:', data);

    return {
      id: data._id || null,
      
      // Name
      nameKh: data.name?.kh || '',
      nameEn: data.name?.en || '',
      
      // Job Title
      jobTitleKh: data.job_title?.kh || '',
      jobTitleEn: data.job_title?.en || '',
      
      // Message (HTML content)
      messageKh: data.message?.kh || '',
      messageEn: data.message?.en || '',
      
      // Profile Image
      profileImage: data.leader_profile || '',
      
      // Status
      isActive: data.status ?? false,
      
      // Meta
      createdBy: data.created_by || null,
      updatedBy: data.updated_by || null,
      createdDate: data.created_date || null,
      updatedDate: data.updated_date || null,
    };
  }

  /**
   * Fallback role data
   */
  getFallbackRoleData() {
    return {
      id: null,
      titleKh: 'តួនាទី និងការទទួលខុសត្រូវ',
      titleEn: 'Roles & Responsibilities',
      articleKh: '',
      articleEn: '',
      isActive: true,
      createdBy: null,
      updatedBy: null,
      createdDate: null,
      updatedDate: null,
    };
  }

  /**
   * Fallback message data
   */
  getFallbackMessageData() {
    return {
      id: null,
      nameKh: 'ឯកឧត្តម អ៊ឹម សិទ្ធីរ៉ា',
      nameEn: 'H.E. Im Sitthyra',
      jobTitleKh: 'ប្រតិភូរាជរដ្ឋាភិបាលទទួលបន្ទុកជាអគ្គនាយក នៃអគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍',
      jobTitleEn: 'Director General of the General Department of Resettlement',
      messageKh: '',
      messageEn: '',
      profileImage: '',
      isActive: true,
      createdBy: null,
      updatedBy: null,
      createdDate: null,
      updatedDate: null,
    };
  }
}

const eventService = new EventService();
export default eventService;