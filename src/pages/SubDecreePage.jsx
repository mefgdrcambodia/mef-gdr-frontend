import React, { useState, useEffect } from "react";
import {
  FileText, Search, Download, Eye, Calendar,
  ChevronLeft, ChevronRight, X, Share2, Check,
  Facebook, Twitter, Linkedin, MessageCircle, Copy,
  FileCheck, ChevronRight as ChevronRightIcon
} from "lucide-react";
import Container from "../components/ui/Container.jsx";
import GlobalBanner from "../components/ui/GlobalBanner.jsx";
import RunningText from "../components/ui/RunningText";
import { useLegalDocuments } from "../hooks/useLegal";
import defaultThumbnail from "../images/pdf/thumbnails/Lor.jpg";

const SubDecreePage = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("language") || "km";
  });
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load counts from localStorage
  const [shareCounts, setShareCounts] = useState(() => {
    const saved = localStorage.getItem('subdecree_share_counts');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [downloadCounts, setDownloadCounts] = useState(() => {
    const saved = localStorage.getItem('subdecree_download_counts');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [viewCounts, setViewCounts] = useState(() => {
    const saved = localStorage.getItem('subdecree_view_counts');
    return saved ? JSON.parse(saved) : {};
  });

  const { loading, documents, totalPages, total } = useLegalDocuments(
    page, 
    10, 
    "sub-decree"
  );

  // Save counts to localStorage
  useEffect(() => {
    localStorage.setItem('subdecree_share_counts', JSON.stringify(shareCounts));
  }, [shareCounts]);

  useEffect(() => {
    localStorage.setItem('subdecree_download_counts', JSON.stringify(downloadCounts));
  }, [downloadCounts]);

  useEffect(() => {
    localStorage.setItem('subdecree_view_counts', JSON.stringify(viewCounts));
  }, [viewCounts]);

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };
    window.addEventListener("languagechange", handleLanguageChange);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  useEffect(() => {
    if (showModal || showShareModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showModal, showShareModal]);

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
    const khmerRegex = /[\u1780-\u17FF]/;
    return khmerRegex.test(title);
  };

  // Get the appropriate download button configuration based on title language
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

  const stripHtmlTags = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const getCategoryDisplayName = () => {
    return currentLang === 'km' ? 'អនុក្រឹត្យ' : 'Sub-Decree';
  };

  const getCategoryIcon = () => <FileCheck size={14} />;

  const getCategoryColor = () => "bg-purple-50 text-purple-700 border-purple-200";

  const getThumbnail = (doc) => doc.coverImage || defaultThumbnail;

  const translations = {
    km: {
      title: "អនុក្រឹត្យ",
      subtitle: "អនុក្រឹត្យ និងបទបញ្ញត្តិពាក់ព័ន្ធ",
      search: "ស្វែងរកតាមចំណងជើង ឬខ្លឹមសារ...",
      downloadKh: "ទាញយកជាភាសាខ្មែរ",
      downloadEn: "ទាញយកជាភាសាអង់គ្លេស",
      view: "មើល",
      documentNumber: "លេខអនុក្រឹត្យ",
      noDocuments: "រកមិនឃើញអនុក្រឹត្យ",
      viewPdf: "បើកមើល PDF",
      showing: "បង្ហាញ",
      to: "ដល់",
      ofTotal: "នៃ",
      documents: "អនុក្រឹត្យ",
      clearFilters: "សម្អាតតម្រង",
      totalDocuments: "អនុក្រឹត្យសរុប",
      loading: "កំពុងផ្ទុក...",
      shareVia: "ចែករំលែកតាម",
      copyLink: "ចម្លងតំណ",
      copied: "បានចម្លង!",
      back: "ត្រលប់ក្រោយ",
      publishedDate: "ថ្ងៃចេញផ្សាយ",
      shares: "ចែករំលែក",
      downloads: "ទាញយក",
      views: "ទស្សនា",
    },
    en: {
      title: "Sub-Decrees",
      subtitle: "Sub-decrees and related regulations",
      search: "Search by title or content...",
      downloadKh: "Download in Khmer",
      downloadEn: "Download in English",
      view: "View",
      documentNumber: "Sub-Decree Number",
      noDocuments: "No sub-decrees found",
      viewPdf: "View PDF",
      showing: "Showing",
      to: "to",
      ofTotal: "of",
      documents: "sub-decrees",
      clearFilters: "Clear Filters",
      totalDocuments: "Total Sub-Decrees",
      loading: "Loading...",
      shareVia: "Share via",
      copyLink: "Copy Link",
      copied: "Copied!",
      back: "Back",
      publishedDate: "Published Date",
      shares: "Shares",
      downloads: "Downloads",
      views: "Views",
    },
  };

  const t = translations[currentLang];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (currentLang === "km") {
      const khmerMonths = [
        "មករា","កុម្ភៈ","មីនា","មេសា","ឧសភា","មិថុនា",
        "កក្កដា","សីហា","កញ្ញា","តុលា","វិច្ឆិកា","ធ្នូ",
      ];
      return `${date.getDate()} ${khmerMonths[date.getMonth()]} ${date.getFullYear()}`;
    }
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const filteredDocuments = documents.filter((doc) => {
    if (!searchTerm) return true;
    const title = currentLang === "km" ? doc.titleKh : doc.titleEn;
    const desc = currentLang === "km" ? doc.descriptionKh : doc.descriptionEn;
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const itemsPerPage = 10;
  const startItem = filteredDocuments.length > 0 ? (page - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(page * itemsPerPage, filteredDocuments.length);

  const handleDocumentClick = (doc) => {
    // Update view count
    setViewCounts(prev => ({
      ...prev,
      [doc.id]: (prev[doc.id] || 0) + 1
    }));
    setSelectedDocument(doc);
    setShowModal(true);
  };

  const handleViewPdf = (doc, language = currentLang) => {
    const pdfUrl = language === "km" ? doc.pdfFileKh : doc.pdfFileEn;
    if (pdfUrl && pdfUrl !== "#") {
      // Update view count for PDF view
      setViewCounts(prev => ({
        ...prev,
        [doc.id]: (prev[doc.id] || 0) + 1
      }));
      window.open(pdfUrl, "_blank");
    }
  };

  const handleDownload = (doc, language) => {
    const pdfUrl = language === "km" ? doc.pdfFileKh : doc.pdfFileEn;
    if (pdfUrl && pdfUrl !== "#") {
      // Update download count
      setDownloadCounts(prev => ({
        ...prev,
        [doc.id]: (prev[doc.id] || 0) + 1
      }));
      
      const fileName = language === "km" ? doc.titleKh : doc.titleEn;
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${fileName}.pdf`;
      link.click();
    }
  };

  const handleShare = (doc) => {
    setSelectedDocument(doc);
    setShowShareModal(true);
  };

  const handleShareConfirm = () => {
    if (selectedDocument) {
      setShareCounts(prev => ({
        ...prev,
        [selectedDocument.id]: (prev[selectedDocument.id] || 0) + 1
      }));
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/legal/sub-decree/${selectedDocument?.id}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    handleShareConfirm();
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShareToSocial = (platform) => {
    const url = `${window.location.origin}/legal/sub-decree/${selectedDocument?.id}`;
    const title = currentLang === "km" ? selectedDocument?.titleKh : selectedDocument?.titleEn;
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    };
    if (shareUrls[platform]) {
      handleShareConfirm();
      window.open(shareUrls[platform], "_blank", "width=600,height=500");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPage(1);
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

      <Container className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileCheck size={18} className="text-[#4CAF50]" />
            <span className="font-medium">{total} {t.totalDocuments.toLowerCase()}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-5">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent bg-white text-sm"
                />
              </div>
              {searchTerm && (
                <button onClick={clearFilters} className="px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                  <X size={14} />
                  {t.clearFilters}
                </button>
              )}
            </div>
          </div>
        </div>

        {!loading && (
          <div className="text-sm text-gray-500 mb-4">
            {filteredDocuments.length > 0
              ? `${t.showing} ${startItem}-${endItem} ${t.ofTotal} ${filteredDocuments.length} ${t.documents}`
              : t.noDocuments}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-36 h-32 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileCheck size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-lg mb-2">{t.noDocuments}</p>
            {searchTerm && (
              <button onClick={clearFilters} className="mt-4 px-4 py-2 text-sm text-[#4CAF50] hover:bg-green-50 rounded-lg transition-colors">
                {t.clearFilters}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => {
              const title = currentLang === "km" ? doc.titleKh || doc.titleEn : doc.titleEn || doc.titleKh;
              const description = currentLang === "km" ? doc.descriptionKh || doc.descriptionEn : doc.descriptionEn || doc.descriptionKh;
              const plainDescription = stripHtmlTags(description);
              const thumbnail = getThumbnail(doc);
              const downloadCount = downloadCounts[doc.id] || 0;
              const shareCount = shareCounts[doc.id] || 0;
              const viewCount = viewCounts[doc.id] || 0;
              
              // Get download button config based on title language
              const btnConfig = getDownloadButtonConfig(doc);

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-[#4CAF50]/30 transition-all duration-200 cursor-pointer overflow-hidden"
                  onClick={() => handleDocumentClick(doc)}
                >
                  <div className="flex flex-col sm:flex-row p-4 gap-4">
                    <div className="relative w-full sm:w-36 h-32 sm:h-full min-h-[128px] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={thumbnail} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = defaultThumbnail; }} />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium">PDF</div>
                      <div className="absolute bottom-2 left-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${getCategoryColor()}`}>
                          {getCategoryIcon()}
                          <span className="hidden sm:inline">{getCategoryDisplayName()}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center text-xs text-gray-400 mb-2">
                        <Calendar size={12} className="mr-1" />
                        <span>{formatDate(doc.publishedDate)}</span>
                        {doc.documentNumber && (
                          <>
                            <span className="mx-2">•</span>
                            <FileCheck size={12} className="mr-1" />
                            <span>{doc.documentNumber}</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 hover:text-[#2E7D32] transition-colors">{title}</h3>
                      {plainDescription && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{plainDescription}</p>}
                      <div className="flex items-center gap-3 mb-3 text-[10px] sm:text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Eye size={10} />{viewCount + (doc.views || 0)} {t.views}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <button onClick={(e) => { e.stopPropagation(); handleViewPdf(doc); }} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"><Eye size={13} />{t.view}</button>
                        
                        {/* Single conditional download button based on title language */}
                        {btnConfig.show && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDownload(doc, btnConfig.language); }}
                            className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1 ${
                              btnConfig.language === 'km'
                                ? 'bg-[#4CAF50] text-white hover:bg-[#2E7D32]'
                                : 'border border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white'
                            }`}
                          >
                            <Download size={13} />
                            {btnConfig.text}
                          </button>
                        )}
                        
                        <button onClick={(e) => { e.stopPropagation(); handleShare(doc); }} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"><Share2 size={13} /></button>
                        
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"><ChevronLeft size={18} /></button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum = totalPages <= 5 ? i + 1 : (page <= 3 ? i + 1 : (page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i));
              return <button key={i} onClick={() => setPage(pageNum)} className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === pageNum ? "bg-[#4CAF50] text-white" : "border border-gray-200 hover:bg-gray-50 text-gray-700"}`}>{pageNum}</button>;
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"><ChevronRight size={18} /></button>
          </div>
        )}
      </Container>

      {/* Document Detail Modal - Updated with conditional download button and stats */}
      {showModal && selectedDocument && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 z-10 py-4 mb-6">
                <div className="flex items-center justify-between">
                  <button onClick={() => setShowModal(false)} className="flex items-center space-x-2 text-gray-500 hover:text-[#2E7D32] transition-colors group">
                    <ChevronRightIcon size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">{t.back}</span>
                  </button>
                  <button onClick={() => handleShare(selectedDocument)} className="p-2 hover:bg-[#4CAF50] hover:bg-opacity-10 rounded-lg"><Share2 size={14} className="text-gray-500" /></button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-56 h-auto min-h-[288px] bg-gray-100 rounded-xl overflow-hidden shadow-lg flex-shrink-0 mx-auto md:mx-0">
                  <img src={getThumbnail(selectedDocument)} alt={currentLang === 'km' ? selectedDocument.titleKh : selectedDocument.titleEn} className="w-full h-full object-cover" onError={(e) => { e.target.src = defaultThumbnail; }} />
                  <div className="absolute top-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-medium">PDF</div>
                </div>
                <div className="flex-1">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${getCategoryColor()}`}>{getCategoryIcon()}{getCategoryDisplayName()}</span>
                  <h2 className="text-2xl font-medium text-gray-900 mt-2 mb-4">{currentLang === 'km' ? selectedDocument.titleKh : selectedDocument.titleEn}</h2>
                </div>
              </div>
              
              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <Calendar size={14} className="text-[#4CAF50] mb-2" />
                  <div className="text-xs text-gray-500">{t.publishedDate}</div>
                  <div className="text-sm font-medium text-gray-900">{formatDate(selectedDocument.publishedDate)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <FileCheck size={14} className="text-[#4CAF50] mb-2" />
                  <div className="text-xs text-gray-500">{t.documentNumber}</div>
                  <div className="text-sm font-medium text-gray-900">{selectedDocument.documentNumber || '-'}</div>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mt-4">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-[#4CAF50]" />
                  <span className="text-sm text-gray-600">
                    {t.views}: {(viewCounts[selectedDocument.id] || 0) + (selectedDocument.views || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Download size={14} className="text-[#4CAF50]" />
                  <span className="text-sm text-gray-600">
                    {t.downloads}: {downloadCounts[selectedDocument.id] || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 size={14} className="text-[#4CAF50]" />
                  <span className="text-sm text-gray-600">
                    {t.shares}: {shareCounts[selectedDocument.id] || 0}
                  </span>
                </div>
              </div>
              
              {/* Download & View Section - Now follows title language rule */}
              <div className="mt-6 bg-purple-50 rounded-lg p-6 border border-purple-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <FileCheck size={20} className="text-purple-600" />
                    <div><h4 className="text-sm font-medium text-gray-900">{currentLang === 'km' ? selectedDocument.titleKh : selectedDocument.titleEn}</h4><p className="text-xs text-gray-500">PDF</p></div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => handleViewPdf(selectedDocument)} className="px-4 py-2 bg-white border border-purple-500 text-purple-600 text-sm rounded-lg hover:bg-purple-500 hover:text-white flex items-center gap-2"><Eye size={14} />{t.viewPdf}</button>
                    
                    {/* Single conditional download button based on title language */}
                    {(() => {
                      const btnConfig = getDownloadButtonConfig(selectedDocument);
                      if (btnConfig.show) {
                        return (
                          <button 
                            onClick={() => handleDownload(selectedDocument, btnConfig.language)}
                            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                              btnConfig.language === 'km'
                                ? 'bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white hover:shadow-lg'
                                : 'border border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white'
                            }`}
                          >
                            <Download size={14} />
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
      )}

      {/* Share Modal */}
      {showShareModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-medium text-gray-900">{t.shareVia}</h3><button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button></div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => handleShareToSocial('facebook')} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg"><Facebook size={14} /><span>Facebook</span></button>
              <button onClick={() => handleShareToSocial('twitter')} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2] text-white rounded-lg"><Twitter size={14} /><span>Twitter</span></button>
              <button onClick={() => handleShareToSocial('linkedin')} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0077B5] text-white rounded-lg"><Linkedin size={14} /><span>LinkedIn</span></button>
              <button onClick={() => handleShareToSocial('telegram')} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#26A5E4] text-white rounded-lg"><MessageCircle size={14} /><span>Telegram</span></button>
            </div>
            <div className="flex items-center gap-2"><input type="text" value={`${window.location.origin}/legal/sub-decree/${selectedDocument.id}`} readOnly className="flex-1 px-3 py-2 border rounded-lg text-sm bg-gray-50" /><button onClick={handleCopyLink} className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32] flex items-center gap-2">{copySuccess ? <Check size={14} /> : <Copy size={14} />}<span>{copySuccess ? t.copied : t.copyLink}</span></button></div>
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @media (min-width: 480px) {
          .xs\\:inline { display: inline; }
          .xs\\:hidden { display: none; }
        }
      `}</style>
    </div>
  );
};

export default SubDecreePage;