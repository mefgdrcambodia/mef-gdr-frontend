// src/components/shared/LanguageSwitcher.jsx
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const LanguageSwitcher = ({ variant = 'topbar', className = '' }) => {
  const [currentLang, setCurrentLang] = useState('km');

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'km' || savedLang === 'en')) {
      setCurrentLang(savedLang);
      document.documentElement.lang = savedLang === 'km' ? 'km' : 'en';
    }
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang === 'km' ? 'km' : 'en';
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
  };

  // Flag images from online URLs
  const flags = {
    km: 'https://flagcdn.com/w40/kh.png',
    en: 'https://flagcdn.com/w40/gb.png'
  };

  const languages = [
    { code: 'km', name: 'ភាសាខ្មែរ', short: 'ខ្មែរ', flag: flags.km },
    { code: 'en', name: 'English', short: 'ENG', flag: flags.en }
  ];

  // Mobile variant (for mobile menu)
  if (variant === 'mobile') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 flex-1 justify-center ${
              currentLang === lang.code
                ? 'bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#4CAF50] hover:shadow-sm'
            }`}
          >
            <img 
              src={lang.flag} 
              alt={lang.name}
              className="w-5 h-5 object-cover rounded-sm"
            />
            <span className="text-sm font-medium">{lang.name}</span>
            {currentLang === lang.code && (
              <Check size={14} className="ml-1" />
            )}
          </button>
        ))}
      </div>
    );
  }

  // Top bar variant (only used in header top bar)
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all duration-300 ${
            currentLang === lang.code
              ? 'bg-white/20 text-white shadow-inner'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <img 
            src={lang.flag} 
            alt={lang.name}
            className="w-4 h-4 object-cover rounded-sm"
          />
          <span className="text-xs font-medium">{lang.short}</span>
          {currentLang === lang.code && (
            <Check size={12} className="ml-1 animate-fadeIn" />
          )}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;