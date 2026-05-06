// src/config/env.config.js

const envConfig = {
    api: {
      baseURL: process.env.REACT_APP_API_URL || 'https://gdr-uat.vercel.app/api/v1',
    },
    
    endpoints: {
      // Sections
      sections: {
        header: '/website-fronted/header',
        footer: '/website-fronted/footer',
      },
      
      // Legal
      legal: {
        getAll: '/website-fronted/legal',
        getById: (id) => `/website-fronted/legal/${id}`,
      },
      
      // News
      news: {
        getAll: '/website-fronted/event/news',
        getById: (id) => `/website-fronted/event/news${id}`,
      },
      
      // Events
      events: {
        roleAndResponsibility: '/website-fronted/about-gs/role-and-responsibility',
        message: 'website-fronted/about-gs/message',
      },

      reports: {
        getAll: '/website-fronted/report',
        getById: (id) => `/website-fronted/report/${id}`,
      },

      managementStructure: {
        get: '/website-fronted/about-gs/management-structure', 
      },
      videoAlbum: {
        getAll: '/website-fronted/event/video-album',
        getById: (id) => `/website-fronted/event/video-album/${id}`,
      },
      photoAlbum: {
        getAll: '/website-fronted/event/photo-album',
        getById: (id) => `/website-fronted/event/photo-album/${id}`,
      },
      speech: {
        getAll: '/website-fronted/about-gs/speech',
        getById: (id) => `/website-fronted/about-gs/speech/${id}`,
      },
      websiteBanner: {
        get: '/website-fronted/website-banner',
      },
    },
  };
  
  export default envConfig;