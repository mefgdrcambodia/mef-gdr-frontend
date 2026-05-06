// src/components/home/NewsSection.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronRight,
  Eye,
  Heart,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Zap,
  Newspaper,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNews } from "../../hooks/useNews";
import defaultImg from "../../images/defuat_img.jpg";

// ── localStorage helpers ────────────────────────────────────────────────────
const getCount = (key) => parseInt(localStorage.getItem(key) || "0");
const setCount = (key, val) => localStorage.setItem(key, String(val));
const hasLiked = (id) => localStorage.getItem(`news_liked_${id}`) === "1";
const hasShared = (id) => localStorage.getItem(`news_shared_${id}`) === "1";

const mergeLocalCounts = (items) =>
  items.map((item) => ({
    ...item,
    views: Math.max(item.views || 0, getCount(`news_views_${item.id}`)),
    likes: Math.max(item.likes || 0, getCount(`news_likes_${item.id}`)),
    shares: Math.max(item.shares || 0, getCount(`news_shares_${item.id}`)),
    liked: hasLiked(item.id),
    shared: hasShared(item.id),
  }));
// ───────────────────────────────────────────────────────────────────────────

// Text truncation component - works for both Khmer and English
const TruncatedText = ({ text, lines = 2, className = "" }) => {
  if (!text) return null;

  return (
    <div
      className={className}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: lines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        wordBreak: "break-word",
        wordWrap: "break-word",
        whiteSpace: "normal",
      }}
    >
      <label style={{ lineHeight: "1.8" }}>{text}</label>
    </div>
  );
};

