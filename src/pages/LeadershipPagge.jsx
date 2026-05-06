// src/pages/LeadershipPage.jsx
import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Award, Users, Shield, Briefcase,
  GraduationCap, X, ChevronRight, Home, Building2, Globe,
  UserCircle, Star, Sparkles, TrendingUp, Calendar,
  MessageCircle, Linkedin, Twitter, Facebook
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/ui/Container.jsx';

// Use a single default image for all positions
import defaultAvatar from '../images/director.jpg';

const LeadershipPage = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Complete leadership data with all positions using default image
  const leadershipData = {
    director: {
      id: 'director',
      name: 'ឯកឧត្តម ឈន សាណាត',
      nameEn: 'H.E. Chhon Sanath',
      position: 'អគ្គនាយក',
      positionEn: 'Director General',
      title: 'អគ្គនាយក នៃអគ្គនាយកដ្ឋានពន្ធនាគារ',
      image: defaultAvatar,
      email: 'director@prison.gov.kh',
      phone: '+៨៥៥ ២៣ ១២៣ ៤៥៦',
      education: 'បណ្ឌិតផ្នែកច្បាប់',
      experience: '២៥ ឆ្នាំ',
      bio: 'ឯកឧត្តម ឈន សាណាត មានបទពិសោធន៍យ៉ាងទូលំទូលាយក្នុងការគ្រប់គ្រងពន្ធនាគារ និងការអភិវឌ្ឍន៍ប្រព័ន្ធយុត្តិធម៌។',
      achievements: [
        'កំណែទម្រង់ប្រព័ន្ធគ្រប់គ្រងពន្ធនាគារ',
        'កម្មវិធីអប់រំកែប្រែអ្នកទោស',
        'គម្រោងសាងសង់ពន្ធនាគារថ្មី'
      ]
    },
    deputies: [
      { id: 'dep1', name: 'តោ ពន្លក', nameEn: 'Tao Ponlok', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'tao.ponlok@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៥៧', responsibility: 'ផ្នែករដ្ឋបាល', experience: '២០ ឆ្នាំ' },
      { id: 'dep2', name: 'នុត សវនា', nameEn: 'Nut Sovanna', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'nut.sovanna@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៥៨', responsibility: 'ផ្នែកប្រតិបត្តិការ', experience: '១៨ ឆ្នាំ' },
      { id: 'dep3', name: 'ញ៉ែម អូន', nameEn: 'Nhim Aun', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'nhim.aun@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៥៩', responsibility: 'ផ្នែកអប់រំកែប្រែ', experience: '១៥ ឆ្នាំ' },
      { id: 'dep4', name: 'ទិត្យ ម៉ាលីន', nameEn: 'Tith Malin', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'tith.malin@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៦០', responsibility: 'ផ្នែកហិរញ្ញវត្ថុ', experience: '២២ ឆ្នាំ' },
      { id: 'dep5', name: 'ខាត់ សារ៉ាន់', nameEn: 'Khat Sarann', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'khat.sarann@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៦១', responsibility: 'ផ្នែកផែនការ', experience: '១៩ ឆ្នាំ' },
      { id: 'dep6', name: 'សែម ស៊ីណង', nameEn: 'Sem Sinaing', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'sem.sinaing@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៦២', responsibility: 'ផ្នែកច្បាប់', experience: '១៧ ឆ្នាំ' },
      { id: 'dep7', name: 'មិក សាផាណារេត', nameEn: 'Mik Saphanareth', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'mik.saphanareth@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៦៣', responsibility: 'ផ្នែកបច្ចេកទេស', experience: '១៤ ឆ្នាំ' },
      { id: 'dep8', name: 'សន កែវ', nameEn: 'San Keo', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'san.keo@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៦៤', responsibility: 'ផ្នែកធនធានមនុស្ស', experience: '២១ ឆ្នាំ' },
      { id: 'dep9', name: 'សុខ សុគន្ធា', nameEn: 'Sok Sokunthea', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'sok.sokunthea@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៦៥', responsibility: 'ផ្នែកសវនកម្ម', experience: '១៦ ឆ្នាំ' },
      { id: 'dep10', name: 'លឹម ឡេង', nameEn: 'Lim Leng', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'lim.leng@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៦៦', responsibility: 'ផ្នែកស្រាវជ្រាវ', experience: '១៣ ឆ្នាំ' },
      { id: 'dep11', name: 'មិន សុវណ្ណា', nameEn: 'Min Sovanna', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'min.sovanna@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៦៧', responsibility: 'ផ្នែកសហប្រតិបត្តិការ', experience: '១៥ ឆ្នាំ' },
      { id: 'dep12', name: 'ម៉ៅ សុភារម្យ', nameEn: 'Mao Sopharomy', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'mao.sopharomy@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៦៨', responsibility: 'ផ្នែកសន្តិសុខ', experience: '២៣ ឆ្នាំ' },
      { id: 'dep13', name: 'ឡាយ សំណាង', nameEn: 'Lay Samneang', position: 'អគ្គនាយករង', image: defaultAvatar, email: 'lay.samneang@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៦៩', responsibility: 'ផ្នែកព័ត៌មានវិទ្យា', experience: '១២ ឆ្នាំ' }
    ],
    departmentHeads: [
      { id: 'dept1', name: 'ឈឹម សុផាណារ៉ាត', nameEn: 'Chhim Sophanarat', position: 'ប្រធាននាយកដ្ឋាន', image: defaultAvatar, department: 'រដ្ឋបាល និងហិរញ្ញវត្ថុ', email: 'chim.sophanarat@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៧០' },
      { id: 'dept2', name: 'ឃៀង សុណាឌីន', nameEn: 'Khieng Sonadin', position: 'ប្រធាននាយកដ្ឋាន', image: defaultAvatar, department: 'នាយកដ្ឋានប្រតិបត្តិ', email: 'khieng.sonadin@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៧១' },
      { id: 'dept3', name: 'គ្រុយ លឹមហ័ង', nameEn: 'Kruy Limhuong', position: 'ប្រធាននាយកដ្ឋាន', image: defaultAvatar, department: 'នាយកដ្ឋានអប់រំកែប្រែ និងស្ដារនីតិសម្បទា', email: 'kruy.limhuong@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៧២' },
      { id: 'dept4', name: 'មាន ថាវរិន្ទ', nameEn: 'Mean Thavarin', position: 'ប្រធាននាយកដ្ឋាន', image: defaultAvatar, department: 'នាយកដ្ឋានបណ្ដុះបណ្ដាលវិជ្ជាជីវៈ និងមុខរបរ', email: 'mean.thavarin@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៧៣' },
      { id: 'dept5', name: 'ម៉ៅ សុភារម្យ', nameEn: 'Mao Sopharomy', position: 'ប្រធាននាយកដ្ឋាន', image: defaultAvatar, department: 'នាយកដ្ឋានសន្តិសុខ', email: 'mao.sopharomy@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៧៤' }
    ],
    centerDirectors: [
      { id: 'center1', name: 'នុត សវនា', nameEn: 'Nut Sovanna', position: 'ប្រធានមណ្ឌល', image: defaultAvatar, center: 'មណ្ឌលអប់រំកែប្រែ', email: 'nut.sovanna@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៨០' },
      { id: 'center2', name: 'ក្លូត កណ្ណិកា', nameEn: 'Klout Kannika', position: 'ប្រធានមណ្ឌល', image: defaultAvatar, center: 'មណ្ឌលអប់រំកែប្រែទី១', email: 'klout.kannika@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៨១' },
      { id: 'center3', name: 'ភិន យ៉ាន', nameEn: 'Phin Yan', position: 'ប្រធានមណ្ឌល', image: defaultAvatar, center: 'មណ្ឌលអប់រំកែប្រែទី២', email: 'phin.yan@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៨២' },
      { id: 'center4', name: 'ប្រាជ្ញ សុភី', nameEn: 'Prach Sopheak', position: 'ប្រធានមណ្ឌល', image: defaultAvatar, center: 'មណ្ឌលអប់រំកែប្រែទី៣', email: 'prach.sopheak@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៨៣' },
      { id: 'center5', name: 'អ៊ុក គឹមជន', nameEn: 'Ouk Kimchon', position: 'ប្រធានមណ្ឌល', image: defaultAvatar, center: 'មណ្ឌលអប់រំកែប្រែទី៤', email: 'ouk.kimchon@prison.gov.kh', phone: '+៨៥៥ ២៣ ១២៣ ៤៨៤' }
    ],
    prisonChiefs: [
      { id: 'pri1', name: 'ឈីម ធីដា', nameEn: 'Chhim Thida', position: 'ប្រធានពន្ធនាគារ', image: defaultAvatar, province: 'រតនគីរី', phone: '+៨៥៥ ២៣ ១២៣ ៤៩០' },
      { id: 'pri2', name: 'ឯម និមល', nameEn: 'Em Nimal', position: 'ប្រធានពន្ធនាគារ', image: defaultAvatar, province: 'រាជធានីភ្នំពេញ', phone: '+៨៥៥ ២៣ ១២៣ ៤៩១' },
      { id: 'pri3', name: 'គង់ ស៊ីថា', nameEn: 'Kong Sitha', position: 'ប្រធានពន្ធនាគារ', image: defaultAvatar, province: 'កណ្ដាល', phone: '+៨៥៥ ២៣ ១២៣ ៤៩២' },
      { id: 'pri4', name: 'អៀង សារឹម', nameEn: 'Ieng Sarim', position: 'ប្រធានពន្ធនាគារ', image: defaultAvatar, province: 'តាកែវ', phone: '+៨៥៥ ២៣ ១២៣ ៤៩៣' },
      { id: 'pri5', name: 'ទីន សុវណ្ណនី', nameEn: 'Tin Sovannny', position: 'ប្រធានពន្ធនាគារ', image: defaultAvatar, province: 'កំពត', phone: '+៨៥៥ ២៣ ១២៣ ៤៩៤' }
    ]
  };

  const handleViewDetails = (leader) => {
    setSelectedLeader(leader);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedLeader(null);
  };

  const filters = [
    { id: 'all', label: 'ទាំងអស់', icon: Users },
    { id: 'deputy', label: 'អគ្គនាយករង', icon: Users },
    { id: 'department', label: 'នាយកដ្ឋាន', icon: Briefcase },
    { id: 'center', label: 'មណ្ឌល', icon: Award },
    { id: 'prison', label: 'ពន្ធនាគារ', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Breadcrumb - Matching LegalPage and ContactPage */}
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
                  ទំព័រដើម
                </Link>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-primary-600 font-medium">រចនាសម្ព័ន្ធដឹកនាំ</span>
              </nav>
            </div>

            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Page Header - Clean */}
      <div className="bg-white border-b border-gray-100">
        <Container className="py-12">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 text-gray-500 mb-3">
              <Users size={16} />
              <span className="text-xs font-medium uppercase tracking-wider">ថ្នាក់ដឹកនាំ</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">រចនាសម្ព័ន្ធដឹកនាំ</h1>
            <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
              គណៈដឹកនាំអគ្គនាយកដ្ឋានពន្ធនាគារ
            </p>
          </div>
        </Container>
      </div>

      {/* Quick Filter Chips */}
      <Container className="py-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <filter.icon size={16} />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </Container>

      <Container className="pb-16">
        {/* Director Section - Always visible */}
        <div className="mb-16">
          <div className="relative mb-8">
            <h2 className="text-2xl font-light text-gray-900 flex items-center">
              <span className="bg-primary-600 w-1 h-6 rounded-full mr-3"></span>
              អគ្គនាយក
            </h2>
          </div>
          
          <div className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-96 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                <img 
                  src={leadershipData.director.image} 
                  alt={leadershipData.director.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full border border-white/30">
                    {leadershipData.director.experience} បទពិសោធន៍
                  </span>
                </div>
              </div>
              <div className="md:w-2/3 p-8 lg:p-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-900 mb-2">{leadershipData.director.name}</h3>
                    <p className="text-primary-600 text-lg">{leadershipData.director.title}</p>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(leadershipData.director)}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center space-x-2"
                  >
                    <span>ប្រវត្តិ</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Mail size={16} className="text-primary-600" />
                    </div>
                    <span className="text-sm">{leadershipData.director.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Phone size={16} className="text-primary-600" />
                    </div>
                    <span className="text-sm">{leadershipData.director.phone}</span>
                  </div>
                </div>

                <div className="mt-6 p-5 bg-primary-50 rounded-xl">
                  <p className="text-gray-700 leading-relaxed">{leadershipData.director.bio}</p>
                </div>

                <div className="flex items-center space-x-3 mt-6">
                  {leadershipData.director.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-1 text-xs bg-gray-100 px-3 py-1.5 rounded-full">
                      <Sparkles size={12} className="text-primary-600" />
                      <span className="text-gray-600">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deputy Directors - Modern Grid */}
        {(activeFilter === 'all' || activeFilter === 'deputy') && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-gray-900 flex items-center">
                <span className="bg-primary-600 w-1 h-6 rounded-full mr-3"></span>
                អគ្គនាយករង
              </h2>
              <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                {leadershipData.deputies.length} នាក់
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadershipData.deputies.map((deputy) => (
                <div key={deputy.id} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                    <img 
                      src={deputy.image} 
                      alt={deputy.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full border border-white/30">
                        {deputy.experience}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{deputy.name}</h3>
                    <p className="text-primary-600 text-sm mb-3">{deputy.responsibility}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <a href={`mailto:${deputy.email}`} className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors">
                          <Mail size={14} />
                        </a>
                        <a href={`tel:${deputy.phone}`} className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors">
                          <Phone size={14} />
                        </a>
                      </div>
                      <button 
                        onClick={() => handleViewDetails(deputy)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                      >
                        លម្អិត
                        <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Department Heads - Modern Cards */}
        {(activeFilter === 'all' || activeFilter === 'department') && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-gray-900 flex items-center">
                <span className="bg-primary-600 w-1 h-6 rounded-full mr-3"></span>
                ប្រធាននាយកដ្ឋាន
              </h2>
              <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                {leadershipData.departmentHeads.length} នាក់
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadershipData.departmentHeads.map((head) => (
                <div key={head.id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="flex items-start p-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mr-4 flex-shrink-0 border-2 border-primary-100">
                      <img src={head.image} alt={head.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{head.name}</h3>
                      <p className="text-primary-600 text-sm mt-1">{head.department}</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <a href={`mailto:${head.email}`} className="p-1.5 bg-gray-100 rounded-lg hover:bg-primary-100 transition-colors">
                          <Mail size={12} className="text-gray-600" />
                        </a>
                        <a href={`tel:${head.phone}`} className="p-1.5 bg-gray-100 rounded-lg hover:bg-primary-100 transition-colors">
                          <Phone size={12} className="text-gray-600" />
                        </a>
                        <button 
                          onClick={() => handleViewDetails(head)}
                          className="ml-auto text-xs text-primary-600 hover:text-primary-700"
                        >
                          មើល
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Center Directors */}
        {(activeFilter === 'all' || activeFilter === 'center') && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-gray-900 flex items-center">
                <span className="bg-primary-600 w-1 h-6 rounded-full mr-3"></span>
                ប្រធានមណ្ឌល
              </h2>
              <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                {leadershipData.centerDirectors.length} នាក់
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadershipData.centerDirectors.map((director) => (
                <div key={director.id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 mr-3">
                        <img src={director.image} alt={director.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{director.name}</h3>
                        <p className="text-xs text-primary-600">{director.center}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <a href={`mailto:${director.email}`} className="text-xs text-gray-500 hover:text-primary-600">
                        {director.email}
                      </a>
                      <button 
                        onClick={() => handleViewDetails(director)}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        លម្អិត
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prison Chiefs */}
        {(activeFilter === 'all' || activeFilter === 'prison') && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-gray-900 flex items-center">
                <span className="bg-primary-600 w-1 h-6 rounded-full mr-3"></span>
                ប្រធានពន្ធនាគារ
              </h2>
              <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                {leadershipData.prisonChiefs.length} នាក់
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leadershipData.prisonChiefs.map((chief) => (
                <div key={chief.id} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 mr-3">
                      <img src={chief.image} alt={chief.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{chief.name}</h3>
                      <p className="text-xs text-primary-600">ខេត្ត{chief.province}</p>
                    </div>
                    <button 
                      onClick={() => handleViewDetails(chief)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-primary-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Modern Detail Modal */}
      {showDetail && selectedLeader && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-slideUp">
              <button 
                onClick={handleCloseDetail}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
              >
                <X size={18} />
              </button>
              
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 ring-4 ring-primary-100">
                    <img 
                      src={selectedLeader.image} 
                      alt={selectedLeader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{selectedLeader.name}</h2>
                    <p className="text-primary-600 mt-1">{selectedLeader.position}</p>
                    {selectedLeader.department && (
                      <p className="text-sm text-gray-500 mt-1">{selectedLeader.department}</p>
                    )}
                    {selectedLeader.center && (
                      <p className="text-sm text-gray-500 mt-1">{selectedLeader.center}</p>
                    )}
                    {selectedLeader.province && (
                      <p className="text-sm text-gray-500 mt-1">ខេត្ត{selectedLeader.province}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {selectedLeader.education && (
                    <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-xl">
                      <GraduationCap size={18} className="mr-3 text-primary-500" />
                      <span>{selectedLeader.education}</span>
                    </div>
                  )}
                  {selectedLeader.responsibility && (
                    <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-xl">
                      <Briefcase size={18} className="mr-3 text-primary-500" />
                      <span>{selectedLeader.responsibility}</span>
                    </div>
                  )}
                  {selectedLeader.experience && (
                    <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-xl">
                      <Calendar size={18} className="mr-3 text-primary-500" />
                      <span>បទពិសោធន៍ {selectedLeader.experience}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Mail size={18} className="mr-3 text-primary-500" />
                    <a href={`mailto:${selectedLeader.email}`} className="hover:text-primary-600">
                      {selectedLeader.email}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Phone size={18} className="mr-3 text-primary-500" />
                    <a href={`tel:${selectedLeader.phone}`} className="hover:text-primary-600">
                      {selectedLeader.phone}
                    </a>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors">
                        <MessageCircle size={16} />
                      </a>
                      <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors">
                        <Linkedin size={16} />
                      </a>
                      <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors">
                        <Mail size={16} />
                      </a>
                    </div>
                    <span className="text-xs text-gray-400">ប្រវត្តិរូបសង្ខេប</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LeadershipPage;