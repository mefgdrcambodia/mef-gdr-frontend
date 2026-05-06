// src/pages/ContactPage.jsx
import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Copy,
  ExternalLink,
  Building2,
  Users,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../components/ui/Container.jsx";

const ContactPage = () => {
  const [currentLang, setCurrentLang] = useState("km");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const handleLanguageChange = (e) => setCurrentLang(e.detail.language);
    window.addEventListener("languagechange", handleLanguageChange);
    const savedLang = localStorage.getItem("language");
    if (savedLang) setCurrentLang(savedLang);
    return () =>
      window.removeEventListener("languagechange", handleLanguageChange);
  }, []);

  const translations = {
    km: {
      pageTitle: "ទំនាក់ទំនង",
      pageSubtitle:
        "មធ្យោបាយទំនាក់ទំនងជាមួយអគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍",
      home: "ទំព័រដើម",
      form: {
        title: "ផ្ញើសារ",
        name: "ឈ្មោះពេញ",
        email: "អាសយដ្ឋានអ៊ីមែល",
        phone: "លេខទូរស័ព្ទ",
        subject: "ប្រធានបទ",
        message: "ខ្លឹមសារ",
        send: "ផ្ញើសារ",
        sending: "កំពុងផ្ញើ...",
        success: "សាររបស់លោកអ្នកត្រូវបានផ្ញើដោយជោគជ័យ",
        error: "សូមទោស មានបញ្ហាបច្ចេកទេស។ សូមព្យាយាមម្តងទៀត",
      },
      info: {
        title: "ព័ត៌មានទំនាក់ទំនង",
        address: "អាសយដ្ឋាន",
        phone: "ទូរស័ព្ទ",
        email: "អ៊ីមែល",
        fax: "ទូរសារ",
        hours: "ម៉ោងធ្វើការ",
        hoursDetail:
          "ច័ន្ទ - សុក្រ: ៧:០០ ព្រឹក - ១១:៣០ ព្រឹក, ២:០០ ល្ងាច - ៥:៣០ ល្ងាច",
        closed: "បិទថ្ងៃសៅរ៍ អាទិត្យ និងថ្ងៃបុណ្យសាសនា",
        viewMap: "មើលផែនទី",
        copy: "ចម្លង",
        copied: "បានចម្លង",
      },
      departments: { title: "នាយកដ្ឋាន" },
      map: { title: "ទីតាំង" },
    },
    en: {
      pageTitle: "Contact Us",
      pageSubtitle:
        "Ways to contact the General Department of Project Impact Resolution",
      home: "Home",
      form: {
        title: "Send a Message",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        subject: "Subject",
        message: "Message",
        send: "Send Message",
        sending: "Sending...",
        success: "Your message has been sent successfully",
        error: "Sorry, a technical error occurred. Please try again",
      },
      info: {
        title: "Contact Information",
        address: "Address",
        phone: "Phone",
        email: "Email",
        fax: "Fax",
        hours: "Office Hours",
        hoursDetail: "Monday - Friday: 7:00 AM - 11:30 AM, 2:00 PM - 5:30 PM",
        closed: "Closed on Saturdays, Sundays and Public Holidays",
        viewMap: "View Map",
        copy: "Copy",
        copied: "Copied",
      },
      departments: { title: "Departments" },
      map: { title: "Location" },
    },
  };
  const t = translations[currentLang];

  const contactInfo = {
    address: {
      km: "ផ្លូវលេខ ៩២ សង្កាត់វត្តភ្នំ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ, 120211",
      en: "Street 92, Sangkat Wat Phnom, Khan Daun Penh, Phnom Penh, 120211",
    },
    phone: "(+855) xx xxx xxxx",
    email: "xxx@mef.gov.kh",
    fax: "(+855) xx xxx xxxx",
    mapLink: "https://maps.app.goo.gl/XsBDgF7wQSayafqP7",
  };

  const getDepartments = () => [
    {
      id: "general",
      name:
        currentLang === "km"
          ? "នាយកដ្ឋានកិច្ចការទូទៅ"
          : "General Affairs Department",
      phone: "(+855) xx xxx xxxx",
    },
    {
      id: "inspection",
      name:
        currentLang === "km"
          ? "នាយកដ្ឋានត្រួតពិនិត្យផ្ទៃក្នុង និងគ្រប់គ្រងទិន្នន័យ"
          : "Internal Inspection and Data Management Department",
      phone: "(+855) xx xxx xxxx",
    },
    {
      id: "impact1",
      name:
        currentLang === "km"
          ? "នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ១"
          : "Impact Resolution Department 1",
      phone: "(+855) xx xxx xxxx",
    },
    {
      id: "impact2",
      name:
        currentLang === "km"
          ? "នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ២"
          : "Impact Resolution Department 2",
      phone: "(+855) xx xxx xxxx",
    },
    {
      id: "impact3",
      name:
        currentLang === "km"
          ? "នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ៣"
          : "Impact Resolution Department 3",
      phone: "(+855) xx xxx xxxx",
    },
  ];

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("sending");
    setTimeout(() => {
      setFormStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setFormStatus(null), 5000);
    }, 1000);
  };
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header with Breadcrumb */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="p-2 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <Home size={18} className="text-gray-400" />
              </Link>
              <nav className="flex items-center space-x-2 text-sm">
                <Link
                  to="/"
                  className="text-gray-500 hover:text-[#2E7D32] transition-colors"
                >
                  {t.home}
                </Link>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-[#2E7D32] font-medium">
                  {t.pageTitle}
                </span>
              </nav>
            </div>
          </div>
        </Container>
      </div>

      {/* Page Header with Light Green Background */}
      <div className="">
        <Container className="py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-[#c8e0c8]">
              <Phone size={14} className="text-[#4CAF50]" />
              <span className="text-xs font-medium text-[#2E7D32] uppercase tracking-wider">
                {t.pageTitle}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20] mb-4 leading-tight">
              {t.pageTitle}
            </h1>
            <div className="w-16 h-1 bg-[#4CAF50] rounded-full mb-5"></div>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              {t.pageSubtitle}
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Info & Departments */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-[#f9fef9] to-white">
                <h2 className="font-medium text-gray-800 flex items-center text-sm">
                  <Building2 size={16} className="mr-2 text-[#4CAF50]" />
                  {t.info.title}
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Address */}
                <div className="flex items-start space-x-3 group">
                  <MapPin
                    size={16}
                    className="text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-[#4CAF50] transition-colors"
                  />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      {t.info.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentLang === "km"
                        ? contactInfo.address.km
                        : contactInfo.address.en}
                    </p>
                    <button
                      onClick={() =>
                        handleCopy(
                          currentLang === "km"
                            ? contactInfo.address.km
                            : contactInfo.address.en,
                          "address",
                        )
                      }
                      className="text-xs text-[#4CAF50] hover:text-[#2E7D32] mt-1 flex items-center"
                    >
                      <Copy size={10} className="mr-1" />
                      {copied === "address" ? t.info.copied : t.info.copy}
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3 group">
                  <Phone
                    size={16}
                    className="text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-[#4CAF50] transition-colors"
                  />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      {t.info.phone}
                    </p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-sm text-gray-600 hover:text-[#2E7D32]"
                    >
                      {contactInfo.phone}
                    </a>
                    <button
                      onClick={() => handleCopy(contactInfo.phone, "phone")}
                      className="text-xs text-[#4CAF50] hover:text-[#2E7D32] mt-1 flex items-center"
                    >
                      <Copy size={10} className="mr-1" />
                      {copied === "phone" ? t.info.copied : t.info.copy}
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3 group">
                  <Mail
                    size={16}
                    className="text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-[#4CAF50] transition-colors"
                  />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      {t.info.email}
                    </p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm text-gray-600 hover:text-[#2E7D32]"
                    >
                      {contactInfo.email}
                    </a>
                    <button
                      onClick={() => handleCopy(contactInfo.email, "email")}
                      className="text-xs text-[#4CAF50] hover:text-[#2E7D32] mt-1 flex items-center"
                    >
                      <Copy size={10} className="mr-1" />
                      {copied === "email" ? t.info.copied : t.info.copy}
                    </button>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-3 pt-3 border-t border-gray-100">
                  <Clock
                    size={16}
                    className="text-gray-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      {t.info.hours}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.info.hoursDetail}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t.info.closed}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Departments Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-[#f9fef9] to-white">
                <h2 className="font-medium text-gray-800 flex items-center text-sm">
                  <Users size={16} className="mr-2 text-[#4CAF50]" />
                  {t.departments.title}
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {getDepartments().map((dept) => (
                  <div
                    key={dept.id}
                    className="p-4 hover:bg-[#f9fef9] transition-all duration-200"
                  >
                    <p className="text-sm font-medium text-gray-700">
                      {dept.name}
                    </p>
                    <p className="text-xs text-[#4CAF50] mt-1">{dept.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form and Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-[#f9fef9] to-white">
                <h2 className="font-medium text-gray-800 flex items-center text-sm">
                  <Send size={16} className="mr-2 text-[#4CAF50]" />
                  {t.form.title}
                </h2>
              </div>
              <div className="p-6">
                {formStatus === "success" && (
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-xs">
                    <CheckCircle size={14} className="mr-2 text-green-600" />
                    {t.form.success}
                  </div>
                )}
                {formStatus === "error" && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-xs">
                    <AlertCircle size={14} className="mr-2" />
                    {t.form.error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        {t.form.name} <span className="text-[#4CAF50]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        {t.form.email} <span className="text-[#4CAF50]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      {t.form.phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      {t.form.subject} <span className="text-[#4CAF50]">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      {t.form.message} <span className="text-[#4CAF50]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-all duration-200 resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="px-6 py-2 bg-[#2E7D32] text-white text-sm font-medium rounded-lg hover:bg-[#1B5E20] transition-all duration-300 disabled:opacity-50 hover:shadow-md"
                  >
                    {formStatus === "sending" ? t.form.sending : t.form.send}
                  </button>
                </form>
              </div>
            </div>

            {/* Map */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-[#f9fef9] to-white">
                <h2 className="font-medium text-gray-800 flex items-center text-sm">
                  <MapPin size={16} className="mr-2 text-[#4CAF50]" />
                  {t.map.title}
                </h2>
              </div>
              <div className="p-6">
                <div className="aspect-[16/9] bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3908.6539446787106!2d104.920614!3d11.576647!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951434d493e03%3A0xb1a605e9a569ec8b!2sMinistry%20of%20Economy%20and%20Finance%20of%20Cambodia!5e0!3m2!1sen!2skh!4v1774153266478!5m2!1sen!2skh"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ministry of Economy and Finance Location Map"
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="mt-3 text-right">
                  <a
                    href={contactInfo.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-[#4CAF50] hover:text-[#2E7D32] transition-colors"
                  >
                    {t.info.viewMap} <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
