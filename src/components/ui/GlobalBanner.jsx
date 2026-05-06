// src/components/ui/GlobalBanner.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { useHeader } from "../../hooks/useHeader";
import useWebsiteBanner from "../../hooks/useWebsiteBanner";
import fallbackBanner from "../../images/Banner-1.jpg";

const GlobalBanner = ({
  title,
  subtitle,
  breadcrumbs = [],
  showBreadcrumb = true,
  height = "h-[200px] md:h-[300px] lg:h-[400px]",
  overlayOpacity = "from-black/70 via-black/50 to-transparent",
}) => {
  const [currentLang, setCurrentLang] = useState("km");
  const location = useLocation();

  // Use header hook to get header banner (as fallback)
  const { loading: headerLoading, banner: headerBanner } = useHeader(currentLang);
  
  // Use website banner hook for dynamic page banners
  const { loading: bannerLoading, getBannerByPath, isActive } = useWebsiteBanner();

  const [bannerUrl, setBannerUrl] = useState(fallbackBanner);

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

  // Get banner based on current path
  useEffect(() => {
    const getBanner = () => {
      const path = location.pathname;
      
      // Try to get specific banner from website banners API
      const specificBanner = getBannerByPath(path, currentLang);
      
      if (specificBanner && specificBanner.trim() !== '') {
        setBannerUrl(specificBanner);
      } else if (headerBanner && headerBanner.trim() !== '') {
        // Fallback to header banner
        setBannerUrl(headerBanner);
      } else {
        // Final fallback
        setBannerUrl(fallbackBanner);
      }
    };
    
    getBanner();
  }, [location.pathname, getBannerByPath, headerBanner, currentLang]);

  const translations = {
    km: {
      home: "ទំព័រដើម",
      about: "អំពីអគ្គនាយកដ្ឋាន",
      management: "រចនាសម្ព័ន្ធនៃការគ្រប់គ្រង",
      roles: "តួនាទី និងភារកិច្ច",
      directorMessage: "សារអគ្គនាយក",
      speech: "សុន្ទរកថា",
      visionMission: "ចក្ខុវិស័យ និងបេសកកម្ម",
      history: "ប្រវត្តិនៃការបង្កើត",
      leadership: "ភាពជាអ្នកដឹកនាំ",
      news: "ព័ត៌មាន",
      photos: "កម្រងរូបភាព",
      videos: "កម្រងវីដេអូ",
      reports: "របាយការណ៍",
      annual: "របាយការណ៍ប្រចាំឆ្នាំ",
      quarterly: "របាយការណ៍ប្រចាំត្រីមាស",
      statistics: "របាយការណ៍ស្ថិតិ",
      activities: "របាយការណ៍សកម្មភាព",
      legal: "បណ្តុំឯកសារ",
      law: "ច្បាប់",
      subDecree: "អនុក្រឹត្យ",
      circular: "សារាចរ",
      declaration: "ប្រកាស",
      contact: "ទំនាក់ទំនង",
      ssmr: "របាយការណ៍ SSMR",
      drp: "របាយការណ៍ DRP",
    },
    en: {
      home: "Home",
      about: "About Department",
      management: "Management Structure",
      roles: "Roles & Responsibilities",
      directorMessage: "Director's Message",
      speech: "Speech",
      visionMission: "Vision & Mission",
      history: "History",
      leadership: "Leadership",
      news: "News",
      photos: "Photo Gallery",
      videos: "Video Gallery",
      reports: "Reports",
      annual: "Annual Report",
      quarterly: "Quarterly Report",
      statistics: "Statistics Report",
      activities: "Activity Report",
      legal: "Document Collection",
      law: "Law",
      subDecree: "Sub-Decree",
      circular: "Circular",
      declaration: "Declaration",
      contact: "Contact",
      ssmr: "SSMR Report",
      drp: "DRP Report",
    },
  };

  const t = translations[currentLang];
  const isLoading = headerLoading || bannerLoading;

  // Generate breadcrumbs from location based on app routes
  const generateBreadcrumbs = () => {
    if (breadcrumbs.length > 0) return breadcrumbs;

    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbItems = [];

    // Define path to label mapping
    const getPathLabel = (path, isLast = false) => {
      const pathMap = {
        // About section
        about: t.about,
        management: t.management,
        roles: t.roles,
        "director-message": t.directorMessage,
        speech: t.speech,
        "vision-mission": t.visionMission,
        history: t.history,
        
        // Leadership
        leadership: t.leadership,
        
        // News section
        news: t.news,
        photos: t.photos,
        videos: t.videos,
        
        // Reports section
        reports: t.reports,
        annual: t.annual,
        quarterly: t.quarterly,
        statistics: t.statistics,
        activities: t.activities,
        ssmr: t.ssmr,
        drp: t.drp,
        
        // Legal section
        legal: t.legal,
        law: t.law,
        "sub-decree": t.subDecree,
        circular: t.circular,
        declaration: t.declaration,
        
        // Contact
        contact: t.contact,
      };
      
      return pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    };

    pathnames.forEach((path, index) => {
      const isLast = index === pathnames.length - 1;
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
      
      breadcrumbItems.push({
        label: getPathLabel(path, isLast),
        to,
        isLast,
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {!isLoading && (
          <img
            src={bannerUrl}
            alt={title || "Banner"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = fallbackBanner;
            }}
          />
        )}
        {/* Overlay for better text readability */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${overlayOpacity}`}
        ></div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
        </div>
      )}

      {/* Breadcrumb */}
      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <div className="absolute top-4 left-0 right-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                to="/"
                className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors group"
              >
                <Home size={14} />
                <span>{t.home}</span>
              </Link>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  <ChevronRight size={12} className="text-white/50" />
                  {item.isLast ? (
                    <span className="text-white font-medium">{item.label}</span>
                  ) : (
                    <Link
                      to={item.to}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            {title && (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {title}
              </h1>
            )}

            {/* Subtitle - Uncommented to allow subtitle display */}
            {/* {subtitle && (
              <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
                {subtitle}
              </p>
            )} */}

            {/* Optional decorative line */}
            {(title || subtitle) && (
              <div className="w-20 h-1 bg-[#4CAF50] mx-auto mt-6 rounded-full"></div>
            )}
          </div>
        </div>
      </div>

      {/* Optional: Add a subtle overlay to separate from nav */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-30"></div>
    </div>
  );
};
 
export default GlobalBanner;