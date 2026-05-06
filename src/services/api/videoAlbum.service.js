// src/services/api/videoAlbum.service.js
import apiService from './api.service';
import envConfig from '../../config/env.config';

class VideoAlbumService {
  /**
   * Get all videos with pagination
   */
  async getVideos(page = 1, limit = 10, search = '') {
    const params = { page, limit };
    if (search) params.search = search;

    const response = await apiService.get(envConfig.endpoints.videoAlbum.getAll, params);
    
    console.log('Video Album API Response:', response);
    
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
      data: { videos: [], total: 0, page, limit, totalPages: 0 },
      pagination: { page, limit, total: 0, totalPages: 0 },
      error: response.error,
    };
  }

  /**
   * Get video by ID
   */
  async getVideoById(id) {
    const response = await apiService.get(envConfig.endpoints.videoAlbum.getById(id));

    if (response.success && response.data) {
      const item = response.data.data || response.data;
      return {
        success: true,
        data: this.transformVideoData(item),
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
    const videos = Array.isArray(body.data) ? body.data : [];

    return {
      videos: videos.map((video) => this.transformVideoData(video)),
      total: body.pagination?.total || videos.length,
      page: body.pagination?.page || 1,
      limit: body.pagination?.limit || 10,
      totalPages: body.pagination?.totalPages || 1,
    };
  }

  /**
   * Transform individual video data
   */
  transformVideoData(video) {
    // Get thumbnail from title_image (cover image)
    const thumbnail = video.title_image || '';
    
    // Get video URL
    const videoUrl = video.videos || '';
    
    // Format date
    const formattedDate = video.created_date ? new Date(video.created_date) : new Date();
    
    return {
      id: video._id || null,
      titleKh: video.title?.kh || '',
      titleEn: video.title?.en || '',
      articleKh: video.article?.kh || '',
      articleEn: video.article?.en || '',
      thumbnail: thumbnail,
      videoUrl: videoUrl,
      date: video.created_date || null,
      formattedDate: formattedDate,
      status: video.status ?? true,
      createdBy: video.created_by?.email || video.created_by || null,
      updatedBy: video.updated_by?.email || video.updated_by || null,
      createdDate: video.created_date || null,
      updatedDate: video.updated_date || null,
    };
  }

  /**
   * Get display title based on language
   */
  getTitle(video, lang = 'km') {
    return lang === 'km' ? video.titleKh || video.titleEn : video.titleEn || video.titleKh;
  }

  /**
   * Get display article based on language
   */
  getArticle(video, lang = 'km') {
    return lang === 'km' ? video.articleKh || video.articleEn : video.articleEn || video.articleKh;
  }

  /**
   * Get duration from video URL (mock for now)
   */
  getDuration(videoUrl) {
    // This would ideally come from API or be calculated
    return "05:30";
  }

  /**
   * Get category (can be derived or from API)
   */
  getCategory(lang = 'km') {
    return lang === 'km' ? "កម្រងវីដេអូ" : "Video Album";
  }
}

const videoAlbumService = new VideoAlbumService();
export default videoAlbumService;