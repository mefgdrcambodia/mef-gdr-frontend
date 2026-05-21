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
        {/* Custom proportions */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Legal Section - 70% */}
          <div className="lg:w-[70%]">
            <LegalSection layout="slideshow" />
          </div>
          
          {/* Right side - News Section - 30% */}
          <div className="lg:w-[30%]">
            <NewsSection layout="list-only" />
          </div>
        </div>
      </Container>
    </>
  );
};

export default HomePage;