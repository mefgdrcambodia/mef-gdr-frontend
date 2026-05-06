import React, { useState, useEffect } from "react";
import {
  Calendar, Eye, Heart, Share2, ArrowLeft, Search, X,
  ChevronLeft, ChevronRight as ChevronRightIcon, ArrowUp,
  Link2, Grid, List, Filter, ChevronDown,
  Newspaper, Megaphone, MoreHorizontal, FileText,
  Facebook, Twitter, Linkedin,
} from "lucide-react";
import Container from "../components/ui/Container.jsx";
import GlobalBanner from "../components/ui/GlobalBanner.jsx";
import RunningText from "../components/ui/RunningText";
import { useNews } from "../hooks/useNews";
import defaultImg from "../images/defuat_img.jpg";

// ── localStorage helpers ────────────────────────────────────────────────────
const getCount = (key) => parseInt(localStorage.getItem(key) || "0");
const setCount = (key, val) => localStorage.setItem(key, String(val));
const hasLiked  = (id) => localStorage.getItem(`news_liked_${id}`)  === "1";
const hasShared = (id) => localStorage.getItem(`news_shared_${id}`) === "1";

const mergeLocalCounts = (items) =>
  items.map((item) => ({
    ...item,
    views:  Math.max(item.views  || 0, getCount(`news_views_${item.id}`)),
    likes:  Math.max(item.likes  || 0, getCount(`news_likes_${item.id}`)),
    shares: Math.max(item.shares || 0, getCount(`news_shares_${item.id}`)),
    liked:  hasLiked(item.id),
    shared: hasShared(item.id),
  }));
// ───────────────────────────────────────────────────────────────────────────

