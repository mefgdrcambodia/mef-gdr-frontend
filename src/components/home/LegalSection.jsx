// src/components/home/LegalSection.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileText,
  Scale,
  Download,
  Eye,
  Calendar,
  ChevronRight,
  Clock,
  ArrowRight,
  FileCheck,
  Share2,
  X,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Check,
  Building2,
  BookOpen,
  AlertCircle,
  MoreHorizontal,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLegalDocuments } from '../../hooks/useLegal';

// Slideshow Component
const LegalSlideshow = ({ documents, loading, t, formatDate, getCategoryDisplayName, getCategoryColor, getCategoryIcon, handleViewDetails, currentLang, stripHtmlTags, handleDownload, downloadCounts, shareCounts, viewCounts }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    if (documents.length === 0 || isHovering) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % documents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [documents.length, isHovering]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <div className="flex items-center border-b border-gray-200 pb-4">
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 rounded-xl animate-pulse h-[500px]"></div>
        <div className="mt-6 flex justify-center">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) return null;

  const currentDoc = documents[currentSlide];
  const title = currentLang === 'km' ? currentDoc.titleKh : currentDoc.titleEn;
  const description = currentLang === 'km' ? currentDoc.descriptionKh : currentDoc.descriptionEn;
  const plainDescription = stripHtmlTags(description);
  // Get remaining documents for grid (excluding current slide)
  const gridDocuments = documents.filter((_, idx) => idx !== currentSlide).slice(0, 4);

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + documents.length) % documents.length);
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % documents.length);
  };

  const hasKhmerFile = (doc) => {
    return doc.pdfFileKh && doc.pdfFileKh !== '#';
  };

  const hasEnglishFile = (doc) => {
    return doc.pdfFileEn && doc.pdfFileEn !== '#';
  };

  const isTitleKhmer = (title) => {
    const khmerRegex = /[\u1780-\u17FF]/;
    return khmerRegex.test(title);
  };

  const getDownloadButtonConfig = (doc) => {
    const title = currentLang === 'km' ? doc.titleKh : doc.titleEn;
    const isKhmerTitle = isTitleKhmer(title);
    const hasKh = hasKhmerFile(doc);
    const hasEn = hasEnglishFile(doc);
    
    if (isKhmerTitle && hasKh) {
      return { show: true, language: 'km', text: 'ទាញយកជាភាសាខ្មែរ' };
    } else if (!isKhmerTitle && hasEn) {
      return { show: true, language: 'en', text: 'Download in English' };
    } else if (hasKh) {
      return { show: true, language: 'km', text: 'ទាញយកជាភាសាខ្មែរ' };
    } else if (hasEn) {
      return { show: true, language: 'en', text: 'Download in English' };
    }
    return { show: false, language: null, text: '' };
  };

  const downloadCount = downloadCounts[currentDoc?.id] || 0;
  const shareCount = shareCounts[currentDoc?.id] || 0;

  return (
    <div 
      className="w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
                {t.title}
              </span>
            </div>
            <h2 className="text-gray-800 text-xl md:text-2xl font-semibold">
              {t.title}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Slideshow Container */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl group">
        <div 
          className="relative h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden cursor-pointer"
          onClick={() => handleViewDetails(currentDoc)}
        >
          <img
            src={currentDoc.coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(currentDoc.category)} bg-white/95 backdrop-blur-sm shadow-lg`}>
              {getCategoryIcon(currentDoc.category)}
              <span>{getCategoryDisplayName(currentDoc.category)}</span>
            </span>
          </div>

          {/* Document Number Badge */}
          {currentDoc.documentNumber && (
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium bg-black/70 backdrop-blur-sm text-white shadow-lg">
                <FileText size={12} />
                <span>{t.documentNumber}: {currentDoc.documentNumber}</span>
              </span>
            </div>
          )}

          {/* Stats Badges */}
          <div className="absolute bottom-28 right-4 flex gap-2 z-10">
            {downloadCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs shadow-lg">
                <Download size={10} />
                {downloadCount}
              </span>
            )}
            {shareCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs shadow-lg">
                <Share2 size={10} />
                {shareCount}
              </span>
            )}
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
            <div className="flex items-center text-xs text-white/70 mb-2">
              <Calendar size={12} className="mr-1" />
              <span>{t.publishedDate}: {formatDate(currentDoc.publishedDate)}</span>
            </div>
            <h3 className="text-white text-lg md:text-xl font-semibold mb-2 line-clamp-2 leading-relaxed">
              {title}
            </h3>
            {plainDescription && (
              <p className="text-white/70 text-xs md:text-sm line-clamp-2 mb-3">
                {plainDescription}
              </p>
            )}
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(currentDoc);
                }}
                className="flex items-center space-x-1 text-xs md:text-sm bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors shadow-lg"
              >
                <span>{t.viewDetails}</span>
                <ChevronRight size={14} />
              </button>
              {(() => {
                const btnConfig = getDownloadButtonConfig(currentDoc);
                if (btnConfig.show) {
                  return (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(currentDoc, btnConfig.language);
                      }}
                      className="flex items-center space-x-1 text-xs md:text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors shadow-lg"
                    >
                      <Download size={14} />
                      <span>{btnConfig.language === 'km' ? 'ទាញយក' : 'Download'}</span>
                    </button>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {documents.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {documents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentSlide
                      ? "bg-green-500 w-6 h-1.5"
                      : "bg-white/50 hover:bg-white/80 w-1.5 h-1.5"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Thumbnail Navigation */}
        {documents.length > 1 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            {documents.slice(0, 5).map((doc, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  idx === currentSlide ? "ring-2 ring-green-500 scale-110" : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={doc.coverImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {documents.length > 5 && (
              <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center text-white text-xs">
                +{documents.length - 5}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4-Column Grid Below Slideshow */}
      {gridDocuments.length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-">
            {gridDocuments.map((doc) => {
              const gridTitle = currentLang === 'km' ? doc.titleKh : doc.titleEn;
              const gridDescription = currentLang === 'km' ? doc.descriptionKh : doc.descriptionEn;
              const plainGridDescription = stripHtmlTags(gridDescription);
              const btnConfig = getDownloadButtonConfig(doc);
              
              return (
                <div
                  key={doc.id}
                  className="group bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => handleViewDetails(doc)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-32 overflow-hidden bg-gray-100">
                    <img
                      src={doc.coverImage}
                      alt={gridTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${getCategoryColor(doc.category)} bg-white/90`}>
                        {getCategoryIcon(doc.category)}
                        <span className="hidden sm:inline">{getCategoryDisplayName(doc.category)}</span>
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md text-[10px]">
                      PDF
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <div className="flex items-center text-[10px] text-gray-400 mb-1">
                      <Calendar size={10} className="mr-1 flex-shrink-0" />
                      <span className="truncate">{formatDate(doc.publishedDate)}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {gridTitle}
                    </h4>
                    {plainGridDescription && (
                      <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">
                        {plainGridDescription}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      {btnConfig.show && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc, btnConfig.language);
                          }}
                          className="flex items-center space-x-1 text-[10px] text-green-600 hover:text-green-700 font-medium"
                        >
                          <Download size={10} />
                          <span>{btnConfig.language === 'km' ? 'ទាញយក' : 'Download'}</span>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(doc);
                        }}
                        className="flex items-center space-x-1 text-[10px] text-green-600 hover:text-green-700 font-medium"
                      >
                        <span>{t.viewDetails}</span>
                        <ChevronRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View More Button at Bottom */}
      <div className="mt-6 flex justify-center">
        <Link
          to="/legal"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg group"
        >
          <span>{t.viewAll}</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

// Main LegalSection Component
const LegalSection = ({ layout = "default" }) => {
  const [currentLang, setCurrentLang] = useState('km');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [shareCounts, setShareCounts] = useState(() => {
    const saved = localStorage.getItem('legal_share_counts');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [downloadCounts, setDownloadCounts] = useState(() => {
    const saved = localStorage.getItem('legal_download_counts');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [viewCounts, setViewCounts] = useState(() => {
    const saved = localStorage.getItem('legal_view_counts');
    return saved ? JSON.parse(saved) : {};
  });

  const { loading, documents, categories } = useLegalDocuments(1, 10, '');

  useEffect(() => {
    localStorage.setItem('legal_share_counts', JSON.stringify(shareCounts));
  }, [shareCounts]);

  useEffect(() => {
    localStorage.setItem('legal_download_counts', JSON.stringify(downloadCounts));
  }, [downloadCounts]);

  useEffect(() => {
    localStorage.setItem('legal_view_counts', JSON.stringify(viewCounts));
  }, [viewCounts]);

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener('languagechange', handleLanguageChange);
    
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setCurrentLang(savedLang);
    }

    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  useEffect(() => {
    if (showDetail || showShareModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDetail, showShareModal]);

  const hasKhmerFile = (doc) => {
    return doc.pdfFileKh && doc.pdfFileKh !== '#';
  };

  const hasEnglishFile = (doc) => {
    return doc.pdfFileEn && doc.pdfFileEn !== '#';
  };

  const isTitleKhmer = (title) => {
    const khmerRegex = /[\u1780-\u17FF]/;
    return khmerRegex.test(title);
  };

  const getDownloadButtonConfig = (doc) => {
    const title = currentLang === 'km' ? doc.titleKh : doc.titleEn;
    const isKhmerTitle = isTitleKhmer(title);
    const hasKh = hasKhmerFile(doc);
    const hasEn = hasEnglishFile(doc);
    
    if (isKhmerTitle && hasKh) {
      return { show: true, language: 'km', text: translations[currentLang].downloadKh };
    } else if (!isKhmerTitle && hasEn) {
      return { show: true, language: 'en', text: translations[currentLang].downloadEn };
    } else if (hasKh) {
      return { show: true, language: 'km', text: translations[currentLang].downloadKh };
    } else if (hasEn) {
      return { show: true, language: 'en', text: translations[currentLang].downloadEn };
    }
    return { show: false, language: null, text: '' };
  };

  const translations = {
    km: {
      title: 'ច្បាប់ និងបទដ្ឋានគតិយុត្តិ',
      subtitle: '',
      viewAll: 'មើលទាំងអស់',
      downloadKh: 'ទាញយកជាភាសាខ្មែរ',
      downloadEn: 'ទាញយកជាភាសាអង់គ្លេស',
      viewDetails: 'មើលលម្អិត',
      publishedDate: 'ថ្ងៃចេញផ្សាយ',
      effectiveDate: 'ថ្ងៃចូលជាធរមាន',
      department: 'ស្ថាប័ន',
      fileSize: 'ទំហំឯកសារ',
      format: 'ទម្រង់',
      pages: 'ទំព័រ',
      description: 'សេចក្តីសង្ខេប',
      keywords: 'ពាក្យគន្លឹះ',
      viewPdf: 'បើកមើល PDF',
      share: 'ចែករំលែក',
      shareVia: 'ចែករំលែកតាម',
      copyLink: 'ចម្លងតំណ',
      copied: 'បានចម្លង!',
      back: 'ត្រលប់ក្រោយ',
      documentNumber: 'លេខឯកសារ',
      loading: 'កំពុងផ្ទុក...',
      noDocuments: 'គ្មានឯកសារ',
      shares: 'ចែករំលែក',
      downloads: 'ទាញយក',
      views: 'ទស្សនា',
    },
    en: {
      title: 'Legal Documents',
      subtitle: 'Important legal standards and documents',
      viewAll: 'View All',
      downloadKh: 'Download in Khmer',
      downloadEn: 'Download in English',
      viewDetails: 'View Details',
      publishedDate: 'Published Date',
      effectiveDate: 'Effective Date',
      department: 'Department',
      fileSize: 'File Size',
      format: 'Format',
      pages: 'Pages',
      description: 'Description',
      keywords: 'Keywords',
      viewPdf: 'View PDF',
      share: 'Share',
      shareVia: 'Share via',
      copyLink: 'Copy Link',
      copied: 'Copied!',
      back: 'Back',
      documentNumber: 'Document No.',
      loading: 'Loading...',
      noDocuments: 'No documents',
      shares: 'Shares',
      downloads: 'Downloads',
      views: 'Views',
    }
  };

  const t = translations[currentLang];

  const getCategoryDisplayName = (categoryKey) => {
    if (!categories || !Array.isArray(categories)) {
      return categoryKey;
    }
    const categoryObj = categories.find(cat => cat[categoryKey]);
    if (categoryObj && categoryObj[categoryKey]) {
      return categoryObj[categoryKey][currentLang] || categoryKey;
    }
    return categoryKey;
  };

  const getCategoryColor = (categoryKey) => {
    const colors = {
      law: "bg-blue-50 text-blue-700 border-blue-200",
      regulation: "bg-green-50 text-green-700 border-green-200",
      decree: "bg-purple-50 text-purple-700 border-purple-200",
      proclamation: "bg-orange-50 text-orange-700 border-orange-200",
      directive: "bg-cyan-50 text-cyan-700 border-cyan-200",
      other: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[categoryKey] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getCategoryIcon = (categoryKey) => {
    const icons = {
      law: <Scale size={14} />,
      regulation: <FileCheck size={14} />,
      decree: <FileText size={14} />,
      proclamation: <AlertCircle size={14} />,
      directive: <BookOpen size={14} />,
      other: <MoreHorizontal size={14} />,
    };
    return icons[categoryKey] || <FileText size={14} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (currentLang === "km") {
      const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
      return `${date.getDate()} ${khmerMonths[date.getMonth()]} ${date.getFullYear()}`;
    }
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const handleViewDetails = (doc) => {
    setViewCounts(prev => ({ ...prev, [doc.id]: (prev[doc.id] || 0) + 1 }));
    setSelectedDoc(doc);
    setShowDetail(true);
  };

  const handleViewPdf = (pdfUrl, docId) => {
    if (pdfUrl && pdfUrl !== '#') {
      setViewCounts(prev => ({ ...prev, [docId]: (prev[docId] || 0) + 1 }));
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownload = (doc, language) => {
    const pdfUrl = language === 'km' ? doc.pdfFileKh : doc.pdfFileEn;
    if (pdfUrl && pdfUrl !== '#') {
      setDownloadCounts(prev => ({ ...prev, [doc.id]: (prev[doc.id] || 0) + 1 }));
      const fileName = language === 'km' ? doc.titleKh : doc.titleEn;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = (doc) => {
    setSelectedDoc(doc);
    setShowShareModal(true);
  };

  const handleShareConfirm = () => {
    if (selectedDoc) {
      setShareCounts(prev => ({ ...prev, [selectedDoc.id]: (prev[selectedDoc.id] || 0) + 1 }));
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/legal/${selectedDoc?.id}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    handleShareConfirm();
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // If layout is slideshow, render slideshow version
  if (layout === "slideshow") {
    return (
      <>
        <LegalSlideshow
          documents={documents}
          loading={loading}
          t={t}
          formatDate={formatDate}
          getCategoryDisplayName={getCategoryDisplayName}
          getCategoryColor={getCategoryColor}
          getCategoryIcon={getCategoryIcon}
          handleViewDetails={handleViewDetails}
          handleDownload={handleDownload}
          currentLang={currentLang}
          stripHtmlTags={stripHtmlTags}
          downloadCounts={downloadCounts}
          shareCounts={shareCounts}
          viewCounts={viewCounts}
        />
        
        {/* Detail Modal */}
        {showDetail && selectedDoc && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="min-h-screen px-4 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 py-4 mb-6">
                  <div className="flex items-center justify-between">
                    <button onClick={() => setShowDetail(false)} className="flex items-center space-x-2 text-gray-500 hover:text-green-600">
                      <ChevronRight size={20} className="rotate-180" />
                      <span>{t.back}</span>
                    </button>
                    <button onClick={() => handleShare(selectedDoc)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-64 h-64 bg-gray-100 rounded-xl overflow-hidden">
                      <img src={selectedDoc.coverImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentLang === 'km' ? selectedDoc.titleKh : selectedDoc.titleEn}
                      </h2>
                      <p className="text-gray-600">{stripHtmlTags(currentLang === 'km' ? selectedDoc.descriptionKh : selectedDoc.descriptionEn)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => handleViewPdf(currentLang === 'km' ? selectedDoc.pdfFileKh : selectedDoc.pdfFileEn, selectedDoc.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        {t.viewPdf}
                      </button>
                      {(() => {
                        const btnConfig = getDownloadButtonConfig(selectedDoc);
                        if (btnConfig.show) {
                          return (
                            <button onClick={() => handleDownload(selectedDoc, btnConfig.language)} className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50">
                              {btnConfig.text}
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Share Modal */}
        {showShareModal && selectedDoc && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">{t.shareVia}</h3>
                <button onClick={() => setShowShareModal(false)}><X size={20} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button onClick={() => { handleShareConfirm(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/legal/${selectedDoc.id}`, '_blank'); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">Facebook</button>
                <button onClick={() => { handleShareConfirm(); window.open(`https://twitter.com/intent/tweet?url=${window.location.origin}/legal/${selectedDoc.id}`, '_blank'); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg">Twitter</button>
                <button onClick={() => { handleShareConfirm(); window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.origin}/legal/${selectedDoc.id}`, '_blank'); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg">LinkedIn</button>
                <button onClick={() => { handleShareConfirm(); window.open(`https://t.me/share/url?url=${window.location.origin}/legal/${selectedDoc.id}`, '_blank'); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg">Telegram</button>
              </div>
              <div className="flex gap-2">
                <input type="text" value={`${window.location.origin}/legal/${selectedDoc.id}`} readOnly className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                <button onClick={handleCopyLink} className="px-4 py-2 bg-green-600 text-white rounded-lg">{copySuccess ? t.copied : t.copyLink}</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Original grid layout for legal page
  return (
    <div className="w-full">
      <div>Original Legal Section Layout</div>
    </div>
  );
};

export default LegalSection;