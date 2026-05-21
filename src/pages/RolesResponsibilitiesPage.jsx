// src/pages/RolesResponsibilitiesPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Building2,
  Users,
  Target,
  X,
  ChevronRight,
  Briefcase,
  Scale,
  Laptop,
  Landmark,
  Link2,
  Globe,
  UserCheck,
  Database,
  MessageCircle,
} from "lucide-react";
import Container from "../components/ui/Container.jsx";
import GlobalBanner from "../components/ui/GlobalBanner.jsx";
import RunningText from "../components/ui/RunningText";
import { useRoleAndResponsibility } from "../hooks/useEvent";
import { useDepartmentDetail } from "../hooks/useDepartmentDetail";

const RolesResponsibilitiesPage = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("language") || "km";
  });
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch role and responsibility data from API
  const { loading: roleLoading, data, error: roleError } = useRoleAndResponsibility();
  
  // Fetch all departments from API
  const { 
    departments, 
    loading: deptLoading, 
    error: deptError,
    getDepartment 
  } = useDepartmentDetail({ 
    autoFetch: true, 
    fetchAll: true,
    parallel: true 
  });

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () =>
      window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const loading = roleLoading || deptLoading;

  // Helper function to strip HTML tags
  const stripHtmlTags = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Get dynamic content based on language
  const getTitle = () => {
    if (roleLoading || !data) {
      return currentLang === "km"
        ? "តួនាទី និងការទទួលខុសត្រូវ"
        : "Roles & Responsibilities";
    }
    return currentLang === "km" ? data.titleKh : data.titleEn;
  };

  const getMissionTitle = () => {
    if (roleLoading || !data) {
      return currentLang === "km"
        ? "អគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍ បំពេញមុខងារជាសេនាធិការឱ្យក្រសួងសេដ្ឋកិច្ចនិងហិរញ្ញវត្ថុ លើការងារដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍នានា ដោយមានបេសកកម្មដូចខាងក្រោម៖"
        : "The General Department of Resettlement serves as the chief of staff to the Ministry of Economy and Finance on impact resolution work from various development projects with the following mission:";
    }
    return currentLang === "km" ? data.titleKh : data.titleEn;
  };

  const getArticle = () => {
    if (roleLoading || !data) return "";
    return currentLang === "km" ? data.articleKh : data.articleEn;
  };

  // Manual leadership data
  const getLeadershipList = () => {
    return [
      {
        id: 1,
        roleKh: "អគ្គនាយក",
        roleEn: "Director General",
        nameKh: "",
        nameEn: "",
      },
      {
        id: 2,
        roleKh: "អគ្គនាយករង",
        roleEn: "Deputy Director General",
        nameKh: "",
        nameEn: "",
      },
      {
        id: 3,
        roleKh: "ប្រធាននាយកដ្ឋាន",
        roleEn: "Department Director",
        nameKh: "",
        nameEn: "",
      },
    ];
  };

  // Transform offices data for the UI - using ONLY real data from database
  const getTransformedOffices = (department, lang) => {
    const offices = [];
    
    // Helper to get office duties
    const getOfficeDuties = (office) => {
      if (!office || !office.jobToDo) return [];
      return office.jobToDo.map(job => lang === "km" ? job.kh : job.en);
    };
    
    // Office One - Only if exists and has data
    if (department.officeOne && department.officeOne.jobToDo && department.officeOne.jobToDo.length > 0) {
      const officeTitle = lang === "km" ? department.officeOne.titleKh : department.officeOne.titleEn;
      
      // Only add if title exists
      if (officeTitle) {
        offices.push({
          name: stripHtmlTags(officeTitle),
          duties: getOfficeDuties(department.officeOne),
        });
      }
    }
    
    // Office Two - Only if exists and has data
    if (department.officeTwo && department.officeTwo.jobToDo && department.officeTwo.jobToDo.length > 0) {
      const officeTitle = lang === "km" ? department.officeTwo.titleKh : department.officeTwo.titleEn;
      
      // Only add if title exists
      if (officeTitle) {
        offices.push({
          name: stripHtmlTags(officeTitle),
          duties: getOfficeDuties(department.officeTwo),
        });
      }
    }
    
    // Office Three - Only if exists and has data
    if (department.officeThree && department.officeThree.jobToDo && department.officeThree.jobToDo.length > 0) {
      const officeTitle = lang === "km" ? department.officeThree.titleKh : department.officeThree.titleEn;
      
      // Only add if title exists
      if (officeTitle) {
        offices.push({
          name: stripHtmlTags(officeTitle),
          duties: getOfficeDuties(department.officeThree),
        });
      }
    }
    
    return offices;
  };

  // Transform API departments to match the expected format for the UI
  const getDepartmentList = () => {
    if (deptLoading || !departments) return [];
    
    const orderedTypes = [
      'general',
      'resettlement-one', 
      'resettlement-two', 
      'resettlement-three', 
      'manage-data'
    ];
    
    return orderedTypes
      .filter(type => departments[type])
      .map(type => {
        const dept = departments[type];
        return {
          id: dept.id,
          type: type,
          name: currentLang === "km" ? dept.name?.kh : dept.name?.en,
          title: currentLang === "km" ? dept.titleKh : dept.titleEn,
          description: stripHtmlTags(currentLang === "km" ? dept.descriptionKh : dept.descriptionEn),
          responsibilities: dept.jobToDo?.map(job => 
            currentLang === "km" ? job.kh : job.en
          ) || [],
          offices: getTransformedOffices(dept, currentLang),
        };
      });
  };

  const translations = {
    km: {
      title: "តួនាទី និងការទទួលខុសត្រូវ",
      subtitle:
        "តួនាទី និងការទទួលខុសត្រូវរបស់អគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍",
      mission: "បេសកកម្ម",
      departments: "នាយកដ្ឋាន",
      leadership: "ថ្នាក់ដឹកនាំ",
      departmentDetails: "ព័ត៌មានលម្អិតនាយកដ្ឋាន",
      responsibilities: "ភារកិច្ច",
      offices: "ការិយាល័យ",
      close: "បិទ",
      back: "ត្រលប់ក្រោយ",
      officeDuties: "ភារកិច្ចការិយាល័យ",
    },
    en: {
      title: "Roles & Responsibilities",
      subtitle:
        "Roles and responsibilities of the General Department of Resettlement",
      mission: "Mission",
      departments: "Departments",
      leadership: "Leadership",
      departmentDetails: "Department Details",
      responsibilities: "Responsibilities",
      offices: "Offices",
      close: "Close",
      back: "Back",
      officeDuties: "Office Duties",
    },
  };

  const t = translations[currentLang];
  const departmentList = getDepartmentList();
  const leadershipList = getLeadershipList();

  const handleOpenModal = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDepartment(null);
  };

  // Department Detail Modal Component
  const DepartmentDetailModal = () => {
    if (!selectedDepartment) return null;

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="min-h-screen px-3 sm:px-4 py-4 sm:py-8">
          <div className="max-w-5xl mx-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 z-10 py-3 sm:py-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleCloseModal}
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-[#2E7D32] transition-colors group"
                >
                  <ChevronRight
                    size={16}
                    className="rotate-180 group-hover:-translate-x-1 transition-transform"
                  />
                  <span className="text-xs sm:text-sm">{t.back}</span>
                </button>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Department Header */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#4CAF50] bg-opacity-10 rounded-xl text-[#2E7D32]">
                  <Building2 size={20} />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
                    {selectedDepartment.name}
                  </h1>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedDepartment.description}
                  </p>
                </div>
              </div>

              {/* Responsibilities Section */}
              {selectedDepartment.responsibilities &&
                selectedDepartment.responsibilities.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Target size={18} className="text-[#2E7D32]" />
                      <h2 className="text-base font-medium text-gray-900">
                        {t.responsibilities}
                      </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selectedDepartment.responsibilities.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <ChevronRight
                            size={14}
                            className="text-[#4CAF50] mt-0.5 flex-shrink-0"
                          />
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Offices Section */}
              {selectedDepartment.offices &&
                selectedDepartment.offices.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 size={18} className="text-[#2E7D32]" />
                      <h2 className="text-base font-medium text-gray-900">
                        {t.offices}
                      </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {selectedDepartment.offices.map((office, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                        >
                          <h3 className="text-sm font-medium text-gray-900 mb-3">
                            {office.name}
                          </h3>
                          {office.duties && office.duties.length > 0 && (
                            <>
                              <div className="text-xs font-medium text-gray-500 mb-2">
                                {t.officeDuties}:
                              </div>
                              <ul className="space-y-1.5">
                                {office.duties.map((duty, dutyIdx) => (
                                  <li
                                    key={dutyIdx}
                                    className="flex items-start gap-1.5 text-xs text-gray-500"
                                  >
                                    <ChevronRight
                                      size={10}
                                      className="text-[#4CAF50] mt-0.5 flex-shrink-0"
                                    />
                                    <span>{duty}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RunningText />
        <GlobalBanner
          title={t.title}
          subtitle={t.subtitle}
          height="h-[200px] md:h-[280px] lg:h-[350px]"
          showBreadcrumb={true}
        />
        <Container className="py-8">
          <div className="text-center mb-8">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-20 w-full max-w-3xl bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RunningText />

      <GlobalBanner
        title={t.title}
        subtitle={t.subtitle}
        height="h-[200px] md:h-[280px] lg:h-[350px]"
        showBreadcrumb={true}
      />

      {/* Mission Section - From API */}
      <Container className="py-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-6 text-center">
            <div className="flex items-center space-x-2">
              <Target
                size={20}
                className="text-[#2E7D32]"
                style={{ marginTop: "-15px" }}
              />
              <h1 className="text-lg" style={{ marginTop: "5px" }}>
                {t.mission}
              </h1>
            </div>
            <label
              style={{
                paddingLeft: "70px",
                paddingRight: "70px",
                color: "black",
              }}
            >
              {getMissionTitle()}
            </label>
          </div>

          {/* Article/Mission Items - Rendered as HTML from API */}
          {getArticle() && (
            <div
              className="mission-content text-left max-w-4xl mx-auto"
              style={{ paddingLeft: "50px", paddingRight: "50px" }}
              dangerouslySetInnerHTML={{ __html: getArticle() }}
            />
          )}
        </div>
      </Container>

      {/* Departments and Leadership */}
      <Container className="py-0">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Departments */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Building2 size={20} className="text-[#2E7D32]" />
              <h2
                className="text-lg font-medium text-gray-900"
                style={{ marginTop: "15px" }}
              >
                {t.departments}
              </h2>
            </div>

            <div className="space-y-3">
              {departmentList.map((item, index) => (
                <div
                  key={item.id || index}
                  onClick={() => handleOpenModal(item)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:shadow-gray-200/50 hover:border-[#4CAF50] transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-[#4CAF50] bg-opacity-10 rounded-lg text-[#2E7D32] group-hover:bg-[#4CAF50] group-hover:text-white transition-colors duration-300">
                      <Building2 size={20} style={{ marginTop: "-10px" }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-[#2E7D32] transition-colors">
                          {item.name}
                        </h3>
                        <ChevronRight
                          size={16}
                          className="text-gray-400 group-hover:text-[#4CAF50] group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Leadership */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Users size={20} className="text-[#2E7D32]" />
              <h2
                className="text-lg font-medium text-gray-900"
                style={{ marginTop: "15px" }}
              >
                {t.leadership}
              </h2>
            </div>

            <div className="space-y-3">
              {leadershipList.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:shadow-gray-200/50 hover:border-[#4CAF50] transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-[#4CAF50] bg-opacity-10 rounded-lg text-[#2E7D32]">
                      <Users size={20} style={{ marginTop: "-10px" }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {currentLang === "km" ? item.roleKh : item.roleEn}
                      </h3>
                      {item.nameKh && currentLang === "km" && (
                        <p className="text-xs text-gray-500">{item.nameKh}</p>
                      )}
                      {item.nameEn && currentLang === "en" && (
                        <p className="text-xs text-gray-500">{item.nameEn}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <br />
      <br />
      <br />

      {/* Department Detail Modal */}
      {showModal && <DepartmentDetailModal />}

      {/* Custom styles for API HTML content */}
      <style jsx>{`
        .mission-content ul {
          list-style-type: disc;
          padding-left: 20px;
        }
        .mission-content li {
          margin-top: 15px;
          color: #4a5568;
          line-height: 1.6;
        }
        .mission-content p {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default RolesResponsibilitiesPage;