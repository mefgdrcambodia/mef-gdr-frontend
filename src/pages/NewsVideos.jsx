// src/pages/NewsVideos.jsx
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Video,
  Play,
  X,
  Eye,
  CalendarDays,
  Volume2,
  VolumeX,
  Maximize2,
  Search,
  ChevronDown,
  Grid,
  List,
} from "lucide-react";
import Container from "../components/ui/Container.jsx";
import GlobalBanner from "../components/ui/GlobalBanner.jsx";
import useVideoAlbum from "../hooks/useVideoAlbum";
import videoAlbumService from "../services/api/videoAlbum.service";

const NewsVideos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [currentLang, setCurrentLang] = useState("km");

  // Use the video album hook
  const { 
    videos: apiVideos, 
    pagination, 
    loading, 
    error,
    fetchVideos,
    fetchVideoById,
    changePage
  } = useVideoAlbum(currentPage, 9);

  // Load counts from localStorage
  const [videoViews, setVideoViews] = useState(() => {
    const saved = localStorage.getItem('video_views');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [videoLikes, setVideoLikes] = useState(() => {
    const saved = localStorage.getItem('video_likes');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [videoShares, setVideoShares] = useState(() => {
    const saved = localStorage.getItem('video_shares');
    return saved ? JSON.parse(saved) : {};
  });

  const [userLikedVideos, setUserLikedVideos] = useState(() => {
    const saved = localStorage.getItem('user_liked_videos');
    return saved ? JSON.parse(saved) : {};
  });

  // Save counts to localStorage
  useEffect(() => {
    localStorage.setItem('video_views', JSON.stringify(videoViews));
  }, [videoViews]);

  useEffect(() => {
    localStorage.setItem('video_likes', JSON.stringify(videoLikes));
  }, [videoLikes]);

  useEffect(() => {
    localStorage.setItem('video_shares', JSON.stringify(videoShares));
  }, [videoShares]);

  useEffect(() => {
    localStorage.setItem('user_liked_videos', JSON.stringify(userLikedVideos));
  }, [userLikedVideos]);

  // Transform API videos with stats
  const videosData = useMemo(() => {
    if (!apiVideos || apiVideos.length === 0) return [];
    
    return apiVideos.map(video => {
      // Format date
      const date = video.createdDate ? new Date(video.createdDate) : new Date();
      const formattedDate = date.toLocaleDateString(currentLang === 'km' ? 'km-KH' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return {
        id: video.id,
        title: {
          km: video.titleKh,
          en: video.titleEn,
        },
        article: {
          km: video.articleKh,
          en: video.articleEn,
        },
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        date: formattedDate,
        timestamp: video.createdDate ? new Date(video.createdDate).getTime() : Date.now(),
        duration: "05:30", // Default duration, can be calculated
        category: videoAlbumService.getCategory(currentLang),
        views: videoViews[video.id] || 0,
        likes: videoLikes[video.id] || 0,
        shares: videoShares[video.id] || 0,
      };
    });
  }, [apiVideos, videoViews, videoLikes, videoShares, currentLang]);

  // Filter videos based on search
  const filteredVideos = useMemo(() => {
    if (!searchTerm) return videosData;
    
    return videosData.filter((video) => {
      const title = currentLang === 'km' ? video.title.km : video.title.en;
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [videosData, searchTerm, currentLang]);

  // Handle search with debounce
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  // Handle view video
  const handleViewVideo = (video) => {
    setVideoViews(prev => ({
      ...prev,
      [video.id]: (prev[video.id] || 0) + 1
    }));
    setSelectedVideo(video);
  };

  // Like/Unlike handler
  const handleLikeToggle = (videoId, e) => {
    if (e) e.stopPropagation();
    
    const hasLiked = userLikedVideos[videoId];
    
    if (hasLiked) {
      setVideoLikes(prev => ({
        ...prev,
        [videoId]: Math.max((prev[videoId] || 0) - 1, 0)
      }));
      setUserLikedVideos(prev => {
        const newState = { ...prev };
        delete newState[videoId];
        return newState;
      });
    } else {
      setVideoLikes(prev => ({
        ...prev,
        [videoId]: (prev[videoId] || 0) + 1
      }));
      setUserLikedVideos(prev => ({
        ...prev,
        [videoId]: true
      }));
    }
  };

  // Share handler
  const handleShare = (video, e) => {
    if (e) e.stopPropagation();
    
    setVideoShares(prev => ({
      ...prev,
      [video.id]: (prev[video.id] || 0) + 1
    }));
    
    const url = `${window.location.origin}/videos/${video.id}`;
    navigator.clipboard.writeText(url);
    alert(t.copied);
  };

  // Language handling
  useEffect(() => {
    const handleLanguageChange = (e) => setCurrentLang(e.detail.language);
    window.addEventListener("languagechange", handleLanguageChange);
    const savedLang = localStorage.getItem("language");
    if (savedLang) setCurrentLang(savedLang);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  const translations = {
    km: {
      title: "កម្រងវីដេអូព័ត៌មាន",
      subtitle: "ស្វែងយល់ពីព័ត៌មានថ្មីៗ សន្និសីទ និងសកម្មភាពសំខាន់ៗ",
      search: "ស្វែងរកវីដេអូ...",
      showing: "បង្ហាញ",
      videos: "វីដេអូ",
      noVideos: "មិនមានវីដេអូ",
      views: "មើល",
      likes: "ចូលចិត្ត",
      shares: "ចែករំលែក",
      grid: "ទម្រង់ក្រឡា",
      list: "ទម្រង់បញ្ជី",
      share: "ចែករំលែក",
      copyLink: "ចម្លងតំណ",
      copied: "បានចម្លង!",
      loading: "កំពុងផ្ទុក...",
      error: "មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យ",
      retry: "សាកល្បងម្តងទៀត",
    },
    en: {
      title: "News Video Gallery",
      subtitle: "Discover the latest news, conferences and key activities",
      search: "Search videos...",
      showing: "Showing",
      videos: "videos",
      noVideos: "No videos found",
      views: "views",
      likes: "likes",
      shares: "shares",
      grid: "Grid View",
      list: "List View",
      share: "Share",
      copyLink: "Copy Link",
      copied: "Copied!",
      loading: "Loading...",
      error: "Error loading data",
      retry: "Try Again",
    },
  };

  const t = translations[currentLang];

  // Loading state
  if (loading && videosData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalBanner
          title={t.title}
          subtitle={t.subtitle}
          height="h-[160px] sm:h-[200px] md:h-[280px] lg:h-[320px]"
          showBreadcrumb={true}
        />
        <Container className="py-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
              <p className="text-gray-500">{t.loading}</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Error state
  if (error && videosData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalBanner
          title={t.title}
          subtitle={t.subtitle}
          height="h-[160px] sm:h-[200px] md:h-[280px] lg:h-[320px]"
          showBreadcrumb={true}
        />
        <Container className="py-12">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-500 text-sm mb-1">{t.error}</p>
            <p className="text-gray-400 text-xs mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32] transition-colors"
            >
              {t.retry}
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Banner */}
      <GlobalBanner
        title={t.title}
        subtitle={t.subtitle}
        height="h-[160px] sm:h-[200px] md:h-[280px] lg:h-[320px]"
        showBreadcrumb={true}
      />

      {/* Main Content */}
      <Container className="py-4 sm:py-6 md:py-8">
        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent bg-white"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-[#2E7D32] shadow-sm"
                    : "text-gray-500 hover:text-[#2E7D32]"
                }`}
                title={t.grid}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-[#2E7D32] shadow-sm"
                    : "text-gray-500 hover:text-[#2E7D32]"
                }`}
                title={t.list}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500">
          {t.showing} {filteredVideos.length} {t.videos}
        </div>

        {/* Video Grid/List */}
        {filteredVideos.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {filteredVideos.map((video) => (
                <VideoGridCard
                  key={video.id}
                  video={video}
                  onClick={handleViewVideo}
                  isLiked={userLikedVideos[video.id] || false}
                  onLikeToggle={handleLikeToggle}
                  onShare={handleShare}
                  t={t}
                  currentLang={currentLang}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVideos.map((video) => (
                <VideoListCard
                  key={video.id}
                  video={video}
                  onClick={handleViewVideo}
                  isLiked={userLikedVideos[video.id] || false}
                  onLikeToggle={handleLikeToggle}
                  onShare={handleShare}
                  t={t}
                  currentLang={currentLang}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl">
            <Video size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-medium text-gray-600">
              {t.noVideos}
            </h3>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &larr;
            </button>
            <span className="text-sm text-gray-600">
              {t.showing} {currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &rarr;
            </button>
          </div>
        )}
      </Container>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onLikeToggle={handleLikeToggle}
          onShare={handleShare}
          t={t}
          currentLang={currentLang}
          isLiked={userLikedVideos[selectedVideo.id] || false}
        />
      )}
    </div>
  );
};

// Video Grid Card Component
const VideoGridCard = ({ video, onClick, isLiked, onLikeToggle, onShare, t, currentLang }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const title = currentLang === 'km' ? video.title.km : video.title.en;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current && !videoError) {
            videoRef.current.play().catch(() => setVideoError(true));
            setIsPlaying(true);
          } else if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [videoError]);

  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
      onClick={() => onClick(video)}
    >
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        />
        {videoError && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <img src={video.thumbnail} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs text-white">
          {video.duration}
        </div>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
            {isPlaying ? (
              <div className="w-4 h-4 border-2 border-[#2E7D32] rounded-sm" />
            ) : (
              <Play size={20} className="text-[#2E7D32] ml-0.5" />
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-[#2E7D32] transition-colors leading-relaxed">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <CalendarDays size={12} className="mr-1" />
            <span>{video.date}</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <button
              onClick={(e) => onLikeToggle(video.id, e)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <span>{video.likes}</span>
            </button>
            <button
              onClick={(e) => onShare(video, e)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#4CAF50] transition-colors"
            >
              <span>{video.shares}</span>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

// Video List Card Component
const VideoListCard = ({ video, onClick, isLiked, onLikeToggle, onShare, t, currentLang }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const title = currentLang === 'km' ? video.title.km : video.title.en;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current && !videoError) {
            videoRef.current.play().catch(() => setVideoError(true));
            setIsPlaying(true);
          } else if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [videoError]);

  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer flex flex-col sm:flex-row"
      onClick={() => onClick(video)}
    >
      <div className="relative w-full sm:w-64 h-48 sm:h-auto aspect-video sm:aspect-auto bg-gray-900 overflow-hidden flex-shrink-0">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        />
        {videoError && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <img src={video.thumbnail} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs text-white">
          {video.duration}
        </div>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
            {isPlaying ? (
              <div className="w-4 h-4 border-2 border-[#2E7D32] rounded-sm" />
            ) : (
              <Play size={20} className="text-[#2E7D32] ml-0.5" />
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 p-4">
        <h3 className="text-base font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-[#2E7D32] transition-colors leading-relaxed">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <CalendarDays size={12} className="mr-1" />
          <span>{video.date}</span>
        </div>
        {/* <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye size={12} />
            <span>{video.views} {t.views}</span>
          </div>
          <button
            onClick={(e) => onLikeToggle(video.id, e)}
            className={`flex items-center gap-1 text-xs transition-colors ${
              isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <span>{video.likes} {t.likes}</span>
          </button>
          <button
            onClick={(e) => onShare(video, e)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#4CAF50] transition-colors"
          >
            <span>{video.shares} {t.shares}</span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

// Video Modal Component
const VideoModal = ({ video, onClose, onLikeToggle, onShare, t, currentLang, isLiked }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const modalRef = useRef(null);
  const title = currentLang === 'km' ? video.title.km : video.title.en;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && !videoError) {
      const handleLoadedMetadata = () => {
        if (videoElement) setDuration(videoElement.duration);
      };
      const handleTimeUpdate = () => {
        if (videoElement) setCurrentTime(videoElement.currentTime);
      };
      const handleError = () => setVideoError(true);

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("error", handleError);

      return () => {
        videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener("error", handleError);
      };
    }
  }, [videoError]);

  const handlePlayPause = () => {
    const videoElement = videoRef.current;
    if (videoElement && !videoError) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play().catch(() => setVideoError(true));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    const modalElement = modalRef.current;
    if (!document.fullscreenElement && modalElement) {
      modalElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-black rounded-xl sm:rounded-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video Player */}
        <div className="relative">
          {videoError ? (
            <div className="w-full aspect-video bg-gray-900 flex flex-col items-center justify-center">
              <img src={video.thumbnail} alt={title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full aspect-video"
              onClick={handlePlayPause}
              controls={false}
            >
              <source src={video.videoUrl} type="video/mp4" />
            </video>
          )}

          {!videoError && (
            <>
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition z-10 backdrop-blur-sm"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 sm:p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-[#4CAF50] transition p-1"
                  >
                    {isPlaying ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white rounded-sm" />
                      </div>
                    ) : (
                      <Play size={18} className="sm:w-5 sm:h-5 fill-white" />
                    )}
                  </button>

                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #4CAF50 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%)`,
                      }}
                    />
                    <div className="flex justify-between text-[10px] sm:text-xs text-white mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleMute}
                    className="text-white hover:text-[#4CAF50] transition p-1"
                  >
                    {isMuted ? <VolumeX size={18} className="sm:w-5 sm:h-5" /> : <Volume2 size={18} className="sm:w-5 sm:h-5" />}
                  </button>
                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-[#4CAF50] transition p-1"
                  >
                    <Maximize2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg md:text-xl font-medium text-white leading-relaxed pr-8">
            {title}
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
              <span>{video.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {video.views} {t.views}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => onLikeToggle(video.id, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isLiked ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span>{video.likes}</span>
              </button>
              <button
                onClick={(e) => onShare(video, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <span>{video.shares}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsVideos;