// src/services/api/legal.service.js
import apiService from './api.service';
import envConfig from '../../config/env.config';

class LegalService {
  /**
   * Get all legal documents with pagination
   */
  async getLegalDocuments(page = 1, limit = 10, category = '') {
    const params = { page, limit };
    if (category) params.category = category;

    const response = await apiService.get(envConfig.endpoints.legal.getAll, params);

    // response.data = full body = { success, data:[], pagination:{}, category:[] }
    if (response.success && response.data) {
      const body = response.data;

      return {
        success: true,
        data: this.transformListData(body),
        categories: Array.isArray(body.category) ? body.category : [],
        pagination: body.pagination || { page, limit, total: 0, totalPages: 0 },
      };
    }

    return {
      success: false,
      data: { documents: [], total: 0, page, limit, totalPages: 0 },
      categories: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      error: response.error,
    };
  }

  /**
   * Get legal document by ID
   */
  async getLegalDocumentById(id) {
    const response = await apiService.get(envConfig.endpoints.legal.getById(id));

    if (response.success && response.data) {
      const item = response.data.data || response.data;
      return {
        success: true,
        data: this.transformDocumentData(item),
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
   * body = { success, data:[], pagination:{}, category:[] }
   */
  transformListData(body) {
    const documents = Array.isArray(body.data) ? body.data : [];

    return {
      documents: documents.map((doc) => this.transformDocumentData(doc)),
      total: body.pagination?.total || documents.length,
      page: body.pagination?.page || 1,
      limit: body.pagination?.limit || 10,
      totalPages: body.pagination?.totalPages || 1,
    };
  }

  /**
   * Transform individual document
   */
  transformDocumentData(doc) {
    return {
      id: doc._id || null,

      // Title — both languages, consumer picks based on currentLang
      titleKh: doc.title?.kh || '',
      titleEn: doc.title?.en || '',

      // Description — both languages
      descriptionKh: doc.description?.kh || '',
      descriptionEn: doc.description?.en || '',

      // PDF files — both languages
      pdfFileKh: doc.pdf_file?.kh || '',
      pdfFileEn: doc.pdf_file?.en || '',

      // Cover image
      coverImage: doc.cover_image || '',

      // Category key e.g. "law", "decree"
      category: doc.category || 'other',

      // Document number
      documentNumber: doc.document_number || '',

      // Dates
      publishedDate: doc.published_date || doc.created_date || null,
      createdDate: doc.created_date || null,
      updatedDate: doc.updated_date || null,

      // Status
      isActive: doc.status ?? true,

      // Meta
      createdBy: doc.created_by || null,
      updatedBy: doc.updated_by || null,
    };
  }

  /**
   * Get display title based on language
   */
  getTitle(doc, lang = 'km') {
    return lang === 'km' ? doc.titleKh || doc.titleEn : doc.titleEn || doc.titleKh;
  }

  /**
   * Get display description based on language
   */
  getDescription(doc, lang = 'km') {
    return lang === 'km' ? doc.descriptionKh || doc.descriptionEn : doc.descriptionEn || doc.descriptionKh;
  }

  /**
   * Get PDF file based on language
   */
  getPdfFile(doc, lang = 'km') {
    return lang === 'km' ? doc.pdfFileKh || doc.pdfFileEn : doc.pdfFileEn || doc.pdfFileKh;
  }

  /**
   * Get category display name based on language
   * categories = [ { law: { kh: 'ច្បាប់', en: 'Law' } }, ... ]
   */
  getCategoryName(categories, categoryKey, lang = 'km') {
    if (!categories || !Array.isArray(categories)) return categoryKey;
    const found = categories.find((cat) => cat[categoryKey]);
    if (found && found[categoryKey]) {
      return lang === 'km'
        ? found[categoryKey].kh || found[categoryKey].en || categoryKey
        : found[categoryKey].en || found[categoryKey].kh || categoryKey;
    }
    return categoryKey;
  }
}

const legalService = new LegalService();
export default legalService;