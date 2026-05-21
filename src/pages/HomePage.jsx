// src/pages/HomePage.jsx
import React from "react";
import Container from "../components/ui/Container.jsx";
import HeroSection from "../components/home/HeroSection.jsx";
import NewsSection from "../components/home/NewsSection.jsx";
import LegalSection from "../components/home/LegalSection.jsx";
import RunningText from "../components/ui/RunningText";

const HomePage = () => {
  return (
    <>
      <RunningText
        position="sticky"
        topOffset="72px"
        mobileTopOffset="72px"
        desktopTopOffset="140px"
        showLogo={true}
        logoSize="20px"
        speed="normal"
      />

      <HeroSection />

      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr">
          {/* Left side - Legal Section with Slideshow */}
          <LegalSection layout="slideshow" />
          
          {/* Right side - News Section (list only) */}
          <NewsSection layout="list-only" />
        </div>
      </Container>
    </>
  );
};

export default HomePage;