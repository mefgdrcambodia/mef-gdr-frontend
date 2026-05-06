// src/components/layout/Navigation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronDown, Home, Globe, ChevronRight, 
  Info, Users, Building2, FileText, Shield,
  Mail, Menu, BarChart3, BookOpen, FileCheck, ScrollText, Megaphone,
  FolderOpen, FolderTree, File, Library, Book, Scale, FileSignature,
  Mic, Briefcase, UserCheck, Calendar, Image, Video, 
  FileBadge, FileJson, FileSpreadsheet, FileCode, 
  ChartBar, PieChart, TrendingUp, ClipboardList,
  Building, Target, Heart, MessageCircle, Languages
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo.jsx';
import { useHeader } from '../../hooks/useHeader';
import { useFooterEmail } from '../../hooks/useFooterEmail';
import LanguageSwitcher from '../shared/LanguageSwitcher.jsx';

const Navigation = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeNestedDropdown, setActiveNestedDropdown] = useState(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState({});
  const [mobileNestedOpen, setMobileNestedOpen] = useState({});
  const [currentLang, setCurrentLang] = useState('km');
  
  // Refs for dropdowns to detect clicks outside
  const dropdownRefs = useRef({});
  const nestedTimeoutRef = useRef(null);

  // Fetch header data for title and logo
  const { 
    loading: headerLoading, 
    orgNameFull, 
    orgNameShort, 
    logo 
  } = useHeader(currentLang);

  // Fetch email from footer
  const { email: footerEmail, loading: emailLoading } = useFooterEmail();
  
  const hasValidEmail = footerEmail && footerEmail.trim() !== '' && footerEmail !== '...';

  // Menu items configuration
  const menuItems = [
    { 
      id: 'home',
      label: 'ទំព័រដើម', 
      labelEn: 'HOME',
      path: '/',
      icon: Home,
      dropdown: false
    },
    { 
      id: 'about',
      label: 'អំពីអគ្គនាយកដ្ឋាន', 
      labelEn: 'ABOUT GENERAL DEPARTMENT',
      path: '/about',
      icon: Info,
      dropdown: true,
      subItems: {
        km: [
          { label: 'រចនាសម្ព័ន្ធនៃការគ្រប់គ្រង', path: '/about/management', icon: Building },
          { label: 'តួនាទី និងភារកិច្ច', path: '/about/roles', icon: Briefcase },
          { label: 'សារអគ្គនាយក', path: '/about/director-message', icon: MessageCircle },
          { label: 'សុន្ទរកថា', path: '/about/speech', icon: Mic }
        ],
        en: [
          { label: 'Management Structure', path: '/about/management', icon: Building },
          { label: 'Roles & Responsibilities', path: '/about/roles', icon: Briefcase },
          { label: "Director's Message", path: '/about/director-message', icon: MessageCircle },
          { label: 'Speech', path: '/about/speech', icon: Mic }
        ]
      }
    },
    { 
      id: 'news',
      label: 'ព័ត៌មាន និង ព្រឹត្តិការណ៍', 
      labelEn: 'NEWS & EVENTS',
      path: '/news',
      icon: Globe,
      dropdown: true,
      subItems: {
        km: [
          { label: 'ព័ត៌មាន', path: '/news', icon: FileText },
          { label: 'កម្រងរូបភាព', path: '/news/photos', icon: Image },
          { label: 'កម្រងវីដេអូ', path: '/news/videos', icon: Video },
        ],
        en: [
          { label: 'News', path: '/news', icon: FileText },
          { label: 'Photo Gallery', path: '/news/photos', icon: Image },
          { label: 'Video Gallery', path: '/news/videos', icon: Video },
        ]
      }
    },
    

    { 
      id: 'documents',
      label: 'បណ្តុំឯកសារ', 
      labelEn: 'DOCUMENT COLLECTION',
      path: '/legal',
      icon: Library,
      dropdown: true,
      hasNested: true,
      subItems: {
        km: [
          { 
            label: 'លិខិតបទដ្ឋានគតិយុត្ត', 
            icon: Scale,
            path: '/legal',
            hasNested: true,
            nestedItems: [
              { label: 'ច្បាប់', path: '/legal?type=law', icon: Book },
              { label: 'អនុក្រឹត្យ', path: '/legal?type=sub-decree', icon: FileText },
              { label: 'សារាចរ', path: '/legal?type=circular', icon: FileSignature },
              { label: 'ប្រកាស', path: '/legal?type=declaration', icon: Megaphone }
            ]
          },
          { 
            label: 'ផ្សេងៗ', 
            icon: FileText,
            path: '/legal?type=other'
          }
        ],
        en: [
          { 
            label: 'Legal Documents', 
            icon: Scale,
            path: '/legal',
            hasNested: true,
            nestedItems: [
              { label: 'Law', path: '/legal?type=law', icon: Book },
              { label: 'Sub-Decree', path: '/legal?type=sub-decree', icon: FileText },
              { label: 'Circular', path: '/legal?type=circular', icon: FileSignature },
              { label: 'Declaration', path: '/legal?type=declaration', icon: Megaphone }
            ]
          },
          { 
            label: 'Others', 
            icon: FileText,
            path: '/legal?type=other'
          }
        ],
      }
    },
    { 
      id: 'reports',
      label: 'របាយការណ៍', 
      labelEn: 'REPORTS',
      path: '/reports',
      icon: BarChart3,
      dropdown: true,
      subItems: {
        km: [
          { label: 'របាយការណ៍ SSMR', path: '/reports?type=ssmr', icon: FileCheck },
          { label: 'របាយការណ៍ DRP', path: '/reports?type=drp', icon: ScrollText },
        ],
        en: [
          { label: 'SSMR Report', path: '/reports?type=ssmr', icon: FileCheck },
          { label: 'DRP Report', path: '/reports?type=drp', icon: ScrollText },
        ]
      }
    },
  ];

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown) {
        const dropdownElement = dropdownRefs.current[activeDropdown];
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          setActiveDropdown(null);
          setActiveNestedDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && activeDropdown) {
        setActiveDropdown(null);
        setActiveNestedDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [activeDropdown]);

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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const getTranslatedLabel = (item) => {
    if (currentLang === 'km') {
      return item.label;
    }
    return item.labelEn;
  };

  const handleNavigation = (path) => {
    if (path && path !== '#') {
      navigate(path);
      if (setMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      setActiveDropdown(null);
      setActiveNestedDropdown(null);
      setMobileDropdownOpen({});
      setMobileNestedOpen({});
    }
  };

  const closeMobileMenu = () => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileDropdown = (itemId) => {
    setMobileDropdownOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    if (mobileDropdownOpen[itemId]) {
      setMobileNestedOpen({});
    }
  };

  const toggleMobileNested = (parentId, nestedId) => {
    setMobileNestedOpen(prev => ({
      ...prev,
      [`${parentId}-${nestedId}`]: !prev[`${parentId}-${nestedId}`]
    }));
  };

  const toggleDropdown = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
    setActiveNestedDropdown(null);
  };

  const toggleNestedDropdown = (parentId, nestedId) => {
    setActiveNestedDropdown(activeNestedDropdown === `${parentId}-${nestedId}` ? null : `${parentId}-${nestedId}`);
  };

  const handleNestedHover = (parentId, nestedId) => {
    if (nestedTimeoutRef.current) {
      clearTimeout(nestedTimeoutRef.current);
    }
    setActiveNestedDropdown(`${parentId}-${nestedId}`);
  };

  const handleNestedLeave = () => {
    nestedTimeoutRef.current = setTimeout(() => {
      setActiveNestedDropdown(null);
    }, 200);
  };

  const isItemActive = (item) => {
    // Direct path match
    if (item.path === location.pathname) return true;
    
    // Check subitems
    if (item.subItems) {
      const isSubItemActive = item.subItems[currentLang].some(subItem => {
        // Check if the subitem path matches (with query params)
        const subItemPath = subItem.path.split('?')[0];
        const currentPath = location.pathname;
        if (subItemPath === currentPath) return true;
        
        // Check for query parameter match
        const queryParams = new URLSearchParams(location.search);
        const reportType = queryParams.get('type');
        
        // For reports subitems, check if the type matches
        if (item.id === 'reports') {
          if (subItem.label === 'របាយការណ៍ SSMR' || subItem.labelEn === 'SSMR Report') {
            if (reportType === 'ssmr') return true;
          }
          if (subItem.label === 'របាយការណ៍ DRP' || subItem.labelEn === 'DRP Report') {
            if (reportType === 'drp') return true;
          }
        }
        
        if (subItem.nestedItems) {
          return subItem.nestedItems.some(nested => nested.path === location.pathname);
        }
        return false;
      });
      
      if (isSubItemActive) return true;
    }
    
    // Special handling for reports parent - highlight when on any /reports page
    if (item.id === 'reports' && (location.pathname === '/reports' || location.pathname.startsWith('/reports'))) {
      return true;
    }
    
    return false;
  };

  return (
    <>
      {/* Desktop Navigation - Large screens (lg and up) */}
      <nav className="hidden lg:flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {menuItems.map((item) => {
            const isActive = isItemActive(item);
            
            return (
              <div
                key={item.id}
                className="relative"
                ref={(el) => dropdownRefs.current[item.id] = el}
              >
                <button
                  onClick={() => {
                    if (!item.dropdown) {
                      handleNavigation(item.path);
                    } else {
                      toggleDropdown(item.id);
                    }
                  }}
                  className={`group flex items-center px-4 py-2.5 text-sm rounded-xl transition-all duration-300 whitespace-nowrap ${
                    isActive 
                      ? 'text-[#2E7D32] bg-gradient-to-r from-[#4CAF50]/10 to-[#2E7D32]/10 shadow-sm' 
                      : 'text-gray-700 hover:text-[#2E7D32] hover:bg-gradient-to-r hover:from-[#4CAF50]/5 hover:to-transparent'
                  }`}
                >
                  <item.icon 
                    size={18} 
                    className={`mr-2 transition-all duration-300 ${
                      isActive ? 'text-[#4CAF50] scale-110' : 'text-gray-500 group-hover:text-[#4CAF50] group-hover:scale-110'
                    }`} 
                  />
                  <span className="tracking-wide">{getTranslatedLabel(item)}</span>
                  {item.dropdown && (
                    <ChevronDown 
                      size={14} 
                      className={`ml-1.5 transition-all duration-300 ${
                        activeDropdown === item.id ? 'rotate-180 text-[#4CAF50]' : 'text-gray-400'
                      }`} 
                    />
                  )}
                </button>
                
                {item.dropdown && (
                  <div 
                    className={`
                      absolute left-0 mt-2 min-w-[260px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-2
                      transition-all duration-300 ease-out transform origin-top
                      ${activeDropdown === item.id 
                        ? 'opacity-100 scale-100 translate-y-0 visible' 
                        : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                      }
                    `}
                    style={{ zIndex: 9999 }}
                  >
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                    
                    {item.subItems[currentLang].map((subItem, i) => {
                      // Check if this specific subitem is active
                      let isSubActive = false;
                      const queryParams = new URLSearchParams(location.search);
                      const reportType = queryParams.get('type');
                      
                      if (item.id === 'reports') {
                        if (subItem.label === 'របាយការណ៍ SSMR' || subItem.labelEn === 'SSMR Report') {
                          isSubActive = reportType === 'ssmr';
                        }
                        if (subItem.label === 'របាយការណ៍ DRP' || subItem.labelEn === 'DRP Report') {
                          isSubActive = reportType === 'drp';
                        }
                      } else {
                        isSubActive = subItem.path.split('?')[0] === location.pathname;
                      }
                      
                      if (subItem.hasNested) {
                        return (
                          <div 
                            key={i} 
                            className="relative"
                            onMouseEnter={() => handleNestedHover(item.id, i)}
                            onMouseLeave={handleNestedLeave}
                          >
                            <button
                              className={`
                                group w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 
                                hover:bg-gradient-to-r hover:from-[#4CAF50]/5 hover:to-transparent
                                ${isSubActive
                                  ? 'text-[#2E7D32] bg-gradient-to-r from-[#4CAF50]/10 to-transparent font-medium'
                                  : 'text-gray-700 hover:text-[#2E7D32]'
                                }
                              `}
                            >
                              <div className="flex items-center flex-1">
                                {subItem.icon && (
                                  <subItem.icon 
                                    size={16} 
                                    className={`mr-3 transition-all duration-200 ${
                                      isSubActive ? 'text-[#4CAF50]' : 'text-gray-400 group-hover:text-[#4CAF50]'
                                    }`} 
                                  />
                                )}
                                <span>{subItem.label}</span>
                              </div>
                              <ChevronRight 
                                size={14} 
                                className={`transition-all duration-200 ${
                                  activeNestedDropdown === `${item.id}-${i}` 
                                    ? 'translate-x-1 text-[#4CAF50]' 
                                    : 'text-gray-400 group-hover:text-[#4CAF50]'
                                }`} 
                              />
                            </button>
                            
                            {subItem.nestedItems && (
                              <div 
                                className={`
                                  absolute left-full top-0 ml-1 min-w-[240px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-2
                                  transition-all duration-300 ease-out
                                  ${activeNestedDropdown === `${item.id}-${i}`
                                    ? 'opacity-100 scale-100 translate-y-0 visible'
                                    : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                                  }
                                `}
                                style={{ zIndex: 10000 }}
                              >
                                <div className="absolute -left-1 top-4 w-2 h-2 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                                
                                {subItem.nestedItems.map((nestedItem, j) => {
                                  const isNestedActive = nestedItem.path === location.pathname;
                                  
                                  return (
                                    <button
                                      key={j}
                                      onClick={() => handleNavigation(nestedItem.path)}
                                      className={`
                                        group w-full flex items-center px-4 py-2.5 text-sm transition-all duration-200 
                                        hover:pl-6 hover:bg-gradient-to-r hover:from-[#4CAF50]/5 hover:to-transparent
                                        ${isNestedActive
                                          ? 'text-[#2E7D32] bg-gradient-to-r from-[#4CAF50]/10 to-transparent font-medium'
                                          : 'text-gray-700 hover:text-[#2E7D32]'
                                        }
                                      `}
                                    >
                                      {nestedItem.icon && (
                                        <nestedItem.icon 
                                          size={14} 
                                          className={`mr-3 transition-all duration-200 ${
                                            isNestedActive ? 'text-[#4CAF50]' : 'text-gray-400 group-hover:text-[#4CAF50]'
                                          }`} 
                                        />
                                      )}
                                      <span>{nestedItem.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handleNavigation(subItem.path)}
                          className={`
                            group w-full flex items-center px-4 py-3 text-sm transition-all duration-200 
                            hover:pl-6 hover:bg-gradient-to-r hover:from-[#4CAF50]/5 hover:to-transparent
                            ${isSubActive
                              ? 'text-[#2E7D32] bg-gradient-to-r from-[#4CAF50]/10 to-transparent font-medium'
                              : 'text-gray-700 hover:text-[#2E7D32]'
                            }
                          `}
                        >
                          {subItem.icon && (
                            <subItem.icon 
                              size={16} 
                              className={`mr-3 transition-all duration-200 ${
                                isSubActive ? 'text-[#4CAF50]' : 'text-gray-400 group-hover:text-[#4CAF50]'
                              }`} 
                            />
                          )}
                          <span>{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Tablet Navigation - Medium screens (md to lg) */}
      <nav className="hidden md:flex lg:hidden items-center justify-start overflow-visible">
        <div className="flex items-center space-x-1 min-w-max relative">
          {menuItems.map((item) => {
            const isActive = isItemActive(item);
            
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => {
                    if (!item.dropdown) {
                      handleNavigation(item.path);
                    } else {
                      toggleDropdown(item.id);
                    }
                  }}
                  className={`group flex items-center px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-300 whitespace-nowrap ${
                    isActive 
                      ? 'text-[#2E7D32] bg-gradient-to-r from-[#4CAF50]/10 to-[#2E7D32]/10' 
                      : 'text-gray-700 hover:text-[#2E7D32] hover:bg-gradient-to-r hover:from-[#4CAF50]/5 hover:to-transparent'
                  }`}
                >
                  <item.icon size={16} className="mr-1.5" />
                  <span className="truncate max-w-[100px]">{getTranslatedLabel(item)}</span>
                  {item.dropdown && (
                    <ChevronDown 
                      size={12} 
                      className={`ml-1 transition-all duration-300 ${
                        activeDropdown === item.id ? 'rotate-180 text-[#4CAF50]' : ''
                      }`} 
                    />
                  )}
                </button>
                
                {item.dropdown && activeDropdown === item.id && (
                  <div 
                    className="fixed bg-white rounded-2xl shadow-2xl border border-gray-100 py-2"
                    style={{ 
                      zIndex: 9999,
                      minWidth: '220px',
                      maxWidth: '280px',
                      top: 'auto',
                      left: 'auto',
                    }}
                    ref={(el) => {
                      if (el) {
                        const btn = el.parentElement?.querySelector('button');
                        if (btn) {
                          const rect = btn.getBoundingClientRect();
                          el.style.top = `${rect.bottom + 8}px`;
                          el.style.left = `${rect.left}px`;
                        }
                      }
                    }}
                  >
                    {item.subItems[currentLang].map((subItem, i) => {
                      // Check if this specific subitem is active
                      let isSubActive = false;
                      const queryParams = new URLSearchParams(location.search);
                      const reportType = queryParams.get('type');
                      
                      if (item.id === 'reports') {
                        if (subItem.label === 'របាយការណ៍ SSMR' || subItem.labelEn === 'SSMR Report') {
                          isSubActive = reportType === 'ssmr';
                        }
                        if (subItem.label === 'របាយការណ៍ DRP' || subItem.labelEn === 'DRP Report') {
                          isSubActive = reportType === 'drp';
                        }
                      } else {
                        isSubActive = subItem.path.split('?')[0] === location.pathname;
                      }
                      
                      if (subItem.hasNested) {
                        return (
                          <div key={i}>
                            <button
                              onClick={() => toggleNestedDropdown(item.id, i)}
                              className="group w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:text-[#2E7D32] hover:bg-gradient-to-r hover:from-[#4CAF50]/5 hover:to-transparent"
                            >
                              <div className="flex items-center">
                                {subItem.icon && <subItem.icon size={16} className="mr-3 text-gray-400" />}
                                <span>{subItem.label}</span>
                              </div>
                              <ChevronRight size={12} className="text-gray-400" />
                            </button>
                            {activeNestedDropdown === `${item.id}-${i}` && subItem.nestedItems && (
                              <div className="pl-6 mt-1 space-y-1 border-l-2 border-[#4CAF50]/20 ml-4">
                                {subItem.nestedItems.map((nestedItem, j) => (
                                  <button
                                    key={j}
                                    onClick={() => handleNavigation(nestedItem.path)}
                                    className="group w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:text-[#2E7D32] hover:bg-gradient-to-r hover:from-[#4CAF50]/5 hover:to-transparent rounded-lg"
                                  >
                                    {nestedItem.icon && <nestedItem.icon size={14} className="mr-3 text-gray-400" />}
                                    {nestedItem.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handleNavigation(subItem.path)}
                          className={`
                            group w-full flex items-center px-4 py-3 text-sm transition-all duration-200 
                            hover:pl-6 hover:bg-gradient-to-r hover:from-[#4CAF50]/5 hover:to-transparent
                            ${isSubActive
                              ? 'text-[#2E7D32] bg-gradient-to-r from-[#4CAF50]/10 to-transparent font-medium'
                              : 'text-gray-700 hover:text-[#2E7D32]'
                            }
                          `}
                        >
                          {subItem.icon && <subItem.icon size={16} className="mr-3" />}
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation - Small screens (below md) */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(true)}
          className="p-2.5 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            style={{ zIndex: 9998 }}
            onClick={closeMobileMenu}
          />

          <div 
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto overflow-x-hidden animate-in slide-in-from-right duration-300 custom-scrollbar"
            style={{ zIndex: 9999 }}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-5 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Logo variant="default" showText={false} logoSrc={logo} className="w-12 h-12" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#2E7D32] text-sm leading-tight break-words">
                    {!headerLoading && orgNameFull ? orgNameFull : (currentLang === 'km' 
                      ? 'អគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោង' 
                      : 'General Department of Resettlement')
                    }
                  </h4>
                  <p className="text-xs text-[#4CAF50] mt-1 font-medium">
                    {currentLang === 'km' ? 'ម៉ឺនុយមេ' : 'Main Menu'}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <button 
                    onClick={closeMobileMenu}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 pb-24">
              {/* Language Switcher for Mobile */}
              <div className="mb-6 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Languages size={16} className="text-[#4CAF50]" />
                  <span className="text-xs font-medium text-gray-600">
                    {currentLang === 'km' ? 'ជ្រើសរើសភាសា' : 'Select Language'}
                  </span>
                </div>
                <LanguageSwitcher variant="mobile" className="justify-start" />
              </div>

              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = isItemActive(item);
                  
                  return (
                    <div key={item.id} className="transform transition-all duration-200">
                      {item.dropdown ? (
                        <>
                          <button
                            onClick={() => toggleMobileDropdown(item.id)}
                            className={`
                              w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200
                              ${isActive 
                                ? 'text-[#2E7D32] bg-gradient-to-r from-[#4CAF50]/10 to-transparent' 
                                : 'text-gray-700 hover:bg-gray-50'
                              }
                              active:scale-98
                            `}
                          >
                            <div className="flex items-center flex-1 min-w-0 gap-3">
                              <item.icon 
                                size={20} 
                                className={`flex-shrink-0 transition-all duration-200 ${
                                  isActive ? 'text-[#4CAF50] scale-110' : 'text-gray-500'
                                }`} 
                              />
                              <span className="text-sm font-medium break-words text-left flex-1">
                                {getTranslatedLabel(item)}
                              </span>
                            </div>
                            <ChevronDown 
                              size={16} 
                              className={`ml-2 flex-shrink-0 transition-all duration-300 ${
                                mobileDropdownOpen[item.id] ? 'rotate-180' : ''
                              } ${isActive ? 'text-[#4CAF50]' : 'text-gray-400'}`} 
                            />
                          </button>

                          <div 
                            className={`
                              ml-12 mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out
                              ${mobileDropdownOpen[item.id] 
                                ? 'max-h-96 opacity-100' 
                                : 'max-h-0 opacity-0'
                              }
                            `}
                          >
                            {item.subItems[currentLang].map((subItem, i) => {
                              // Check if this specific subitem is active
                              let isSubActive = false;
                              const queryParams = new URLSearchParams(location.search);
                              const reportType = queryParams.get('type');
                              
                              if (item.id === 'reports') {
                                if (subItem.label === 'របាយការណ៍ SSMR' || subItem.labelEn === 'SSMR Report') {
                                  isSubActive = reportType === 'ssmr';
                                }
                                if (subItem.label === 'របាយការណ៍ DRP' || subItem.labelEn === 'DRP Report') {
                                  isSubActive = reportType === 'drp';
                                }
                              } else {
                                isSubActive = subItem.path === location.pathname;
                              }
                              
                              if (subItem.hasNested) {
                                return (
                                  <div key={i} className="space-y-1">
                                    <button
                                      onClick={() => toggleMobileNested(item.id, i)}
                                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-50"
                                    >
                                      <div className="flex items-center gap-2">
                                        {subItem.icon && <subItem.icon size={16} className="text-gray-500" />}
                                        <span>{subItem.label}</span>
                                      </div>
                                      <ChevronRight 
                                        size={14} 
                                        className={`transition-all duration-200 ${
                                          mobileNestedOpen[`${item.id}-${i}`] ? 'rotate-90 text-[#4CAF50]' : ''
                                        }`}
                                      />
                                    </button>
                                    
                                    {mobileNestedOpen[`${item.id}-${i}`] && subItem.nestedItems && (
                                      <div className="ml-6 pl-3 border-l-2 border-[#4CAF50]/20 space-y-1">
                                        {subItem.nestedItems.map((nestedItem, j) => (
                                          <button
                                            key={j}
                                            onClick={() => handleNavigation(nestedItem.path)}
                                            className={`
                                              w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200
                                              ${nestedItem.path === location.pathname
                                                ? 'text-[#2E7D32] bg-gradient-to-r from-[#4CAF50]/10 to-transparent font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                              }
                                            `}
                                          >
                                            {nestedItem.icon && <nestedItem.icon size={14} className="text-gray-500" />}
                                            {nestedItem.label}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              
                              return (
                                <button
                                  key={i}
                                  onClick={() => handleNavigation(subItem.path)}
                                  className={`
                                    w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all duration-200
                                    transform hover:translate-x-1
                                    ${isSubActive
                                      ? 'text-[#2E7D32] bg-gradient-to-r from-[#4CAF50]/10 to-transparent font-medium'
                                      : 'text-gray-600 hover:bg-gray-50'
                                    }
                                  `}
                                >
                                  {subItem.icon && <subItem.icon size={16} className="text-gray-500" />}
                                  <span className="break-words">{subItem.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => handleNavigation(item.path)}
                          className={`
                            w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200
                            ${isActive 
                              ? 'text-[#2E7D32] bg-gradient-to-r from-[#4CAF50]/10 to-transparent' 
                              : 'text-gray-700 hover:bg-gray-50'
                            }
                            active:scale-98 hover:translate-x-1
                          `}
                        >
                          <item.icon 
                            size={20} 
                            className={`mr-3 flex-shrink-0 transition-all duration-200 ${
                              isActive ? 'text-[#4CAF50] scale-110' : 'text-gray-500'
                            }`} 
                          />
                          <span className="text-sm font-medium flex-1 text-left break-words">
                            {getTranslatedLabel(item)}
                          </span>
                          <ChevronRight 
                            size={14} 
                            className={`flex-shrink-0 transition-all duration-200 ${
                              isActive ? 'text-[#4CAF50] translate-x-1' : 'text-gray-400'
                            }`} 
                          />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Contact Info - Email only from API */}
              <div className="mt-8 pt-5 border-t border-gray-100 animate-in fade-in duration-500 delay-100">
                <p className="text-xs text-[#4CAF50] mb-3 px-1 font-semibold tracking-wide">CONTACT</p>
                <div className="space-y-2 px-1">
                  {!emailLoading && hasValidEmail && (
                    <a 
                      href={`mailto:${footerEmail}`}
                      className="flex items-center text-sm text-gray-600 hover:text-[#2E7D32] transition-all duration-200 group"
                    >
                      <Mail size={14} className="mr-3 text-[#4CAF50] flex-shrink-0 group-hover:scale-110 transition-all duration-200" />
                      <span className="group-hover:font-medium break-words">{footerEmail}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-from-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation-name: fade-in;
        }
        
        .slide-in-from-right {
          animation-name: slide-in-from-right;
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        
        .break-words {
          word-break: break-word;
          overflow-wrap: break-word;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4CAF50 #e5e7eb;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4CAF50;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2E7D32;
        }
      `}</style>
    </>
  );
};

export default Navigation;