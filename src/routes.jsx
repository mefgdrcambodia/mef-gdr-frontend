// src/routes.jsx
import HomePage from './pages/HomePage.jsx';
import NewsPage from './pages/NewsPage.jsx';
import ManagementPage from './pages/FullManagementStructurePage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import StructurePage from './pages/StructurePage.jsx';
import LeadershipPage from './pages/LeadershipPagge.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import VisionMissionPage from './pages/VisionMissionPage.jsx';
import RolesResponsibilitiesPage from './pages/RolesResponsibilitiesPage.jsx';
import DirectorMessagePage from './pages/DirectorMessagePage.jsx';
import NewsPhotos from './pages/NewsPhotos.jsx';
import NewsVideos from './pages/NewsVideos.jsx';
// import OrganizationStructurePage from './pages/OrganizationStructurePage.jsx';

export const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true,
    name: 'home'
  },
  {
    path: '/news',
    component: NewsPage,
    name: 'news'
  },
  {
    path: '/news/photos',
    component: NewsPhotos,
    name: 'news-photos'
  },
  {
    path: '/news/videos',
    component: NewsVideos,
    name: 'news-videos'
  },
  {
    path: '/about/management',
    component: ManagementPage,
    name: 'management'
  },
  {
    path: '/contact',
    component: ContactPage,
    name: 'contact'
  },
  {
    path: '/about',
    component: AboutPage,
    name: 'about'
  },
  {
    path: '/legal',
    component: LegalPage,
    name: 'legal'
  },
  {
    path: '/structure',
    component: StructurePage,
    name: 'structure'
  },
  {
    path: '/leadership',
    component: LeadershipPage,
    name: 'leadership'
  },
  {
    path: '/about/history',
    component: HistoryPage,
    name: 'history'
  },
  {
    path: '/about/vision-mission',
    component: VisionMissionPage,
    name: 'vision-mission'
  },
  {
    path: '/about/roles',
    component: RolesResponsibilitiesPage,
    name: 'roles-responsibilities'
  },
  {
    path: '/about/director-message',
    component: DirectorMessagePage,
    name: 'director-message'
  }
 

  
];