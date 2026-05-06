// src/components/layout/Header.jsx
import React, { useState, useEffect } from "react";
import { Mail, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Container from "../ui/Container.jsx";
import Navigation from "./Navigation.jsx";
import LanguageSwitcher from "../shared/LanguageSwitcher.jsx";
import Logo from "../ui/Logo.jsx";
import { useHeader } from "../../hooks/useHeader";
import { useFooterEmail } from "../../hooks/useFooterEmail";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("language") || "km";
  });
  const location = useLocation();

  const { 
    loading: headerLoading, 
    error,
    orgNameFull, 
    orgNameShort, 
    logo, 
    runningTexts,
    isActive 
  } = useHeader(currentLang);

  const { email: footerEmail, loading: emailLoading } = useFooterEmail();

  const hasValidEmail = footerEmail && footerEmail.trim() !== '' && footerEmail !== '...';

  const smoothScrollTo = (elementId, offset = 80) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleHashLinkClick = (e) => {
      const target = e.target.closest("a");
      if (target && target.hash && target.hash.startsWith("#")) {
        const elementId = target.hash.substring(1);
        const element = document.getElementById(elementId);

        if (element) {
          e.preventDefault();
          const header = document.querySelector("header");
          const headerHeight = header ? header.offsetHeight : 80;
          smoothScrollTo(elementId, headerHeight);
          window.history.pushState(null, null, target.hash);
        }
      }
    };

    document.addEventListener("click", handleHashLinkClick);

    if (window.location.hash) {
      setTimeout(() => {
        const elementId = window.location.hash.substring(1);
        if (document.getElementById(elementId)) {
          const header = document.querySelector("header");
          const headerHeight = header ? header.offsetHeight : 80;
          smoothScrollTo(elementId, headerHeight);
        }
      }, 100);
    }

    return () => document.removeEventListener("click", handleHashLinkClick);
  }, []);

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    return path.substring(1);
  };

  if (headerLoading) {
    return (
      <header className="bg-white shadow-sm py-4 border-b border-gray-100">
        <Container>
          <div className="flex justify-between items-center">
            <div className="h-12 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-lg md:hidden"></div>
          </div>
        </Container>
      </header>
    );
  }

  return (
    <>
      <div
        className={`bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white py-1.5 hidden md:block transition-all duration-300 ${
          scrolled ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <Container>
  <div className="flex justify-between items-center">
    <LanguageSwitcher variant="minimal" />
    
    {!emailLoading && hasValidEmail ? (
      <a
        href={`mailto:${footerEmail}`}
        className="flex items-center space-x-2 text-xs group"
      >
        <span className="p-1.5 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
          <Mail size={12} className="text-white/80 group-hover:text-white" />
        </span>
        <span className="text-white/80 group-hover:text-white font-medium">
          {footerEmail}
        </span>
      </a>
    ) : (
      // Empty div to maintain flex spacing when email is hidden
      <div></div>
    )}
  </div>
</Container>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-2 border-b border-green-100"
            : "bg-white shadow-sm py-3 border-b border-transparent"
        }`}
      >
        <Container>
          <div className="flex justify-between items-center gap-4">
            <Link to="/" className="flex-shrink-0 group max-w-[70%] sm:max-w-full">
              <Logo
                variant="default"
                showText={true}
                departmentName={orgNameFull}
                departmentShort={orgNameShort}
                logoSrc={logo}
              />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 md:hidden bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="hidden md:block">
            <div className={`transition-all duration-500 ${scrolled ? "mt-2" : "mt-4"}`}>
              <Navigation currentPage={getCurrentPage()} />
            </div>
          </div>
        </Container>

        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#4CAF50] via-[#2E7D32] to-[#4CAF50] transition-all duration-300 ${
            scrolled ? "w-full" : "w-0"
          }`}
        />
      </header>

      {mobileMenuOpen && (
        <Navigation
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          currentPage={getCurrentPage()}
        />
      )}
    </>
  );
};

export default Header;