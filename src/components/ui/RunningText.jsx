// src/components/ui/RunningText.jsx
import React, { useState, useEffect } from "react";
import { useHeader } from "../../hooks/useHeader";
import fallbackLogo from "../../images/logo_white.png";

const RunningText = ({
  position = "sticky",
  topOffset = "72px",
  mobileTopOffset = "72px",
  desktopTopOffset = "140px",
  zIndex = 40,
  showLogo = true,
  logoSize = "24px",
  speed = "normal",
  className = "",
}) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("language") || "km";
  });

  const { loading, runningTexts, logo } = useHeader(currentLang);



  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  const speedMap = {
    slow: "80s",
    normal: "50s",
    fast: "30s",
  };

  const animationDuration = speedMap[speed] || speedMap.normal;
  const logoSrc = logo || fallbackLogo;

  const LogoIcon = () => {
    if (!showLogo) return null;
    
    return (
      <img
        src={logoSrc}
        alt="Logo"
        style={{
          height: logoSize,
          width: logoSize,
          objectFit: "contain",
          display: "inline",
          marginRight: "8px",
          verticalAlign: "middle",
          filter: "brightness(0) invert(1)", // This ensures the logo stays white
        }}
        onError={(e) => {
          e.target.src = fallbackLogo;
        }}
      />
    );
  };

  // Don't render if no running texts and not loading
  if (!loading && (!runningTexts || runningTexts.length === 0)) {
    console.log('RunningText - Not rendering (no texts)');
    return null;
  }

  return (
    <>
      <div
        className={`
          running-text-bar
          ${position}
          w-full
          z-${zIndex}
          overflow-hidden
          bg-gradient-to-r from-[#2E7D32]/80 to-[#4CAF50]/80
          backdrop-blur-sm
          shadow-lg
          border-b border-green-700/30
          ${className}
        `}
        style={{
          top: position === "sticky" ? topOffset : undefined,
        }}
      >
        <div className="overflow-hidden">
          <div 
            className="animate-marquee whitespace-nowrap py-2 md:py-3"
            style={{ animationDuration }}
          >
            {/* Loading state */}
            {loading && (
              <div className="inline-flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="inline-flex items-center mx-6">
                    <div className="w-5 h-5 bg-white/20 rounded-full mr-2 animate-pulse"></div>
                    <div className="h-4 w-48 md:w-64 bg-white/20 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            )}

            {/* First set */}
            {!loading && runningTexts && runningTexts.length > 0 && (
              runningTexts.map((text, index) => (
                <span
                  key={index}
                  className="inline-flex items-center text-white text-xs md:text-sm lg:text-base font-medium mx-6"
                >
                  <LogoIcon />
                  <span className="whitespace-nowrap">{text}</span>
                </span>
              ))
            )}

            {/* Second set for seamless loop */}
            {!loading && runningTexts && runningTexts.length > 0 && (
              runningTexts.map((text, index) => (
                <span
                  key={`dup-${index}`}
                  className="inline-flex items-center text-white text-xs md:text-sm lg:text-base font-medium mx-6"
                >
                  <LogoIcon />
                  <span className="whitespace-nowrap">{text}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee linear infinite;
          display: inline-block;
          width: fit-content;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .running-text-bar {
            top: ${mobileTopOffset} !important;
          }
        }

        @media (min-width: 769px) {
          .running-text-bar {
            top: ${desktopTopOffset} !important;
          }
        }
      `}</style>
    </>
  );
};

export default RunningText;