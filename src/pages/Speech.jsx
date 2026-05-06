// src/pages/Speech.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Mic, Calendar, User, ChevronRight, Eye, Clock, Share2, 
  Search, ChevronDown, ArrowLeft, ArrowRight, 
  SlidersHorizontal, X
} from 'lucide-react';
import GlobalBanner from '../components/ui/GlobalBanner.jsx';
import Container from '../components/ui/Container.jsx';
import RunningText from '../components/ui/RunningText';
import useSpeech from '../hooks/useSpeech';
import speechService from '../services/api/speech.service';

const Speech = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("language") || "km";
  });
  const [selectedSpeech, setSelectedSpeech] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortBy, setSortBy] = useState('latest');
  const [sortOpen, setSortOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Use the speech hook
  const { 
    speeches: apiSpeeches, 
    pagination, 
    loading, 
    error,
    changePage
  } = useSpeech(currentPage, itemsPerPage);

  // Load view counts from localStorage
  const loadViewCounts = () => {
    const storedViews = localStorage.getItem('speech_views');
    return storedViews ? JSON.parse(storedViews) : {};
  };

  // Save view count to localStorage
  const saveViewCount = (speechId, lang, views) => {
    const storedViews = loadViewCounts();
    const key = `${lang}_${speechId}`;
    storedViews[key] = views;
    localStorage.setItem('speech_views', JSON.stringify(storedViews));
  };

  // Get view count for a specific speech
  const getViewCount = (speechId, lang) => {
    const storedViews = loadViewCounts();
    const key = `${lang}_${speechId}`;
    return storedViews[key] || 0;
  };

  // Transform API speeches with stats
  const speechesData = useMemo(() => {
    if (!apiSpeeches || apiSpeeches.length === 0) return [];
    
    return apiSpeeches.map(speech => ({
      id: speech.id,
      title: speechService.getTitle(speech, currentLang),
      titleRaw: {
        km: speech.titleKh,
        en: speech.titleEn,
      },
      date: speech.createdDate,
      formattedDate: speech.formattedDate,
      author: speechService.getAuthor(speech, currentLang),
      views: getViewCount(speech.id, currentLang) || 0,
      readTime: speechService.getReadTime(speech, currentLang),
      excerpt: speechService.getExcerpt(speech, currentLang),
      content: speechService.getArticle(speech, currentLang),
      image: speech.coverImage || 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800&h=500&fit=crop',
    }));
  }, [apiSpeeches, currentLang]);

  const translations = {
    km: {
      title: 'សុន្ទរកថា',
      subtitle: 'បណ្តុំសុន្ទរកថារបស់ថ្នាក់ដឹកនាំ',
      searchPlaceholder: 'ស្វែងរក...',
      sortBy: 'តម្រៀប',
      latest: 'ថ្មីជាងគេ',
      popular: 'ការមើលច្រើន',
      oldest: 'ចាស់ជាងគេ',
      showing: 'បង្ហាញ',
      speeches: 'សុន្ទរកថា',
      ofTotal: 'នៃ',
      total: 'សរុប',
      noSpeeches: 'រកមិនឃើញ',
      tryAgain: 'សូមស្វែងរកម្តងទៀត',
      readMore: 'អានបន្ថែម',
      back: 'ត្រលប់',
      views: 'មើល',
      itemsPerPage: 'ចំនួនក្នុងមួយទំព័រ',
      share: 'ចែករំលែក',
      publishedOn: 'ចេញផ្សាយ',
      relatedSpeeches: 'ពាក់ព័ន្ធ',
      minRead: 'នាទី',
      by: 'ដោយ',
      clearAll: 'សម្អាត',
      loading: 'កំពុងផ្ទុក...',
      error: 'មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យ',
      retry: 'សាកល្បងម្តងទៀត'
    },
    en: {
      title: 'Speeches',
      subtitle: 'Collection of speeches by the leadership',
      searchPlaceholder: 'Search...',
      sortBy: 'Sort',
      latest: 'Latest',
      popular: 'Most Viewed',
      oldest: 'Oldest',
      showing: 'Showing',
      speeches: 'speeches',
      ofTotal: 'of',
      total: 'Total',
      noSpeeches: 'No speeches found',
      tryAgain: 'Please try again',
      readMore: 'Read more',
      back: 'Back',
      views: 'views',
      itemsPerPage: 'Items per page',
      share: 'Share',
      publishedOn: 'Published',
      relatedSpeeches: 'Related',
      minRead: 'min read',
      by: 'by',
      clearAll: 'Clear',
      loading: 'Loading...',
      error: 'Error loading data',
      retry: 'Try Again'
    },
  };

  const t = translations[currentLang];

  // Filter and sort speeches (without category)
  const filteredSpeeches = useMemo(() => {
    let filtered = [...speechesData];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(speech => 
        speech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speech.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'popular') return b.views - a.views;
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      return new Date(b.date) - new Date(a.date);
    });
    
    return filtered;
  }, [speechesData, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredSpeeches.length / itemsPerPage);
  const paginatedSpeeches = filteredSpeeches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const startItem = filteredSpeeches.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, filteredSpeeches.length);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (currentLang === 'km') {
      return date.toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const incrementViewCount = (speech) => {
    const newViews = speech.views + 1;
    saveViewCount(speech.id, currentLang, newViews);
    return newViews;
  };

  const handleViewSpeech = (speech) => {
    const updatedViews = incrementViewCount(speech);
    setSelectedSpeech({ ...speech, views: updatedViews });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (selectedSpeech) {
      if (navigator.share) {
        navigator.share({
          title: selectedSpeech.title,
          text: selectedSpeech.title,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert(currentLang === 'km' ? 'បានចម្លងតំណភ្ជាប់!' : 'Link copied!');
      }
    }
  };

  const handleDropdownToggle = (dropdownName, e) => {
    e.stopPropagation();
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
      if (dropdownName === 'sort') setSortOpen(false);
    } else {
      setActiveDropdown(dropdownName);
      setSortOpen(dropdownName === 'sort');
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("latest");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, itemsPerPage]);

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };
    window.addEventListener('languagechange', handleLanguageChange);
    const savedLang = localStorage.getItem('language');
    if (savedLang) setCurrentLang(savedLang);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // Loading state
  if (loading && speechesData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RunningText />
        <GlobalBanner
          title={t.title}
          subtitle={t.subtitle}
          height="h-[180px] md:h-[250px] lg:h-[300px]"
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
  if (error && speechesData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RunningText />
        <GlobalBanner
          title={t.title}
          subtitle={t.subtitle}
          height="h-[180px] md:h-[250px] lg:h-[300px]"
          showBreadcrumb={true}
        />
        <Container className="py-12">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Mic size={28} className="text-red-400" />
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

  // Speech List Item Component
  const SpeechListItem = ({ speech }) => (
    <div
      onClick={() => handleViewSpeech(speech)}
      className="group bg-white border border-gray-100 rounded-xl hover:border-[#4CAF50]/30 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden mb-4"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-72 lg:w-80 h-56 md:h-auto overflow-hidden bg-gray-100">
          <img 
            src={speech.image} 
            alt={speech.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800&h=500&fit=crop';
            }}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white text-[10px]">
            <Eye size={10} className="text-white/80" />
            <span className="font-medium">{speech.views} {t.views}</span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-[#4CAF50]" />
              {formatDate(speech.date)}
            </span>
            {/* <span className="flex items-center gap-1.5">
              <User size={12} className="text-[#4CAF50]" />
              {t.by} {speech.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-[#4CAF50]" />
              {speech.readTime} {t.minRead}
            </span> */}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#2E7D32] transition-colors line-clamp-2">
            {speech.title}
          </h3>
          
          <p className="text-sm text-gray-500 mb-4 line-clamp-3">
            {speech.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-1.5 text-xs font-medium text-[#2E7D32] hover:gap-2 transition-all">
              <span>{t.readMore}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Pagination Component
  const Pagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${
            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft size={16} />
        </button>
        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-md text-sm font-medium ${
                currentPage === page
                  ? 'bg-[#2E7D32] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          );
        })}
        {totalPages > 5 && <span className="text-sm text-gray-400">...</span>}
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${
            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RunningText />
      <GlobalBanner
        title={t.title}
        subtitle={t.subtitle}
        height="h-[180px] md:h-[250px] lg:h-[300px]"
        showBreadcrumb={true}
      />

      <Container className="py-6 sm:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="flex-1 min-w-[200px] relative">
                <Search size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50] bg-white text-sm"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => handleDropdownToggle('sort', e)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal size={14} />
                  <span>{t.sortBy}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
                </button>

                {sortOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[140px]">
                    {[
                      { value: "latest", label: t.latest },
                      { value: "oldest", label: t.oldest },
                      { value: "popular", label: t.popular }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setSortOpen(false); setActiveDropdown(null); setCurrentPage(1); }}
                        className={`w-full px-3 py-1.5 text-left text-sm ${sortBy === option.value ? "text-[#4CAF50] bg-green-50" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Items Per Page Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => handleDropdownToggle('items', e)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span>{itemsPerPage} {t.speeches}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'items' ? "rotate-180" : ""}`} />
                </button>

                {activeDropdown === 'items' && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[120px]">
                    {[4, 6, 8, 10].map(num => (
                      <button
                        key={num}
                        onClick={() => { setItemsPerPage(num); setActiveDropdown(null); setCurrentPage(1); }}
                        className={`w-full px-3 py-1.5 text-left text-sm ${itemsPerPage === num ? "text-[#4CAF50] bg-green-50" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        {num} {t.speeches}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              {(searchQuery || sortBy !== "latest") && (
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <X size={13} />
                  {t.clearAll}
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {(searchQuery || sortBy !== "latest") && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-gray-100">
                {sortBy !== "latest" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {sortBy === "oldest" && t.oldest}
                    {sortBy === "popular" && t.popular}
                    <button onClick={() => { setSortBy("latest"); setCurrentPage(1); }} className="hover:bg-gray-200 rounded-full p-0.5">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:bg-gray-200 rounded-full p-0.5">
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="text-xs text-gray-400 mb-3">
          {filteredSpeeches.length > 0
            ? `${t.showing} ${startItem}-${endItem} ${t.ofTotal} ${filteredSpeeches.length} ${t.speeches}`
            : t.noSpeeches}
        </div>

        {/* Results - List Only */}
        {paginatedSpeeches.length > 0 ? (
          <div>
            {paginatedSpeeches.map(speech => <SpeechListItem key={speech.id} speech={speech} />)}
          </div>
        ) : (
          <div className="text-center py-12">
            <Mic size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">{t.noSpeeches}</p>
            <p className="text-xs text-gray-300 mt-1">{t.tryAgain}</p>
          </div>
        )}

        <Pagination />
      </Container>

      {/* Detail Modal */}
      {selectedSpeech && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-4 py-3">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <button onClick={() => setSelectedSpeech(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#2E7D32] transition-colors">
                <ArrowLeft size={18} />
                {t.back}
              </button>
              <button onClick={handleShare} className="p-2 text-gray-400 hover:text-[#2E7D32] transition-colors rounded-full hover:bg-gray-50">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Hero Image */}
            <div className="mb-8 rounded-xl overflow-hidden h-64 md:h-80 bg-gray-100 shadow-md">
              <img 
                src={selectedSpeech.image} 
                alt={selectedSpeech.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800&h=500&fit=crop';
                }}
              />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{selectedSpeech.title}</h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(selectedSpeech.date)}
                </span>
                {/* <span className="flex items-center gap-1.5">
                  <User size={14} />
                  {selectedSpeech.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={14} />
                  {selectedSpeech.views} {t.views}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {selectedSpeech.readTime} {t.minRead}
                </span> */}
              </div>
            </div>

            <div className="prose prose-sm md:prose-base max-w-none text-gray-600 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: selectedSpeech.content }} />
            </div>

            {filteredSpeeches.filter(s => s.id !== selectedSpeech.id).length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.relatedSpeeches}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSpeeches.filter(s => s.id !== selectedSpeech.id).slice(0, 2).map(speech => (
                    <div 
                      key={speech.id} 
                      onClick={() => handleViewSpeech(speech)} 
                      className="p-3 border border-gray-100 rounded-lg cursor-pointer hover:border-[#4CAF50]/30 hover:shadow-md transition-all flex gap-3 bg-white"
                    >
                      <img 
                        src={speech.image} 
                        alt={speech.title}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=100&h=100&fit=crop';
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 line-clamp-2">{speech.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(speech.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
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

export default Speech;