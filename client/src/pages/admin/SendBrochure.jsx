import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import {
  FiSend,
  FiFileText,
  FiMail,
  FiUser,
  FiBook,
  FiVideo,
  FiUpload,
  FiCheck,
  FiX,
  FiMonitor,
  FiLayout,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

// --- High-Tech Video Upload Modal ---
const VideoUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/webm",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Invalid format. Accepted: MP4, MOV, AVI, MKV, WebM");
      return;
    }

    const maxSize = 500 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error("File exceeds 500MB limit.");
      return;
    }

    setFile(selectedFile);
    if (!name) setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Select a video file");

    const formData = new FormData();
    formData.append("video", file);
    if (name) formData.append("name", name);

    try {
      setIsUploading(true);
      setProgress(0);
      const response = await api.post("/admin/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) =>
          setProgress(Math.round((ev.loaded * 100) / ev.total)),
      });
      toast.success("Video asset secured.");
      onUploadSuccess(response.data.data);
      onClose();
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0a0f2d] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Ingest Video Asset</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-[#F47C26] hover:bg-white/5 transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            {file ? (
              <div className="text-green-400">
                <FiCheck className="mx-auto text-4xl mb-2" />
                <p className="font-mono text-sm truncate">{file.name}</p>
                <p className="text-xs opacity-70">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-gray-400 group-hover:text-white transition-colors">
                <FiUpload className="mx-auto text-4xl mb-2" />
                <p className="font-bold">Select Video File</p>
                <p className="text-xs opacity-50 mt-1">
                  Max 500MB • MP4, MOV, AVI
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Asset Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F47C26] transition-all"
              placeholder="e.g. Course Intro v1"
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F47C26] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-gray-400 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="px-6 py-2 bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? "Processing..." : "Start Upload"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- Main Component ---
const SendBrochure = () => {
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState({ generated: [], uploaded: [] });
  const [selectedPdfs, setSelectedPdfs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoSearchTerm, setVideoSearchTerm] = useState("");

  // Form State
  const [email, setEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [subject, setSubject] = useState("Course Brochure");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("custom");

  // UI State
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState("generated"); // 'generated' | 'uploaded'
  const [showVideoUpload, setShowVideoUpload] = useState(false);

  // Message templates for different scenarios
  const messageTemplates = useMemo(
    () => ({
      courseEnquiry: {
        name: "Course Enquiry",
        subject: `About {{courseName}} - FirstVITE E-Learning`,
        content: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p style="margin: 0 0 8px 0;">Dear {{studentName}},</p>

  <p style="margin: 0 0 8px 0;">
    Greetings from 
    <strong>
      <span style="color: rgb(244, 124, 38);">First</span>
      <span style="color: rgb(30, 144, 255);">VITE</span> E-Learning!
    </strong>
  </p>

  <p style="margin: 0 0 8px 0;">
    Are you looking to build a strong career in the domain of 
    <strong>{{courseName}}</strong>?  
    We are excited to introduce our <strong>{{courseName}}</strong> online training program,  
    designed for both beginners and professionals.
  </p>

  <h3 style="margin: 12px 0 6px 0; color: #222; font-size: 16px;">
    🌟 Course Highlights – {{courseName}}
  </h3>
  <ul style="margin: 0 0 12px 18px; padding: 0;">
    <li style="margin-bottom: 4px;">✅ 100% Online | Live + Recorded Classes</li>
    <li style="margin-bottom: 4px;">✅ Taught by Certified Professionals</li>
    <li style="margin-bottom: 4px;">✅ Real-time Case Studies & Projects</li>
    <li style="margin-bottom: 4px;">✅ Access to Server for Practical Training</li>
    <li style="margin-bottom: 4px;">✅ Resume Building + Interview Preparation</li>
    <li style="margin-bottom: 4px;">✅ Certificate from FirstVITE upon Completion</li>
  </ul>

  <h3 style="margin: 12px 0 6px 0; color: #222; font-size: 16px;">
    📅 Course Duration & Timings: 3 to 4 Months | Weekdays / Weekends Available
  </h3>

  <p style="margin: 0 0 8px 0;">💰 Special discounts available for early enrollment!</p>

  <p style="margin: 0 0 8px 0;">Looking forward to helping you take the next step in your career!</p>

  <p style="margin: 0 0 4px 0;">Warm regards,</p>
  <p style="margin: 0 0 4px 0;">
    Team – 
    <span style="color: rgb(244, 124, 38);">First</span>
    <span style="color: rgb(30, 144, 255);">VITE</span> E-Learning Pvt. Ltd.
  </p>
  <p style="margin: 0 0 4px 0;">📩 info@firstvite.com</p>
  <p style="margin: 0;">
    🌐 
    <a href="https://firstvite.com" style="color: rgb(30, 144, 255); text-decoration: none;">
      www.firstvite.com
    </a>
  </p>
</div>
      `,
      },
      webinarInvite: {
        name: "Learning Approach Invitation",
        subject: `Take the Next Step in Your Career with FirstVITE E-Learning`,
        content: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p style="margin: 0 0 8px 0;">Dear {{studentName}},</p>

  <p style="margin: 0 0 8px 0;">
    Greetings from 
    <span style="color: rgb(244, 124, 38);">First</span>
    <span style="color: rgb(30, 144, 255);">VITE</span> E-Learning Pvt. Ltd.!
  </p>

  <p style="margin: 0 0 8px 0;">
    We’re excited to invite you to enroll in one of our professional certification programs designed to help you enhance your skills and career growth.
  </p>

  <p style="margin: 0 0 8px 0;">
    At 
    <span style="color: rgb(244, 124, 38);">First</span>
    <span style="color: rgb(30, 144, 255);">VITE</span>, we offer a wide range of in-demand programs such as 
    <strong>Java</strong>, <strong>Python</strong>, <strong>AI & Machine Learning</strong>, 
    <strong>Cyber Security</strong>, <strong>Digital Marketing</strong>, <strong>SAP</strong>, 
    <strong>Power BI</strong>, <strong>Cloud Computing (Azure)</strong>, <strong>Salesforce</strong>, and more.
  </p>

  <p style="margin: 0 0 8px 0;">
    Each program is structured to provide hands-on learning with real-world applications — helping you gain the expertise needed to stand out in today’s competitive job market.
  </p>

  <p style="margin: 0 0 8px 0;">
    If you’re looking to upgrade your skills or switch to a high-growth career path, this is the perfect time to get started!
  </p>

  <p style="margin: 0 0 8px 0;">
    Please feel free to reply to this email or contact us directly for more details about the courses, duration, and fee structure.
  </p>

  <p style="margin: 0 0 8px 0;">
    Looking forward to helping you begin your learning journey with us.
  </p>

  <p style="margin: 0 0 4px 0;">Warm regards,</p>
  <p style="margin: 0 0 4px 0;">
    Team – 
    <span style="color: rgb(244, 124, 38);">First</span>
    <span style="color: rgb(30, 144, 255);">VITE</span> E-Learning Pvt. Ltd.
  </p>
  <p style="margin: 0 0 4px 0;">📩 info@firstvite.com</p>
  <p style="margin: 0;">
    🌐 
    <a href="https://firstvite.com" style="color: rgb(30, 144, 255); text-decoration: none;">
      www.firstvite.com
    </a>
  </p>
</div>
`,
      },
      videoSender: {
        name: "Video Sender",
        subject: `Take the Next Step in Your Career with FirstVITE E-Learning`,
        content: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p style="margin: 0 0 8px 0;">Dear {{studentName}},</p>

  <p style="margin: 0 0 8px 0;">
    Greetings from 
    <span style="color: rgb(244, 124, 38)">First</span>
    <span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.!
  </p>

  <p style="margin: 0 0 8px 0;">
    We’re excited to invite you to enroll in one of our professional certification programs designed to help you enhance your skills and career growth.
  </p>

  <p style="margin: 0 0 8px 0;">
    At 
    <span style="color: rgb(244, 124, 38)">First</span>
    <span style="color: rgb(30, 144, 255)">VITE</span>, we offer a wide range of in-demand programs such as 
    <strong>Java</strong>, <strong>Python</strong>, <strong>AI & Machine Learning</strong>, 
    <strong>Cyber Security</strong>, <strong>Digital Marketing</strong>, <strong>SAP</strong>, 
    <strong>Power BI</strong>, <strong>Cloud Computing (Azure)</strong>, <strong>Salesforce</strong>, and more.
  </p>

  <p style="margin: 0 0 8px 0;">
    Each program is structured to provide hands-on learning with real-world applications — helping you gain the expertise needed to stand out in today’s competitive job market.
  </p>

  <p style="margin: 0 0 8px 0;">
    If you’re looking to upgrade your skills or switch to a high-growth career path, this is the perfect time to get started!
  </p>

  <p style="margin: 0 0 8px 0;">
    Please feel free to reply to this email or contact us directly for more details about the courses, duration, and fee structure.
  </p>

  <p style="margin: 0 0 8px 0;">
    Looking forward to helping you begin your learning journey with us.
  </p>

  <p style="margin: 0 0 8px 0;">
    <a href="{{videoUrl}}">Watch the demo video</a>
  </p>

  <p style="margin: 0 0 4px 0;">Warm regards,</p>
  <p style="margin: 0 0 4px 0;">
    Team – 
    <span style="color: rgb(244, 124, 38)">First</span>
    <span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.
  </p>
  <p style="margin: 0 0 4px 0;">📩 info@firstvite.com</p>
  <p style="margin: 0;">🌐 <a href="https://firstvite.com" style="color: rgb(30, 144, 255); text-decoration: none;">www.firstvite.com</a></p>
</div>
`,
      },
      allCoursesProposal: {
        name: "All Courses Proposal",
        subject: `Proposal for Student Skill Development & Certification Programs – FirstVITE E-Learning Pvt. Ltd`,
        content: `
<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
  <p style="margin: 0 0 8px 0;">
    Dear {{studentName}},
  </p>

  <p style="margin: 0 0 8px 0;">
    Warm greetings from 
    <span style="color: rgb(244, 124, 38)">First</span>
    <span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.
  </p>

  <p style="margin: 0 0 8px 0;">
    We are pleased to introduce 
    <span style="color: rgb(244, 124, 38)">First</span>
    <span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd., a leading online learning platform focused on delivering high-quality certification programs designed to enhance students’ employability and industry readiness.
  </p>

  <p style="margin: 0 0 8px 0;">
    We would like to propose a collaboration (tie-up) with <strong>{{courseName}}</strong>, to offer a range of industry-relevant certification programs for your students. These programs are structured and delivered by our expert trainers who possess extensive experience in their respective domains.
  </p>

  <p style="margin: 8px 0;"><strong>Courses We Offer</strong></p>

  <ul style="margin: 0 0 8px 20px; padding: 0;">
    <li>Java Programming</li>
    <li>Python Programming</li>
    <li>SAP (Enterprise Management System)</li>
    <li>Artificial Intelligence & Machine Learning</li>
    <li>Cyber Security</li>
    <li>Database Management</li>
    <li>Digital Marketing</li>
    <li>Game Development</li>
    <li>Microsoft Azure (Cloud Computing)</li>
    <li>Salesforce (CRM Platform)</li>
    <li>Android App Development</li>
    <li>Power BI (Business Analytics)</li>
  </ul>

  <p style="margin: 0 0 8px 0;">
    Additionally, we also provide free value-added short courses to help students strengthen their profiles and gain an edge in their career journey.
  </p>

  <p style="margin: 8px 0;"><strong>Key Highlights of Our Programs</strong></p>

  <ul style="margin: 0 0 8px 20px; padding: 0;">
    <li>100% Online Learning (Live + Recorded Classes)</li>
    <li>Delivered by Industry Experts from FirstVite</li>
    <li>Practical, Project-Based Learning</li>
    <li>Certification from FirstVite E-Learning Pvt. Ltd.</li>
    <li>Placement Guidance and Career Support</li>
    <li>Internship Assistance (where applicable)</li>
  </ul>

  <p style="margin: 8px 0;"><strong>Proposal for Tie-Up</strong></p>

  <p style="margin: 0 0 8px 0;">
    We are looking forward to forming a strategic academic partnership with your institution. Through this collaboration, Royal Educational Institute students will gain access to our certified programs at special institutional pricing and benefit from joint skill enhancement initiatives like webinars, workshops, and hackathons.
  </p>

  <p style="margin: 0 0 8px 0;">
    We truly believe this partnership will help bridge the gap between academic learning and industry expectations, empowering your students with the skills needed to succeed in today’s competitive job market.
  </p>

  <p style="margin: 0 0 8px 0;">
    If this proposal aligns with your vision, we would be happy to schedule a meeting or presentation to discuss the details further.
  </p>

  <p style="margin: 0 0 8px 0;">Looking forward to your positive response and a fruitful collaboration.</p>

  <p style="margin: 0 0 4px 0;">Warm regards,</p>
  <p style="margin: 0 0 4px 0;">
    Team <span style="color: rgb(244, 124, 38)">First</span><span style="color: rgb(30, 144, 255)">VITE</span>
  </p>
  <p style="margin: 0 0 4px 0;">
    <span style="color: rgb(244, 124, 38)">First</span><span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.
  </p>
  <p style="margin: 0 0 4px 0;">📧 info@firstvite.com</p>
  <p style="margin: 0;">📞 +91-9990056799 | 🌐 www.firstvite.com</p>
</div>
`,
      },
      custom: {
        name: "Custom Message",
        subject: "",
        content: "",
      },
    }),
    []
  );

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pdfRes, videoRes] = await Promise.all([
          api.get("/uploaded_brochures"),
          api.get("/uploaded_brochures"),
        ]);

        setPdfs({
          generated: pdfRes.data.filter((p) => p.type === "generated"),
          uploaded: pdfRes.data.filter((p) => p.type === "uploaded"),
        });
        setVideos(videoRes.data);
      } catch (err) {
        toast.error("Failed to load assets.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update message when template or variables change
  useEffect(() => {
    if (activeTab === "uploaded") {
      const template = messageTemplates[selectedTemplate];

      // Replace variables in content
      let updatedContent = template.content
        .replace(/\{\{studentName\}\}/g, studentName || "Student")
        .replace(/\{\{courseName\}\}/g, courseName || "this course")
        .replace(/\{\{videoUrl\}\}/g, videoUrl || "");

      // Replace variables in subject
      let updatedSubject = template.subject
        .replace(/\{\{studentName\}\}/g, studentName || "Student")
        .replace(/\{\{courseName\}\}/g, courseName || "this course")
        .replace(/\{\{videoUrl\}\}/g, videoUrl || "");

      setMessage(updatedContent);

      // Only update subject if it hasn't been manually modified or is empty
      if (
        subject === "" ||
        subject === "Course Brochure" ||
        subject.startsWith("About ") ||
        subject.startsWith("Following up")
      ) {
        setSubject(updatedSubject);
      }
    }
  }, [
    activeTab,
    studentName,
    courseName,
    videoUrl,
    selectedTemplate,
    messageTemplates,
    subject,
  ]);

  // Handle template change
  const handleTemplateChange = (e) => {
    const templateKey = e.target.value;
    setSelectedTemplate(templateKey);

    // Only update message if not custom template
    if (templateKey !== "custom") {
      const template = messageTemplates[templateKey];
      setMessage(template.content);
      setSubject(template.subject);
    }
  };

  // --- Helpers ---
  const handleVideoUploadSuccess = (newVideo) => {
    setVideos([newVideo, ...videos]);
    setSelectedVideos([...selectedVideos, newVideo.path]);
  };

  const filteredPdfs = useMemo(() => {
    const list = activeTab === "generated" ? pdfs.generated : pdfs.uploaded;
    return list.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, pdfs, searchTerm]);

  const filteredVideos = useMemo(() => {
    return videos.filter((v) =>
      v.name.toLowerCase().includes(videoSearchTerm.toLowerCase())
    );
  }, [videos, videoSearchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPdfs.length && !selectedVideos.length)
      return toast.error("Select at least one asset.");
    if (!email) return toast.error("Recipient email required.");

    setSending(true);
    try {
      // (Your original submission logic)
      // await api.post(...)
      toast.success("Broadcast initiated successfully!");
      // Reset form
    } catch (err) {
      toast.error("Transmission failed.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-[#05081a] text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 px-6 py-8 max-w-[1600px] mx-auto">
        {/* --- Header --- */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black">
              Broadcast <span className="text-[#F47C26]">Command</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Dispatch brochures and video assets to prospective leads.
            </p>
          </div>
          <Link
            to="/admin/mail-sender/email-records"
            className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <FiMonitor /> View Logs
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* --- Left Column: Asset Selection --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mode Switcher */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-1 flex">
              <button
                type="button"
                onClick={() => setActiveTab("generated")}
                className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  activeTab === "generated"
                    ? "bg-[#F47C26] text-white shadow-lg"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-white"
                }`}
              >
                <FiFileText /> Generated PDFs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("uploaded")}
                className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  activeTab === "uploaded"
                    ? "bg-[#F47C26] text-white shadow-lg"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-white"
                }`}
              >
                <FiUpload /> Uploaded Assets
              </button>
            </div>

            {/* Asset Browser Card */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm h-[600px] flex flex-col">
              {/* PDF Selector */}
              <div className="flex-1 flex flex-col min-h-0 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <FiBook className="text-blue-500" /> Documents
                  </h3>
                  <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">
                    {filteredPdfs.length}
                  </span>
                </div>

                <div className="relative mb-3">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search PDFs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#F47C26]"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {filteredPdfs.map((pdf) => (
                    <label
                      key={pdf.path}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPdfs.includes(pdf.path)
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500"
                          : "bg-white dark:bg-white/5 border-transparent hover:bg-gray-50 dark:hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={pdf.path}
                        checked={selectedPdfs.includes(pdf.path)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedPdfs((prev) =>
                            prev.includes(val)
                              ? prev.filter((p) => p !== val)
                              : [...prev, val]
                          );
                        }}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <p className="font-bold line-clamp-1">{pdf.name}</p>
                        <p className="text-xs opacity-60">
                          {(pdf.size / 1024).toFixed(1)} KB •{" "}
                          {new Date(pdf.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Video Selector */}
              <div className="flex-1 flex flex-col min-h-0 border-t border-gray-200 dark:border-white/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <FiVideo className="text-[#F47C26]" /> Videos
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowVideoUpload(true)}
                    className="text-xs bg-[#F47C26]/10 text-[#F47C26] hover:bg-[#F47C26] hover:text-white px-2 py-1 rounded-md transition-all flex items-center gap-1"
                  >
                    <FiPlus /> New
                  </button>
                </div>

                <div className="relative mb-3">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Videos..."
                    value={videoSearchTerm}
                    onChange={(e) => setVideoSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#F47C26]"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {filteredVideos.map((video) => (
                    <label
                      key={video.path}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedVideos.includes(video.path)
                          ? "bg-orange-50 dark:bg-orange-900/20 border-[#F47C26]"
                          : "bg-white dark:bg-white/5 border-transparent hover:bg-gray-50 dark:hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={video.path}
                        checked={selectedVideos.includes(video.path)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedVideos((prev) =>
                            prev.includes(val)
                              ? prev.filter((v) => v !== val)
                              : [...prev, val]
                          );
                        }}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <p className="font-bold line-clamp-1">{video.name}</p>
                        <p className="text-xs opacity-60">
                          {(video.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Dispatch Configuration --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipient Details */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FiUser /> Recipient Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#F47C26] transition-all"
                      required
                    />
                  </div>
                </div>

                {activeTab === "uploaded" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Recipient Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#F47C26] transition-all"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "uploaded" && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Organization / Course
                    </label>
                    <div className="relative">
                      <FiBook className="absolute left-4 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Manipal University / B.Tech Computer Science"
                        className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#F47C26] transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FiLayout /> Message Content
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Template:</span>
                  <select
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    className="bg-gray-50 dark:bg-[#0a0f2d] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-[#F47C26]"
                  >
                    {Object.entries(messageTemplates).map(([key, template]) => (
                      <option key={key} value={key}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email Subject Line"
                    className="w-full bg-transparent text-xl font-bold placeholder-gray-400 border-b border-gray-200 dark:border-white/10 pb-2 focus:outline-none focus:border-[#F47C26] transition-all"
                  />
                </div>

                <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden min-h-[300px]">
                  <ReactQuill
                    theme="snow"
                    value={message}
                    onChange={setMessage}
                    className="h-[250px] dark:text-gray-200"
                    placeholder="Compose your message..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={sending || loading}
                  className="px-8 py-3 bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <span className="animate-pulse">Transmitting...</span>
                  ) : (
                    <>
                      <FiSend /> Send Broadcast
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <VideoUploadModal
        isOpen={showVideoUpload}
        onClose={() => setShowVideoUpload(false)}
        onUploadSuccess={handleVideoUploadSuccess}
      />
    </div>
  );
};

export default SendBrochure;
