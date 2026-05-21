// src/components/home/HeroSection.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useHeader } from "../../hooks/useHeader";

const HeroSection = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("language") || "km";
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  // Get banners from hook
  const { loading, banners } = useHeader(currentLang);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener("languagechange", handleLanguageChange);

    return () => {
      window.removeEventListener(
        "languagechange",
        handleLanguageChange
      );
    };
  }, []);

  // Create stable banners list
  const bannersList = useMemo(() => {
    if (!Array.isArray(banners) || banners.length === 0) {
      return [];
    }

    // Remove invalid URLs
    const validBanners = banners.filter(
      (banner) =>
        typeof banner === "string" &&
        banner.trim() !== ""
    );

    if (validBanners.length === 0) {
      return [];
    }

    // If already enough banners
    if (validBanners.length >= 5) {
      return validBanners.slice(0, 5);
    }

    // Repeat banners until 5 items
    return Array.from(
      { length: 5 },
      (_, index) =>
        validBanners[index % validBanners.length]
    );
  }, [banners]);

  // Auto slide
  useEffect(() => {
    if (bannersList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % bannersList.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [bannersList.length]);

  // Navigation
  const goToNextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % bannersList.length
    );
  };

  const goToPrevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + bannersList.length) %
        bannersList.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Hide component if no banners
  if (!loading && bannersList.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[200px] md:h-[300px] lg:h-[500px] overflow-hidden group">
      {/* Banner Images */}
      <div className="absolute inset-0 w-full h-full">
        {!loading && bannersList.length > 0 && (
          <div className="relative w-full h-full">
            {bannersList.map((bannerUrl, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <img
                  src={bannerUrl}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";

                    console.error(
                      `Failed to load banner: ${bannerUrl}`
                    );
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}

      {/* Navigation */}
      {bannersList.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          >
            ‹
          </button>

          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
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
            />
          ))}
        </div>
      )}

      {/* Top Overlay */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-30"></div>
    </div>
  );
};

export default HeroSection;