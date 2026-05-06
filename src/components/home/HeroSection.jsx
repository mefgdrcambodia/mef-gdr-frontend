// src/components/home/HeroSection.jsx
import React, { useState, useEffect } from "react";
import { useHeader } from "../../hooks/useHeader";

const HeroSection = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("language") || "km";
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannersList, setBannersList] = useState([]);

  // Use header hook to get banners array
  const { loading, banners } = useHeader(currentLang);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  // Use banners directly from API (already an array of URLs)
  useEffect(() => {
    if (banners && Array.isArray(banners) && banners.length > 0) {
      // Filter out any empty or invalid URLs
      const validBanners = banners.filter(b => b && b.trim() !== '');
      
      if (validBanners.length > 0) {
        // If we want exactly 5 slides, repeat the banners if needed
        if (validBanners.length >= 5) {
          // Use first 5 banners
          setBannersList(validBanners.slice(0, 5));
        } else {
          // Repeat banners to make at least 5 slides
          const slideshowBanners = [];
          for (let i = 0; i < 5; i++) {
            const bannerIndex = i % validBanners.length;
            slideshowBanners.push(validBanners[bannerIndex]);
          }
          setBannersList(slideshowBanners);
        }
      } else {
        setBannersList([]);
      }
    } else {
      setBannersList([]);
    }
  }, [banners]);

  // Auto-slide functionality
  useEffect(() => {
    if (bannersList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannersList.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [bannersList.length]);

  // Navigation functions
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannersList.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannersList.length) % bannersList.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Don't render if no banners
  if (bannersList.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="relative w-full h-[200px] md:h-[300px] lg:h-[500px] overflow-hidden group">
      {/* Background Image with fade transition */}
      <div className="absolute inset-0 w-full h-full">
        {!loading && bannersList.length > 0 && (
          <div className="relative w-full h-full">
            {bannersList.map((bannerUrl, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={bannerUrl}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.error(`Failed to load banner: ${bannerUrl}`);
                  }}
                />
              </div>
            ))}
          </div>
        )}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}

      {/* Navigation Arrows - Only show if more than 1 slide */}
      {bannersList.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if more than 1 slide */}
      {bannersList.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {bannersList.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Optional: Add a subtle overlay to separate from nav */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-30"></div>
    </div>
  );
};

export default HeroSection;