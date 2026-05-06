// src/pages/AboutPage.jsx
import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">អំពីអគ្គនាយកដ្ឋាន</h1>
          <p className="text-lg text-blue-100 mt-4">About the General Department of Prisons</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        {/* Add about content here */}
      </div>
    </div>
  );
};

export default AboutPage;