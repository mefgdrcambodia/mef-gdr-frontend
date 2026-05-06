// src/pages/NewsPhotos.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ImageLogo from "../images/logo_white.png";
import {
  Camera,
  Clock,
  Calendar,
  Image,
  ChevronRight,
  Eye,
  Calendar as CalendarIcon,
  Heart,
  Share2,
  Download,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Grid,
  List,
  Search,
  Filter,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Container from "../components/ui/Container.jsx";
import GlobalBanner from "../components/ui/GlobalBanner.jsx";
import RunningText from "../components/ui/RunningText"; // Import RunningText component
import usePhotoAlbum from "../hooks/usePhotoAlbum";
import photoAlbumService from "../services/api/photoAlbum.service";

const NewsPhotos = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentLang, setCurrentLang] = useState("km");

  // Use the photo album hook
  const { 
    albums: apiAlbums, 
    pagination, 
    loading, 
    error,
    changePage
  } = usePhotoAlbum(currentPage, itemsPerPage);

  // Load counts from localStorage
  const [albumViews, setAlbumViews] = useState(() => {
    const saved = localStorage.getItem('album_views');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [albumLikes, setAlbumLikes] = useState(() => {
    const saved = localStorage.getItem('album_likes');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [albumShares, setAlbumShares] = useState(() => {
    const saved = localStorage.getItem('album_shares');
    return saved ? JSON.parse(saved) : {};
  });

  // Track which albums the user has liked
  const [userLikedAlbums, setUserLikedAlbums] = useState(() => {
    const saved = localStorage.getItem('user_liked_albums');
    return saved ? JSON.parse(saved) : {};
  });

  // Save counts to localStorage
  useEffect(() => {
    localStorage.setItem('album_views', JSON.stringify(albumViews));
  }, [albumViews]);

  useEffect(() => {
    localStorage.setItem('album_likes', JSON.stringify(albumLikes));
  }, [albumLikes]);

  useEffect(() => {
    localStorage.setItem('album_shares', JSON.stringify(albumShares));
  }, [albumShares]);

  useEffect(() => {
    localStorage.setItem('user_liked_albums', JSON.stringify(userLikedAlbums));
  }, [userLikedAlbums]);

  // Transform API albums with stats
  const photoAlbums = useMemo(() => {
    if (!apiAlbums || apiAlbums.length === 0) return [];
    
    return apiAlbums.map(album => {
      // Format date
      const date = album.createdDate ? new Date(album.createdDate) : new Date();
      const formattedDate = date.toLocaleDateString(currentLang === 'km' ? 'km-KH' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Get article text (strip HTML)
      const articleText = photoAlbumService.stripHtml(
        currentLang === 'km' ? album.articleKh : album.articleEn
      );
      
      return {
        id: album.id,
        title: {
          km: album.titleKh,
          en: album.titleEn,
        },
        description: {
          km: articleText || album.titleKh,
          en: articleText || album.titleEn,
        },
        coverImage: album.coverImage,
        images: album.images,
        imageCount: album.imageCount,
        date: formattedDate,
        dateSort: album.createdDate,
        views: albumViews[album.id] || 0,
        likes: albumLikes[album.id] || 0,
        shares: albumShares[album.id] || 0,
        userLiked: userLikedAlbums[album.id] || false,
      };
    });
  }, [apiAlbums, albumViews, albumLikes, albumShares, userLikedAlbums, currentLang]);

  // Filter and sort albums
  const filteredAlbums = useMemo(() => {
    let filtered = [...photoAlbums];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(album => {
        const title = currentLang === 'km' ? album.title.km : album.title.en;
        const description = currentLang === 'km' ? album.description.km : album.description.en;
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               description.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "popular") return b.views - a.views;
      if (sortBy === "oldest") return new Date(a.dateSort) - new Date(b.dateSort);
      return new Date(b.dateSort) - new Date(a.dateSort); // latest
    });
    
    return filtered;
  }, [photoAlbums, searchQuery, sortBy, currentLang]);

  // Pagination
  const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);
  const paginatedAlbums = filteredAlbums.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, itemsPerPage]);

  // Touch swipe refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Language effect
  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener("languagechange", handleLanguageChange);

    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setCurrentLang(savedLang);
    }

    return () =>
      window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  const translations = {
    km: {
      title: "កម្រងរូបភាពព័ត៌មាន",
      subtitle: "បណ្តុំរូបភាពព្រឹត្តិការណ៍ សិក្ខាសាលា និងសកម្មភាពនានារបស់អគ្គនាយកដ្ឋាន",
      searchPlaceholder: "ស្វែងរកកម្រងរូបភាព...",
      sortBy: "តម្រៀបតាម",
      latest: "ថ្មីបំផុត",
      popular: "ពេញនិយមបំផុត",
      oldest: "ចាស់បំផុត",
      filter: "តម្រង",
      showing: "បង្ហាញ",
      albums: "កម្រងរូបភាព",
      total: "សរុប",
      noAlbums: "រកមិនឃើញកម្រងរូបភាព",
      tryAgain: "សូមព្យាយាមស្វែងរកម្តងទៀត",
      viewPhotos: "មើលរូបភាព",
      back: "ត្រលប់ក្រោយ",
      photos: "រូបភាព",
      views: "មើល",
      likes: "ចូលចិត្ត",
      shares: "ចែករំលែក",
      grid: "ទម្រង់ក្រឡា",
      list: "ទម្រង់បញ្ជី",
      itemsPerPage: "ចំនួនក្នុងមួយទំព័រ",
      loading: "កំពុងផ្ទុក...",
      error: "មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យ",
      retry: "សាកល្បងម្តងទៀត",
    },
    en: {
      title: "News Photo Gallery",
      subtitle: "Collection of event photos, workshops and activities of the General Department",
      searchPlaceholder: "Search albums...",
      sortBy: "Sort by",
      latest: "Latest",
      popular: "Most viewed",
      oldest: "Oldest",
      filter: "Filter",
      showing: "Showing",
      albums: "albums",
      total: "Total",
      noAlbums: "No albums found",
      tryAgain: "Please try searching again",
      viewPhotos: "View Photos",
      back: "Back",
      photos: "photos",
      views: "views",
      likes: "likes",
      shares: "shares",
      grid: "Grid View",
      list: "List View",
      itemsPerPage: "Items per page",
      loading: "Loading...",
      error: "Error loading data",
      retry: "Try Again",
    },
  };

  const t = translations[currentLang];

  const handleOpenAlbum = (album) => {
    // Update view count when opening album
    setAlbumViews(prev => ({
      ...prev,
      [album.id]: (prev[album.id] || 0) + 1
    }));
    setSelectedAlbum(album);
    setSelectedImageIndex(null);
  };

  const handleCloseAlbum = () => {
    setSelectedAlbum(null);
    setShowLightbox(false);
    setSelectedImageIndex(null);
  };

  const handleToggleLike = (albumId, e) => {
    e.stopPropagation();
    
    const isLiked = userLikedAlbums[albumId];
    
    if (isLiked) {
      setAlbumLikes(prev => ({
        ...prev,
        [albumId]: Math.max(0, (prev[albumId] || 0) - 1)
      }));
      setUserLikedAlbums(prev => {
        const newState = { ...prev };
        delete newState[albumId];
        return newState;
      });
    } else {
      setAlbumLikes(prev => ({
        ...prev,
        [albumId]: (prev[albumId] || 0) + 1
      }));
      setUserLikedAlbums(prev => ({
        ...prev,
        [albumId]: true
      }));
    }
  };

  const handleShare = (album, e) => {
    e.stopPropagation();
    setAlbumShares(prev => ({
      ...prev,
      [album.id]: (prev[album.id] || 0) + 1
    }));
    
    const url = `${window.location.origin}/photos/${album.id}`;
    navigator.clipboard.writeText(url);
    alert(t.copied || "Copied!");
  };

  const handleOpenLightbox = (index) => {
    setSelectedImageIndex(index);
    setShowLightbox(true);
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedAlbum && selectedImageIndex < selectedAlbum.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrevAlbum = () => {
    if (selectedAlbum) {
      const currentIndex = filteredAlbums.findIndex(
        (album) => album.id === selectedAlbum.id,
      );
      if (currentIndex > 0) {
        setSelectedAlbum(filteredAlbums[currentIndex - 1]);
        setSelectedImageIndex(null);
        setShowLightbox(false);
      }
    }
  };

  const handleNextAlbum = () => {
    if (selectedAlbum) {
      const currentIndex = filteredAlbums.findIndex(
        (album) => album.id === selectedAlbum.id,
      );
      if (currentIndex < filteredAlbums.length - 1) {
        setSelectedAlbum(filteredAlbums[currentIndex + 1]);
        setSelectedImageIndex(null);
        setShowLightbox(false);
      }
    }
  };

  // Touch swipe handlers for lightbox
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        handlePrevImage();
      } else {
        handleNextImage();
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showLightbox) {
        if (e.key === "ArrowLeft") handlePrevImage();
        if (e.key === "ArrowRight") handleNextImage();
        if (e.key === "Escape") setShowLightbox(false);
      }
      if (selectedAlbum && !showLightbox) {
        if (e.key === "ArrowLeft") handlePrevAlbum();
        if (e.key === "ArrowRight") handleNextAlbum();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLightbox, selectedAlbum, selectedImageIndex]);

  // Loading state
  if (loading && photoAlbums.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <RunningText /> {/* Add RunningText component */}
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
  if (error && photoAlbums.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <RunningText /> {/* Add RunningText component */}
        <GlobalBanner
          title={t.title}
          subtitle={t.subtitle}
          height="h-[160px] sm:h-[200px] md:h-[280px] lg:h-[320px]"
          showBreadcrumb={true}
        />
        <Container className="py-12">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Image size={28} className="text-red-400" />
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

  // Grid View Component for Albums
  const AlbumGridView = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedAlbums.map((album) => (
        <div
          key={album.id}
          className="group bg-white rounded-xl border border-gray-200 hover:border-[#4CAF50] hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
          onClick={() => handleOpenAlbum(album)}
        >
          {/* Cover Image */}
          <div className="relative h-56 overflow-hidden bg-gray-100">
            <img
              src={album.coverImage}
              alt={album.title[currentLang]}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = "https://placehold.co/400x300/4CAF50/white?text=No+Image";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Image Count Badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-1">
                <Image size={12} />
                {album.imageCount}
              </span>
            </div>

            {/* Date Badge */}
            <div className="absolute bottom-3 left-3">
              <span className="px-2.5 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-1">
                <CalendarIcon size={12} />
                {album.date}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#2E7D32] transition-colors">
              {album.title[currentLang]}
            </h3>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {album.description[currentLang]}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                {/* <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Eye size={12} />
                  <span>{album.views}</span>
                </div>
                <button
                  onClick={(e) => handleToggleLike(album.id, e)}
                  className={`flex items-center space-x-1 text-xs transition-colors ${
                    album.userLiked 
                      ? "text-red-500" 
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Heart size={12} fill={album.userLiked ? "currentColor" : "none"} />
                  <span>{album.likes}</span>
                </button>
                <button
                  onClick={(e) => handleShare(album, e)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-[#4CAF50] transition-colors"
                >
                  <Share2 size={12} />
                  <span>{album.shares || 0}</span>
                </button> */}
              </div>
              <span className="text-xs text-[#4CAF50] font-medium flex items-center group-hover:translate-x-1 transition-transform">
                {t.viewPhotos}
                <ChevronRight size={14} className="ml-1" />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // List View Component for Albums
  const AlbumListView = () => (
    <div className="space-y-4">
      {paginatedAlbums.map((album) => (
        <div
          key={album.id}
          className="group bg-white border border-gray-200 rounded-xl hover:border-[#4CAF50] hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col md:flex-row"
          onClick={() => handleOpenAlbum(album)}
        >
          {/* Cover Image */}
          <div className="relative md:w-64 h-48 md:h-auto overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={album.coverImage}
              alt={album.title[currentLang]}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = "https://placehold.co/400x300/4CAF50/white?text=No+Image";
              }}
            />
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-1">
                <Image size={12} />
                {album.imageCount}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#2E7D32] transition-colors line-clamp-1">
              {album.title[currentLang]}
            </h3>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {album.description[currentLang]}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <CalendarIcon size={12} />
                  <span>{album.date}</span>
                </div>
                {/* <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Eye size={12} />
                  <span>{album.views}</span>
                </div>
                <button
                  onClick={(e) => handleToggleLike(album.id, e)}
                  className={`flex items-center space-x-1 text-xs transition-colors ${
                    album.userLiked 
                      ? "text-red-500" 
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Heart size={12} fill={album.userLiked ? "currentColor" : "none"} />
                  <span>{album.likes}</span>
                </button>
                <button
                  onClick={(e) => handleShare(album, e)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-[#4CAF50] transition-colors"
                >
                  <Share2 size={12} />
                  <span>{album.shares || 0}</span>
                </button> */}
              </div>
              <span className="text-xs text-[#4CAF50] font-medium flex items-center group-hover:translate-x-1 transition-transform">
                {t.viewPhotos}
                <ChevronRight size={14} className="ml-1" />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Pagination Component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
            currentPage === 1
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-300 text-gray-600 hover:bg-[#4CAF50] hover:bg-opacity-10 hover:border-[#4CAF50] hover:text-[#2E7D32]"
          }`}
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-9 h-9 rounded-lg font-medium border ${
              currentPage === page
                ? "bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white border-transparent"
                : "border-gray-300 text-gray-600 hover:bg-[#4CAF50] hover:bg-opacity-10 hover:border-[#4CAF50] hover:text-[#2E7D32]"
            }`}
          >
            {page}
          </button>
        ))}

        {totalPages > 5 && (
          <>
            <span className="text-gray-400">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`w-9 h-9 rounded-lg font-medium border ${
                currentPage === totalPages
                  ? "bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white border-transparent"
                  : "border-gray-300 text-gray-600 hover:bg-[#4CAF50] hover:bg-opacity-10 hover:border-[#4CAF50] hover:text-[#2E7D32]"
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
            currentPage === totalPages
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-300 text-gray-600 hover:bg-[#4CAF50] hover:bg-opacity-10 hover:border-[#4CAF50] hover:text-[#2E7D32]"
          }`}
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Running Text Bar - Using the RunningText component like LegalPage */}
      <RunningText />

      {/* Global Banner */}
      <GlobalBanner
        title={t.title}
        subtitle={t.subtitle}
        height="h-[160px] sm:h-[200px] md:h-[280px] lg:h-[320px]"
        showBreadcrumb={true}
      />

      {/* Main Content */}
      <Container className="py-4 sm:py-6 md:py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-colors text-sm"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-[#4CAF50] hover:bg-opacity-5 hover:border-[#4CAF50] transition-colors"
            >
              <Filter size={16} />
              <span>{t.filter}</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
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

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    {t.sortBy}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4CAF50] bg-white"
                  >
                    <option value="latest">{t.latest}</option>
                    <option value="popular">{t.popular}</option>
                    <option value="oldest">{t.oldest}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    {t.itemsPerPage}
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4CAF50] bg-white"
                  >
                    <option value={6}>6 {t.albums}</option>
                    <option value={9}>9 {t.albums}</option>
                    <option value={12}>12 {t.albums}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">
            {t.showing} {paginatedAlbums.length} {t.albums} ({t.total}{" "}
            {filteredAlbums.length} {t.albums})
          </p>
        </div>

        {/* Albums Display */}
        {paginatedAlbums.length > 0 ? (
          viewMode === "grid" ? (
            <AlbumGridView />
          ) : (
            <AlbumListView />
          )
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex p-3 bg-gray-100 rounded-full mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t.noAlbums}
            </h3>
            <p className="text-gray-500">{t.tryAgain}</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination />
      </Container>

      {/* Album Detail Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleCloseAlbum}
                  className="flex items-center space-x-2 text-gray-500 hover:text-[#2E7D32] transition-colors group"
                >
                  <ChevronRight
                    size={18}
                    className="rotate-180 group-hover:-translate-x-1 transition-transform"
                  />
                  <span className="text-sm">{t.back}</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevAlbum}
                    disabled={
                      filteredAlbums.findIndex(
                        (a) => a.id === selectedAlbum.id,
                      ) === 0
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      filteredAlbums.findIndex(
                        (a) => a.id === selectedAlbum.id,
                      ) === 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextAlbum}
                    disabled={
                      filteredAlbums.findIndex(
                        (a) => a.id === selectedAlbum.id,
                      ) ===
                      filteredAlbums.length - 1
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      filteredAlbums.findIndex(
                        (a) => a.id === selectedAlbum.id,
                      ) ===
                      filteredAlbums.length - 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Album Content */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Album Info */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">
                {selectedAlbum.title[currentLang]}
              </h2>
              <p className="text-gray-500 mb-4 max-w-2xl mx-auto">
                {selectedAlbum.description[currentLang]}
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <CalendarIcon size={14} />
                  <span>{selectedAlbum.date}</span>
                </div>
                {/* <div className="flex items-center space-x-1">
                  <Eye size={14} />
                  <span>
                    {selectedAlbum.views} {t.views}
                  </span>
                </div> */}
                {/* <button
                  onClick={(e) => handleToggleLike(selectedAlbum.id, e)}
                  className={`flex items-center space-x-1 transition-colors ${
                    selectedAlbum.userLiked 
                      ? "text-red-500" 
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Heart size={14} fill={selectedAlbum.userLiked ? "currentColor" : "none"} />
                  <span>
                    {selectedAlbum.likes} {t.likes}
                  </span>
                </button>
                <button
                  onClick={(e) => handleShare(selectedAlbum, e)}
                  className="flex items-center space-x-1 hover:text-[#4CAF50] transition-colors"
                >
                  <Share2 size={14} />
                  <span>
                    {selectedAlbum.shares || 0} {t.shares}
                  </span>
                </button> */}
              </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedAlbum.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenLightbox(idx)}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group bg-gray-100"
                >
                  <img
                    src={img}
                    alt={`${selectedAlbum.title[currentLang]} - ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400x400/4CAF50/white?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye size={24} className="text-white" />
                  </div>
                </div>
              ))}
            </div>

            {/* Album Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                {t.photos} {selectedAlbum.images.length} {t.photos}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal with Swipe Support */}
      {showLightbox && selectedAlbum && selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>

          <button
            onClick={handlePrevImage}
            disabled={selectedImageIndex === 0}
            className={`absolute left-4 z-10 text-white hover:text-gray-300 transition-colors ${
              selectedImageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft size={48} />
          </button>

          <button
            onClick={handleNextImage}
            disabled={selectedImageIndex === selectedAlbum.images.length - 1}
            className={`absolute right-4 z-10 text-white hover:text-gray-300 transition-colors ${
              selectedImageIndex === selectedAlbum.images.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <ChevronRightIcon size={48} />
          </button>

          <div className="max-w-[90vw] max-h-[90vh]">
            <img
              src={selectedAlbum.images[selectedImageIndex]}
              alt={`${selectedAlbum.title[currentLang]} - ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {selectedAlbum.images.length}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default NewsPhotos;