const NewsSection = ({ onViewAll }) => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState("km");
  const [selectedNews, setSelectedNews] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const [localLeftNews, setLocalLeftNews] = useState([]);
  const [localRightNews, setLocalRightNews] = useState([]);

  const [leftPage, setLeftPage] = useState(1);
  const [rightPage, setRightPage] = useState(1);

  const {
    loading: leftLoading,
    news: rawLeftNews,
    totalPages: leftTotalPages,
    categories,
  } = useNews({ page: leftPage, limit: 10 });
  const {
    loading: rightLoading,
    news: rawRightNews,
    totalPages: rightTotalPages,
  } = useNews({ page: rightPage, limit: 5 });
  const loading = leftLoading || rightLoading;

  useEffect(() => {
    setLocalLeftNews(
      rawLeftNews.length > 0 ? mergeLocalCounts(rawLeftNews) : [],
    );
  }, [rawLeftNews]);
  useEffect(() => {
    setLocalRightNews(
      rawRightNews.length > 0 ? mergeLocalCounts(rawRightNews) : [],
    );
  }, [rawRightNews]);

  useEffect(() => {
    const handler = (e) => setCurrentLang(e.detail.language);
    window.addEventListener("languagechange", handler);
    const saved = localStorage.getItem("language");
    if (saved) setCurrentLang(saved);
    return () => window.removeEventListener("languagechange", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      showDetail || showLightbox || shareModal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDetail, showLightbox, shareModal]);

  // Auto-slide for featured carousel
  useEffect(() => {
    if (localLeftNews.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % localLeftNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [localLeftNews]);

  // ── state patcher ──────────────────────────────────────────────────────────
  const patchItem = (id, patch) => {
    setLocalLeftNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    );
    setLocalRightNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    );
    setSelectedNews((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  };

  // ── action handlers ────────────────────────────────────────────────────────
  const handleReadMore = (newsItem) => {
    const key = `news_views_${newsItem.id}`;
    const newViews = getCount(key) + 1;
    setCount(key, newViews);
    const patch = { views: newViews };
    patchItem(newsItem.id, patch);
    setSelectedNews({ ...newsItem, ...patch });
    setShowDetail(true);
    setSelectedImageIndex(null);
    window.scrollTo(0, 0);
  };

  const handleLike = (newsItem) => {
    const key = `news_likes_${newsItem.id}`;
    const likedKey = `news_liked_${newsItem.id}`;
    const already = hasLiked(newsItem.id);
    const newLikes = already
      ? Math.max(0, getCount(key) - 1)
      : getCount(key) + 1;
    setCount(key, newLikes);
    localStorage.setItem(likedKey, already ? "0" : "1");
    patchItem(newsItem.id, { likes: newLikes, liked: !already });
  };

  const handleShare = (newsItem) => {
    if (!hasShared(newsItem.id)) {
      const key = `news_shares_${newsItem.id}`;
      const newShares = getCount(key) + 1;
      setCount(key, newShares);
      localStorage.setItem(`news_shared_${newsItem.id}`, "1");
      patchItem(newsItem.id, { shares: newShares, shared: true });
    }
    setShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    if (selectedNews) handleShare(selectedNews);
    setShareModal(false);
    alert(t.copied);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedNews(null);
    setSelectedImageIndex(null);
  };
  const handleOpenLightbox = (i) => {
    setSelectedImageIndex(i);
    setShowLightbox(true);
  };
  const handleCloseLightbox = () => {
    setShowLightbox(false);
    setSelectedImageIndex(null);
  };
  const handlePrevImage = () => {
    if (selectedImageIndex > 0) setSelectedImageIndex(selectedImageIndex - 1);
  };
  const handleNextImage = () => {
    if (selectedImageIndex < selectedNews.images.length - 1)
      setSelectedImageIndex(selectedImageIndex + 1);
  };
  const handleViewAll = () => navigate("/news");

  const featuredSlides = localLeftNews;

  // ── i18n ───────────────────────────────────────────────────────────────────
  const translations = {
    km: {
      title: "ព័ត៌មានថ្មីៗ",
      viewAll: "មើលទាំងអស់",
      readMore: "អានបន្ត",
      views: "មើល",
      likes: "ចូលចិត្ត",
      shares: "ចែករំលែក",
      back: "ត្រលប់ក្រោយ",
      related: "ព័ត៌មានពាក់ព័ន្ធ",
      shareVia: "ចែករំលែកតាមរយៈ",
      copyLink: "ចម្លងតំណ",
      copied: "បានចម្លង!",
      viewImages: "មើលរូបភាពទាំងអស់",
      recentNews: "ព័ត៌មានថ្មីៗ",
      event: "ព្រឹត្តិការណ៍",
      news: "ព័ត៌មាន",
      announcement: "សេចក្តីជូនដំណឹង",
      other: "ផ្សេងៗ",
      prev: "មុន",
      next: "បន្ទាប់",
    },
    en: {
      title: "Latest News",
      viewAll: "View All",
      readMore: "Read More",
      views: "views",
      likes: "likes",
      shares: "shares",
      back: "Back",
      related: "Related News",
      shareVia: "Share via",
      copyLink: "Copy Link",
      copied: "Copied!",
      viewImages: "View All Images",
      recentNews: "Recent News",
      event: "Event",
      news: "News",
      announcement: "Announcement",
      other: "Other",
      prev: "Prev",
      next: "Next",
    },
  };
  const t = translations[currentLang];

  const getCategoryLabel = (key) => {
    const defaults = {
      event: t.event,
      news: t.news,
      announcement: t.announcement,
      other: t.other,
    };
    if (!categories || !Array.isArray(categories)) return defaults[key] || key;
    const obj = categories.find((c) => c[key]);
    return obj?.[key]?.[currentLang] || defaults[key] || key;
  };

  const formatDate = (ds) => {
    if (!ds) return "";
    const d = new Date(ds);
    if (currentLang === "km") {
      const m = [
        "មករា",
        "កុម្ភៈ",
        "មីនា",
        "មេសា",
        "ឧសភា",
        "មិថុនា",
        "កក្កដា",
        "សីហា",
        "កញ្ញា",
        "តុលា",
        "វិច្ឆិកា",
        "ធ្នូ",
      ];
      return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
    }
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ── reusable action bar for cards ─────────────────────────────────────────
  const CardActions = ({ item, size = 6 }) => (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleLike(item);
        }}
        className={`flex items-center gap-0.5 text-[7px] sm:text-[8px] transition-all duration-200 whitespace-nowrap ${item.liked ? "text-red-500 font-medium" : "text-gray-400 hover:text-red-400"}`}
      >
        <Heart
          size={size}
          className={`${item.liked ? "fill-red-500 text-red-500" : ""} flex-shrink-0`}
        />
        <span>{item.likes || 0}</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleShare(item);
        }}
        className={`flex items-center gap-0.5 text-[7px] sm:text-[8px] transition-all duration-200 whitespace-nowrap ${item.shared ? "text-green-600 font-medium" : "text-gray-400 hover:text-green-500"}`}
      >
        <Share2 size={size} className="flex-shrink-0" />
        <span>{item.shares || 0}</span>
      </button>
    </div>
  );

  // ── list item (right column) ──────────────────────────────────────────────
  const ListItem = ({ item, onClick }) => {
    const title = currentLang === "km" ? item.titleKh : item.titleEn;

    return (
      <div
        className="group cursor-pointer border-b border-gray-100 last:border-0 py-3 transition-all duration-300 hover:bg-gray-50 rounded-lg px-2"
        onClick={() => onClick(item)}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={item.mainImage || defaultImg}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultImg;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full whitespace-nowrap">
                {getCategoryLabel(item.category)}
              </span>
              <span className="text-[8px] sm:text-[9px] text-gray-400 flex items-center gap-0.5 whitespace-nowrap">
                <Calendar size={6} className="flex-shrink-0" />
                <span>{formatDate(item.publishedDate)}</span>
              </span>
            </div>
            <TruncatedText
              text={title}
              lines={2}
              className="text-[11px] sm:text-xs font-medium text-gray-800 mb-1.5 leading-relaxed"
            />
            <div className="flex items-center gap-2 mt-0.5 text-[8px] sm:text-[9px] text-gray-400 flex-wrap">
              {/* <span className="flex items-center gap-0.5 whitespace-nowrap">
                <Eye size={6} className="flex-shrink-0" />
                <span>{item.views || 0}</span>
              </span> */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(item);
                }}
                className={`flex items-center gap-0.5 transition-colors whitespace-nowrap ${item.liked ? "text-red-500" : "hover:text-red-400"}`}
              >
                {/* <Heart
                  size={6}
                  className={`${item.liked ? "fill-red-500 text-red-500" : ""} flex-shrink-0`}
                />
                <span>{item.likes || 0}</span> */}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(item);
                }}
                className={`flex items-center gap-0.5 transition-colors whitespace-nowrap ${item.shared ? "text-green-600" : "hover:text-green-500"}`}
              >
                {/* <Share2 size={6} className="flex-shrink-0" />
                <span>{item.shares || 0}</span> */}
              </button>
            </div>
          </div>
          <ChevronRight
            size={14}
            className="text-gray-400 flex-shrink-0 mt-1 group-hover:text-green-600 transition-colors"
          />
        </div>
      </div>
    );
  };

  // ── loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 sm:h-80 md:h-96 bg-gray-200 rounded-xl animate-pulse mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-56 sm:h-64 bg-gray-200 rounded-xl animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border p-3 sm:p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-2 flex gap-2">
                    <div className="w-14 h-14 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-green-600 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 break-words">
                {t.title}
              </h2>
            </div>
            <button
              onClick={handleViewAll}
              className="flex items-center text-xs sm:text-sm text-green-600 hover:text-green-700 transition-colors group font-medium whitespace-nowrap"
            >
              {t.viewAll}
              <ChevronRight
                size={14}
                className="ml-0.5 sm:ml-1 group-hover:translate-x-1 transition-transform flex-shrink-0"
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left column - Featured Slideshow Carousel */}
          <div className="lg:col-span-2">
            {featuredSlides.length > 0 && (
              <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6 group">
                <div className="relative h-56 sm:h-64 md:h-80 lg:h-96 bg-gray-900">
                  {featuredSlides.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${idx === slideIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                      onClick={() => handleReadMore(item)}
                    >
                      <img
                        src={item.mainImage || defaultImg}
                        alt={currentLang === "km" ? item.titleKh : item.titleEn}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = defaultImg;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                      {/* Slide Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                        <div className="max-w-2xl">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 bg-green-600 text-white text-[8px] sm:text-[9px] md:text-[10px] font-medium rounded-full flex items-center gap-0.5 whitespace-nowrap">
                              <Zap size={8} className="flex-shrink-0" />
                              <span>{getCategoryLabel(item.category)}</span>
                            </span>
                            <span className="flex items-center gap-0.5 text-white/80 text-[7px] sm:text-[8px] md:text-[9px] bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              <Calendar
                                size={6}
                                className="text-white flex-shrink-0"
                              />
                              <span>{formatDate(item.publishedDate)}</span>
                            </span>
                            {/* <span className="flex items-center gap-0.5 text-white/80 text-[7px] sm:text-[8px] md:text-[9px] bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              <Eye
                                size={6}
                                className="text-white flex-shrink-0"
                              />
                              <span>
                                {item.views || 0} {t.views}
                              </span>
                            </span> */}
                          </div>
                          <TruncatedText
                            text={
                              currentLang === "km" ? item.titleKh : item.titleEn
                            }
                            lines={2}
                            className="text-white text-[13px] sm:text-sm md:text-base lg:text-lg font-bold leading-tight mb-1"
                          />
                          <TruncatedText
                            text={
                              currentLang === "km"
                                ? item.summaryKh
                                : item.summaryEn
                            }
                            lines={2}
                            className="text-white/70 text-[9px] sm:text-[10px] md:text-xs mb-2 hidden sm:block"
                          />
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button className="flex items-center gap-0.5 bg-green-600 hover:bg-green-700 text-white text-[9px] sm:text-[10px] md:text-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg transition-colors whitespace-nowrap">
                              <span>{t.readMore}</span>{" "}
                              <ChevronRight
                                size={8}
                                className="flex-shrink-0"
                              />
                            </button>
                            {/* <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLike(item);
                                }}
                                className={`flex items-center gap-0.5 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-lg transition-colors whitespace-nowrap ${item.liked ? "text-red-400" : ""}`}
                              >
                                <Heart
                                  size={7}
                                  className={`${item.liked ? "fill-red-400" : ""} flex-shrink-0`}
                                />
                                <span>{item.likes || 0}</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(item);
                                }}
                                className={`flex items-center gap-0.5 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-lg transition-colors whitespace-nowrap ${item.shared ? "text-green-400" : ""}`}
                              >
                                <Share2 size={7} className="flex-shrink-0" />
                                <span>{item.shares || 0}</span>
                              </button>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {featuredSlides.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSlideIndex(
                          (prev) =>
                            (prev - 1 + featuredSlides.length) %
                            featuredSlides.length,
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setSlideIndex(
                          (prev) => (prev + 1) % featuredSlides.length,
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ChevronRightIcon size={18} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                      {featuredSlides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSlideIndex(idx)}
                          className={`transition-all duration-300 rounded-full ${
                            idx === slideIndex
                              ? "bg-green-500 w-3 h-1"
                              : "bg-white/50 hover:bg-white/80 w-1 h-1"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Grid Cards - 2 lines for title and summary */}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {featuredSlides.slice(0, 6).map((item) => {
                const title =
                  currentLang === "km" ? item.titleKh : item.titleEn;
                const summary =
                  currentLang === "km" ? item.summaryKh : item.summaryEn;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 h-full flex flex-col"
                    onClick={() => handleReadMore(item)}
                  >
                    <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.mainImage || defaultImg}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = defaultImg;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <span className="px-1.5 py-0.5 bg-green-600 text-white text-[8px] sm:text-[9px] font-medium rounded-full flex items-center gap-0.5 whitespace-nowrap">
                          <Zap size={7} className="flex-shrink-0" />
                          <span>{getCategoryLabel(item.category)}</span>
                        </span>
                      </div>
                      {item.images?.length > 1 && (
                        <div className="absolute top-2 right-2">
                          <span className="px-1 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[7px] rounded-md flex items-center gap-0.5 whitespace-nowrap">
                            <svg
                              className="w-1.5 h-1.5 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{item.images.length}</span>
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white/80 text-[7px] sm:text-[8px] bg-black/30 backdrop-blur-sm px-1 py-0.5 rounded-full whitespace-nowrap">
                        <Calendar size={6} className="flex-shrink-0" />
                        <span>{formatDate(item.publishedDate)}</span>
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 flex-1 flex flex-col">
                      <TruncatedText
                        text={title}
                        lines={2}
                        className="text-[11px] sm:text-xs font-semibold text-gray-800 mb-1 leading-relaxed"
                      />
                      <TruncatedText
                        text={summary}
                        lines={2}
                        className="text-[9px] sm:text-[10px] text-gray-500 mb-2 hidden sm:block"
                      />
                      <div className="flex items-right justify-end pt-1 border-t border-gray-100 mt-auto">
                        <button className="flex items-center gap-0.5 text-[8px] sm:text-[9px] text-green-600 hover:text-green-700 font-medium whitespace-nowrap">
                          <span>{t.readMore}</span>
                          <ChevronRight size={7} className="flex-shrink-0" />
                        </button>
                        {/* <div className="flex items-center gap-1 sm:gap-1.5 text-[7px] sm:text-[8px]">
                          <span className="flex items-center gap-0.5 text-gray-400 whitespace-nowrap">
                            <Eye size={6} className="flex-shrink-0" />
                            <span>{item.views || 0}</span>
                          </span>
                          <CardActions item={item} size={6} />
                        </div> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {leftTotalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setLeftPage((p) => Math.max(1, p - 1))}
                  disabled={leftPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                  {leftPage} / {leftTotalPages}
                </span>
                <button
                  onClick={() =>
                    setLeftPage((p) => Math.min(leftTotalPages, p + 1))
                  }
                  disabled={leftPage === leftTotalPages}
                  className="p-1.5 sm:p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Right column - Recent News List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Newspaper
                    size={14}
                    className="sm:w-4 sm:h-4 text-green-600 flex-shrink-0"
                  />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 break-words">
                    {t.recentNews}
                  </h3>
                </div>
                {rightTotalPages > 1 && (
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <button
                      onClick={() => setRightPage((p) => Math.max(1, p - 1))}
                      disabled={rightPage === 1}
                      className="p-0.5 sm:p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                      {rightPage}/{rightTotalPages}
                    </span>
                    <button
                      onClick={() =>
                        setRightPage((p) => Math.min(rightTotalPages, p + 1))
                      }
                      disabled={rightPage === rightTotalPages}
                      className="p-0.5 sm:p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                )}
              </div>
              <div className="p-1 sm:p-2">
                {localRightNews.map((item) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    onClick={handleReadMore}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail modal with responsive text wrapping ──────────────────────── */}
      {showDetail && selectedNews && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <button
                onClick={handleCloseDetail}
                className="flex items-center space-x-1.5 text-gray-500 hover:text-green-600 transition-colors group"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform flex-shrink-0"
                />
                <span className="text-xs sm:text-sm whitespace-nowrap">
                  {t.back}
                </span>
              </button>
              <button
                onClick={() => handleShare(selectedNews)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <Share2 size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="relative h-56 sm:h-80 md:h-96 lg:h-[400px] rounded-xl overflow-hidden mb-6 sm:mb-8 bg-gray-100">
              <img
                src={selectedNews.mainImage || defaultImg}
                alt={
                  currentLang === "km"
                    ? selectedNews.titleKh
                    : selectedNews.titleEn
                }
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = defaultImg;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-600 text-white text-[10px] sm:text-sm font-medium rounded-lg shadow-lg whitespace-nowrap">
                  {getCategoryLabel(selectedNews.category)}
                </span>
              </div>
              {selectedNews.images?.length > 1 && (
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <span className="px-1.5 py-1 sm:px-2.5 sm:py-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-xs rounded-lg flex items-center gap-1 whitespace-nowrap">
                    <svg
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{selectedNews.images.length}</span>
                  </span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white leading-tight break-words hyphens-auto">
                  {currentLang === "km"
                    ? selectedNews.titleKh
                    : selectedNews.titleEn}
                </h1>
              </div>
            </div>

            {/* Stats + interactive like/share */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 pb-4 sm:pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-sm text-gray-500 whitespace-nowrap">
                <Calendar size={14} className="text-green-600 flex-shrink-0" />
                <span>{formatDate(selectedNews.publishedDate)}</span>
              </span>
              {/* <span className="flex items-center gap-1.5 text-[11px] sm:text-sm text-gray-500 whitespace-nowrap">
                <Eye size={14} className="text-green-600 flex-shrink-0" />
                <span>
                  {selectedNews.views || 0} {t.views}
                </span>
              </span>
              <button
                onClick={() => handleLike(selectedNews)}
                className={`flex items-center gap-1.5 text-[11px] sm:text-sm px-2.5 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                  selectedNews.liked
                    ? "bg-red-50 border-red-200 text-red-500 font-medium"
                    : "border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-400"
                }`}
              >
                <Heart
                  size={14}
                  className={`${selectedNews.liked ? "fill-red-500 text-red-500" : ""} flex-shrink-0`}
                />
                <span>
                  {selectedNews.likes || 0} {t.likes}
                </span>
              </button>
              <button
                onClick={() => handleShare(selectedNews)}
                className={`flex items-center gap-1.5 text-[11px] sm:text-sm px-2.5 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                  selectedNews.shared
                    ? "bg-green-50 border-green-200 text-green-600 font-medium"
                    : "border-gray-200 text-gray-500 hover:bg-green-50 hover:border-green-200 hover:text-green-500"
                }`}
              >
                <Share2 size={14} className="flex-shrink-0" />
                <span>
                  {selectedNews.shares || 0} {t.shares}
                </span>
              </button> */}
            </div>

            {/* Content with proper text wrapping */}
            <div
              className="prose prose-sm max-w-none mb-8 text-gray-600 leading-relaxed text-sm sm:text-base break-words overflow-x-auto"
              dangerouslySetInnerHTML={{
                __html:
                  currentLang === "km"
                    ? selectedNews.contentKh
                    : selectedNews.contentEn,
              }}
            />

            {selectedNews.images?.length > 1 && (
              <div className="mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-green-600 mb-3 sm:mb-4 break-words">
                  {t.viewImages}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {selectedNews.images.slice(0, 8).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleOpenLightbox(idx)}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100"
                    >
                      <img
                        src={img}
                        alt={`img-${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = defaultImg;
                        }}
                      />
                      {idx === 7 && selectedNews.images.length > 8 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                            +{selectedNews.images.length - 8}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      {showLightbox && selectedNews && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center">
          <button
            onClick={handleCloseLightbox}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-white hover:text-gray-300"
          >
            <X size={24} className="sm:w-8 sm:h-8" />
          </button>
          <button
            onClick={handlePrevImage}
            disabled={selectedImageIndex === 0}
            className={`absolute left-2 sm:left-4 z-10 text-white hover:text-gray-300 ${selectedImageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ChevronLeft size={32} className="sm:w-12 sm:h-12" />
          </button>
          <button
            onClick={handleNextImage}
            disabled={selectedImageIndex === selectedNews.images.length - 1}
            className={`absolute right-2 sm:right-4 z-10 text-white hover:text-gray-300 ${selectedImageIndex === selectedNews.images.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ChevronRightIcon size={32} className="sm:w-12 sm:h-12" />
          </button>
          <div className="max-w-[90vw] max-h-[90vh] relative">
            <img
              src={selectedNews.images[selectedImageIndex]}
              alt={`img-${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              onError={(e) => {
                e.target.src = defaultImg;
              }}
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm whitespace-nowrap">
              {selectedImageIndex + 1} / {selectedNews.images.length}
            </div>
          </div>
        </div>
      )}

      {/* ── Share modal ───────────────────────────────────────────────────── */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70]">
          <div className="bg-white rounded-xl p-4 sm:p-5 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                {t.shareVia}
              </h3>
              <button
                onClick={() => setShareModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[
                {
                  label: "Facebook",
                  bg: "bg-blue-600 hover:bg-blue-700",
                  icon: <Facebook size={14} />,
                },
                {
                  label: "Twitter",
                  bg: "bg-sky-500 hover:bg-sky-600",
                  icon: <Twitter size={14} />,
                },
                {
                  label: "LinkedIn",
                  bg: "bg-blue-700 hover:bg-blue-800",
                  icon: <Linkedin size={14} />,
                },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    if (selectedNews) handleShare(selectedNews);
                    setShareModal(false);
                  }}
                  className="flex flex-col items-center space-y-1 p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${s.bg} text-white rounded-full flex items-center justify-center transition-colors`}
                  >
                    {s.icon}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-gray-500 whitespace-nowrap">
                    {s.label}
                  </span>
                </button>
              ))}
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center space-y-1 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <Link2 size={14} />
                </div>
                <span className="text-[9px] sm:text-[10px] text-gray-500 whitespace-nowrap">
                  {t.copyLink}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsSection;
