// src/pages/FullManagementStructurePage.jsx
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
  Calendar,
  User,
  Eye,
  Clock,
  FileText,
  Printer,
  Download,
} from "lucide-react";
import Container from "../components/ui/Container.jsx";
import GlobalBanner from "../components/ui/GlobalBanner.jsx";
import useManagementStructure from "../hooks/useManagementStructure";

const FullManagementStructurePage = () => {
  const [currentLang, setCurrentLang] = useState("km");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Use the management structure hook
  const { loading, error, data, orgChartImage, isActive } = useManagementStructure();

  useEffect(() => {
    const handleLanguageChange = (e) => setCurrentLang(e.detail.language);
    window.addEventListener("languagechange", handleLanguageChange);
    const savedLang = localStorage.getItem("language");
    if (savedLang) setCurrentLang(savedLang);
    return () =>
      window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 640) setZoomLevel(0.55);
      else if (width < 768) setZoomLevel(0.7);
      else if (width < 1024) setZoomLevel(0.85);
      else setZoomLevel(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get article content based on language
  const articleContent = currentLang === 'km' ? data?.articleKh : data?.articleEn;
  
  // Get metadata
  const createdDate = data?.createdDate;
  const updatedDate = data?.updatedDate;
  const createdBy = data?.createdBy;
  const updatedBy = data?.updatedBy;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === "km" ? "km-KH" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to extract title from article
  const extractTitle = (content) => {
    if (!content) return null;
    const text = content.replace(/<[^>]*>/g, '').trim();
    const lines = text.split('\n').filter(line => line.trim());
    return lines[0] || (currentLang === "km" ? "រចនាសម្ព័ន្ធគ្រប់គ្រង" : "Management Structure");
  };

  // Helper function to get read time
  const getReadTime = (content) => {
    if (!content) return 2;
    const text = content.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, Math.min(minutes, 10));
  };

  const translations = {
    km: {
      title: "រចនាសម្ព័ន្ធគ្រប់គ្រង",
      subtitle: "អគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍",
      back: "ត្រលប់ក្រោយ",
      zoomIn: "ពង្រីក",
      zoomOut: "បង្រួម",
      reset: "កំណត់ឡើងវិញ",
      loading: "កំពុងផ្ទុក...",
      error: "មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យ",
      retry: "សាកល្បងម្តងទៀត",
      publishedOn: "ចេញផ្សាយនៅ",
      lastUpdated: "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ",
      readTime: "ពេលអាន",
      minutes: "នាទី",
      views: "ទស្សនា",
      share: "ចែករំលែក",
      print: "បោះពុម្ព",
      download: "ទាញយក",
      organizationChart: "ផែនទីរចនាសម្ព័ន្ធគ្រប់គ្រង",
    },
    en: {
      title: "Management Structure",
      subtitle: "General Department of Resettlement",
      back: "Back",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      reset: "Reset",
      loading: "Loading...",
      error: "Error loading data",
      retry: "Try Again",
      publishedOn: "Published on",
      lastUpdated: "Last updated",
      readTime: "Read time",
      minutes: "min",
      views: "views",
      share: "Share",
      print: "Print",
      download: "Download",
      organizationChart: "Organization Chart",
    },
  };

  const t = translations[currentLang];

  const handleZoomIn = () => setZoomLevel((p) => Math.min(p + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel((p) => Math.max(p - 0.1, 0.4));
  const handleZoomReset = () => {
    if (windowWidth < 640) setZoomLevel(0.55);
    else if (windowWidth < 768) setZoomLevel(0.7);
    else if (windowWidth < 1024) setZoomLevel(0.85);
    else setZoomLevel(1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t.title,
        text: currentLang === "km" ? "រចនាសម្ព័ន្ធគ្រប់គ្រងនៃអគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់" : "Management Structure of General Department of Resettlement",
        url: window.location.href,
      }).catch(() => {
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  const orgChartImageUrl = orgChartImage(currentLang);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <GlobalBanner
          title={t.title}
          subtitle={t.subtitle}
          height="h-[200px] md:h-[280px] lg:h-[350px]"
          showBreadcrumb={true}
        />
        <Container className="py-20">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">{t.loading}</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Error state
  if (error || !orgChartImageUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <GlobalBanner
          title={t.title}
          subtitle={t.subtitle}
          height="h-[200px] md:h-[280px] lg:h-[350px]"
          showBreadcrumb={true}
        />
        <Container className="py-20">
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.error}</h3>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {t.retry}
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Global Banner */}
      <GlobalBanner
        title={t.title}
        subtitle={t.subtitle}
        height="h-[200px] md:h-[280px] lg:h-[350px]"
        showBreadcrumb={true}
      />

      {/* Organization Chart Section */}
      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-xl font-normal text-gray-900 mb-3">
            {extractTitle(articleContent)}
          </h2>
         
        </div>

          {/* Toolbar - Aligned to Right */}
          <div className="flex items-center justify-end gap-2 mb-6">
            <button
              onClick={handleZoomIn}
              className="p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-green-50 hover:border-[#4CAF50] transition-all duration-200 shadow-sm"
              title={t.zoomIn}
            >
              <ZoomIn size={18} className="text-gray-600" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-green-50 hover:border-[#4CAF50] transition-all duration-200 shadow-sm"
              title={t.zoomOut}
            >
              <ZoomOut size={18} className="text-gray-600" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-green-50 hover:border-[#4CAF50] transition-all duration-200 shadow-sm"
              title={t.reset}
            >
              <Maximize2 size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Organization Chart Image - No click functionality */}
          <div className="overflow-x-auto">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top center",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="flex justify-center">
                <img 
                  src={orgChartImageUrl} 
                  alt={t.title}
                  className="w-full h-auto"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                  onError={(e) => {
                    console.error('Failed to load organization chart image');
                    e.target.src = "https://placehold.co/1200x800/4CAF50/white?text=Organization+Chart";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Zoom Level Indicator */}
          <div className="text-center mt-4">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
        </div>
      </Container>

      <style jsx>{`
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
        
        /* Print Styles */
        @media print {
          button,
          .toolbar,
          .zoom-controls {
            display: none;
          }
          
          .bg-gradient-to-b {
            background: white;
          }
        }
      `}</style>
    </div>
  );
};

export default FullManagementStructurePage;