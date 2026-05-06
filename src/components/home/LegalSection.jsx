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
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLegalDocuments } from '../../hooks/useLegal';
import defaultThumbnail from '../../images/pdf/thumbnails/Lor.jpg';

const LegalSection = () => {
  const [currentLang, setCurrentLang] = useState('km');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Load counts from localStorage on component mount
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

  // Fetch legal documents from API - limit to 4 items for homepage
  const { 
    loading, 
    documents,
    categories 
  } = useLegalDocuments(1, 4, '');

  // Save counts to localStorage whenever they change
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

  // Check if document has Khmer file
  const hasKhmerFile = (doc) => {
    return doc.pdfFileKh && doc.pdfFileKh !== '#';
  };

  // Check if document has English file
  const hasEnglishFile = (doc) => {
    return doc.pdfFileEn && doc.pdfFileEn !== '#';
  };

  // Check if title is in Khmer (has Khmer Unicode characters)
  const isTitleKhmer = (title) => {
    // Khmer Unicode range: \u1780-\u17FF
    const khmerRegex = /[\u1780-\u17FF]/;
    return khmerRegex.test(title);
  };

  // Get the appropriate download button based on title language
  const getDownloadButtonConfig = (doc) => {
    const title = currentLang === 'km' ? doc.titleKh : doc.titleEn;
    const isKhmerTitle = isTitleKhmer(title);
    const hasKh = hasKhmerFile(doc);
    const hasEn = hasEnglishFile(doc);
    
    // Priority 1: Khmer title + Khmer file exists
    if (isKhmerTitle && hasKh) {
      return { show: true, language: 'km', text: t.downloadKh };
    }
    // Priority 2: English title + English file exists
    else if (!isKhmerTitle && hasEn) {
      return { show: true, language: 'en', text: t.downloadEn };
    }
    // Priority 3: Fallback - Khmer file exists
    else if (hasKh) {
      return { show: true, language: 'km', text: t.downloadKh };
    }
    // Priority 4: Fallback - English file exists
    else if (hasEn) {
      return { show: true, language: 'en', text: t.downloadEn };
    }
    // No file available
    return { show: false, language: null, text: '' };
  };

  const translations = {
    km: {
      title: 'ឯកសារពាក់ព័ន្ធ',
      subtitle: 'លិខិតបទដ្ឋានគតិយុត្ត និងឯកសារពាក់ព័ន្ធ',
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
      title: 'Related Documents',
      subtitle: 'Legal standards and related documents',
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

  // Get category display name from API categories
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

  // Get category color
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

  // Get category icon
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    if (currentLang === "km") {
      const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
      const day = date.getDate();
      const month = khmerMonths[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Strip HTML tags from text
  const stripHtmlTags = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const handleViewDetails = (doc) => {
    // Update view count
    setViewCounts(prev => ({
      ...prev,
      [doc.id]: (prev[doc.id] || 0) + 1
    }));
    setSelectedDoc(doc);
    setShowDetail(true);
  };

  const handleViewPdf = (pdfUrl, docId) => {
    if (pdfUrl && pdfUrl !== '#') {
      // Update view count for PDF view
      setViewCounts(prev => ({
        ...prev,
        [docId]: (prev[docId] || 0) + 1
      }));
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownload = (doc, language) => {
    const pdfUrl = language === 'km' ? doc.pdfFileKh : doc.pdfFileEn;
    if (pdfUrl && pdfUrl !== '#') {
      // Update download count
      setDownloadCounts(prev => ({
        ...prev,
        [doc.id]: (prev[doc.id] || 0) + 1
      }));
      
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
    // Update share count when actually shared
    if (selectedDoc) {
      setShareCounts(prev => ({
        ...prev,
        [selectedDoc.id]: (prev[selectedDoc.id] || 0) + 1
      }));
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/legal/${selectedDoc?.id}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    handleShareConfirm(); // Count as share when copied
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShareToSocial = (platform) => {
    const url = `${window.location.origin}/legal/${selectedDoc?.id}`;
    const title = currentLang === 'km' ? selectedDoc?.titleKh : selectedDoc?.titleEn;
    let shareUrl = '';

    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      default:
        return;
    }

    handleShareConfirm(); // Count as share when shared to social media
    window.open(shareUrl, '_blank', 'width=600,height=500');
  };

  // Get thumbnail - use cover_image from API
  const getThumbnail = (doc) => {
    return doc.coverImage || defaultThumbnail;
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full mt-12">
        <div className="mb-8">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-1"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="flex">
                <div className="w-28 sm:w-36 h-32 bg-gray-200 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Split documents into rows of 2
  const rows = [];
  for (let i = 0; i < documents.length; i += 2) {
    rows.push(documents.slice(i, i + 2));
  }

  return (
    <div className="w-full mt-12">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
                {t.title}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t.subtitle}
            </p>
          </div>
          <Link
            to="/legal"
            className="group flex items-center space-x-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
          >
            <span>{t.viewAll}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t.noDocuments}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {row.map((doc) => {
                const title = currentLang === 'km' ? doc.titleKh : doc.titleEn;
                const description = currentLang === 'km' ? doc.descriptionKh : doc.descriptionEn;
                const plainDescription = stripHtmlTags(description);
                const thumbnail = getThumbnail(doc);
                const hasKh = hasKhmerFile(doc);
                const hasEn = hasEnglishFile(doc);
                const downloadCount = downloadCounts[doc.id] || 0;
                const shareCount = shareCounts[doc.id] || 0;
                const viewCount = viewCounts[doc.id] || 0;
                
                // Determine which download button to show based on title language
                const isKhmerTitle = isTitleKhmer(title);
                const showKhmerDownload = hasKh && isKhmerTitle;
                const showEnglishDownload = hasEn && !isKhmerTitle;
                // If title language doesn't match available file, show the available one
                const showFallbackKhmer = hasKh && !showEnglishDownload && !showKhmerDownload;
                const showFallbackEnglish = hasEn && !showEnglishDownload && !showKhmerDownload;
                
                return (
                  <div
                    key={doc.id}
                    className="group bg-white rounded-xl border border-gray-200 hover:border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => handleViewDetails(doc)}
                  >
                    <div className="flex p-4">
                      {/* Thumbnail - Left side */}
                      <div className="relative w-28 sm:w-36 h-full min-h-[128px] sm:min-h-[144px] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-3 sm:mr-4 shadow-md">
                        <img
                          src={thumbnail}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.target.src = defaultThumbnail; }}
                        />
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium shadow-lg">
                          PDF
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${getCategoryColor(doc.category)}`}>
                            {getCategoryIcon(doc.category)}
                            <span className="hidden sm:inline">{getCategoryDisplayName(doc.category)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center text-xs text-gray-400 mb-2">
                          <Calendar size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{t.publishedDate}: {formatDate(doc.publishedDate)}</span>
                        </div>

                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {title}
                        </h3>

                        {plainDescription && (
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                            {plainDescription}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mb-3 text-[10px] sm:text-xs text-gray-400">
                          {doc.documentNumber && (
                            <span className="flex items-center gap-1">
                              <FileText size={10} />
                              {t.documentNumber}: {doc.documentNumber}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            {/* <Eye size={10} />
                            {viewCount + (doc.views || 0)} */}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {/* Show download button based on title language */}
                          {(showKhmerDownload || showFallbackKhmer) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(doc, 'km');
                              }}
                              className="flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] sm:text-xs rounded-lg hover:shadow-md transition-all duration-200"
                            >
                              <Download size={10} className="sm:w-3 sm:h-3" />
                              <span className="hidden xs:inline">{t.downloadKh}</span>
                              <span className="xs:hidden">ខ្មែរ</span>
                            </button>
                          )}
                          
                          {(showEnglishDownload || showFallbackEnglish) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(doc, 'en');
                              }}
                              className="flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-green-500 text-green-600 text-[10px] sm:text-xs rounded-lg hover:bg-green-50 transition-all duration-200 font-medium"
                            >
                              <Download size={10} className="sm:w-3 sm:h-3" />
                              <span className="hidden xs:inline">{t.downloadEn}</span>
                              <span className="xs:hidden">EN</span>
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(doc);
                            }}
                            className="flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 text-gray-600 text-[10px] sm:text-xs rounded-lg hover:border-green-500 hover:text-green-600 transition-all duration-200"
                          >
                            <Share2 size={10} className="sm:w-3 sm:h-3" />
                            <span className="hidden xs:inline">{t.share}</span>
                            <span className="xs:hidden">ចែក</span>
                          </button>
                          
                          {/* Stats counters */}
                          <div className="flex items-center gap-2 ml-auto">
                            {downloadCount > 0 && (
                              <span className="text-xs text-gray-400 flex items-center gap-1" title={t.downloads}>
                                <Download size={10} />
                                {downloadCount}
                              </span>
                            )}
                            {shareCount > 0 && (
                              <span className="text-xs text-gray-400 flex items-center gap-1" title={t.shares}>
                                <Share2 size={10} />
                                {shareCount}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end pt-2 border-t border-gray-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(doc);
                            }}
                            className="flex items-center space-x-1 text-[10px] sm:text-xs text-green-600 hover:text-green-700 font-medium group/btn"
                          >
                            <span>{t.viewDetails}</span>
                            <ChevronRight size={10} className="sm:w-3 sm:h-3 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedDoc && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 z-10 py-3 sm:py-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowDetail(false)}
                    className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-[#2E7D32] transition-colors group"
                  >
                    <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">{t.back}</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleShare(selectedDoc)}
                      className="p-1.5 sm:p-2 hover:bg-[#4CAF50] hover:bg-opacity-10 rounded-lg transition-colors"
                    >
                      <Share2 size={14} className="text-gray-500 hover:text-[#2E7D32] sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Document Details */}
              <div className="space-y-4 sm:space-y-6">
                {/* Header with Thumbnail */}
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  <div className="relative w-40 sm:w-56 h-auto min-h-[192px] sm:min-h-[288px] bg-gray-100 rounded-xl overflow-hidden shadow-lg flex-shrink-0 mx-auto md:mx-0">
                    <img
                      src={getThumbnail(selectedDoc)}
                      alt={currentLang === 'km' ? selectedDoc.titleKh : selectedDoc.titleEn}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = defaultThumbnail; }}
                    />
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#4CAF50] text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium">
                      PDF
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${getCategoryColor(selectedDoc.category)}`}>
                        {getCategoryIcon(selectedDoc.category)}
                        {getCategoryDisplayName(selectedDoc.category)}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
                      {currentLang === 'km' ? selectedDoc.titleKh : selectedDoc.titleEn}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                      {stripHtmlTags(currentLang === 'km' ? selectedDoc.descriptionKh : selectedDoc.descriptionEn)}
                    </p>
                  </div>
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <Calendar size={14} className="text-[#4CAF50] mb-1 sm:mb-2 sm:w-4 sm:h-4" />
                    <div className="text-[10px] sm:text-xs text-gray-500">{t.publishedDate}</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {formatDate(selectedDoc.publishedDate)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <FileText size={14} className="text-[#4CAF50] mb-1 sm:mb-2 sm:w-4 sm:h-4" />
                    <div className="text-[10px] sm:text-xs text-gray-500">{t.documentNumber}</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {selectedDoc.documentNumber || '-'}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                {/* <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye size={14} className="text-[#4CAF50]" />
                    <span className="text-sm text-gray-600">
                      {t.views}: {(viewCounts[selectedDoc.id] || 0) + (selectedDoc.views || 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download size={14} className="text-[#4CAF50]" />
                    <span className="text-sm text-gray-600">
                      {t.downloads}: {downloadCounts[selectedDoc.id] || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 size={14} className="text-[#4CAF50]" />
                    <span className="text-sm text-gray-600">
                      {t.shares}: {shareCounts[selectedDoc.id] || 0}
                    </span>
                  </div>
                </div> */}

                {/* Download & View Section - NOW FOLLOWS TITLE LANGUAGE RULE */}
                <div className="bg-[#4CAF50] bg-opacity-5 rounded-lg p-4 sm:p-6 border border-[#4CAF50] border-opacity-20">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <FileText size={20} className="text-[#4CAF50] sm:w-6 sm:h-6" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">
                          {currentLang === 'km' ? selectedDoc.titleKh : selectedDoc.titleEn}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-gray-500">PDF</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <button 
                        onClick={() => handleViewPdf(currentLang === 'km' ? selectedDoc.pdfFileKh : selectedDoc.pdfFileEn, selectedDoc.id)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-[#4CAF50] text-[#2E7D32] text-xs sm:text-sm rounded-lg hover:bg-[#4CAF50] hover:text-white transition-all duration-200 flex items-center space-x-1 sm:space-x-2"
                      >
                        <Eye size={12} className="sm:w-4 sm:h-4" />
                        <span>{t.viewPdf}</span>
                      </button>
                      
                      {/* Conditional Download Button based on Title Language */}
                      {(() => {
                        const btnConfig = getDownloadButtonConfig(selectedDoc);
                        if (btnConfig.show) {
                          return (
                            <button 
                              onClick={() => handleDownload(selectedDoc, btnConfig.language)}
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center space-x-1 sm:space-x-2 ${
                                btnConfig.language === 'km'
                                  ? 'bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white hover:shadow-lg'
                                  : 'border border-[#4CAF50] text-[#2E7D32] hover:bg-[#4CAF50] hover:text-white'
                              }`}
                            >
                              <Download size={12} className="sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">{btnConfig.text}</span>
                              <span className="xs:hidden">{btnConfig.language === 'km' ? 'ខ្មែរ' : 'EN'}</span>
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
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">{t.shareVia}</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button onClick={() => handleShareToSocial('facebook')} className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-[#1877F2] text-white rounded-lg">
                  <Facebook size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Facebook</span>
                </button>
                <button onClick={() => handleShareToSocial('twitter')} className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-[#1DA1F2] text-white rounded-lg">
                  <Twitter size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Twitter</span>
                </button>
                <button onClick={() => handleShareToSocial('linkedin')} className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-[#0077B5] text-white rounded-lg">
                  <Linkedin size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">LinkedIn</span>
                </button>
                <button onClick={() => handleShareToSocial('telegram')} className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-[#26A5E4] text-white rounded-lg">
                  <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Telegram</span>
                </button>
              </div>
              
              <div className="border-t border-gray-100 pt-3 sm:pt-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/legal/${selectedDoc.id}`}
                    readOnly
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm bg-gray-50 text-gray-600"
                  />
                  <button onClick={handleCopyLink} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32] transition-colors flex items-center space-x-1 sm:space-x-2">
                    {copySuccess ? <Check size={14} className="sm:w-4 sm:h-4" /> : <Copy size={14} className="sm:w-4 sm:h-4" />}
                    <span className="text-xs sm:text-sm">{copySuccess ? t.copied : t.copyLink}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
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
      `}</style>
    </div>
  );
};
 
export default LegalSection;