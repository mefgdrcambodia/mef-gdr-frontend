// src/components/ui/Preloader.jsx
import React, { useState, useEffect } from 'react';
import { useHeader } from '../../hooks/useHeader';
import fallbackLogo from '../../images/logo_white.png';

const Preloader = ({ onLoadComplete, minimumDisplayTime = 1500 }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  
  const { loading, logo } = useHeader('km');
  const logoSrc = logo || fallbackLogo;

  useEffect(() => {
    // Prevent body scroll while preloader is visible
    document.body.style.overflow = 'hidden';

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Check if content is loaded
    const checkLoaded = () => {
      if (!loading) {
        setProgress(100);
        clearInterval(progressInterval);
        
        // Wait minimum display time before hiding
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = '';
            if (onLoadComplete) onLoadComplete();
          }, 500);
        }, minimumDisplayTime);
      }
    };

    // Start checking after a short delay
    const loadCheckInterval = setInterval(checkLoaded, 100);

    // Cleanup
    return () => {
      clearInterval(progressInterval);
      clearInterval(loadCheckInterval);
      document.body.style.overflow = '';
    };
  }, [loading, minimumDisplayTime, onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-[99999] flex items-center justify-center
        bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#4CAF50]
        transition-opacity duration-500
        ${fadeOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated Background Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-4 border-white/10 animate-ping-slow"></div>
          <div className="w-40 h-40 rounded-full border-4 border-white/20 animate-ping-slower"></div>
          <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-pulse"></div>
        </div>

        {/* Logo Container */}
        <div className="relative z-10 mb-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/10 backdrop-blur-md p-4 shadow-2xl animate-float">
            <img 
              src={logoSrc} 
              alt="Logo" 
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = fallbackLogo; }}
            />
          </div>
        </div>

        {/* Loading Text */}
        <div className="relative z-10 text-center">
          <h2 className="text-white text-xl md:text-2xl font-semibold mb-2 tracking-wide">
            <span className="inline-block animate-wave">អ</span>
            <span className="inline-block animate-wave" style={{ animationDelay: '0.1s' }}>គ</span>
            <span className="inline-block animate-wave" style={{ animationDelay: '0.2s' }}>្គ</span>
            <span className="inline-block animate-wave" style={{ animationDelay: '0.3s' }}>ន</span>
            <span className="inline-block animate-wave" style={{ animationDelay: '0.4s' }}>ា</span>
            <span className="inline-block animate-wave" style={{ animationDelay: '0.5s' }}>យ</span>
            <span className="inline-block animate-wave" style={{ animationDelay: '0.6s' }}>ក</span>
            <span className="inline-block animate-wave" style={{ animationDelay: '0.7s' }}>ដ</span>
            <span className="inline-block animate-wave" style={{ animationDelay: '0.8s' }}>្ឋ</span>
            <span className="inline-block animate-wave" style={{ animationDelay: '0.9s' }}>ា</span>
            <span className="inline-block animate-wave" style={{ animationDelay: '1s' }}>ន</span>
          </h2>
          <p className="text-white/70 text-sm uppercase tracking-wider">Loading...</p>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 w-48 md:w-64 h-1 bg-white/20 rounded-full mt-6 overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="relative z-10 mt-2">
          <span className="text-white/60 text-xs font-medium">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }
        
        @keyframes ping-slower {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.15;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes wave {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-8px);
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s ease-in-out infinite;
        }
        
        .animate-ping-slower {
          animation: ping-slower 4s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Preloader;