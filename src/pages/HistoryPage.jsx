// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  ChevronRight,
  ChevronLeft,
  Home,
  Clock,
  Award,
  TrendingUp,
  Users,
  Building2,
  Shield,
  FileText,
  Star,
  Layers,
  GitBranch,
  Download,
  Share2,
  Printer,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/ui/Container.jsx';

const HistoryPage = () => {
  const [currentLang, setCurrentLang] = useState('km');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener('languagechange', handleLanguageChange);
    
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setCurrentLang(savedLang);
    }

    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  useEffect(() => {
    if (showDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDetail]);

  const translations = {
    km: {
      title: 'ប្រវត្តិអគ្គនាយកដ្ឋាន',
      subtitle: 'ដំណើរឆ្ពោះទៅរកការអភិវឌ្ឍន៍',
      home: 'ទំព័រដើម',
      back: 'ត្រលប់ក្រោយ',
      timeline: 'ប្រវត្តិតាមកាលប្បវត្តិ',
      readMore: 'អានបន្ត',
      share: 'ចែករំលែក',
      print: 'បោះពុម្ព',
      download: 'ទាញយក',
      keyFigures: 'បុគ្គលសំខាន់ៗ',
      achievements: 'សមិទ្ធផល',
      yearsOfDevelopment: 'ឆ្នាំនៃការអភិវឌ្ឍន៍',
      keyMilestones: 'ដំណាក់កាលសំខាន់',
      prisons: 'ពន្ធនាគារ',
      expertStaff: 'មន្រ្តីជំនាញ'
    },
    en: {
      title: 'Department History',
      subtitle: 'Journey Towards Development',
      home: 'Home',
      back: 'Back',
      timeline: 'Historical Timeline',
      readMore: 'Read More',
      share: 'Share',
      print: 'Print',
      download: 'Download',
      keyFigures: 'Key Figures',
      achievements: 'Achievements',
      yearsOfDevelopment: 'Years of Development',
      keyMilestones: 'Key Milestones',
      prisons: 'Prisons',
      expertStaff: 'Expert Staff'
    }
  };

  const t = translations[currentLang];

  const historyData = [
    {
      id: 1,
      era: 'present',
      year: 'បច្ចុប្បន្ន',
      yearEn: 'Present',
      title: {
        km: 'ការអភិវឌ្ឍន៍ និងធ្វើទំនើបកម្មប្រព័ន្ធពន្ធនាគារ',
        en: 'Development and Modernization of Prison System'
      },
      description: {
        km: 'បន្តការអភិវឌ្ឍន៍ និងធ្វើទំនើបកម្មប្រព័ន្ធពន្ធនាគារ ដើម្បីបង្កើនប្រសិទ្ធភាពការងារ និងលើកកម្ពស់សុខុមាលភាពអ្នកទោស។',
        en: 'Continue development and modernization of prison systems to enhance work efficiency and improve prisoner welfare.'
      },
      icon: <TrendingUp size={20} />,
      achievements: [
        'ធ្វើទំនើបកម្មប្រព័ន្ធគ្រប់គ្រងពន្ធនាគារ',
        'បង្កើនកម្មវិធីអប់រំកែប្រែ',
        'ពង្រីកកិច្ចសហប្រតិបត្តិការអន្តរជាតិ'
      ],
      keyFigures: ['ឯកឧត្តម ឈន សាណាត', 'លោក តោ ពន្លក']
    },
    {
      id: 2,
      era: 'integration',
      year: '២០១៣',
      yearEn: '2013',
      date: '៧ សីហា ២០១៣',
      dateEn: 'August 7, 2013',
      title: {
        km: 'សមាហរណកម្មមន្រ្តីពន្ធនាគារ',
        en: 'Integration of Prison Officers'
      },
      description: {
        km: 'មន្រ្តីពន្ធនាគារក្រោមក្របខណ្ឌរដ្ឋបាលស៊ីវិល បានសមាហរណកម្មចូលក្នុងក្របខណ្ឌមន្រ្តីពន្ធនាគារ។',
        en: 'Prison officers under the civil administration framework were integrated into the prison officer framework.'
      },
      icon: <Users size={20} />,
      achievements: [
        'បង្រួបបង្រួមប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក',
        'បង្កើនប្រសិទ្ធភាពការងារ',
        'ពង្រឹងសមត្ថភាពមន្រ្តី'
      ]
    },
    {
      id: 3,
      era: 'establishment',
      year: '២០០៦',
      yearEn: '2006',
      date: '១៩ ធ្នូ ២០០៦',
      dateEn: 'December 19, 2006',
      title: {
        km: 'បង្កើតអគ្គនាយកដ្ឋានពន្ធនាគារ',
        en: 'Establishment of General Department of Prisons'
      },
      description: {
        km: 'ត្រូវបានបង្កើតជាអគ្គនាយកដ្ឋានពន្ធនាគារ ក្រោមក្របខណ្ឌរដ្ឋបាលស៊ីវិល។',
        en: 'Was established as the General Department of Prisons under the civil administration framework.'
      },
      icon: <Building2 size={20} />,
      achievements: [
        'ក្លាយជាអគ្គនាយកដ្ឋានឯករាជ្យ',
        'ពង្រីករចនាសម្ព័ន្ធអង្គភាព',
        'បង្កើនចំនួនបុគ្គលិក'
      ]
    },
    {
      id: 4,
      era: 'transfer',
      year: '២០០០',
      yearEn: '2000',
      date: '២៤ តុលា ២០០០',
      dateEn: 'October 24, 2000',
      title: {
        km: 'ផ្ទេរក្របខណ្ឌមន្ត្រីពន្ធនាគារ',
        en: 'Transfer of Prison Officer Framework'
      },
      description: {
        km: 'មន្ត្រីពន្ធនាគារបានផ្ទេរពីក្របខណ្ឌនគរបាលជាតិ មកក្រោមក្របខណ្ឌរដ្ឋបាលស៊ីវិល។',
        en: 'Prison officers were transferred from the National Police framework to the civil administration framework.'
      },
      icon: <GitBranch size={20} />,
      achievements: [
        'ផ្លាស់ប្តូរប្រព័ន្ធគ្រប់គ្រង',
        'កែលម្អលក្ខខណ្ឌការងារ',
        'បង្កើនសិទ្ធិបុគ្គលិក'
      ]
    },
    {
      id: 5,
      era: 'rename',
      year: '១៩៩២',
      yearEn: '1992',
      title: {
        km: 'ប្តូរឈ្មោះជានាយកដ្ឋានពន្ធនាគារ',
        en: 'Renamed to Department of Prisons'
      },
      description: {
        km: 'បានប្តូរឈ្មោះជានាយកដ្ឋានពន្ធនាគារ ក្រោមក្របខណ្ឌនគរបាលជាតិ។',
        en: 'Was renamed to the Department of Prisons under the National Police framework.'
      },
      icon: <FileText size={20} />,
      achievements: [
        'កំណត់រចនាសម្ព័ន្ធថ្មី',
        'ពង្រឹងតួនាទីភារកិច្ច'
      ]
    },
    {
      id: 6,
      era: 'creation',
      year: '១៩៨៣-១៩៩២',
      yearEn: '1983-1992',
      title: {
        km: 'បង្កើតនាយកដ្ឋានថ្មី',
        en: 'Creation of New Department'
      },
      description: {
        km: 'បំបែកចេញពីនាយកដ្ឋានស្រាវជ្រាវសួរចម្លើយ និងពន្ធនាគារ បង្កើតជានាយកដ្ឋានតម្រួតគ្រប់គ្រងអប់រំកែប្រែទណ្ឌិត និងពិរុទ្ធជន។',
        en: 'Separated from the Research, Interrogation and Prisons Department to form the Department of Prison Management and Rehabilitation.'
      },
      icon: <Layers size={20} />,
      achievements: [
        'បង្កើតប្រព័ន្ធគ្រប់គ្រងថ្មី',
        'ផ្តោតលើការអប់រំកែប្រែ'
      ]
    },
    {
      id: 7,
      era: 'initial',
      year: '១៩៧៩-១៩៨៣',
      yearEn: '1979-1983',
      title: {
        km: 'ការគ្រប់គ្រងដំបូង',
        en: 'Initial Management'
      },
      description: {
        km: 'ស្ថាប័នពន្ធនាគារស្ថិតនៅចំណុះនាយកដ្ឋានស្រាវជ្រាវ សួរចម្លើយ និងពន្ធនាគារ នៃស្នងការនគរបាលជាតិ។',
        en: 'Prison institutions were under the Department of Research, Interrogation and Prisons of the National Police Commissariat.'
      },
      icon: <Shield size={20} />,
      achievements: [
        'បង្កើតមូលដ្ឋានគ្រឹះ',
        'រៀបចំប្រព័ន្ធដំបូង'
      ]
    }
  ];

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Home size={18} className="text-gray-500" />
              </Link>
              
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm">
                <Link to="/" className="text-gray-500 hover:text-primary-600 transition-colors">
                  {t.home}
                </Link>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-gray-900 font-medium">{t.title}</span>
              </nav>
            </div>

            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <Download size={16} className="text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <Share2 size={16} className="text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <Printer size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Simple Header - Smaller Title */}
      <Container className="py-8">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-primary-600 mb-3">
            <Clock size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">{t.timeline}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">{t.title}</h1>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">{t.subtitle}</p>
          <div className="w-12 h-0.5 bg-primary-600 mt-4"></div>
        </div>
      </Container>

      {/* Timeline */}
      <Container className="pb-16">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-gray-200"></div>

          {/* Timeline Items */}
          <div className="space-y-8">
            {historyData.map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={item.id} 
                  className="relative group"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 rounded-full bg-primary-600 border-2 border-white shadow-sm z-10 transition-all duration-300 ${
                    activeIndex === index ? 'scale-150' : ''
                  }`}></div>

                  {/* Content Card */}
                  <div className={`flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2"></div>
                    <div className={`md:w-1/2 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}>
                      <div 
                        className="ml-12 md:ml-0 bg-white border border-gray-100 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleEventClick(item)}
                      >
                        {/* Year */}
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar size={12} className="text-primary-500" />
                          <span className="text-xs font-medium text-primary-600">{item.year}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-medium text-gray-900 mb-2 leading-relaxed">
                          {item.title[currentLang]}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          {item.description[currentLang]}
                        </p>

                        {/* Read More */}
                        <div className="flex items-center justify-end text-xs text-primary-600">
                          <span>{t.readMore}</span>
                          <ChevronRight size={10} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Stats Section - Simple */}
      <div className="border-t border-gray-100 bg-gray-50/30">
        <Container className="py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-light text-primary-600 mb-1">៤៥+</div>
              <div className="text-xs text-gray-500">{t.yearsOfDevelopment}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-primary-600 mb-1">៧</div>
              <div className="text-xs text-gray-500">{t.keyMilestones}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-primary-600 mb-1">២៥+</div>
              <div className="text-xs text-gray-500">{t.prisons}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-primary-600 mb-1">១០០០+</div>
              <div className="text-xs text-gray-500">{t.expertStaff}</div>
            </div>
          </div>
        </Container>
      </div>

      {/* Simple Modal */}
      {showDetail && selectedEvent && (
        <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="relative bg-white rounded-lg max-w-2xl w-full shadow-xl animate-fadeIn">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">
                  {selectedEvent.title[currentLang]}
                </h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5">
                {/* Year */}
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar size={12} className="text-primary-500" />
                  <span className="text-xs font-medium text-primary-600">{selectedEvent.year}</span>
                  {selectedEvent.date && (
                    <span className="text-xs text-gray-400 ml-2">({selectedEvent.date})</span>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedEvent.description[currentLang]}
                  </p>
                </div>

                {/* Achievements */}
                {selectedEvent.achievements && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      {t.achievements}
                    </h4>
                    <ul className="space-y-1">
                      {selectedEvent.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-gray-600">
                          <Star size={10} className="text-primary-500 mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Figures */}
                {selectedEvent.keyFigures && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      {t.keyFigures}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.keyFigures.map((figure, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                          {figure}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;