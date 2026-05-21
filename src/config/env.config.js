// Remove this line at the top:
// import { get } from "node:http";

const envConfig = {
  api: {
    baseURL:
      process.env.REACT_APP_API_URL || "https://gdr-uat.vercel.app/api/v1",
  },

  endpoints: {
    // Sections
    sections: {
      header: "/website-fronted/header",
      footer: "/website-fronted/footer",
    },

    // Legal
    legal: {
      getAll: "/website-fronted/legal",
      getById: (id) => `/website-fronted/legal/${id}`,
    },

    // News
    news: {
      getAll: "/website-fronted/event/news",
      getById: (id) => `/website-fronted/event/news${id}`,
    },

    // Events
    events: {
      roleAndResponsibility:
        "/website-fronted/about-gs/role-and-responsibility",
      message: "website-fronted/about-gs/message",
    },

    reports: {
      getAll: "/website-fronted/report",
      getById: (id) => `/website-fronted/report/${id}`,
    },

    managementStructure: {
      get: "/website-fronted/about-gs/management-structure",
    },
    videoAlbum: {
      getAll: "/website-fronted/event/video-album",
      getById: (id) => `/website-fronted/event/video-album/${id}`,
    },
    photoAlbum: {
      getAll: "/website-fronted/event/photo-album",
      getById: (id) => `/website-fronted/event/photo-album/${id}`,
    },
    speech: {
      getAll: "/website-fronted/about-gs/speech",
      getById: (id) => `/website-fronted/about-gs/speech/${id}`,
    },
    websiteBanner: {
      get: "/website-fronted/website-banner",
    },
    department: {
      // Base paths for different departments
      resettlementOne:
        "/website-fronted/about-gs/role-and-responsibility/depament-resttlement-one",
      resettlementTwo:
        "/website-fronted/about-gs/role-and-responsibility/depament-resttlement-two",
      resettlementThree:
        "/website-fronted/about-gs/role-and-responsibility/depament-resttlement-three",
      general:
        "/website-fronted/about-gs/role-and-responsibility/depament-general",
      manageData:
        "/website-fronted/about-gs/role-and-responsibility/depament-manage-data",

      // Dynamic getter for any department type
      getByType: (type) => {
        const endpoints = {
          "resettlement-one":
            "/website-fronted/about-gs/role-and-responsibility/depament-resttlement-one",
          "resettlement-two":
            "/website-fronted/about-gs/role-and-responsibility/depament-resttlement-two",
          "resettlement-three":
            "/website-fronted/about-gs/role-and-responsibility/depament-resttlement-three",
          general:
            "/website-fronted/about-gs/role-and-responsibility/depament-general",
          "manage-data":
            "/website-fronted/about-gs/role-and-responsibility/depament-manage-data",
        };
        return endpoints[type] || endpoints["general"];
      },

      // Get all department endpoints as an array
      getAllEndpoints: () => [
        {
          type: "general",
          url: "/website-fronted/about-gs/role-and-responsibility/depament-general",
          name: "General Department",
        },
        {
          type: "resettlement-one",
          url: "/website-fronted/about-gs/role-and-responsibility/depament-resttlement-one",
          name: "Department of Resettlement One",
        },
        {
          type: "resettlement-two",
          url: "/website-fronted/about-gs/role-and-responsibility/depament-resttlement-two",
          name: "Department of Resettlement Two",
        },
        {
          type: "resettlement-three",
          url: "/website-fronted/about-gs/role-and-responsibility/depament-resttlement-three",
          name: "Department of Resettlement Three",
        },
        {
          type: "manage-data",
          url: "/website-fronted/about-gs/role-and-responsibility/depament-manage-data",
          name: "Data Management Department",
        },
      ],
    },
  },
};

export default envConfig;
