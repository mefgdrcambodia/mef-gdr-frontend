// src/pages/DirectorMessagePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Quote } from "lucide-react";
import Container from "../components/ui/Container.jsx";
import GlobalBanner from "../components/ui/GlobalBanner.jsx";
import RunningText from "../components/ui/RunningText";
import { useMessage } from "../hooks/useEvent";
import directorFallbackImage from "../images/director.jpg";

const DirectorMessagePage = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("language") || "km";
  });

  // Fetch message data from API
  const { loading, data, error } = useMessage();

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  // Get dynamic content based on language
  const getDirectorName = () => {
    if (loading || !data) return currentLang === "km" ? "ឯកឧត្តម អ៊ឹម សិទ្ធីរ៉ា" : "H.E. Im Sitthyra";
    return currentLang === "km" ? data.nameKh : data.nameEn;
  };

  const getDirectorTitle = () => {
    if (loading || !data) {
      return currentLang === "km" 
        ? "ប្រតិភូរាជរដ្ឋាភិបាលទទួលបន្ទុកជាអគ្គនាយក នៃអគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍"
        : "Director General of the General Department of Project Impact Resolution";
    }
    return currentLang === "km" ? data.jobTitleKh : data.jobTitleEn;
  };

  const getMessage = () => {
    if (loading || !data) return "";
    return currentLang === "km" ? data.messageKh : data.messageEn;
  };

  const getProfileImage = () => {
    if (loading || !data || !data.profileImage) return directorFallbackImage;
    return data.profileImage;
  };

  const translations = {
    km: {
      title: "សារពីឯកឧត្តម អគ្គនាយក",
      subtitle: "សារស្វាគមន៍ និងការប្តេជ្ញាចិត្តពីថ្នាក់ដឹកនាំអគ្គនាយកដ្ឋាន",
      quote: "អគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍",
    },
    en: {
      title: "Message from the Director General",
      subtitle: "Welcome message and commitment from the General Department's leadership",
      quote: "General Department of Resettlement",
    },
  };

  const t = translations[currentLang];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <RunningText />
        <GlobalBanner
          title={t.title}
          subtitle={t.subtitle}
          height="h-[200px] md:h-[280px] lg:h-[350px]"
          showBreadcrumb={true}
        />
        <Container className="pb-16">
          <div style={{ marginTop: "80px" }} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
                <div className="relative mb-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 animate-pulse"></div>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-xl p-6 mb-8">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Running Text Component */}
      <RunningText />

      {/* Global Banner */}
      <GlobalBanner
        title={t.title}
        subtitle={t.subtitle}
        height="h-[200px] md:h-[280px] lg:h-[350px]"
        showBreadcrumb={true}
      />

      {/* Main Content */}
      <Container className="pb-16">
        <div style={{ marginTop: "80px" }} className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Director Info */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
              {/* Director Image */}
              <div className="relative mb-4">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] overflow-hidden border-4 border-[#4CAF50]">
                  <img
                    src={getProfileImage()}
                    alt={getDirectorName()}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = directorFallbackImage;
                    }}
                  />
                </div>
                <div className="absolute bottom-0 right-1/2 transform translate-x-16 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white p-1.5 rounded-full">
                  <Shield size={14} />
                </div>
              </div>

              {/* Director Name & Title */}
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {getDirectorName()}
                </h2>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {getDirectorTitle()}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Message Content */}
          <div className="md:col-span-2">
            {/* Quote Banner */}
            <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-xl p-6 mb-8 relative">
              <Quote
                size={24}
                className="text-[#4CAF50] absolute top-4 left-4 opacity-50"
              />
              <p className="text-sm text-gray-700 italic leading-relaxed pl-10">
                "{t.quote}"
              </p>
            </div>

            {/* Message Content - Rendered as HTML */}
            {getMessage() && (
              <div 
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: getMessage() }}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DirectorMessagePage;