const AllNewsPage = () => {
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem("language") || "km");
  const [activeTab, setActiveTab]           = useState("");
  const [searchQuery, setSearchQuery]       = useState("");
  const [currentPage, setCurrentPage]       = useState(1);
  const [selectedNews, setSelectedNews]     = useState(null);
  const [showDetail, setShowDetail]         = useState(false);
  const [showScrollTop, setShowScrollTop]   = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showLightbox, setShowLightbox]     = useState(false);
  const [viewMode, setViewMode]             = useState("grid");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [shareModal, setShareModal]         = useState(false);
  const [localNews, setLocalNews]           = useState([]);

  const itemsPerPage = 9;

  const { loading, news: rawNews, total, totalPages, categories } = useNews({
    page: currentPage, limit: itemsPerPage, category: activeTab,
  });

  // Sync rawNews → localNews with localStorage
  useEffect(() => {
    setLocalNews(rawNews.length > 0 ? mergeLocalCounts(rawNews) : []);
  }, [rawNews]);

  useEffect(() => {
    const handler = (e) => setCurrentLang(e.detail.language);
    window.addEventListener("languagechange", handler);
    return () => window.removeEventListener("languagechange", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (showDetail || showLightbox || shareModal) ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [showDetail, showLightbox, shareModal]);

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (categoryDropdownOpen && !e.target.closest(".category-dropdown-container"))
        setCategoryDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [categoryDropdownOpen]);

  // ── state patcher (cards + open detail stay in sync) ─────────────────────
  const patchItem = (id, patch) => {
    setLocalNews((prev) => prev.map((n) => n.id === id ? { ...n, ...patch } : n));
    setSelectedNews((prev) => prev?.id === id ? { ...prev, ...patch } : prev);
  };

  // ── action handlers ───────────────────────────────────────────────────────
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
    const key      = `news_likes_${newsItem.id}`;
    const likedKey = `news_liked_${newsItem.id}`;
    const already  = hasLiked(newsItem.id);
    const newLikes = already ? Math.max(0, getCount(key) - 1) : getCount(key) + 1;
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

  const handleCloseDetail  = () => { setShowDetail(false); setSelectedNews(null); setSelectedImageIndex(null); };
  const handleOpenLightbox = (i) => { setSelectedImageIndex(i); setShowLightbox(true); };
  const handleCloseLightbox= () => { setShowLightbox(false); setSelectedImageIndex(null); };
  const handlePrevImage    = () => { if (selectedImageIndex > 0) setSelectedImageIndex(selectedImageIndex - 1); };
  const handleNextImage    = () => { if (selectedImageIndex < selectedNews.images.length - 1) setSelectedImageIndex(selectedImageIndex + 1); };
  const clearFilters       = () => { setSearchQuery(""); setActiveTab(""); setCurrentPage(1); };
  const handleCategoryChange = (cat) => { setActiveTab(cat); setCurrentPage(1); setCategoryDropdownOpen(false); };
  const scrollToTop        = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ── derived ───────────────────────────────────────────────────────────────
  const filteredNews = localNews.filter((item) => {
    if (!searchQuery) return true;
    const title   = currentLang === "km" ? item.titleKh : item.titleEn;
    const summary = currentLang === "km" ? item.summaryKh : item.summaryEn;
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           summary.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const startItem  = filteredNews.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem    = Math.min(currentPage * itemsPerPage, filteredNews.length);
  const relatedNews = localNews
    .filter((i) => i.id !== selectedNews?.id && i.category === selectedNews?.category)
    .slice(0, 3);

  // ── category helpers ──────────────────────────────────────────────────────
  const getCategoryDisplayName = (key) => {
    if (!categories || !Array.isArray(categories) || !key) return key;
    const found = categories.find((c) => c[key]);
    if (!found?.[key]) return key;
    return currentLang === "km" ? found[key].kh || found[key].en || key : found[key].en || found[key].kh || key;
  };
  const getCategoryColor = (key) => ({
    event:        "bg-pink-100 text-pink-700 border-pink-200",
    news:         "bg-indigo-100 text-indigo-700 border-indigo-200",
    announcement: "bg-amber-100 text-amber-700 border-amber-200",
    other:        "bg-gray-100 text-gray-700 border-gray-200",
  }[key] || "bg-gray-100 text-gray-700 border-gray-200");

  const getCategoryIcon = (key) => ({
    event:        <Calendar size={14} />,
    news:         <Newspaper size={14} />,
    announcement: <Megaphone size={14} />,
    other:        <MoreHorizontal size={14} />,
  }[key] || <FileText size={14} />);

  // ── translations ──────────────────────────────────────────────────────────
  const translations = {
    km: {
      title: "ព័ត៌មានទាំងអស់", subtitle: "ព័ត៌មានថ្មីៗ និងសេចក្តីប្រកាសព័ត៌មាន",
      search: "ស្វែងរកព័ត៌មាន...", filter: "តម្រង", allCategories: "គ្រប់ប្រភេទ",
      readMore: "អានបន្ត", views: "មើល", likes: "ចូលចិត្ត", shares: "ចែករំលែក",
      back: "ត្រលប់ក្រោយ", results: "លទ្ធផល", related: "ព័ត៌មានពាក់ព័ន្ធ",
      clearAll: "សម្អាតទាំងអស់", noNews: "រកមិនឃើញព័ត៌មាន",
      tryAgain: "សូមព្យាយាមស្វែងរកម្តងទៀត", viewImages: "មើលរូបភាពទាំងអស់",
      gridView: "ទម្រង់ក្រឡា", listView: "ទម្រង់បញ្ជី", totalNews: "ព័ត៌មានសរុប",
      showing: "បង្ហាញ", ofTotal: "នៃ", loading: "កំពុងផ្ទុក...", noCategories: "គ្មានប្រភេទ",
      shareVia: "ចែករំលែកតាមរយៈ", copyLink: "ចម្លងតំណ", copied: "បានចម្លង!",
    },
    en: {
      title: "All News", subtitle: "Latest news and announcements from the General Department",
      search: "Search news...", filter: "Filter", allCategories: "All Categories",
      readMore: "Read More", views: "views", likes: "likes", shares: "shares",
      back: "Back", results: "results", related: "Related News",
      clearAll: "Clear All", noNews: "No news found", tryAgain: "Please try searching again",
      viewImages: "View All Images", gridView: "Grid View", listView: "List View",
      totalNews: "Total News", showing: "Showing", ofTotal: "of",
      loading: "Loading...", noCategories: "No categories",
      shareVia: "Share via", copyLink: "Copy Link", copied: "Copied!",
    },
  };
  const t = translations[currentLang];

  const formatDate = (ds) => {
    if (!ds) return "";
    const d = new Date(ds);
    if (currentLang === "km") {
      const m = ["មករា","កុម្ភៈ","មីនា","មេសា","ឧសភា","មិថុនា","កក្កដា","សីហា","កញ្ញា","តុលា","វិច្ឆិកា","ធ្នូ"];
      return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
    }
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // ── reusable ActionBar ────────────────────────────────────────────────────
  const ActionBar = ({ item }) => (
    <div className="flex items-center gap-3">
      <button
        onClick={(e) => { e.stopPropagation(); handleLike(item); }}
        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all duration-200 ${
          item.liked ? "bg-red-50 border-red-200 text-red-500 font-medium" : "border-transparent text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-400"
        }`}
      >
        {/* <Heart size={13} className={item.liked ? "fill-red-500 text-red-500" : ""} />
        <span>{item.likes || 0}</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); handleShare(item); }}
        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all duration-200 ${
          item.shared ? "bg-green-50 border-green-200 text-green-600 font-medium" : "border-transparent text-gray-400 hover:bg-green-50 hover:border-green-200 hover:text-green-500"
        }`}
      >
        <Share2 size={13} />
        <span>{item.shares || 0}</span> */}
      </button>
    </div>
  );

  // ── Grid view ─────────────────────────────────────────────────────────────
  const GridView = ({ items }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const title   = currentLang === "km" ? item.titleKh : item.titleEn;
        const summary = currentLang === "km" ? item.summaryKh : item.summaryEn;
        return (
          <div key={item.id}
            className="group bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-[#4CAF50]/30 transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => handleReadMore(item)}>
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <img src={item.mainImage || defaultImg} alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = defaultImg; }} />
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                  {getCategoryIcon(item.category)}{getCategoryDisplayName(item.category)}
                </span>
              </div>
              {item.images?.length > 1 && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {item.images.length}
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center text-xs text-gray-500 mb-2 gap-3">
                <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(item.publishedDate)}</span>
                <span className="flex items-center gap-1"><Eye size={12} />{item.views || 0}</span>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2 leading-relaxed line-clamp-2 min-h-[3rem] group-hover:text-[#2E7D32] transition-colors">{title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{summary}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <ActionBar item={item} />
                <span className="text-xs text-[#4CAF50] font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  {t.readMore}<ChevronRightIcon size={14} className="ml-1" />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── List view ─────────────────────────────────────────────────────────────
  const ListView = ({ items }) => (
    <div className="space-y-4">
      {items.map((item) => {
        const title   = currentLang === "km" ? item.titleKh : item.titleEn;
        const summary = currentLang === "km" ? item.summaryKh : item.summaryEn;
        return (
          <div key={item.id}
            className="group bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-[#4CAF50]/30 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col md:flex-row"
            onClick={() => handleReadMore(item)}>
            <div className="relative md:w-64 h-48 md:h-auto overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={item.mainImage || defaultImg} alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = defaultImg; }} />
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                  {getCategoryIcon(item.category)}{getCategoryDisplayName(item.category)}
                </span>
              </div>
              {item.images?.length > 1 && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {item.images.length}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 p-5">
              <div className="flex items-center text-xs text-gray-500 mb-2 gap-3">
                <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(item.publishedDate)}</span>
                {/* <span className="flex items-center gap-1"><Eye size={12} />{item.views || 0}</span> */}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 leading-relaxed group-hover:text-[#2E7D32] transition-colors line-clamp-1">{title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{summary}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <ActionBar item={item} />
                <span className="text-xs text-[#4CAF50] font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  {t.readMore}<ChevronRightIcon size={14} className="ml-1" />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 z-50 p-3 bg-[#2E7D32] text-white rounded-full shadow-lg hover:bg-[#4CAF50] transition-all duration-300 hover:scale-110">
          <ArrowUp size={20} />
        </button>
      )}

      <RunningText />
      <GlobalBanner title={t.title} subtitle={t.subtitle} height="h-[180px] md:h-[250px] lg:h-[300px]" showBreadcrumb={true} />

      <Container className="py-8">
        <div className="mb-6">
          <span className="text-sm text-gray-600 font-medium">{total} {t.totalNews.toLowerCase()}</span>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="p-5">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder={t.search} value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent bg-gray-50/50 text-sm" />
              </div>

              <div className="relative lg:w-64 category-dropdown-container">
                <button onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-left text-sm flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <span className={activeTab ? "text-gray-900" : "text-gray-500"}>
                      {activeTab ? getCategoryDisplayName(activeTab) : t.allCategories}
                    </span>
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto">
                    <button onClick={() => handleCategoryChange("")}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${!activeTab ? "bg-green-50 text-[#4CAF50]" : "text-gray-700"}`}>
                      <Filter size={14} className={!activeTab ? "text-[#4CAF50]" : "text-gray-400"} />{t.allCategories}
                    </button>
                    {!loading && categories.length > 0 ? categories.map((cat, i) => {
                      const key = Object.keys(cat)[0];
                      const label = currentLang === "km" ? cat[key].kh || cat[key].en || key : cat[key].en || cat[key].kh || key;
                      return (
                        <button key={i} onClick={() => handleCategoryChange(key)}
                          className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${activeTab === key ? "bg-green-50 text-[#4CAF50]" : "text-gray-700"}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center ${getCategoryColor(key).split(" ")[0]}`}>{getCategoryIcon(key)}</span>
                          {label}
                        </button>
                      );
                    }) : <div className="px-4 py-2.5 text-sm text-gray-400 text-center">{loading ? t.loading : t.noCategories}</div>}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === "grid" ? "bg-white text-[#4CAF50] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  <Grid size={18} />
                </button>
                <button onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === "list" ? "bg-white text-[#4CAF50] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  <List size={18} />
                </button>
              </div>

              {(activeTab || searchQuery) && (
                <button onClick={clearFilters} className="px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2">
                  <X size={14} />{t.clearAll}
                </button>
              )}
            </div>
          </div>

          {(activeTab || searchQuery) && (
            <div className="px-5 pb-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
              <span className="text-xs text-gray-500">{t.filter}:</span>
              {activeTab && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getCategoryColor(activeTab)}`}>
                  {getCategoryIcon(activeTab)}{getCategoryDisplayName(activeTab)}
                  <button onClick={() => { setActiveTab(""); setCurrentPage(1); }} className="ml-1 hover:bg-black/10 rounded-full p-0.5"><X size={12} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  <Search size={12} />"{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5"><X size={12} /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {!loading && (
          <div className="text-sm text-gray-500 mb-4">
            {filteredNews.length > 0 ? `${t.showing} ${startItem}-${endItem} ${t.ofTotal} ${filteredNews.length} ${t.results}` : t.noNews}
          </div>
        )}

        {loading ? (
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Search size={40} className="text-gray-400" /></div>
            <p className="text-gray-500 font-medium text-lg mb-2">{t.noNews}</p>
            <p className="text-gray-400 text-sm">{t.tryAgain}</p>
            {(activeTab || searchQuery) && (
              <button onClick={clearFilters} className="mt-4 px-4 py-2 text-sm text-[#4CAF50] hover:bg-green-50 rounded-lg transition-colors">{t.clearAll}</button>
            )}
          </div>
        ) : viewMode === "grid" ? <GridView items={filteredNews} /> : <ListView items={filteredNews} />}

        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={18} />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let p;
              if (totalPages <= 5) p = i + 1;
              else if (currentPage <= 3) p = i + 1;
              else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
              else p = currentPage - 2 + i;
              return (
                <button key={i} onClick={() => setCurrentPage(p)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${currentPage === p ? "bg-[#4CAF50] text-white shadow-md" : "border border-gray-200 hover:bg-gray-50 text-gray-700"}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRightIcon size={18} />
            </button>
          </div>
        )}
      </Container>

      {/* ── Detail modal ──────────────────────────────────────────────────── */}
      {showDetail && selectedNews && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
              <button onClick={handleCloseDetail} className="flex items-center space-x-2 text-gray-600 hover:text-[#2E7D32] transition-colors group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /><span className="text-sm">{t.back}</span>
              </button>
              <button onClick={() => handleShare(selectedNews)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8 bg-gray-100">
              <img src={selectedNews.mainImage || defaultImg}
                alt={currentLang === "km" ? selectedNews.titleKh : selectedNews.titleEn}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = defaultImg; }} />
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border bg-white/90 backdrop-blur-sm ${getCategoryColor(selectedNews.category)}`}>
                  {getCategoryIcon(selectedNews.category)}{getCategoryDisplayName(selectedNews.category)}
                </span>
              </div>
              {selectedNews.images?.length > 1 && (
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {selectedNews.images.length}
                  </span>
                </div>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-6 leading-tight">
              {currentLang === "km" ? selectedNews.titleKh : selectedNews.titleEn}
            </h1>

            {/* Stats row with interactive like + share */}
            <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar size={16} className="text-[#4CAF50]" />{formatDate(selectedNews.publishedDate)}
              </span>
              {/* <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Eye size={16} className="text-[#4CAF50]" />{selectedNews.views || 0} {t.views}
              </span> */}
              {/* Like */}
              {/* <button onClick={() => handleLike(selectedNews)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                  selectedNews.liked ? "bg-red-50 border-red-200 text-red-500 font-medium" : "border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-400"
                }`}>
                <Heart size={16} className={selectedNews.liked ? "fill-red-500 text-red-500" : ""} />
                {selectedNews.likes || 0} {t.likes}
              </button> */}
              {/* Share */}
              {/* <button onClick={() => handleShare(selectedNews)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                  selectedNews.shared ? "bg-green-50 border-green-200 text-green-600 font-medium" : "border-gray-200 text-gray-500 hover:bg-green-50 hover:border-green-200 hover:text-green-500"
                }`}>
                <Share2 size={16} />{selectedNews.shares || 0} {t.shares}
              </button> */}
            </div>

            <div className="prose prose-sm max-w-none mb-12 text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: currentLang === "km" ? selectedNews.contentKh : selectedNews.contentEn }} />
            </div>

            {selectedNews.images?.length > 1 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-green-600 mb-4">{t.viewImages}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedNews.images.slice(0, 8).map((img, idx) => (
                    <div key={idx} onClick={() => handleOpenLightbox(idx)}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group bg-gray-100">
                      <img src={img} alt={`img-${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { e.target.src = defaultImg; }} />
                      {idx === 7 && selectedNews.images.length > 8 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium">+{selectedNews.images.length - 8}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {relatedNews.length > 0 && (
              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-lg font-bold text-green-600 mb-6">{t.related}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedNews.map((item) => (
                    <div key={item.id} className="group cursor-pointer border border-gray-100 rounded-xl hover:shadow-md hover:border-[#4CAF50]/30 transition-all overflow-hidden"
                      onClick={() => handleReadMore(item)}>
                      <div className="relative h-32 overflow-hidden bg-gray-100">
                        <img src={item.mainImage || defaultImg}
                          alt={currentLang === "km" ? item.titleKh : item.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = defaultImg; }} />
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#2E7D32] line-clamp-2 mb-2">
                          {currentLang === "km" ? item.titleKh : item.titleEn}
                        </h4>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={10} />{formatDate(item.publishedDate)}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {/* <span className="flex items-center gap-0.5"><Eye size={10} />{item.views || 0}</span>
                            <span className={`flex items-center gap-0.5 ${item.liked ? "text-red-400" : ""}`}>
                              <Heart size={10} className={item.liked ? "fill-red-400" : ""} />{item.likes || 0}
                            </span>
                            <span className={`flex items-center gap-0.5 ${item.shared ? "text-green-500" : ""}`}>
                              <Share2 size={10} />{item.shares || 0}
                            </span> */}
                          </div>
                        </div>
                      </div>
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
          <button onClick={handleCloseLightbox} className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"><X size={32} /></button>
          <button onClick={handlePrevImage} disabled={selectedImageIndex === 0}
            className={`absolute left-4 z-10 text-white hover:text-gray-300 transition-colors ${selectedImageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}>
            <ChevronLeft size={48} />
          </button>
          <button onClick={handleNextImage} disabled={selectedImageIndex === selectedNews.images.length - 1}
            className={`absolute right-4 z-10 text-white hover:text-gray-300 transition-colors ${selectedImageIndex === selectedNews.images.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}>
            <ChevronRightIcon size={48} />
          </button>
          <div className="max-w-[90vw] max-h-[90vh] relative">
            <img src={selectedNews.images[selectedImageIndex]} alt={`img-${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              onError={(e) => { e.target.src = defaultImg; }} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {selectedNews.images.length}
            </div>
          </div>
        </div>
      )}

      {/* ── Share modal ───────────────────────────────────────────────────── */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70]">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">{t.shareVia}</h3>
              <button onClick={() => setShareModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Facebook", bg: "bg-blue-600 hover:bg-blue-700", icon: <Facebook size={16} /> },
                { label: "Twitter",  bg: "bg-sky-500 hover:bg-sky-600",   icon: <Twitter  size={16} /> },
                { label: "LinkedIn", bg: "bg-blue-700 hover:bg-blue-800", icon: <Linkedin size={16} /> },
              ].map((s) => (
                <button key={s.label}
                  onClick={() => { if (selectedNews) handleShare(selectedNews); setShareModal(false); }}
                  className="flex flex-col items-center gap-1.5 p-2 hover:bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 ${s.bg} text-white rounded-full flex items-center justify-center transition-colors`}>{s.icon}</div>
                  <span className="text-[10px] text-gray-500">{s.label}</span>
                </button>
              ))}
              <button onClick={handleCopyLink} className="flex flex-col items-center gap-1.5 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full flex items-center justify-center transition-colors"><Link2 size={16} /></div>
                <span className="text-[10px] text-gray-500">{t.copyLink}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllNewsPage;