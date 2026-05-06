// src/components/shared/SocialIcons.jsx
import React from 'react';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

const SocialIcons = ({ className = '' }) => {
  const socialLinks = [
    { Icon: Facebook, href: '#', label: 'Facebook' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
    { Icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <div className={`flex space-x-4 mt-4 ${className}`}>
      {socialLinks.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          className="text-gray-400 hover:text-white transition"
          aria-label={label}
        >
          <Icon size={20} />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;