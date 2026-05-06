// src/services/api/photoAlbum.service.js
import apiService from './api.service';
import envConfig from '../../config/env.config';

class PhotoAlbumService {
  /**
   * Get all photo albums with pagination
   */
  async getPhotoAlbums(page = 1, limit = 10, search = '') {
    const params = { page, limit };
    if (search) params.search = search;

    const response = await apiService.get(envConfig.endpoints.photoAlbum.getAll, params);
    
    console.log('Photo Album API Response:', response);
    
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
      data: { albums: [], total: 0, page, limit, totalPages: 0 },
      pagination: { page, limit, total: 0, totalPages: 0 },
      error: response.error,
    };
  }

  /**
   * Get photo album by ID
   */
  async getPhotoAlbumById(id) {
    const response = await apiService.get(envConfig.endpoints.photoAlbum.getById(id));

    if (response.success && response.data) {
      const item = response.data.data || response.data;
      return {
        success: true,
        data: this.transformAlbumData(item),
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
    const albums = Array.isArray(body.data) ? body.data : [];

    return {
      albums: albums.map((album) => this.transformAlbumData(album)),
      total: body.pagination?.total || albums.length,
      page: body.pagination?.page || 1,
      limit: body.pagination?.limit || 10,
      totalPages: body.pagination?.totalPages || 1,
    };
  }

  /**
   * Transform individual album data
   */
  transformAlbumData(album) {
    // Get cover image from title_image
    const coverImage = album.title_image || '';
    
    // Get all images
    const images = Array.isArray(album.images) ? album.images : [];
    
    // Format date
    const formattedDate = album.created_date ? new Date(album.created_date) : new Date();
    
    return {
      id: album._id || null,
      titleKh: album.title?.kh || '',
      titleEn: album.title?.en || '',
      articleKh: album.article?.kh || '',
      articleEn: album.article?.en || '',
      coverImage: coverImage,
      images: images,
      imageCount: images.length,
      status: album.status ?? true,
      createdBy: album.created_by?.email || album.created_by || null,
      updatedBy: album.updated_by?.email || album.updated_by || null,
      createdDate: album.created_date || null,
      updatedDate: album.updated_date || null,
      formattedDate: formattedDate,
    };
  }

  /**
   * Get display title based on language
   */
  getTitle(album, lang = 'km') {
    return lang === 'km' ? album.titleKh || album.titleEn : album.titleEn || album.titleKh;
  }

  /**
   * Get display article based on language
   */
  getArticle(album, lang = 'km') {
    return lang === 'km' ? album.articleKh || album.articleEn : album.articleEn || album.articleKh;
  }

  /**
   * Strip HTML tags from article
   */
  stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}

const photoAlbumService = new PhotoAlbumService();
export default photoAlbumService;