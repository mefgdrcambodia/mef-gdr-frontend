// src/services/api/news.service.js
import apiService from './api.service';
import envConfig from '../../config/env.config';

class NewsService {
  async getAllNews(params = {}) {
    const { page = 1, limit = 10, category = '' } = params;

    const queryParams = { page, limit };
    if (category) queryParams.category = category;

    const response = await apiService.get(envConfig.endpoints.news.getAll, queryParams);

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
      data: { news: [], total: 0, page, limit, totalPages: 0 },
      categories: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      error: response.error,
    };
  }

  async getNewsById(id) {
    const response = await apiService.get(envConfig.endpoints.news.getById(id));

    if (response.success && response.data) {
      const item = response.data.data || response.data;
      return {
        success: true,
        data: this.transformNewsData(item),
      };
    }

    return {
      success: false,
      data: null,
      error: response.error,
    };
  }

  // body = { success, data:[], pagination:{}, category:[] }
  transformListData(body) {
    const newsArray = Array.isArray(body.data) ? body.data : [];

    return {
      news: newsArray.map((item) => this.transformNewsData(item)),
      total: body.pagination?.total || newsArray.length,
      page: body.pagination?.page || 1,
      limit: body.pagination?.limit || 10,
      totalPages: body.pagination?.totalPages || 1,
    };
  }

  transformNewsData(news) {
    return {
      id: news._id || null,
      titleKh: news.title?.kh || '',
      titleEn: news.title?.en || '',
      contentKh: news.article?.kh || '',
      contentEn: news.article?.en || '',
      summaryKh: news.summary?.kh || this.extractSummary(news.article?.kh),
      summaryEn: news.summary?.en || this.extractSummary(news.article?.en),
      mainImage: news.title_image || '',
      images: Array.isArray(news.images) ? news.images : [],
      category: news.category || 'other',
      authorKh: news.author?.kh || 'នាយកដ្ឋានព័ត៌មាន',
      authorEn: news.author?.en || 'Information Department',
      views: news.views || 0,
      likes: news.likes || 0,
      downloads: news.downloads || 0,
      publishedDate: news.published_date || news.created_date || null,
      createdDate: news.created_date || null,
      updatedDate: news.updated_date || null,
      isActive: news.status ?? true,
      isFeatured: news.is_featured || false,
      createdBy: news.created_by || null,
      updatedBy: news.updated_by || null,
      hasAttachment: !!(news.attachments && news.attachments.length > 0),
      attachments: news.attachments || [],
    };
  }

  extractSummary(htmlContent) {
    if (!htmlContent) return '';
    const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }

  formatDate(dateString, language = 'km') {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (language === 'km') {
      const khmerMonths = [
        'មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា',
        'កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ',
      ];
      return `${date.getDate()} ${khmerMonths[date.getMonth()]} ${date.getFullYear()}`;
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}

const newsService = new NewsService();
export default newsService;