// src/components/ui/NewsItem.jsx
import React from 'react';
import { Calendar } from 'lucide-react';
import Card from './Card';

const NewsItem = ({ title, date, category, href = '#' }) => {
  return (
    <Card hover>
      <a href={href} className="block">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-900 transition">
              {title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center">
              <Calendar size={14} className="mr-2" />
              {date}
            </p>
          </div>
          {category && (
            <span className="text-xs font-medium text-blue-900 bg-blue-50 px-2 py-1 rounded">
              {category}
            </span>
          )}
        </div>
      </a>
    </Card>
  );
};

export default NewsItem;