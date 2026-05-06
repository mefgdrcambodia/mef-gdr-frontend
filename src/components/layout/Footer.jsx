// src/components/layout/Footer.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  Mail,
  MapPin,
  ChevronRight,
  ArrowUp,
  Home,
  Globe,
  Info,
  Users,
  FileText,
  Building2,
  BarChart3,
  Library,
  Mic,
  Briefcase,
  MessageCircle,
  Calendar,
  Image,
  Video,
  Book,
  FileSignature,
  Megaphone,
  FileCheck,
  ScrollText,
  ChevronDown,
  Scale,
  Newspaper,
  FolderTree,
  PieChart,
  Phone,
  Link2,
  Camera,
  PlayCircle,
  Gavel,
  CheckSquare,
  Scroll,
  Building,
  Target,
  HeartHandshake,
  Map
} from "lucide-react";
import Container from "../ui/Container";
import { useFooter } from "../../hooks/useFooter";
import { useHeader } from "../../hooks/useHeader";
import logoImage from "../../images/logo.png";

// Social media SVG icons
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const Footer = () => {
  const [currentLang, setCurrentLang] = useState("km");
  const [openSections, setOpenSections] = useState({
    about: false,
    news: false,
    documents: false,
    legalDocuments: false,
    reports: false
  });
  const location = useLocation();

  const { 
    loading: footerLoading, 
    contact, 
    email, 
    address,
    copyright,
    mapUrl,
  } = useFooter(currentLang);

  const { logo: apiLogo, loading: headerLoading } = useHeader(currentLang);

  const loading = footerLoading || headerLoading;

  const hasValidEmail = email && email.trim() !== '';

  // Hardcoded links
  const WEBSITE_URL = 'https://gdr.mef.gov.kh';
  const WEBSITE_DISPLAY = 'www.gdr.mef.gov.kh';
  const FACEBOOK_URL = 'https://www.facebook.com';
  const X_URL = 'https://www.x.com';
  const TELEGRAM_URL = 'https://www.telegram.org';

  const getEmbedMapUrl = (url) => {
    if (!url) return '';
    if (url.includes('/embed')) return url;
    return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.6539446787106!2d104.920614!3d11.576647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951434d493e03%3A0xb1a605e9a569ec8b!2sMinistry%20of%20Economy%20and%20Finance%20of%20Cambodia!5e0!3m2!1sen!2skh!4v1774153266478!5m2!1sen!2skh';
  };

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const translations = {
    km: {
      address: "អាសយដ្ឋាន",
      email: "អ៊ីមែល",
      website: "គេហទំព័រ",
      quickLinks: "តំណភ្ជាប់រហ័ស",
      home: "ទំព័រដើម",
      news: "ព័ត៌មាន និង ព្រឹត្តិការណ៍",
      about: "អំពីអគ្គនាយកដ្ឋាន",
      documents: "បណ្តុំឯកសារ",
      legalDocuments: "លិខិតបទដ្ឋានគតិយុត្ត",
      reports: "របាយការណ៍",
      ssmr: "របាយការណ៍ SSMR",
      drp: "របាយការណ៍ DRP",
      management: "រចនាសម្ព័ន្ធនៃការគ្រប់គ្រង",
      roles: "តួនាទី និងភារកិច្ច",
      directorMessage: "សារអគ្គនាយក",
      speech: "សុន្ទរកថា",
      newsMain: "ព័ត៌មាន",
      photos: "កម្រងរូបភាព",
      videos: "កម្រងវីដេអូ",
      law: "ច្បាប់",
      subDecree: "អនុក្រឹត្យ",
      circular: "សារាចរ",
      declaration: "ប្រកាស",
      backToTop: "ត្រលប់ទៅកំពូល",
      location: "ទីតាំង",
      viewMap: "មើលផែនទីធំ",
      contactUs: "ទំនាក់ទំនង",
      followUs: "តាមដានពួកយើង",
    },
    en: {
      address: "Address",
      email: "Email",
      website: "Website",
      quickLinks: "Quick Links",
      home: "Home",
      news: "News & Events",
      about: "About General Department",
      documents: "Document Collection",
      legalDocuments: "Legal Documents",
      reports: "Reports",
      ssmr: "SSMR Report",
      drp: "DRP Report",
      management: "Management Structure",
      roles: "Roles & Responsibilities",
      directorMessage: "Director's Message",
      speech: "Speech",
      newsMain: "News",
      photos: "Photo Gallery",
      videos: "Video Gallery",
      law: "Law",
      subDecree: "Sub-Decree",
      circular: "Circular",
      declaration: "Declaration",
      backToTop: "Back to top",
      location: "Location",
      viewMap: "View larger map",
      contactUs: "Contact Us",
      followUs: "Follow Us",
    },
  };

  const t = translations[currentLang];

  // Quick links based on Navigation menu structure with icons
  const quickLinksList = [
    { label: t.home, path: "/", icon: <Home size={14} /> },
  ];

  // About sub-links with icons
  const aboutSubLinks = [
    { label: t.management, path: "/about/management", icon: <Building size={12} /> },
    { label: t.roles, path: "/about/roles", icon: <Briefcase size={12} /> },
    { label: t.directorMessage, path: "/about/director-message", icon: <MessageCircle size={12} /> },
    { label: t.speech, path: "/about/speech", icon: <Mic size={12} /> },
  ];

  // News sub-links with icons
  const newsSubLinks = [
    { label: t.newsMain, path: "/news", icon: <Newspaper size={12} /> },
    { label: t.photos, path: "/news/photos", icon: <Camera size={12} /> },
    { label: t.videos, path: "/news/videos", icon: <PlayCircle size={12} /> },
  ];

  // Legal Documents nested items with icons
  const legalNestedItems = [
    { label: t.law, path: "/legal/law", icon: <Gavel size={12} /> },
    { label: t.subDecree, path: "/legal/sub-decree", icon: <FileText size={12} /> },
    { label: t.circular, path: "/legal/circular", icon: <FileSignature size={12} /> },
    { label: t.declaration, path: "/legal/declaration", icon: <Megaphone size={12} /> },
  ];

  // Reports sub-links with icons
  const reportsSubLinks = [
    { label: t.ssmr, path: "/reports?type=ssmr", icon: <CheckSquare size={12} /> },
    { label: t.drp, path: "/reports?type=drp", icon: <Scroll size={12} /> },
  ];

  const socialMediaList = [
    { href: FACEBOOK_URL, icon: <FacebookIcon />, label: "Facebook", color: "hover:bg-[#1877F2]" },
    { href: X_URL, icon: <XIcon />, label: "X (Twitter)", color: "hover:bg-[#000000]" },
    { href: TELEGRAM_URL, icon: <TelegramIcon />, label: "Telegram", color: "hover:bg-[#0088CC]" },
  ];

  if (loading) {
    return (
      <footer className="bg-gradient-to-b from-[#1B5E20] to-[#0D3310] text-white">
        <Container className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-b from-[#1B5E20] to-[#0D3310] text-white relative">
      <button
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#4CAF50] hover:bg-[#2E7D32] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group z-10"
        aria-label={t.backToTop}
      >
        <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
      </button>

      <Container className="pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-5">
            <Link to="/" className="flex flex-col items-start gap-3 group transition-all duration-300 hover:opacity-90">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:shadow-lg">
                <img
                  src={apiLogo || logoImage}
                  alt={currentLang === "km" ? contact.titleKh : contact.titleEn}
                  className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.target.src = logoImage; }}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg leading-tight text-white break-words transition-all duration-300 group-hover:text-green-200">
                  {currentLang === "km" ? contact.titleKh : contact.titleEn}
                </h3>
              </div>
            </Link>

            {/* Social Media Icons */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {socialMediaList.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`bg-white/10 ${social.color} text-white p-2.5 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white flex items-center text-base sm:text-lg">
              <span className="w-8 h-0.5 bg-[#4CAF50] mr-2"></span>
              {t.contactUs}
            </h4>

            <div className="space-y-4">
              {/* Address */}
              {(address.km || address.en) && (
                <div className="flex items-start space-x-3 group">
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#4CAF50] transition-colors flex-shrink-0">
                    <MapPin size={16} className="text-[#4CAF50] group-hover:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-300 mb-1">{t.address}</p>
                    <p className="text-sm text-green-100 leading-relaxed break-words">
                      {currentLang === "km" ? address.km : address.en}
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              {hasValidEmail && (
                <div className="flex items-start space-x-3 group">
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#4CAF50] transition-colors flex-shrink-0">
                    <Mail size={16} className="text-[#4CAF50] group-hover:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-300 mb-1">{t.email}</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm text-green-100 hover:text-white transition-colors break-words flex items-center gap-1"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {/* Website */}
              <div className="flex items-start space-x-3 group">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#4CAF50] transition-colors flex-shrink-0">
                  <Globe size={16} className="text-[#4CAF50] group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-green-300 mb-1">{t.website}</p>
                  <a
                    href={WEBSITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-100 hover:text-white transition-colors break-words flex items-center gap-1"
                  >
                    {WEBSITE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Column with Dropdowns */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white flex items-center text-base sm:text-lg">
              <span className="w-8 h-0.5 bg-[#4CAF50] mr-2"></span>
              {t.quickLinks}
            </h4>

            {/* Main Quick Links */}
            <ul className="space-y-2">
              {quickLinksList.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="group flex items-center text-sm text-green-200 hover:text-white transition-colors">
                    {/* <ChevronRight size={14} className="mr-2 text-[#4CAF50] group-hover:translate-x-1 transition-transform flex-shrink-0" /> */}
                    <span className="mr-2">{link.icon}</span>
                    <span className="break-words">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* About Dropdown Section */}
            <div className="mt-4">
              <button
                onClick={() => toggleSection('about')}
                className="w-full flex items-center justify-between text-sm text-green-200 hover:text-white transition-colors group py-1"
              >
                <div className="flex items-center">
                  {/* <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full mr-2"></span> */}
                  <Info size={12} className="mr-2 text-[#4CAF50]" />
                  <span className="font-medium">{t.about}</span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${openSections.about ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.about ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <ul className="space-y-2 pl-4 border-l-2 border-[#4CAF50]/30">
                  {aboutSubLinks.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="group flex items-center text-xs text-green-300 hover:text-white transition-colors">
                        {/* <span className="mr-2 text-[#4CAF50] group-hover:translate-x-0.5 transition-transform">•</span> */}
                        <span className="mr-2">{link.icon}</span>
                        <span className="break-words">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* News Dropdown Section */}
            <div>
              <button
                onClick={() => toggleSection('news')}
                className="w-full flex items-center justify-between text-sm text-green-200 hover:text-white transition-colors group py-1"
              >
                <div className="flex items-center">
                  {/* <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full mr-2"></span> */}
                  <Newspaper size={12} className="mr-2 text-[#4CAF50]" />
                  <span className="font-medium">{t.news}</span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${openSections.news ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.news ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <ul className="space-y-2 pl-4 border-l-2 border-[#4CAF50]/30">
                  {newsSubLinks.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="group flex items-center text-xs text-green-300 hover:text-white transition-colors">
                        {/* <span className="mr-2 text-[#4CAF50] group-hover:translate-x-0.5 transition-transform">•</span> */}
                        <span className="mr-2">{link.icon}</span>
                        <span className="break-words">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Documents Dropdown Section with Nested Legal Documents */}
            <div>
              <button
                onClick={() => toggleSection('documents')}
                className="w-full flex items-center justify-between text-sm text-green-200 hover:text-white transition-colors group py-1"
              >
                <div className="flex items-center">
                  {/* <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full mr-2"></span> */}
                  <FolderTree size={12} className="mr-2 text-[#4CAF50]" />
                  <span className="font-medium">{t.documents}</span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${openSections.documents ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.documents ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <div className="pl-4">
                  {/* Legal Documents - Nested Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleSection('legalDocuments')}
                      className="w-full flex items-center justify-between text-xs text-green-300 hover:text-white transition-colors group py-1.5"
                    >
                      <div className="flex items-center">
                        <Scale size={12} className="mr-2 text-[#4CAF50]" />
                        <span>{t.legalDocuments}</span>
                      </div>
                      <ChevronDown 
                        size={12} 
                        className={`transition-transform duration-200 ${openSections.legalDocuments ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.legalDocuments ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                      <ul className="space-y-1.5 pl-6 border-l-2 border-[#4CAF50]/20">
                        {legalNestedItems.map((link, index) => (
                          <li key={index}>
                            <Link to={link.path} className="group flex items-center text-[11px] text-green-400 hover:text-white transition-colors">
                              <span className="mr-1.5 text-[#4CAF50] group-hover:translate-x-0.5 transition-transform">•</span>
                              <span className="mr-1.5">{link.icon}</span>
                              <span className="break-words">{link.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Dropdown Section */}
            <div>
              <button
                onClick={() => toggleSection('reports')}
                className="w-full flex items-center justify-between text-sm text-green-200 hover:text-white transition-colors group py-1"
              >
                <div className="flex items-center">
                  {/* <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full mr-2"></span> */}
                  <PieChart size={12} className="mr-2 text-[#4CAF50]" />
                  <span className="font-medium">{t.reports}</span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${openSections.reports ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.reports ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <ul className="space-y-2 pl-4 border-l-2 border-[#4CAF50]/30">
                  {reportsSubLinks.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="group flex items-center text-xs text-green-300 hover:text-white transition-colors">
                        {/* <span className="mr-2 text-[#4CAF50] group-hover:translate-x-0.5 transition-transform">•</span> */}
                        <span className="mr-2">{link.icon}</span>
                        <span className="break-words">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white flex items-center text-base sm:text-lg">
              <span className="w-8 h-0.5 bg-[#4CAF50] mr-2"></span>
              <Map size={16} className="mr-2 text-[#4CAF50]" />
              {t.location}
            </h4>

            <div className="bg-white/10 rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={getEmbedMapUrl(mapUrl)}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
                className="w-full h-full"
              ></iframe>
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-green-300 hover:text-white transition-colors group"
              >
                <span className="break-words">{t.viewMap}</span>
                <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-green-300 text-center md:text-left break-words">
              {currentLang === "km" ? copyright.textKh : copyright.textEn}
              <span className="block mt-1 text-green-400 font-medium">
                {currentLang === "km" ? copyright.belowKh : copyright.belowEn}
              </span>
            </p>

            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-2 text-green-400">
                <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-pulse"></span>
                <span>{currentLang === "km" ? "ភាសាខ្មែរ" : "English"}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;