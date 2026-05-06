// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className = '', hover = true, padding = true }) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm
        ${hover ? 'hover:shadow-md transition-shadow' : ''}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;