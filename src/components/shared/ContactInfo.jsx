// src/components/shared/ContactInfo.jsx
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactInfo = () => {
  const contacts = [
    { Icon: Phone, content: '071 258 0896', href: 'tel:0712580896' },
    { Icon: Mail, content: 'gad@irc.gov.kh', href: 'mailto:gad@irc.gov.kh' },
    { 
      Icon: MapPin, 
      content: (
        <>
          Building # 168 (6th Floor),<br />
          St. 598, Sangkat Chraing Chamres 1,<br />
          Khan Russey Keo, Phnom Penh, Cambodia
        </>
      ),
      isHtml: true
    },
  ];

  return (
    <div>
      <h4 className="font-semibold mb-4">Contact Info</h4>
      <div className="space-y-3 text-sm text-gray-400">
        {contacts.map(({ Icon, content, href, isHtml }, index) => (
          <div key={index} className="flex items-start">
            <Icon size={16} className="mr-2 mt-1 flex-shrink-0" />
            {href && !isHtml ? (
              <a href={href} className="hover:text-white transition">
                {content}
              </a>
            ) : (
              <span>{content}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;