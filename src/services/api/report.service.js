// src/services/api/report.service.js
import apiService from './api.service';
import envConfig from '../../config/env.config';

class ReportService {
  /**
   * Get all reports with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} category - Category filter (ssmr, drp)
   */
  async getReports(page = 1, limit = 10, category = '') {
    const params = { page, limit };
    if (category) params.category = category;

    const response = await apiService.get(envConfig.endpoints.reports.getAll, params);

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
      data: { reports: [], total: 0, page, limit, totalPages: 0 },
      categories: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      error: response.error,
    };
  }

  /**
   * Get report by ID
   * @param {string} id - Report ID
   */
  async getReportById(id) {
    const response = await apiService.get(envConfig.endpoints.reports.getById(id));

    if (response.success && response.data) {
      const item = response.data.data || response.data;
      return {
        success: true,
        data: this.transformReportData(item),
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
    const reports = Array.isArray(body.data) ? body.data : [];

    return {
      reports: reports.map((report) => this.transformReportData(report)),
      total: body.pagination?.total || reports.length,
      page: body.pagination?.page || 1,
      limit: body.pagination?.limit || 10,
      totalPages: body.pagination?.totalPages || 1,
    };
  }

  /**
   * Transform individual report
   */
  transformReportData(report) {
    return {
      id: report._id || null,

      // Title — both languages
      titleKh: report.title?.kh || '',
      titleEn: report.title?.en || '',

      // Description — both languages
      descriptionKh: report.description?.kh || '',
      descriptionEn: report.description?.en || '',

      // PDF files — both languages
      pdfFileKh: report.pdf_file?.kh || '',
      pdfFileEn: report.pdf_file?.en || '',

      // Cover image / Thumbnail
      thumbnail: report.cover_image || '',
      coverImage: report.cover_image || '',

      // Category key e.g. "ssmr", "drp"
      category: report.category || 'other',

      // Document number
      documentNumber: report.document_number || '',

      // Dates
      publishedDate: report.published_date || report.created_date || null,
      createdDate: report.created_date || null,
      updatedDate: report.updated_date || null,

      // Status
      isActive: report.status ?? true,

      // Meta
      createdBy: report.created_by || null,
      updatedBy: report.updated_by || null,
      
      // Additional fields for UI
      format: "PDF",
      pages: report.pages || 0,
      size: report.file_size || "Unknown",
    };
  }

  /**
   * Get display title based on language
   */
  getTitle(report, lang = 'km') {
    return lang === 'km' ? report.titleKh || report.titleEn : report.titleEn || report.titleKh;
  }

  /**
   * Get display description based on language
   */
  getDescription(report, lang = 'km') {
    return lang === 'km' ? report.descriptionKh || report.descriptionEn : report.descriptionEn || report.descriptionKh;
  }

  /**
   * Get PDF file based on language
   */
  getPdfFile(report, lang = 'km') {
    return lang === 'km' ? report.pdfFileKh || report.pdfFileEn : report.pdfFileEn || report.pdfFileKh;
  }

  /**
   * Get thumbnail/cover image
   */
  getThumbnail(report) {
    return report.thumbnail || report.coverImage || '';
  }

  /**
   * Get category display name based on language
   * categories = [ { ssmr: { kh: 'ស.ស.ម.ស', en: 'SSMR' } }, { drp: { kh: 'គ.រ.ស', en: 'DRP' } } ]
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

  /**
   * Get category key from URL or filter
   */
  getCategoryKeyFromType(reportType) {
    if (reportType === 'drp') return 'drp';
    if (reportType === 'ssmr') return 'ssmr';
    return '';
  }
}

const reportService = new ReportService();
export default reportService;