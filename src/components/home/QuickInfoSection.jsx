// src/components/home/QuickInfoSection.jsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Radio, 
  Heart, 
  ChevronRight, 
  Calendar,
  Play,
  Eye,
  Clock,
  Sparkles,
  TrendingUp,
  FileText,
  Headphones,
  Users
} from 'lucide-react';

const QuickInfoSection = () => {
  const [currentLang, setCurrentLang] = useState('km');
  const [activeIndex, setActiveIndex] = useState(null);

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

  const translations = {
    km: {
      knowledge: 'ការចែករំលែកចំណេះដឹង',
      education: 'ការផ្សព្វផ្សាយអប់រំ',
      social: 'កម្មវិធីសង្គម',
      viewMore: 'មើលបន្ថែម',
      watch: 'មើលវីដេអូ',
      new: 'ថ្មី',
      popular: 'ពេញនិយម',
      listen: 'ស្តាប់',
      read: 'អាន'
    },
    en: {
      knowledge: 'Knowledge Sharing',
      education: 'Educational Broadcast',
      social: 'Social Programs',
      viewMore: 'View More',
      watch: 'Watch Video',
      new: 'New',
      popular: 'Popular',
      listen: 'Listen',
      read: 'Read'
    }
  };

  const t = translations[currentLang];

  const items = [
    {
      id: 1,
      type: 'knowledge',
      icon: <BookOpen size={18} />,
      title: t.knowledge,
      content: currentLang === 'km' 
        ? 'ការធានារ៉ាប់រងសុខភាព និងហិរញ្ញវត្ថុគ្រួសារ'
        : 'Health Insurance and Household Finance',
      date: '12 Mar 2026',
      stats: '2.5k',
      badge: 'new',
      secondaryAction: 'read'
    },
    {
      id: 2,
      type: 'education',
      icon: <Radio size={18} />,
      title: t.education,
      content: currentLang === 'km'
        ? 'អត្ថប្រយោជន៍នៃការមានធានារ៉ាប់រងយានយន្ត'
        : 'Benefits of Vehicle Insurance',
      date: '15 Feb 2023',
      stats: '1.2k',
      duration: '15:30',
      badge: 'popular',
      secondaryAction: 'listen'
    },
    {
      id: 3,
      type: 'social',
      icon: <Heart size={18} />,
      title: t.social,
      content: currentLang === 'km'
        ? 'ប្រគល់ជំនួយមនុស្សធម៌ជូនកងទ័ពជួរមុខ'
        : 'Humanitarian donation to frontline soldiers',
      date: '8 Aug 2025',
      stats: '850',
      participants: 120,
      secondaryAction: 'read'
    }
  ];

  const getBadgeIcon = (badge) => {
    if (badge === 'new') return <Sparkles size={10} className="mr-1" />;
    if (badge === 'popular') return <TrendingUp size={10} className="mr-1" />;
    return null;
  };

  const getSecondaryIcon = (action) => {
    if (action === 'listen') return <Headphones size={12} />;
    if (action === 'read') return <FileText size={12} />;
    return null;
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="group relative"
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {/* Main Card */}
          <div className={`
            relative bg-white
            rounded-2xl overflow-hidden 
            border border-[#4CAF50] border-opacity-20
            hover:border-[#4CAF50]
            transition-all duration-300
            hover:shadow-lg hover:shadow-[#4CAF50]/10
          `}>
            {/* Content Container */}
            <div className="relative p-5">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Icon Container */}
                  <div className={`
                    flex items-center justify-center
                    w-12 h-12 rounded-xl
                    bg-[#4CAF50] bg-opacity-10
                    border border-[#4CAF50] border-opacity-20
                    group-hover:border-[#4CAF50] group-hover:bg-[#4CAF50] group-hover:bg-opacity-20
                    transition-all duration-300
                  `}>
                    <div className="text-[#2E7D32] group-hover:text-[#2E7D32] transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#2E7D32] transition-colors">
                      {item.title}
                    </h3>
                    
                    {/* Badge and Stats Row */}
                    <div className="flex items-center space-x-3 mt-1.5">
                      {item.badge && (
                        <span className={`
                          inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium
                          bg-[#4CAF50] bg-opacity-10 text-[#2E7D32]
                          border border-[#4CAF50] border-opacity-20
                        `}>
                          {getBadgeIcon(item.badge)}
                          {item.badge === 'new' ? t.new : t.popular}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-500 flex items-center">
                        <Eye size={11} className="mr-1 text-[#4CAF50]" />
                        {item.stats} views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Indicator */}
                <button className={`
                  w-8 h-8 rounded-lg
                  bg-[#4CAF50] bg-opacity-10 border border-[#4CAF50] border-opacity-20
                  flex items-center justify-center
                  hover:bg-[#4CAF50] hover:bg-opacity-20 hover:border-[#4CAF50]
                  transition-all duration-300 group/quick
                `}>
                  <ChevronRight size={16} className="text-[#2E7D32] group-hover/quick:text-[#2E7D32] group-hover/quick:translate-x-0.5 transition-all" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.content}
                </p>
              </div>

              {/* Meta Information Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex items-center space-x-1.5 px-2 py-1.5 bg-[#4CAF50] bg-opacity-5 rounded-lg border border-[#4CAF50] border-opacity-10">
                  <Calendar size={12} className="text-[#4CAF50]" />
                  <span className="text-[11px] text-gray-600">{item.date}</span>
                </div>
                
                {item.duration && (
                  <div className="flex items-center space-x-1.5 px-2 py-1.5 bg-[#4CAF50] bg-opacity-5 rounded-lg border border-[#4CAF50] border-opacity-10">
                    <Clock size={12} className="text-[#4CAF50]" />
                    <span className="text-[11px] text-gray-600">{item.duration}</span>
                  </div>
                )}

                {item.participants && (
                  <div className="flex items-center space-x-1.5 px-2 py-1.5 bg-[#4CAF50] bg-opacity-5 rounded-lg border border-[#4CAF50] border-opacity-10">
                    <Users size={12} className="text-[#4CAF50]" />
                    <span className="text-[11px] text-gray-600">{item.participants}</span>
                  </div>
                )}

                {/* Show stats as fallback if no other meta */}
                {!item.duration && !item.participants && (
                  <div className="flex items-center space-x-1.5 px-2 py-1.5 bg-[#4CAF50] bg-opacity-5 rounded-lg border border-[#4CAF50] border-opacity-10">
                    <Eye size={12} className="text-[#4CAF50]" />
                    <span className="text-[11px] text-gray-600">{item.stats}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Primary Action Button - Watch Video only */}
                  {item.type === 'education' && (
                    <button className={`
                      relative overflow-hidden group/btn
                      px-4 py-2 rounded-lg
                      bg-gradient-to-r from-[#2E7D32] to-[#4CAF50]
                      hover:shadow-md
                      transition-all duration-300
                      shadow-sm
                    `}>
                      <span className="relative z-10 flex items-center space-x-2 text-xs font-medium text-white">
                        <Play size={12} />
                        <span>{t.watch}</span>
                      </span>
                    </button>
                  )}
                  
                  {/* Secondary Action Button */}
                  <button className={`
                    px-3 py-2 rounded-lg
                    bg-white border border-[#4CAF50]
                    hover:bg-[#4CAF50] hover:text-white
                    transition-all duration-300
                    flex items-center space-x-2
                  `}>
                    {getSecondaryIcon(item.secondaryAction)}
                    <span className="text-xs text-[#2E7D32] group-hover:text-white">
                      {item.secondaryAction === 'listen' ? t.listen : t.read}
                    </span>
                  </button>
                </div>

                {/* View More Link */}
                <button className="flex items-center space-x-1 text-xs text-[#4CAF50] hover:text-[#2E7D32] transition-colors group/link">
                  <span>{t.viewMore}</span>
                  <ChevronRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
              <div className={`
                h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50]
                transition-all duration-500 ease-out
                ${activeIndex === index ? 'w-full' : 'w-0'}
              `} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickInfoSection;