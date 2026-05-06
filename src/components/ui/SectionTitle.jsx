// src/components/ui/SectionTitle.jsx
import React from 'react';

const SectionTitle = ({ children, subtitle, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900">{children}</h2>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;