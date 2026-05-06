// src/services/api/speech.service.js
import apiService from './api.service';
import envConfig from '../../config/env.config';

class SpeechService {
  /**
   * Get all speeches with pagination
   */
  async getSpeeches(page = 1, limit = 10, search = '') {
    const params = { page, limit };
    if (search) params.search = search;

    const response = await apiService.get(envConfig.endpoints.speech.getAll, params);
    
    console.log('Speech API Response:', response);
    
    if (response.success && response.data) {
      const body = response.data;
      
      return {
        success: true,
        data: this.transformListData(body),
        pagination: body.pagination || { page, limit, total: 0, totalPages: 0 },
      };
    }
    
    return {
      success: false,
      data: { speeches: [], total: 0, page, limit, totalPages: 0 },
      pagination: { page, limit, total: 0, totalPages: 0 },
      error: response.error,
    };
  }

  /**
   * Get speech by ID
   */
  async getSpeechById(id) {
    const response = await apiService.get(envConfig.endpoints.speech.getById(id));

    if (response.success && response.data) {
      const item = response.data.data || response.data;
      return {
        success: true,
        data: this.transformSpeechData(item),
      };
    }

    return {
      success: false,
      data: null,
      error: response.error,
    };
  }

  /**
   * Transform list data
   */
  transformListData(body) {
    const speeches = Array.isArray(body.data) ? body.data : [];

    return {
      speeches: speeches.map((speech) => this.transformSpeechData(speech)),
      total: body.pagination?.total || speeches.length,
      page: body.pagination?.page || 1,
      limit: body.pagination?.limit || 10,
      totalPages: body.pagination?.totalPages || 1,
    };
  }

  /**
   * Transform individual speech data
   */
  transformSpeechData(speech) {
    // Get cover image from title_image
    const coverImage = speech.title_image || '';
    
    // Format date
    const formattedDate = speech.created_date ? new Date(speech.created_date) : new Date();
    
    // Extract plain text from article (strip HTML)
    const getPlainText = (html) => {
      if (!html) return '';
      const temp = document.createElement('DIV');
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || '';
    };
    
    // Get excerpt (first 200 characters)
    const getExcerpt = (html, lang) => {
      const plainText = getPlainText(lang === 'km' ? speech.article?.kh : speech.article?.en);
      return plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText;
    };
    
    // Calculate read time (approx 200 words per minute)
    const calculateReadTime = (html, lang) => {
      const plainText = getPlainText(lang === 'km' ? speech.article?.kh : speech.article?.en);
      const wordCount = plainText.split(/\s+/).length;
      return Math.max(1, Math.ceil(wordCount / 200));
    };
    
    // Determine category based on title/content (can be enhanced)
    const getCategory = (title, lang) => {
      const titleText = lang === 'km' ? title?.kh?.toLowerCase() : title?.en?.toLowerCase();
      if (titleText?.includes('ប្រជុំ') || titleText?.includes('meeting')) return 'annual-meeting';
      if (titleText?.includes('ដោះស្រាយ') || titleText?.includes('resettlement')) return 'resettlement';
      if (titleText?.includes('សន្និបាត') || titleText?.includes('conference')) return 'conference';
      if (titleText?.includes('បណ្តុះបណ្តាល') || titleText?.includes('training')) return 'training';
      return 'other';
    };
    
    const getCategoryLabel = (category, lang) => {
      const labels = {
        km: {
          'annual-meeting': 'ប្រជុំប្រចាំឆ្នាំ',
          'resettlement': 'ដោះស្រាយផលប៉ះពាល់',
          'conference': 'សន្និបាត',
          'training': 'បណ្តុះបណ្តាល',
          'other': 'ផ្សេងៗ'
        },
        en: {
          'annual-meeting': 'Annual Meeting',
          'resettlement': 'Resettlement',
          'conference': 'Conference',
          'training': 'Training',
          'other': 'Other'
        }
      };
      return labels[lang][category] || category;
    };
    
    const category = getCategory(speech.title, 'km');
    
    return {
      id: speech._id || null,
      titleKh: speech.title?.kh || '',
      titleEn: speech.title?.en || '',
      articleKh: speech.article?.kh || '',
      articleEn: speech.article?.en || '',
      coverImage: coverImage,
      excerptKh: getExcerpt(speech.article, 'km'),
      excerptEn: getExcerpt(speech.article, 'en'),
      readTimeKh: calculateReadTime(speech.article, 'km'),
      readTimeEn: calculateReadTime(speech.article, 'en'),
      category: category,
      categoryLabelKh: getCategoryLabel(category, 'km'),
      categoryLabelEn: getCategoryLabel(category, 'en'),
      status: speech.status ?? true,
      createdBy: speech.created_by?.email || speech.created_by || null,
      updatedBy: speech.updated_by?.email || speech.updated_by || null,
      createdDate: speech.created_date || null,
      updatedDate: speech.updated_date || null,
      formattedDate: formattedDate,
    };
  }

  /**
   * Get display title based on language
   */
  getTitle(speech, lang = 'km') {
    return lang === 'km' ? speech.titleKh || speech.titleEn : speech.titleEn || speech.titleKh;
  }

  /**
   * Get display article based on language
   */
  getArticle(speech, lang = 'km') {
    return lang === 'km' ? speech.articleKh || speech.articleEn : speech.articleEn || speech.articleKh;
  }

  /**
   * Get display excerpt based on language
   */
  getExcerpt(speech, lang = 'km') {
    return lang === 'km' ? speech.excerptKh || speech.excerptEn : speech.excerptEn || speech.excerptKh;
  }

  /**
   * Get read time based on language
   */
  getReadTime(speech, lang = 'km') {
    return lang === 'km' ? speech.readTimeKh : speech.readTimeEn;
  }

  /**
   * Get category label based on language
   */
  getCategoryLabel(speech, lang = 'km') {
    return lang === 'km' ? speech.categoryLabelKh : speech.categoryLabelEn;
  }

  /**
   * Get author (from created_by or default)
   */
  getAuthor(speech, lang = 'km') {
    // You can customize this based on your data
    if (speech.createdBy) return speech.createdBy;
    return lang === 'km' ? 'អគ្គនាយកដ្ឋាន' : 'General Department';
  }

  /**
   * Strip HTML tags
   */
  stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}

const speechService = new SpeechService();
export default speechService;