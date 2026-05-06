// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import NewsPage from './pages/AllNewsPage.jsx';
import ManagementPage from './pages/FullManagementStructurePage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import LeadershipPage from './pages/LeadershipPagge.jsx';
import VisionMissionPage from './pages/VisionMissionPage.jsx';
import RolesResponsibilitiesPage from './pages/RolesResponsibilitiesPage.jsx';
import DirectorMessagePage from './pages/DirectorMessagePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import NewsPhotos from './pages/NewsPhotos.jsx';
import NewsVideos from './pages/NewsVideos.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import Speech from './pages/Speech.jsx';

// Legal sub-pages
import LawPage from './pages/LawPage.jsx';
import SubDecreePage from './pages/SubDecreePage.jsx';
import CircularPage from './pages/CircularPage.jsx';
import DeclarationPage from './pages/DeclarationPage.jsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />
          
          {/* About Section */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/management" element={<ManagementPage />} />
          <Route path="/about/roles" element={<RolesResponsibilitiesPage />} />
          <Route path="/about/director-message" element={<DirectorMessagePage />} />
          <Route path="/about/vision-mission" element={<VisionMissionPage />} />
          <Route path="/about/history" element={<HistoryPage />} />
          <Route path="/about/speech" element={<Speech />} />

          
          {/* Leadership */}
          <Route path="/leadership" element={<LeadershipPage />} />
          
          {/* News Section */}
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/photos" element={<NewsPhotos />} />
          <Route path="/news/videos" element={<NewsVideos />} />
          
          {/* Reports Section */}
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/annual" element={<ReportsPage />} />
          <Route path="/reports/quarterly" element={<ReportsPage />} />
          <Route path="/reports/statistics" element={<ReportsPage />} />
          <Route path="/reports/activities" element={<ReportsPage />} />
          
          {/* Legal Section */}
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/legal/law" element={<LawPage />} />
          <Route path="/legal/sub-decree" element={<SubDecreePage />} />
          <Route path="/legal/circular" element={<CircularPage />} />
          <Route path="/legal/declaration" element={<DeclarationPage />} />
          
          {/* Contact */}
          <Route path="/contact" element={<ContactPage />} />
          
          {/* 404 route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <p className="text-gray-500 mb-4">Page Not Found</p>
                <a href="/" className="text-[#4CAF50] hover:text-[#2E7D32] underline">Go back home</a>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;