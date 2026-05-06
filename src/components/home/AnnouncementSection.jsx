// src/components/home/AnnouncementSection.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Bell, 
  ChevronRight, 
  Calendar, 
  Download, 
  ExternalLink, 
  X, 
  Eye, 
  Sparkles, 
  TrendingUp, 
  Share2,
  Clock,
  AlertCircle
} from 'lucide-react';
import defaultImg from '../../images/defuat_img.jpg';

const AnnouncementSection = () => {
  const [currentLang, setCurrentLang] = useState('km');
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

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

  if (!isVisible) return null;

  const announcements = {
    km: {
      title: 'សេចក្តីជូនដំណឹង',
      badge: 'ថ្មី',
      date: '១២ មីនា ២០២៦',
      time: '១១:៣៧',
      description: 'ការកែសម្រួលពន្ធធានារ៉ាប់រងឆ្នាំ២០២៦',
      download: 'ទាញយក',
      view: 'មើល',
      share: 'ចែករំលែក',
      views: '២.៥ក',
      expires: '៥ ថ្ងៃ',
      tags: ['ពន្ធ', 'ធានារ៉ាប់រង', '២០២៦'],
      details: 'ព័ត៌មានលម្អិត'
    },
    en: {
      title: 'Announcement',
      badge: 'NEW',
      date: '12 Mar 2026',
      time: '11:37',
      description: 'Insurance tax adjustment for 2026',
      download: 'Download',
      view: 'View',
      share: 'Share',
      views: '2.5k',
      expires: '5 days',
      tags: ['tax', 'insurance', '2026'],
      details: 'Details'
    }
  };

  const t = announcements[currentLang];

  return (
    <div className="relative group">
      {/* Main Card */}
      <div 
        className="relative bg-white rounded-xl border border-[#4CAF50] border-opacity-20 hover:border-[#4CAF50] hover:shadow-lg transition-all duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden bg-gray-100">
          <img 
            src={defaultImg} 
            alt="Announcement"
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Close Button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 p-1.5 bg-white/10 backdrop-blur-sm hover:bg-[#4CAF50] hover:bg-opacity-30 text-white rounded-lg transition-all duration-300 z-20 border border-white/20"
          >
            <X size={14} />
          </button>

          {/* Badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className="px-2.5 py-1 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white text-xs font-medium rounded-md flex items-center space-x-1 shadow-md">
              <Sparkles size={12} className="text-white/90" />
              <span>{t.badge}</span>
            </span>
          </div>

          {/* Date and Views */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
            <div className="flex items-center space-x-1.5 text-white/90 text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
              <Calendar size={12} />
              <span>{t.date}</span>
            </div>
            
            <div className="flex items-center space-x-1.5 text-white/90 text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
              <Eye size={12} />
              <span>{t.views}</span>
            </div>
          </div>

          {/* Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50]"></div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start space-x-3 mb-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="p-2 bg-[#4CAF50] bg-opacity-10 rounded-lg border border-[#4CAF50] border-opacity-20">
                <FileText size={16} className="text-[#2E7D32]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {t.title}
                </h3>
                <span className="flex-shrink-0 ml-2 px-2 py-0.5 bg-[#4CAF50] bg-opacity-10 text-[#2E7D32] text-[10px] rounded-md">
                  {t.time}
                </span>
              </div>
              
              {/* Expiry */}
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock size={10} className="mr-1 text-[#4CAF50]" />
                  {t.expires}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            {t.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {t.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-[#4CAF50] bg-opacity-10 text-[#2E7D32] text-[10px] rounded-md border border-[#4CAF50] border-opacity-20"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            
              
              {/* View Button */}
              <button className="group/btn flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#4CAF50] text-[#2E7D32] text-xs rounded-lg hover:bg-[#4CAF50] hover:text-white hover:border-[#4CAF50] transition-all duration-300">
                <ExternalLink size={12} className="group-hover/btn:rotate-12 transition-transform" />
                <span>{t.view}</span>
              </button>
              
              
            </div>

            {/* Details Link */}
            <button className="flex items-center space-x-1 text-xs text-[#4CAF50] hover:text-[#2E7D32] transition-colors group/link">
              <span>{t.details}</span>
              <ChevronRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
            </button>
          </div>

          
        </div>

       
      </div>
    </div>
  );
};

export default AnnouncementSection;