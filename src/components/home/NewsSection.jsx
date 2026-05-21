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
  Newspaper,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNews } from "../../hooks/useNews";

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
      }}
    >
      {text}
    </div>
  );
};

const NewsSection = ({ layout = "default" }) => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState("km");
  const [selectedNews, setSelectedNews] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [shareModal, setShareModal] = useState(false);

  const [localRightNews, setLocalRightNews] = useState([]);
  const [rightPage, setRightPage] = useState(1);

  // Limit to 5 items per page
  const {
    loading: rightLoading,
    news: rawRightNews,
    totalPages: rightTotalPages,
  } = useNews({ page: rightPage, limit: 5 });

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
    document.body.style.overflow = showDetail || shareModal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDetail, shareModal]);

  const patchItem = (id, patch) => {
    setLocalRightNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    );
    setSelectedNews((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  };

  const handleReadMore = (newsItem) => {
    const key = `news_views_${newsItem.id}`;
    const newViews = getCount(key) + 1;
    setCount(key, newViews);
    patchItem(newsItem.id, { views: newViews });
    setSelectedNews({ ...newsItem, views: newViews });
    setShowDetail(true);
  };

  const handleLike = (newsItem) => {
    const key = `news_likes_${newsItem.id}`;
    const likedKey = `news_liked_${newsItem.id}`;
    const already = hasLiked(newsItem.id);
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
  };

  const handleViewAll = () => navigate("/news");

  const translations = {
    km: {
      title: "ព័ត៌មានថ្មីៗ",
      viewAll: "មើលទាំងអស់",
      readMore: "អានបន្ត",
      views: "មើល",
      likes: "ចូលចិត្ត",
      shares: "ចែករំលែក",
      back: "ត្រលប់ក្រោយ",
      recentNews: "ព័ត៌មានថ្មីៗ",
      shareVia: "ចែករំលែកតាមរយៈ",
      copyLink: "ចម្លងតំណ",
      copied: "បានចម្លង!",
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
      recentNews: "Recent News",
      shareVia: "Share via",
      copyLink: "Copy Link",
      copied: "Copied!",
      prev: "Prev",
      next: "Next",
    },
  };
  const t = translations[currentLang];

  const formatDate = (ds) => {
    if (!ds) return "";
    const d = new Date(ds);
    if (currentLang === "km") {
      const m = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
      return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
    }
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const ListItem = ({ item, onClick }) => {
    const title = currentLang === "km" ? item.titleKh : item.titleEn;
    return (
      <div
        className="group cursor-pointer border-b border-gray-100 last:border-0 py-4 transition-all duration-300 hover:bg-gray-50 rounded-lg px-3"
        onClick={() => onClick(item)}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <img src={item.mainImage} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
                {currentLang === "km" ? "ព័ត៌មាន" : "News"}
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                <Calendar size={8} />
                <span>{formatDate(item.publishedDate)}</span>
              </span>
            </div>
            <TruncatedText text={title} lines={2} className="text-sm font-semibold text-gray-800 mb-2 leading-relaxed group-hover:text-green-600 transition-colors" />
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(item);
                }}
                className={`flex items-center gap-1 text-[10px] transition-colors ${item.liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
              >
                <Heart size={10} className={item.liked ? "fill-red-500" : ""} />
                <span>{item.likes || 0}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(item);
                }}
                className={`flex items-center gap-1 text-[10px] transition-colors ${item.shared ? "text-green-600" : "text-gray-400 hover:text-green-500"}`}
              >
                <Share2 size={10} />
                <span>{item.shares || 0}</span>
              </button>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400 self-center group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    );
  };

  // List-Only Layout for Homepage Right Side
  if (layout === "list-only") {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Header - Consistent style with Legal */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center border-b border-gray-200 pb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
                  {t.title}
                </span>
              </div>
              <h2 className="text-gray-800 text-xl md:text-2xl font-semibold">
                {t.title}
              </h2>
              <p className="text-gray-500 text-xs md:text-sm mt-1">
                {currentLang === 'km' ? 'ព័ត៌មាន និងព្រឹត្តិការណ៍ថ្មីៗ' : 'Latest news and events'}
              </p>
            </div>
          </div>
        </div>

        {/* News List - Full height cards */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Newspaper size={16} className="text-green-600" />
              <h3 className="text-base font-semibold text-gray-800">
                {t.recentNews}
              </h3>
            </div>
            {rightTotalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRightPage((p) => Math.max(1, p - 1))}
                  disabled={rightPage === 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-gray-500">
                  {rightPage}/{rightTotalPages}
                </span>
                <button
                  onClick={() => setRightPage((p) => Math.min(rightTotalPages, p + 1))}
                  disabled={rightPage === rightTotalPages}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {rightLoading ? (
              // Show 5 loading skeletons
              <div className="p-2 space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-4 flex gap-3 animate-pulse px-3">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : localRightNews.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No news available</p>
              </div>
            ) : (
              <div className="p-2">
                {localRightNews.slice(0, 5).map((item) => (
                  <ListItem key={item.id} item={item} onClick={handleReadMore} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View More Button at Bottom */}
        <div className="mt-6 flex justify-center flex-shrink-0">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            <span>{t.viewAll}</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Detail Modal */}
        {showDetail && selectedNews && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
              <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                <button onClick={() => setShowDetail(false)} className="flex items-center space-x-1.5 text-gray-500 hover:text-green-600 transition-colors">
                  <ArrowLeft size={16} />
                  <span>{t.back}</span>
                </button>
                <button onClick={() => handleShare(selectedNews)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="relative h-80 md:h-96 rounded-xl overflow-hidden mb-6">
                <img src={selectedNews.mainImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <h1 className="absolute bottom-4 left-4 right-4 text-xl md:text-2xl font-bold text-white leading-tight">
                  {currentLang === "km" ? selectedNews.titleKh : selectedNews.titleEn}
                </h1>
              </div>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar size={16} className="text-green-600" />
                  {formatDate(selectedNews.publishedDate)}
                </span>
                <button onClick={() => handleLike(selectedNews)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 ${selectedNews.liked ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-400"}`}>
                  <Heart size={14} className={selectedNews.liked ? "fill-red-500" : ""} />
                  <span>{selectedNews.likes || 0} {t.likes}</span>
                </button>
                <button onClick={() => handleShare(selectedNews)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 ${selectedNews.shared ? "bg-green-50 border-green-200 text-green-600" : "border-gray-200 text-gray-500 hover:bg-green-50 hover:border-green-200 hover:text-green-500"}`}>
                  <Share2 size={14} />
                  <span>{selectedNews.shares || 0} {t.shares}</span>
                </button>
              </div>
              <div
                className="prose prose-sm sm:prose max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: currentLang === "km" ? selectedNews.contentKh : selectedNews.contentEn,
                }}
              />
            </div>
          </div>
        )}

        {/* Share Modal */}
        {shareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70]">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold text-gray-900">{t.shareVia}</h3>
                <button onClick={() => setShareModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Facebook", color: "bg-[#1877F2] hover:bg-[#0D6BD4]", icon: <Facebook size={16} /> },
                  { name: "Twitter", color: "bg-[#1DA1F2] hover:bg-[#0D8BD9]", icon: <Twitter size={16} /> },
                  { name: "LinkedIn", color: "bg-[#0077B5] hover:bg-[#006699]", icon: <Linkedin size={16} /> },
                ].map((social) => (
                  <button key={social.name} onClick={() => { setShareModal(false); }} className={`${social.color} text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105`}>
                    {social.icon} {social.name}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <p className="text-xs text-gray-500 mb-2">{t.copyLink}</p>
                <div className="flex gap-2">
                  <input type="text" value={window.location.href} readOnly className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600" />
                  <button onClick={handleCopyLink} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                    {t.copyLink}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Original layout for news page
  return (
    <div className="w-full">
      {/* Your original NewsSection layout here */}
      <div>Original News Section Layout</div>
    </div>
  );
};

export default NewsSection;