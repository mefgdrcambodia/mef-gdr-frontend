// src/pages/VisionMissionPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Home,
  ChevronRight,
  Eye,
  Target,
  Heart,
  Shield,
  Users,
  TrendingUp,
  Globe,
  Award,
  BookOpen,
  Compass,
  Rocket,
  Sparkles,
  Star,
  CheckCircle,
  ArrowRight,
  Download,
  Share2,
  Printer,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/ui/Container.jsx';

const VisionMissionPage = () => {
  const [currentLang, setCurrentLang] = useState('km');

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

  const translations = {
    km: {
      title: 'ចក្ខុវិស័យ និងបេសកកម្ម',
      home: 'ទំព័រដើម',
      vision: 'ចក្ខុវិស័យ',
      mission: 'បេសកកម្ម',
      coreValues: 'គុណតម្លៃស្នូល',
      strategicGoals: 'គោលដៅយុទ្ធសាស្ត្រ',
      download: 'ទាញយក',
      share: 'ចែករំលែក',
      print: 'បោះពុម្ព',
      visionDesc: 'ចក្ខុវិស័យរបស់យើងគឺដើម្បីក្លាយជាស្ថាប័នពន្ធនាគារឈានមុខគេ ដែលមានតម្លាភាព យុត្តិធម៌ និងប្រសិទ្ធភាព ក្នុងការគ្រប់គ្រង និងអប់រំកែប្រែអ្នកទោស ដើម្បីឱ្យពួកគេក្លាយជាពលរដ្ឋល្អ និងមានប្រយោជន៍សម្រាប់សង្គម។',
      missionDesc: 'យើងខ្ញុំប្តេជ្ញាផ្តល់សេវាកម្មគ្រប់គ្រងពន្ធនាគារប្រកបដោយគុណភាព តម្លាភាព និងយុត្តិធម៌ តាមរយៈការអភិវឌ្ឍន៍ធនធានមនុស្ស ការកែលម្អហេដ្ឋារចនាសម្ព័ន្ធ និងការពង្រឹងកិច្ចសហប្រតិបត្តិការជាមួយដៃគូពាក់ព័ន្ធ។',
      value1: 'ភាពស្មោះត្រង់',
      value1Desc: 'ប្រតិបត្តិការប្រកបដោយតម្លាភាព និងសុចរិតភាពខ្ពស់',
      value2: 'យុត្តិធម៌',
      value2Desc: 'ធានានូវសមភាព និងយុត្តិធម៌សម្រាប់ទាំងអស់គ្នា',
      value3: 'វិជ្ជាជីវៈ',
      value3Desc: 'បុគ្គលិកដែលមានសមត្ថភាព និងជំនាញខ្ពស់',
      value4: 'គណនេយ្យភាព',
      value4Desc: 'ទទួលខុសត្រូវចំពោះរាល់សកម្មភាព និងការសម្រេចចិត្ត',
      value5: 'ការគោរពសិទ្ធិ',
      value5Desc: 'គោរពសិទ្ធិមនុស្ស និងសេចក្តីថ្លៃថ្នូររបស់អ្នកទោស',
      goal1: 'ពង្រឹងប្រព័ន្ធគ្រប់គ្រងពន្ធនាគារឱ្យបានទំនើប',
      goal2: 'លើកកម្ពស់កម្មវិធីអប់រំកែប្រែ និងបណ្តុះបណ្តាលវិជ្ជាជីវៈ',
      goal3: 'ពង្រឹងសមត្ថភាពមន្រ្តីពន្ធនាគារ',
      goal4: 'ពង្រីកកិច្ចសហប្រតិបត្តិការអន្តរជាតិ',
      goal5: 'កែលម្អហេដ្ឋារចនាសម្ព័ន្ធពន្ធនាគារ'
    },
    en: {
      title: 'Vision & Mission',
      home: 'Home',
      vision: 'Vision',
      mission: 'Mission',
      coreValues: 'Core Values',
      strategicGoals: 'Strategic Goals',
      download: 'Download',
      share: 'Share',
      print: 'Print',
      visionDesc: 'Our vision is to become a leading prison institution with transparency, fairness, and efficiency in managing and rehabilitating prisoners, enabling them to become good and productive citizens for society.',
      missionDesc: 'We are committed to providing quality, transparent, and fair prison management services through human resource development, infrastructure improvement, and strengthening cooperation with relevant partners.',
      value1: 'Integrity',
      value1Desc: 'Operating with transparency and high integrity',
      value2: 'Fairness',
      value2Desc: 'Ensuring equality and justice for all',
      value3: 'Professionalism',
      value3Desc: 'Competent and highly skilled personnel',
      value4: 'Accountability',
      value4Desc: 'Responsible for all actions and decisions',
      value5: 'Rights Respect',
      value5Desc: 'Respecting human rights and dignity of prisoners',
      goal1: 'Modernize prison management systems',
      goal2: 'Enhance rehabilitation and vocational training programs',
      goal3: 'Strengthen prison officers\' capacity',
      goal4: 'Expand international cooperation',
      goal5: 'Improve prison infrastructure'
    }
  };

  const t = translations[currentLang];

  const values = [
    { icon: <Shield size={24} />, title: t.value1, desc: t.value1Desc },
    { icon: <Scale size={24} />, title: t.value2, desc: t.value2Desc },
    { icon: <Award size={24} />, title: t.value3, desc: t.value3Desc },
    { icon: <CheckCircle size={24} />, title: t.value4, desc: t.value4Desc },
    { icon: <Heart size={24} />, title: t.value5, desc: t.value5Desc }
  ];

  const goals = [
    t.goal1,
    t.goal2,
    t.goal3,
    t.goal4,
    t.goal5
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Breadcrumb */}
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
                <span className="text-gray-900 font-medium">អំពីអគ្គនាយកដ្ឋាន</span>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-primary-600 font-medium">{t.title}</span>
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

      {/* Page Header */}
      <Container className="py-10">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-primary-600 mb-3">
            <Compass size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">{t.title}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">{t.title}</h1>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
            {currentLang === 'km' 
              ? 'គោលការណ៍ណែនាំ និងទិសដៅយុទ្ធសាស្ត្ររបស់អគ្គនាយកដ្ឋានពន្ធនាគារ'
              : 'Guiding principles and strategic direction of the General Department of Prisons'
            }
          </p>
          <div className="w-12 h-0.5 bg-primary-600 mt-4"></div>
        </div>
      </Container>

      {/* Vision Section */}
      <Container className="pb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl border border-primary-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-primary-600 rounded-lg text-white">
                <Eye size={24} />
              </div>
              <h2 className="text-xl font-medium text-gray-900">{t.vision}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t.visionDesc}
            </p>
            <div className="mt-6 flex items-center text-sm text-primary-600">
              <span>{currentLang === 'km' ? 'ឆ្ពោះទៅអនាគត' : 'Towards the future'}</span>
              <ArrowRight size={14} className="ml-2" />
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl border border-primary-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-primary-600 rounded-lg text-white">
                <Target size={24} />
              </div>
              <h2 className="text-xl font-medium text-gray-900">{t.mission}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t.missionDesc}
            </p>
            <div className="mt-6 flex items-center text-sm text-primary-600">
              <span>{currentLang === 'km' ? 'ការប្តេជ្ញាចិត្តរបស់យើង' : 'Our commitment'}</span>
              <ArrowRight size={14} className="ml-2" />
            </div>
          </div>
        </div>
      </Container>

      {/* Core Values Section */}
      <Container className="py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-full mb-4">
            <Star size={14} className="text-primary-600" />
            <span className="text-xs font-medium text-primary-700 uppercase tracking-wider">
              {t.coreValues}
            </span>
          </div>
          <h2 className="text-xl font-light text-gray-900 mb-2">{t.coreValues}</h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            {currentLang === 'km'
              ? 'គោលការណ៍គ្រឹះដែលដឹកនាំការងាររបស់យើង'
              : 'Fundamental principles that guide our work'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((value, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{value.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Strategic Goals Section */}
      <Container className="py-8">
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full mb-4 shadow-sm">
              <Rocket size={14} className="text-primary-600" />
              <span className="text-xs font-medium text-primary-700 uppercase tracking-wider">
                {t.strategicGoals}
              </span>
            </div>
            <h2 className="text-xl font-light text-gray-900 mb-2">{t.strategicGoals}</h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              {currentLang === 'km'
                ? 'គោលដៅសំខាន់ៗសម្រាប់អភិវឌ្ឍវិស័យពន្ធនាគារ'
                : 'Key objectives for developing the prison sector'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map((goal, index) => (
              <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full text-white flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Quote Section */}
      <Container className="py-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-4">
            <Sparkles size={24} className="text-primary-400 mx-auto" />
          </div>
          <p className="text-sm text-gray-600 italic leading-relaxed">
            {currentLang === 'km'
              ? '"ការកែប្រែអ្នកទោសឱ្យក្លាយជាពលរដ្ឋល្អ គឺជាការវិនិយោគដ៏មានតម្លៃបំផុតសម្រាប់អនាគតសង្គម"'
              : '"Rehabilitating prisoners to become good citizens is the most valuable investment for the future of society"'
            }
          </p>
          <p className="text-xs text-gray-400 mt-4">
            {currentLang === 'km' ? '— អគ្គនាយកដ្ឋានពន្ធនាគារ' : '— General Department of Prisons'}
          </p>
        </div>
      </Container>
    </div>
  );
};

export default VisionMissionPage;