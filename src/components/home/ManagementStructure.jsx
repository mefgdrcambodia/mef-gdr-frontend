// src/components/home/ManagementStructure.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ChevronRight, 
  Building2, 
  Shield,
  DollarSign,
  Scale,
  Landmark,
  TrendingUp,
  Globe,
  Mail,
  Phone,
  X,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Download,
  Share2,
  Printer,
  User,
  MessageCircle,
  Heart,
  FileText,
  Briefcase,
  Star,
  ChevronLeft,
  Database,
  Eye,
  Server,
  LineChart,
  Map,
  ClipboardList,
  ClipboardCheck,
  Home,
  Target,
  Handshake,
  GraduationCap,
  Briefcase as BriefcaseIcon,
  Medal,
  Languages,
  FileText as FileTextIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import directorImg from '../../images/director.jpg';
import logo from "../../images/logo.png"


const ManagementStructure = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState('km');
  const [hoveredDept, setHoveredDept] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  // Lock body scroll when detail is open
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
      title: 'រចនាសម្ព័ន្ធគ្រប់គ្រង',
      subtitle: 'អង្គភាពក្រោមឱវាទ',
      viewAll: 'មើលទាំងអស់',
      director: 'អគ្គនាយក',
      deputyDirector: 'អគ្គនាយករង',
      departments: 'នាយកដ្ឋាន',
      view: 'មើល',
      back: 'ត្រលប់ក្រោយ',
      overview: 'ទិដ្ឋភាពទូទៅ',
      team: 'ក្រុមការងារ',
      projects: 'គម្រោង',
      contact: 'ទំនាក់ទំនង',
      departmentHead: 'ប្រធាននាយកដ្ឋាន',
      email: 'អ៊ីមែល',
      phone: 'ទូរស័ព្ទ',
      employees: 'បុគ្គលិក',
      established: 'បង្កើតឡើង',
      description: 'ការពិពណ៌នា',
      responsibilities: 'ភារកិច្ច',
      achievements: 'សមិទ្ធិផល',
      viewFullProfile: 'មើលប្រវត្តិរូបពេញលេញ',
      share: 'ចែករំលែក',
      download: 'ទាញយក',
      print: 'បោះពុម្ព',
      save: 'រក្សាទុក',
      coreFunctions: 'មុខងារសំខាន់ៗ',
      projectTypes: 'ប្រភេទគម្រោង',
      viewFullChart: 'មើលតារាងរចនាសម្ព័ន្ធពេញលេញ',
      personalInfo: 'ព័ត៌មានផ្ទាល់ខ្លួន',
      education: 'កម្រិតវប្បធម៌',
      employment: 'ប្រវត្តិការងារ',
      publications: 'បោះពុម្ពផ្សាយ',
      decorations: 'គ្រឿងឥស្សរិយយស',
      languages: 'សមត្ថភាពភាសា',
      name: 'ឈ្មោះ',
      dob: 'ថ្ងៃខែឆ្នាំកំណើត',
      pob: 'ទីកន្លែងកំណើត',
      nationality: 'សញ្ជាតិ',
      maritalStatus: 'ស្ថានភាពគ្រួសារ',
      department: 'នាយកដ្ឋានទទួលបន្ទុក'
    },
    en: {
      title: 'Management Structure',
      subtitle: 'Subordinate Units',
      viewAll: 'View All',
      director: 'Director General',
      deputyDirector: 'Deputy Director General',
      departments: 'Departments',
      view: 'View',
      back: 'Back',
      overview: 'Overview',
      team: 'Team',
      projects: 'Projects',
      contact: 'Contact',
      departmentHead: 'Department Director',
      email: 'Email',
      phone: 'Phone',
      employees: 'Employees',
      established: 'Established',
      description: 'Description',
      responsibilities: 'Responsibilities',
      achievements: 'Achievements',
      viewFullProfile: 'View Full Profile',
      share: 'Share',
      download: 'Download',
      print: 'Print',
      save: 'Save',
      coreFunctions: 'Core Functions',
      projectTypes: 'Project Types',
      viewFullChart: 'View Full Organization Chart',
      personalInfo: 'Personal Information',
      education: 'Education',
      employment: 'Employment Records',
      publications: 'Publications',
      decorations: 'Decorations',
      languages: 'Languages',
      name: 'Name',
      dob: 'Date of Birth',
      pob: 'Place of Birth',
      nationality: 'Nationality',
      maritalStatus: 'Marital Status',
      department: 'Department in Charge'
    }
  };

  const t = translations[currentLang];

  // Director General with full CV details
  const directorGeneral = {
    id: 'dg',
    name: { km: 'ឯកឧត្តម អ៊ឹម សិទ្ធីរ៉ា', en: 'H.E. Im Sitthyra' },
    position: { km: 'ប្រតិភូរាជរដ្ឋាភិបាលទទួលបន្ទុកជាអគ្គនាយក', en: 'Delegate of the Royal Government in charge as Director General' },
    email: 'xxx@mef.gov.kh',
    phone: '(+885) xx xxx xxxx',
    image: directorImg,
    personalInfo: {
      name: { km: 'អ៊ឹម សិទ្ធីរ៉ា', en: 'IM SETHYRA' },
      dob: { km: 'ថ្ងៃទី ២១ ខែ ធ្នូ ឆ្នាំ ១៩៨០', en: '21 December 1980' },
      pob: { km: 'សង្កាត់លេខ៦ ក្រុងភ្នំពេញ', en: 'Sangkat 6, Phnom Penh' },
      nationality: { km: 'ខ្មែរ', en: 'Cambodian' },
      maritalStatus: { km: 'រៀបអាពាហ៍ពិពាហ៍', en: 'Married' }
    },
    education: [
      { year: '2002 - 2003', degree: { km: 'អនុបណ្ឌិតផ្នែកធុរកិច្ចអន្តរជាតិ', en: 'Master of Business Administration (MBA) in International Business' } },
      { year: '2001 - 2002', degree: { km: 'អនុបណ្ឌិតផ្នែកគ្រប់គ្រងសណ្ឋាគារ និងទេសចរណ៍អន្តរជាតិ', en: 'Master of Business Administration (MBA) in International Hotel and Tourism Management' } },
      { year: '1997 - 2001', degree: { km: 'បរិញ្ញាបត្រផ្នែកគណនេយ្យ', en: 'Bachelor of Business Administration (BBA) in Accounting' } },
      { year: '1994 - 1997', degree: { km: 'សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ', en: 'High School Diploma' } }
    ],
    employment: [
      { year: '2021 - បច្ចុប្បន្ន', title: { km: 'ប្រតិភូរាជរដ្ឋាភិបាលទទួលបន្ទុក ជាអគ្គនាយក', en: 'Royal Government Delegate in charge as Director General' } },
      { year: '2019 - បច្ចុប្បន្ន', title: { km: 'សមាជិកឧត្តមក្រុមប្រឹក្សាសេដ្ឋកិច្ចជាតិ', en: 'Member of the Supreme National Economic Council' } },
      { year: '2016 - 2021', title: { km: 'អគ្គនាយក នៃអគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់', en: 'Director General of the General Department of Resettlement' } },
      { year: '2015 - 2018', title: { km: 'ទីប្រឹក្សាឧត្តមក្រុមប្រឹក្សាសេដ្ឋកិច្ចជាតិ', en: 'Advisor to the Supreme National Economic Council' } },
      { year: '2011 - 2016', title: { km: 'ប្រធាននាយកដ្ឋានដោះស្រាយផលប៉ះពាល់', en: 'Director of the Department of Resettlement' } },
      { year: '2007 - 2011', title: { km: 'អនុប្រធានអង្គភាពរៀបចំ អនុវត្ត ផែនការសកម្មភាពការតាំងទីលំនៅឡើងវិញ', en: 'Deputy Director of the Resettlement Unit' } },
      { year: '2005 - 2007', title: { km: 'អនុប្រធាននាយកដ្ឋានសមាហរណកម្មសេដ្ឋកិច្ច និងអាស៊ាន', en: 'Deputy Director of the Department of Economic Integration and ASEAN' } }
    ],
    publications: [
      { year: 'កុម្ភៈ ២០១៨', title: { km: 'ស្តង់ដានីតិវិធីប្រតិបត្តិសម្រាប់ការងារដោះស្រាយផលប៉ះពាល់', en: 'Standard Operating Procedures for Land Acquisition and Involuntary Resettlement' } }
    ],
    decorations: [
      { year: '2023', title: { km: 'គ្រឿងឥស្សរិយយស ជាតូបការ', en: 'Grand Order of National Merit' } },
      { year: '2022', title: { km: 'គ្រឿងឥស្សរិយយស ជាតូបការ', en: 'Grand Order of National Merit' } },
      { year: '2019', title: { km: 'គ្រឿងឥស្សរិយយស ជាតូបការ', en: 'Grand Order of National Merit' } },
      { year: '2017', title: { km: 'គ្រឿងឥស្សរិយយស សុវត្ថារា ថ្នាក់ មហាសេរីវឌ្ឍន៍', en: 'Royal Order of Sowathara Grand Cross' } }
    ],
    languages: {
      desc: { km: 'ភាសាកំណើត: ខ្មែរ, ភាសាបរទេស: អង់គ្លេស និង បារាំង', en: 'Native: Khmer, Foreign: English and French' }
    }
  };

   const deputyDirectors = [
    {
      id: "deputy1",
      name: { km: "លោក លី ហ្សេមីន", en: "លោក លី ហ្សេមីន" },
      email: "xxx@mef.gov.kh",
      phone: "(+855) xx xxx xxxx",
      image: logo,
      position: { km: "អគ្គនាយករង", en: "Deputy Director General" },
      department: {
        km: "នាយកដ្ឋានកិច្ចការទូទៅ",
        en: "Department of General Affairs",
      },
      responsibilities: {
        km: "ទទួលបន្ទុកគ្រប់គ្រងផ្នែករដ្ឋបាល បុគ្គលិក ហិរញ្ញវត្ថុ និងកិច្ចការច្បាប់ទាំងអស់របស់អគ្គនាយកដ្ឋាន",
        en: "Responsible for managing all administrative, personnel, financial, and legal affairs of the General Department",
      },
    },
    {
      id: "deputy2",
      name: { km: "លោក យ៉េន សុភ័ណ", en: "Mr. Yen Sophorn" },
      email: "xxx@mef.gov.kh",
      phone: "(+855) xx xxx xxxx",
      image: logo,
      position: { km: "អគ្គនាយករង", en: "Deputy Director General" },
      department: {
        km: "នាយកដ្ឋានត្រួតពិនិត្យផ្ទៃក្នុង និងគ្រប់គ្រងទិន្នន័យ",
        en: "Department of Internal Inspection and Data Management",
      },
      responsibilities: {
        km: "ទទួលបន្ទុកត្រួតពិនិត្យ និងតាមដានការអនុវត្តការងាររបស់នាយកដ្ឋានទាំងអស់ និងគ្រប់គ្រងប្រព័ន្ធទិន្នន័យ",
        en: "Responsible for monitoring and tracking the implementation of all departments and managing the data system",
      },
    },
    {
      id: "deputy3",
      name: { km: "លោក ប៊ុត សង្វារ", en: "Mr. But Sangvar" },
      email: "xxx@mef.gov.kh",
      phone: "(+855) xx xxx xxxx",
      image: logo,
      position: { km: "អគ្គនាយករង", en: "Deputy Director General" },
      department: {
        km: "នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ១",
        en: "Impact Resolution Department 1",
      },
      responsibilities: {
        km: "ទទួលបន្ទុកគម្រោងដែលប្រើប្រាស់ថវិកាជាតិ និងគម្រោងរបស់ធនាគារពិភពលោក (WB)",
        en: "Responsible for projects using national budget and World Bank (WB) projects",
      },
    },
    {
      id: "deputy4",
      name: { km: "លោក ចាន់ ធន់", en: "លោក ចាន់ ធន់" },
      email: "xxx@mef.gov.kh",
      phone: "(+855) xx xxx xxxx",
      image: logo,
      position: { km: "អគ្គនាយករង", en: "Deputy Director General" },
      department: {
        km: "នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ២",
        en: "Impact Resolution Department 2",
      },
      responsibilities: {
        km: "ទទួលបន្ទុកគម្រោងរបស់ធនាគារអភិវឌ្ឍន៍អាស៊ី (ADB)",
        en: "Responsible for Asian Development Bank (ADB) projects",
      },
    },
    {
      id: "deputy5",
      name: { km: "លោក ស្រ៊ាង លឹមស្រូយ", en: "Mr. Sreng Limsroy" },
      email: "xxx@mef.gov.kh",
      phone: "(+855) xx xxx xxxx",
      image: logo,
      position: { km: "អគ្គនាយករង", en: "Deputy Director General" },
      department: {
        km: "នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ៣",
        en: "Impact Resolution Department 3",
      },
      responsibilities: {
        km: "ទទួលបន្ទុកគម្រោងដែលប្រើប្រាស់ទុនវិនិយោគពីប្រទេសចិន និងដៃគូទ្វេភាគី",
        en: "Responsible for projects using investment capital from China and bilateral partners",
      },
    },
  ];

  // Departments
  const departments = [
    {
      id: 'dept1',
      name: { km: 'នាយកដ្ឋានកិច្ចការទូទៅ', en: 'Department of General Affairs' },
      head: { km: 'លោក ពិន និលឡា', en: 'Mr. Pin Neilla' },
      email: 'xxx@mef.gov.kh',
      phone: '(+855) xx xxx xxxx',
      image: logo
    },
    {
      id: 'dept2',
      name: { km: 'នាយកដ្ឋានត្រួតពិនិត្យផ្ទៃក្នុង', en: 'Department of Internal Inspection' },
      head: { km: 'លោក គង់ រដ្ឋា', en: 'Mr. Kong Rattha' },
      email: 'xxx@mef.gov.kh',
      phone: '(+855) xx xxx xxxx',
      image: logo
    },
    {
      id: 'dept3',
      name: { km: 'នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ១', en: 'Impact Resolution Department 1' },
      head: { km: 'លោក សេង វណ្ណឌី', en: 'Mr. Seng Vandy' },
      email: 'xxx@mef.gov.kh',
      phone: '(+855) xx xxx xxxx',
      image: logo
    },
    {
      id: 'dept4',
      name: { km: 'នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ២', en: 'Impact Resolution Department 2' },
      head: { km: 'លោក ស៊ន់ សេរីវឌ្ឍនៈ', en: 'Mr. Son Serey Vatthana' },
      email: 'xxx@mef.gov.kh',
      phone: '(+855) xx xxx xxxx',
      image: logo
    },
    {
      id: 'dept5',
      name: { km: 'នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ៣', en: 'Impact Resolution Department 3' },
      head: { km: 'លោក គីម ច័ន្ទវិបុល', en: 'Mr. Kim Chanvipol' },
      email: 'xxx@mef.gov.kh',
      phone: '(+855) xx xxx xxxx',
      image: logo
    }
  ];

  const handleViewDetail = (item) => {
    setSelectedDept(item);
    setShowDetail(true);
    setActiveTab('overview');
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedDept(null);
  };

  const handleViewFullChart = () => {
    navigate('/management');
  };

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-1">
            {t.title}
          </h2>
          <p className="text-sm text-gray-500 flex items-center">
            <Building2 size={14} className="mr-1" />
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Director General Card */}
      <div className="mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleViewDetail(directorGeneral)}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white overflow-hidden ring-2 ring-green-300 flex-shrink-0">
              <img 
                src={directorGeneral.image} 
                alt={directorGeneral.name[currentLang]}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-green-600 mb-1">{t.director}</p>
              <p className="text-base font-semibold text-gray-900">{directorGeneral.name[currentLang]}</p>
              <div className="flex items-center space-x-3 mt-2">
                <a href={`mailto:${directorGeneral.email}`} className="text-green-500 hover:text-green-700">
                  <Mail size={14} />
                </a>
                <a href={`tel:${directorGeneral.phone}`} className="text-green-500 hover:text-green-700">
                  <Phone size={14} />
                </a>
              </div>
            </div>
            <ChevronRight size={18} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Deputy Directors Grid - 5 Columns */}
      <div className="mb-8">
        <h3 className="text-center text-sm font-medium text-green-700 mb-3">{t.deputyDirector}</h3>
        <div className="grid grid-cols-5 gap-3">
          {deputyDirectors.map((deputy) => (
            <div key={deputy.id} className="bg-white border border-green-100 rounded-lg p-3 text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetail(deputy)}>
              <div className="w-12 h-12 rounded-full bg-green-100 overflow-hidden mx-auto mb-2">
                <img 
                  src={deputy.image} 
                  alt={deputy.name[currentLang]}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-medium text-gray-800 line-clamp-2">{deputy.name[currentLang]}</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <a href={`mailto:${deputy.email}`} onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-green-600">
                  <Mail size={10} />
                </a>
                <a href={`tel:${deputy.phone}`} onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-green-600">
                  <Phone size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Connecting Line */}
        <div className="w-0.5 h-8 bg-green-300 mx-auto mt-4"></div>
        <div className="text-xs text-gray-400 text-center mt-1">{t.departments}</div>
      </div>

      {/* Departments Grid - 5 Columns */}
      <div className="grid grid-cols-5 gap-3">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white border border-green-100 rounded-lg p-3 text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewDetail(dept)}
          >
            <div className="w-12 h-12 rounded-full bg-green-100 overflow-hidden mx-auto mb-2">
              <img 
                src={dept.image} 
                alt={dept.name[currentLang]}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs font-medium text-gray-800 line-clamp-2">{dept.name[currentLang]}</p>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <a href={`mailto:${dept.email}`} onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-green-600">
                <Mail size={10} />
              </a>
              <a href={`tel:${dept.phone}`} onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-green-600">
                <Phone size={10} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Organization Chart Link */}
      <div className="mt-8 text-center">
        <button
          onClick={handleViewFullChart}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-50 hover:bg-green-50 border border-gray-200 rounded-lg transition-all duration-300 group"
        >
          <Globe size={16} className="text-gray-500 group-hover:text-green-600" />
          <span className="text-sm text-gray-600 group-hover:text-green-600">
            {t.viewFullChart}
          </span>
          <ChevronRight size={14} className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
        </button>      
      </div>

      {/* Detail Modal */}
      {showDetail && selectedDept && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto animate-fadeIn">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-slideUp">
              <div className="sticky top-0 bg-white border-b border-gray-100 rounded-t-xl z-10">
                <div className="px-5 py-3 flex items-center justify-between">
                  <button
                    onClick={handleCloseDetail}
                    className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors group"
                  >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs">{t.back}</span>
                  </button>
                  <button 
                    onClick={handleCloseDetail}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-green-100 overflow-hidden ring-2 ring-green-200 shadow-sm mb-3">
                    <img 
                      src={selectedDept.image} 
                      alt={selectedDept.name?.[currentLang] || selectedDept.head?.[currentLang]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedDept.name?.[currentLang] || selectedDept.head?.[currentLang]}
                  </h2>
                  {selectedDept.position && (
                    <p className="text-xs text-green-600 mt-1">{selectedDept.position[currentLang]}</p>
                  )}
                </div>

                {/* Director General Full CV */}
                {selectedDept.id === 'dg' && (
                  <>
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
                        <User size={14} className="text-green-600" /> {t.personalInfo}
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs">
                        <p><span className="text-gray-500">{t.name}:</span> {selectedDept.personalInfo.name[currentLang]}</p>
                        <p><span className="text-gray-500">{t.dob}:</span> {selectedDept.personalInfo.dob[currentLang]}</p>
                        <p><span className="text-gray-500">{t.pob}:</span> {selectedDept.personalInfo.pob[currentLang]}</p>
                        <p><span className="text-gray-500">{t.nationality}:</span> {selectedDept.personalInfo.nationality[currentLang]}</p>
                        <p><span className="text-gray-500">{t.maritalStatus}:</span> {selectedDept.personalInfo.maritalStatus[currentLang]}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
                        <GraduationCap size={14} className="text-green-600" /> {t.education}
                      </h3>
                      <div className="space-y-2">
                        {selectedDept.education.map((edu, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-2">
                            <p className="text-xs text-green-600 font-medium">{edu.year}</p>
                            <p className="text-xs text-gray-700">{edu.degree[currentLang]}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
                        <BriefcaseIcon size={14} className="text-green-600" /> {t.employment}
                      </h3>
                      <div className="space-y-2">
                        {selectedDept.employment.slice(0, 4).map((job, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-2">
                            <p className="text-xs text-green-600 font-medium">{job.year}</p>
                            <p className="text-xs text-gray-700">{job.title[currentLang]}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
                        <Languages size={14} className="text-green-600" /> {t.languages}
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-700">{selectedDept.languages.desc[currentLang]}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Deputy Directors Detail */}
                {selectedDept.department && (
                  <>
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
                        <Building2 size={14} className="text-green-600" /> {t.department}
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-700">{selectedDept.department[currentLang]}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
                        <ClipboardList size={14} className="text-green-600" /> {t.responsibilities}
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-700">{selectedDept.responsibilities[currentLang]}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Contact Info */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-medium text-gray-900 text-sm mb-2">{t.contact}</h3>
                  <div className="space-y-2">
                    <a href={`mailto:${selectedDept.email}`} className="flex items-center space-x-2 text-xs text-gray-600 hover:text-green-600 p-2 hover:bg-gray-50 rounded-lg">
                      <Mail size={12} className="text-green-500" />
                      <span className="truncate">{selectedDept.email}</span>
                    </a>
                    <a href={`tel:${selectedDept.phone}`} className="flex items-center space-x-2 text-xs text-gray-600 hover:text-green-600 p-2 hover:bg-gray-50 rounded-lg">
                      <Phone size={12} className="text-green-500" />
                      <span>{selectedDept.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default ManagementStructure;