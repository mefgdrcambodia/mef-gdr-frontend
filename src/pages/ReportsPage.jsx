import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Search,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Database,
  BarChart,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import Container from '../components/ui/Container.jsx';
import GlobalBanner from '../components/ui/GlobalBanner.jsx';
import RunningText from '../components/ui/RunningText';
import { useLocation, useNavigate } from 'react-router-dom';
import useReports from '../hooks/useReport.js';
import reportService from '../services/api/report.service.js';

const ReportsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("language") || "km";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [yearFilter, setYearFilter] = useState("all");
  const [yearFilterOpen, setYearFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Custom date range
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");
  const [dateFilterOpen, setDateFilterOpen] = useState(false);

  // Refs for dropdown containers to prevent outside-click from closing them prematurely
  const dateDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  const itemsPerPage = 9;

  // Get report type from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const reportType = queryParams.get('type');

  // Use the reports hook
  const {
    reports: apiReports,
    categories,
    pagination: apiPagination,
    loading: apiLoading,
    error: apiError,
    fetchReports,
    fetchReportById,
    changePage,
    changeCategory
  } = useReports(currentPage, itemsPerPage, reportType || '');

  // Load view counts, download counts, and share counts from localStorage
  const loadStats = () => {
    const storedViews = localStorage.getItem('report_views');
    const storedDownloads = localStorage.getItem('report_downloads');
    const storedShares = localStorage.getItem('report_shares');
    return {
      views: storedViews ? JSON.parse(storedViews) : {},
      downloads: storedDownloads ? JSON.parse(storedDownloads) : {},
      shares: storedShares ? JSON.parse(storedShares) : {}
    };
  };

  const saveViewCount = (reportId, views) => {
    const stats = loadStats();
    stats.views[reportId] = views;
    localStorage.setItem('report_views', JSON.stringify(stats.views));
  };

  const saveDownloadCount = (reportId, downloads) => {
    const stats = loadStats();
    stats.downloads[reportId] = downloads;
    localStorage.setItem('report_downloads', JSON.stringify(stats.downloads));
  };

  const saveShareCount = (reportId, shares) => {
    const stats = loadStats();
    stats.shares[reportId] = shares;
    localStorage.setItem('report_shares', JSON.stringify(stats.shares));
  };

  const getViewCount = (reportId) => {
    const stats = loadStats();
    return stats.views[reportId] || Math.floor(Math.random() * 100) + 50;
  };

  const getDownloadCount = (reportId) => {
    const stats = loadStats();
    return stats.downloads[reportId] || Math.floor(Math.random() * 30) + 10;
  };

  const getShareCount = (reportId) => {
    const stats = loadStats();
    return stats.shares[reportId] || Math.floor(Math.random() * 10) + 5;
  };

  const incrementViewCount = (reportId) => {
    const currentViews = getViewCount(reportId);
    const newViews = currentViews + 1;
    saveViewCount(reportId, newViews);
    return newViews;
  };

  const incrementDownloadCount = (reportId) => {
    const currentDownloads = getDownloadCount(reportId);
    const newDownloads = currentDownloads + 1;
    saveDownloadCount(reportId, newDownloads);
    return newDownloads;
  };

  const incrementShareCount = (reportId) => {
    const currentShares = getShareCount(reportId);
    const newShares = currentShares + 1;
    saveShareCount(reportId, newShares);
    return newShares;
  };

  // Transform API reports to component format with stats
  const transformReportsWithStats = useCallback((reports) => {
    if (!reports || !Array.isArray(reports)) return [];

    return reports.map(report => {
      const year = report.publishedDate
        ? new Date(report.publishedDate).getFullYear()
        : new Date().getFullYear();

      return {
        id: report.id,
        titleKh: report.titleKh,
        titleEn: report.titleEn,
        type: report.category,
        typeKh: reportService.getCategoryName(categories, report.category, 'km'),
        typeEn: reportService.getCategoryName(categories, report.category, 'en'),
        date: report.publishedDate || report.createdDate,
        year: year,
        size: report.size || "2.5 MB",
        format: "PDF",
        pages: report.pages || 80,
        summaryKh: report.descriptionKh || report.titleKh,
        summaryEn: report.descriptionEn || report.titleEn,
        fileUrl: reportService.getPdfFile(report, currentLang) || report.pdfFileKh || report.pdfFileEn,
        thumbnail: report.coverImage || report.thumbnail || "https://placehold.co/400x300/4CAF50/white?text=Report",
        views: getViewCount(report.id),
        downloads: getDownloadCount(report.id),
        shares: getShareCount(report.id)
      };
    });
  }, [categories, currentLang]);

  const [reportsData, setReportsData] = useState({ all: [], transformed: [] });

  // Update reports when API data changes
  useEffect(() => {
    if (apiReports && apiReports.length > 0) {
      const transformed = transformReportsWithStats(apiReports);
      setReportsData({ all: apiReports, transformed });
    } else if (!apiLoading && apiReports && apiReports.length === 0) {
      setReportsData({ all: [], transformed: [] });
    }
  }, [apiReports, transformReportsWithStats, apiLoading]);

  // Close dropdowns when clicking outside — ref-aware so date inputs stay usable
  useEffect(() => {
    const handleClickOutside = (e) => {
      const insideDate = dateDropdownRef.current && dateDropdownRef.current.contains(e.target);
      const insideYear = yearDropdownRef.current && yearDropdownRef.current.contains(e.target);
      const insideSort = sortDropdownRef.current && sortDropdownRef.current.contains(e.target);

      if (insideDate || insideYear || insideSort) return;

      setActiveDropdown(null);
      setYearFilterOpen(false);
      setSortOpen(false);
      setDateFilterOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };
    window.addEventListener("languagechange", handleLanguageChange);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showModal || showShareModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showModal, showShareModal]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const translations = {
    km: {
      title: reportType === 'drp' ? "របាយការណ៍ Detailed Resettlement Plan" : reportType === 'ssmr' ? "របាយការណ៍ Social Safeguards Monitoring Report" : "របាយការណ៍",
      subtitle: reportType === 'drp' ? "របាយការណ៍ Detailed Resettlement Plan ទាំងអស់" : reportType === 'ssmr' ? "របាយការណ៍ Social Safeguards Monitoring Report ទាំងអស់" : "របាយការណ៍ SSMR និង DRP",
      search: "ស្វែងរក...",
      sortBy: "តម្រៀប",
      sortLatest: "ថ្មីជាងគេ",
      sortOldest: "ចាស់ជាងគេ",
      sortPopular: "ការមើលច្រើន",
      download: "ទាញយក",
      view: "មើល",
      views: "មើល",
      downloads: "ទាញយក",
      shares: "ចែករំលែក",
      size: "ទំហំ",
      format: "ទម្រង់",
      published: "ចេញផ្សាយ",
      year: "ឆ្នាំ",
      allYears: "ទាំងអស់",
      clearAll: "សម្អាត",
      noReports: "រកមិនឃើញ",
      tryAgain: "សូមស្វែងរកម្តងទៀត",
      totalReports: "របាយការណ៍",
      showing: "បង្ហាញ",
      to: "ដល់",
      ofTotal: "នៃ",
      details: "ព័ត៌មានលម្អិត",
      pages: "ទំព័រ",
      close: "បិទ",
      viewFullReport: "មើលរបាយការណ៍ពេញ",
      customDate: "កំណត់កាលបរិច្ឆេទ",
      startDate: "ថ្ងៃចាប់ផ្តើម",
      endDate: "ថ្ងៃបញ្ចប់",
      apply: "អនុវត្ត",
      clear: "សម្អាត",
      share: "ចែករំលែក",
      shareVia: "ចែករំលែកតាម",
      copyLink: "ចម្លងតំណ",
      copied: "បានចម្លង!",
      back: "ត្រលប់ក្រោយ",
      viewReport: "មើលរបាយការណ៍",
      reportDetails: "ព័ត៌មានលម្អិតរបាយការណ៍",
      loading: "កំពុងផ្ទុក..."
    },
    en: {
      title: reportType === 'drp' ? "Detailed Resettlement Plan Reports" : reportType === 'ssmr' ? "Social Safeguards Monitoring Report Reports" : "Reports",
      subtitle: reportType === 'drp' ? "All Detailed Resettlement Plan Reports" : reportType === 'ssmr' ? "All SSMR Reports" : "SSMR and DRP Reports",
      search: "Search...",
      sortBy: "Sort",
      sortLatest: "Latest",
      sortOldest: "Oldest",
      sortPopular: "Most Viewed",
      download: "Download",
      view: "View",
      views: "views",
      downloads: "downloads",
      shares: "shares",
      size: "Size",
      format: "Format",
      published: "Published",
      year: "Year",
      allYears: "All",
      clearAll: "Clear",
      noReports: "No reports found",
      tryAgain: "Please try again",
      totalReports: "Reports",
      showing: "Showing",
      to: "to",
      ofTotal: "of",
      details: "Details",
      pages: "Pages",
      close: "Close",
      viewFullReport: "View Full Report",
      customDate: "Custom Date",
      startDate: "Start Date",
      endDate: "End Date",
      apply: "Apply",
      clear: "Clear",
      share: "Share",
      shareVia: "Share via",
      copyLink: "Copy Link",
      copied: "Copied!",
      back: "Back",
      viewReport: "View Report",
      reportDetails: "Report Details",
      loading: "Loading..."
    },
  };

  const t = translations[currentLang];

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    let filtered = [...reportsData.transformed];

    if (searchQuery) {
      filtered = filtered.filter(report => {
        const title = currentLang === "km" ? report.titleKh : report.titleEn;
        const summary = currentLang === "km" ? report.summaryKh : report.summaryEn;
        return (
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          summary.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (yearFilter !== "all") {
      filtered = filtered.filter(report => report.year === parseInt(yearFilter));
    }

    if (customDateStart && customDateEnd) {
      const startDate = new Date(customDateStart);
      const endDate = new Date(customDateEnd);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter(report => {
        if (!report.date) return false;
        const reportDate = new Date(report.date);
        return reportDate >= startDate && reportDate <= endDate;
      });
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filtered;
  }, [reportsData.transformed, searchQuery, currentLang, yearFilter, customDateStart, customDateEnd, sortBy]);

  const availableYears = useMemo(() => {
    const years = [...new Set(reportsData.transformed.map(r => r.year).filter(Boolean))];
    return years.sort((a, b) => b - a);
  }, [reportsData.transformed]);

  const totalPages = Math.ceil(filteredAndSortedReports.length / itemsPerPage);
  const paginatedReports = filteredAndSortedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const startItem = filteredAndSortedReports.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, filteredAndSortedReports.length);

  const clearFilters = () => {
    setSearchQuery("");
    setYearFilter("all");
    setSortBy("latest");
    setCustomDateStart("");
    setCustomDateEnd("");
    setCurrentPage(1);
  };

  const clearCustomDate = () => {
    setCustomDateStart("");
    setCustomDateEnd("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    changePage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    if (currentLang === "km") {
      const khmerMonths = [
        "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
        "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
      ];
      return `${date.getDate()} ${khmerMonths[date.getMonth()]} ${date.getFullYear()}`;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      ssmr: "bg-teal-100 text-teal-700 border-teal-200",
      drp: "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getTypeIcon = (type) => {
    const icons = {
      ssmr: <BarChart size={14} />,
      drp: <Database size={14} />,
    };
    return icons[type] || <FileText size={14} />;
  };

  const handleViewReport = (report) => {
    incrementViewCount(report.id);
    if (report.fileUrl) {
      window.open(report.fileUrl, '_blank');
    }
  };

  const handleDownloadReport = (report) => {
    incrementDownloadCount(report.id);
    if (report.fileUrl) {
      const link = document.createElement('a');
      link.href = report.fileUrl;
      link.download = `${currentLang === 'km' ? report.titleKh : report.titleEn}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenModal = async (report) => {
    incrementViewCount(report.id);
    const fullReport = await fetchReportById(report.id);
    if (fullReport) {
      const transformedFull = transformReportsWithStats([fullReport])[0];
      setSelectedReport(transformedFull);
    } else {
      setSelectedReport(report);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleShare = (report) => {
    incrementShareCount(report.id);
    setSelectedReport({ ...report, shares: getShareCount(report.id) + 1 });
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/reports/${selectedReport?.id}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShareToSocial = (platform) => {
    const url = `${window.location.origin}/reports/${selectedReport?.id}`;
    const title = currentLang === "km" ? selectedReport?.titleKh : selectedReport?.titleEn;
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    };
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=500");
    }
  };

  // Unified dropdown toggle — uses mousedown refs so no e.stopPropagation needed
  const handleDropdownToggle = (dropdownName, e) => {
    e.stopPropagation();
    const isOpen = activeDropdown === dropdownName;
    setActiveDropdown(isOpen ? null : dropdownName);
    setSortOpen(isOpen ? false : dropdownName === 'sort');
    setYearFilterOpen(isOpen ? false : dropdownName === 'year');
    setDateFilterOpen(isOpen ? false : dropdownName === 'date');
  };

  // Loading state
  if (apiLoading && reportsData.transformed.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <RunningText />
        <GlobalBanner title={t.title} subtitle={t.subtitle} height="h-[180px] md:h-[250px] lg:h-[300px]" showBreadcrumb={true} />
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
  if (apiError && reportsData.transformed.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <RunningText />
        <GlobalBanner title={t.title} subtitle={t.subtitle} height="h-[180px] md:h-[250px] lg:h-[300px]" showBreadcrumb={true} />
        <Container className="py-12">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText size={28} className="text-red-400" />
            </div>
            <p className="text-red-500 text-sm mb-1">Error loading reports</p>
            <p className="text-gray-400 text-xs">{apiError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32]"
            >
              Try Again
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-2.5 bg-[#2E7D32] text-white rounded-full shadow-lg hover:bg-[#4CAF50] transition-all duration-300 hover:scale-110"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <RunningText />

      <GlobalBanner
        title={t.title}
        subtitle={t.subtitle}
        height="h-[180px] md:h-[250px] lg:h-[300px]"
        showBreadcrumb={true}
      />

      <Container className="py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-3">

              {/* Search Input */}
              <div className="flex-1 min-w-[200px] relative">
                <Search size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50] bg-white text-sm"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={(e) => handleDropdownToggle('sort', e)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span>{t.sortBy}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
                </button>

                {sortOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[140px]">
                    {[
                      { value: "latest", label: t.sortLatest },
                      { value: "oldest", label: t.sortOldest },
                      { value: "popular", label: t.sortPopular }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                          setActiveDropdown(null);
                          setCurrentPage(1);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-sm ${sortBy === option.value ? "text-[#4CAF50] bg-green-50" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Filter Dropdown */}
              {availableYears.length > 0 && (
                <div className="relative" ref={yearDropdownRef}>
                  <button
                    onClick={(e) => handleDropdownToggle('year', e)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Calendar size={14} />
                    <span>{yearFilter !== "all" ? yearFilter : t.year}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${yearFilterOpen ? "rotate-180" : ""}`} />
                  </button>

                  {yearFilterOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[100px]">
                      <button
                        onClick={() => {
                          setYearFilter("all");
                          setYearFilterOpen(false);
                          setActiveDropdown(null);
                          setCurrentPage(1);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-sm ${yearFilter === "all" ? "text-[#4CAF50] bg-green-50" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        {t.allYears}
                      </button>
                      {availableYears.map(year => (
                        <button
                          key={year}
                          onClick={() => {
                            setYearFilter(year.toString());
                            setYearFilterOpen(false);
                            setActiveDropdown(null);
                            setCurrentPage(1);
                          }}
                          className={`w-full px-3 py-1.5 text-left text-sm ${yearFilter === year.toString() ? "text-[#4CAF50] bg-green-50" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Custom Date Range Dropdown */}
              <div className="relative" ref={dateDropdownRef}>
                <button
                  onClick={(e) => handleDropdownToggle('date', e)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Calendar size={14} />
                  <span>
                    {customDateStart && customDateEnd
                      ? `${customDateStart} – ${customDateEnd}`
                      : t.customDate}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dateFilterOpen ? "rotate-180" : ""}`} />
                </button>

                {dateFilterOpen && (
                  <div
                    className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 p-3 z-50 w-72"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t.startDate}
                        </label>
                        <input
                          type="date"
                          value={customDateStart}
                          max={customDateEnd || undefined}
                          onChange={(e) => setCustomDateStart(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t.endDate}
                        </label>
                        <input
                          type="date"
                          value={customDateEnd}
                          min={customDateStart || undefined}
                          onChange={(e) => setCustomDateEnd(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            clearCustomDate();
                            setDateFilterOpen(false);
                            setActiveDropdown(null);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {t.clear}
                        </button>
                        <button
                          onClick={() => {
                            setDateFilterOpen(false);
                            setActiveDropdown(null);
                            setCurrentPage(1);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32] transition-colors"
                        >
                          {t.apply}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Clear All Filters Button */}
              {(searchQuery || yearFilter !== "all" || sortBy !== "latest" || (customDateStart && customDateEnd)) && (
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
            {(searchQuery || yearFilter !== "all" || sortBy !== "latest" || (customDateStart && customDateEnd)) && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-gray-100">
                {sortBy !== "latest" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {sortBy === "oldest" && t.sortOldest}
                    {sortBy === "popular" && t.sortPopular}
                    <button
                      onClick={() => { setSortBy("latest"); setCurrentPage(1); }}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {yearFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {t.year} {yearFilter}
                    <button
                      onClick={() => { setYearFilter("all"); setCurrentPage(1); }}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {customDateStart && customDateEnd && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {customDateStart} – {customDateEnd}
                    <button onClick={clearCustomDate} className="hover:bg-gray-200 rounded-full p-0.5">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                    >
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
          {filteredAndSortedReports.length > 0
            ? `${t.showing} ${startItem}-${endItem} ${t.ofTotal} ${filteredAndSortedReports.length} ${t.totalReports}`
            : t.noReports}
        </div>

        {/* Reports List */}
        {filteredAndSortedReports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-1">{t.noReports}</p>
            <p className="text-gray-400 text-xs">{t.tryAgain}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedReports.map(report => {
              const title = currentLang === "km" ? report.titleKh : report.titleEn;
              const summary = currentLang === "km" ? report.summaryKh : report.summaryEn;
              const typeName = currentLang === "km" ? report.typeKh : report.typeEn;
              return (
                <div
                  key={report.id}
                  className="group bg-white rounded-lg border border-gray-100 hover:shadow-md hover:border-[#4CAF50]/30 transition-all duration-200 overflow-hidden cursor-pointer"
                  onClick={() => handleOpenModal(report)}
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 overflow-hidden rounded-lg">
                      <img
                        src={report.thumbnail}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/150x150/4CAF50/white?text=Report";
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${getTypeColor(report.type)}`}>
                          {getTypeIcon(report.type)}
                          <span className="xs:inline hidden">{typeName}</span>
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium">
                        PDF
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center text-xs text-gray-400 mb-2">
                            <Calendar size={12} className="mr-1" />
                            <span>{formatDate(report.date)}</span>
                            {/* <span className="mx-2">•</span> */}
                            {/* <span>{report.size}</span> */}
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-[#2E7D32] transition-colors">
                            {title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{summary}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                            {/* <span className="flex items-center gap-1">
                              <Eye size={11} />
                              {report.views} {t.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download size={11} />
                              {report.downloads} {t.downloads}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 size={11} />
                              {report.shares} {t.shares}
                            </span> */}
                          </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadReport(report);
                            }}
                            className="px-2.5 py-1 text-xs bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32] transition-all duration-200 flex items-center gap-1"
                          >
                            <Download size={11} />
                            {t.download}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-[#4CAF50] text-white"
                      : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </Container>

      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 z-10 py-3 sm:py-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleCloseModal}
                    className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-[#2E7D32] transition-colors group"
                  >
                    <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">{t.back}</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleShare(selectedReport)}
                      className="p-1.5 sm:p-2 hover:bg-[#4CAF50] hover:bg-opacity-10 rounded-lg transition-colors"
                    >
                      <Share2 size={14} className="text-gray-500 hover:text-[#2E7D32] sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  <div className="relative w-40 sm:w-56 h-auto min-h-[192px] sm:min-h-[288px] bg-gray-100 rounded-xl overflow-hidden shadow-lg flex-shrink-0 mx-auto md:mx-0">
                    <img
                      src={selectedReport.thumbnail}
                      alt={currentLang === 'km' ? selectedReport.titleKh : selectedReport.titleEn}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x500/4CAF50/white?text=Report";
                      }}
                    />
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#4CAF50] text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium">
                      PDF
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${getTypeColor(selectedReport.type)}`}>
                        {getTypeIcon(selectedReport.type)}
                        {currentLang === 'km' ? selectedReport.typeKh : selectedReport.typeEn}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
                      {currentLang === 'km' ? selectedReport.titleKh : selectedReport.titleEn}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                      {currentLang === 'km' ? selectedReport.summaryKh : selectedReport.summaryEn}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {selectedReport.views} {t.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download size={12} />
                        {selectedReport.downloads} {t.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 size={12} />
                        {selectedReport.shares} {t.shares}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <Calendar size={14} className="text-[#4CAF50] mb-1 sm:mb-2 sm:w-4 sm:h-4" />
                    <div className="text-[10px] sm:text-xs text-gray-500">{t.published}</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {formatDate(selectedReport.date)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <FileText size={14} className="text-[#4CAF50] mb-1 sm:mb-2 sm:w-4 sm:h-4" />
                    <div className="text-[10px] sm:text-xs text-gray-500">{t.pages}</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {selectedReport.pages} {t.pages}
                    </div>
                  </div>
                </div>

                {/* Download & View Section */}
                <div className="bg-[#4CAF50] bg-opacity-5 rounded-lg p-4 sm:p-6 border border-[#4CAF50] border-opacity-20">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <FileText size={20} className="text-[#4CAF50] sm:w-6 sm:h-6" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">
                          {currentLang === 'km' ? selectedReport.titleKh : selectedReport.titleEn}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-gray-500">PDF • {selectedReport.size}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleViewReport(selectedReport)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-[#4CAF50] text-[#2E7D32] text-xs sm:text-sm rounded-lg hover:bg-[#4CAF50] hover:text-white transition-all duration-200 flex items-center space-x-1 sm:space-x-2"
                      >
                        <Eye size={12} className="sm:w-4 sm:h-4" />
                        <span>{t.viewReport}</span>
                      </button>
                      <button
                        onClick={() => handleDownloadReport(selectedReport)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white text-xs sm:text-sm rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-1 sm:space-x-2"
                      >
                        <Download size={12} className="sm:w-4 sm:h-4" />
                        <span>{t.download}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedReport && (
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
                <button
                  onClick={() => handleShareToSocial('facebook')}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-[#1877F2] text-white rounded-lg"
                >
                  <Facebook size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Facebook</span>
                </button>
                <button
                  onClick={() => handleShareToSocial('twitter')}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-[#1DA1F2] text-white rounded-lg"
                >
                  <Twitter size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Twitter</span>
                </button>
                <button
                  onClick={() => handleShareToSocial('linkedin')}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-[#0077B5] text-white rounded-lg"
                >
                  <Linkedin size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">LinkedIn</span>
                </button>
                <button
                  onClick={() => handleShareToSocial('telegram')}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-[#26A5E4] text-white rounded-lg"
                >
                  <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Telegram</span>
                </button>
              </div>

              <div className="border-t border-gray-100 pt-3 sm:pt-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/reports/${selectedReport.id}`}
                    readOnly
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32] transition-colors flex items-center space-x-1 sm:space-x-2"
                  >
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
        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportsPage;