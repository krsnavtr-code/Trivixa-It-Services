import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "../../api/axios";
import { FiUpload } from "react-icons/fi";
import {
  FiSend,
  FiPaperclip,
  FiBriefcase,
  FiUser,
  FiInfo,
  FiLayout,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion, AnimatePresence } from "framer-motion";

const SendProposal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  // Default Values (same as provided)
  const defaultValues = {
    subject: "Invitation for Job Fair 2025 | FirstVITE E-Learning",
    studentMessage: `<div style="color: #4DA3FF; font-size: 18px;">
Dear Student,

Greetings from <span style="font-weight: 600;"><span style="color: rgb(244, 124, 38)">First</span><span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.</span>!

We are excited to invite you to participate in our upcoming Career Hiring Camp 2025, a unique platform where you can connect directly with leading companies that are hiring fresh graduates and final-year students.

This event is designed to help you kickstart your career journey with opportunities for:
• On-the-spot interviews and job offers
• Internship and placement opportunities
• Skill-building sessions by industry experts
• Networking with recruiters from reputed organizations

🎯 <span style="font-weight: 600;">Why You Should Join:</span>
• 100% Free Registration
• Certificate of Participation
• Real Hiring Exposure

📝 <span style="font-weight: 600;">Register Now:</span>
Click the link below to secure your spot:
👉 <span style="font-weight: 600; color: #007BFF;"><a href="https://firstvite.com/jobfair/apply/student">Register Now</a></span>

📅 Event Details will be sent to your email after registration.
Organized by: <span style="font-weight: 600;"><span style="color: rgb(244, 124, 38)">First</span><span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.</span>

Don't miss this golden opportunity to get noticed by hiring companies and start your professional journey.
We look forward to seeing you at the event!

Warm regards,
<strong style="font-weight: 600;"><span style="color: rgb(244, 124, 38)">First</span><span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.</strong>
📞 <span style="font-weight: 600; color: #007BFF;">9990056799</span> 
📧 <span style="font-weight: 600; color: #007BFF;">info@firstvite.com</span>
🌐 <span style="font-weight: 600; color: #007BFF;">https://firstvite.com</span>
</div>
`,
    collegeMessage: `<div style="color: #4DA3FF; font-size: 18px;">
Dear [College Name],

Greetings from <span style="font-weight: 600;"><span style="color: rgb(244, 124, 38)">First</span><span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.</span>!

We are delighted to inform you that we are organizing a Career Hiring Camp in collaboration with several leading partner companies who are actively recruiting fresh graduates and final-year students.

The objective of this initiative is to bridge the gap between education and employment by connecting talented students directly with hiring partners and offering them career guidance, interview exposure, and skill-building sessions — all under one platform.

Your esteemed institution’s participation in this camp would provide your students with:
Direct interaction with multiple hiring companies
Access to real job and internship opportunities
Free participation (no registration or hidden fees)
Certificates and recognition for participants

To participation provide this to your students, please fill out the short form below:
👉 <span style="font-weight: 600; color: #007BFF;"><a href="https://firstvite.com/jobfair/apply/student">Register Now</a></span>

Our team will get in touch with you for further coordination and provide detailed schedules.
We look forward to having your institution join us in empowering the next generation of professionals.

Warm regards,
<span style="font-weight: 600;"><span style="color: rgb(244, 124, 38)">First</span><span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.</span>
📞 <span style="font-weight: 600; color: #007BFF;">9990056799</span> 
📧 <span style="font-weight: 600; color: #007BFF;">info@firstvite.com</span>
🌐 <span style="font-weight: 600; color: #007BFF;">https://firstvite.com</span>
</div>
`,
    companyMessage: `<div style="color: #4DA3FF; font-size: 18px;">
Dear [Company Name],

We are excited to announce that <span style="font-weight: 600;"><span style="color: rgb(244, 124, 38)">First</span><span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.</span>! are organizing a Job Fair which will bring together over 👥1,500+ students from multiple leading colleges/universities.

The objective of this initiative is to bridge the gap between education and employment by connecting talented students directly with hiring partners and offering them career guidance, interview exposure, and skill-building sessions — all under one platform.

This event presents a unique opportunity for your company to:
✅ Engage with top talent across diverse streams.
✅ Showcase your organization and upcoming career opportunities.
✅ Conduct on-the-spot interviews and networking sessions with prospective candidates.
✅ Promote your company brand among job seekers.
✅ Access to fresh & skilled candidates.

We would be honoured to have participate in this Job Fair and connect with some of the brightest emerging professionals. We are committed to providing a seamless experience for all participating companies, including dedicated space for your representatives, and structured interaction with students.

🏫 For Registration kindly fill out this short form:
👉 <span style="font-weight: 600; color: #007BFF;">
<a href="https://firstvite.com/jobfair/apply/company">Register Now</a></span>

💼 Participation Fee: ₹4000 + GST (includes personal hiring space)

For details and bookings, feel free to contact:

Warm regards,
<span style="font-weight: 600;"><span style="color: rgb(244, 124, 38)">First</span><span style="color: rgb(30, 144, 255)">VITE</span> E-Learning Pvt. Ltd.</span>
📞 <span style="font-weight: 600; color: #007BFF;">9990056799</span> 
📧 <span style="font-weight: 600; color: #007BFF;">info@firstvite.com</span>
🌐 <span style="font-weight: 600; color: #007BFF;">https://firstvite.com</span>
</div>
`,
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      messageType: "company", // Default to company for B2B context
      subject: defaultValues.subject,
      studentMessage: defaultValues.studentMessage,
      collegeMessage: defaultValues.collegeMessage,
      companyMessage: defaultValues.companyMessage,
    },
  });

  const messageType = watch("messageType");
  const currentMessageField = `${messageType}Message`;
  const currentMessage = watch(currentMessageField);

  // --- Handlers ---

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter(
        (file) => file.size <= 10 * 1024 * 1024
      );
      if (validFiles.length < e.target.files.length)
        toast.error("Some files exceeded 10MB limit.");
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Process Emails
      const emailList = data.emails
        .split("\n")
        .map((e) => e.trim())
        .filter(Boolean);

      // Prepare Payload
      const emailData = {
        emails: emailList,
        subject: data.subject,
        message: data[currentMessageField],
      };

      formData.append("data", JSON.stringify(emailData));
      files.forEach((file) => formData.append("attachments", file));

      const token = localStorage.getItem("token");
      await axios.post("/v1/admin/emails/send-proposal", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`Proposal sent to ${messageType} contacts!`);
      setFiles([]);
      // Optional: Reset logic here
    } catch (error) {
      toast.error(error.response?.data?.message || "Transmission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-[#05081a] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 px-6 py-8 max-w-[1600px] mx-auto">
        {/* --- Header --- */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black">
              Proposal <span className="text-[#F47C26]">Dispatch</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Initiate partnerships with colleges and corporate entities.
            </p>
          </div>
          <Link
            to="/admin/mail-sender/email-records"
            className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <FiBriefcase /> Audit Logs
          </Link>
        </div>

        {/* Visual Context: Sales Funnel */}
        <div
          className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-60 hover:opacity-100 transition-opacity cursor-help"
          title="View Pipeline"
        >
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
            B2B Outreach Workflow
          </span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* --- Left Column: Configuration --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recipient Type Selector */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FiUser /> Target Audience
              </h3>

              <div className="space-y-3">
                {[
                  {
                    id: "company",
                    label: "Corporate Partners",
                    desc: "Sponsors & Hiring Partners",
                  },
                  {
                    id: "college",
                    label: "Educational Institutes",
                    desc: "Colleges & Universities",
                  },
                  {
                    id: "student",
                    label: "Student Body",
                    desc: "Direct Candidates",
                  },
                ].map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      messageType === type.id
                        ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500"
                        : "bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10"
                    }`}
                  >
                    <input
                      type="radio"
                      value={type.id}
                      {...register("messageType")}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold block text-sm">
                        {type.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {type.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Recipient List */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FiSend /> Recipient List
              </h3>
              <textarea
                {...register("emails", { required: "Recipients required" })}
                rows={8}
                className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl p-4 font-mono text-sm focus:outline-none focus:border-[#F47C26] resize-none"
                placeholder={`hr@company.com\nplacement@college.edu\n...`}
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <FiInfo /> Enter one email address per line.
              </p>
              {errors.emails && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.emails.message}
                </p>
              )}
            </div>

            {/* Attachments */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FiPaperclip /> Attachments
              </h3>

              <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 text-center hover:border-[#F47C26] transition-colors relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FiUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                <p className="text-sm font-medium">Click or Drag files here</p>
                <p className="text-xs text-gray-500 mt-1">Max 10MB per file</p>
              </div>

              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between text-sm bg-gray-50 dark:bg-white/5 p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FiFileText className="text-gray-400" />
                        <span className="truncate max-w-[150px]">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* --- Right Column: Content Editor --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FiLayout /> Proposal Content
                </h3>
              </div>

              {/* Subject Line */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  {...register("subject", { required: "Subject required" })}
                  className="w-full bg-transparent text-xl font-bold border-b border-gray-200 dark:border-white/10 pb-2 focus:outline-none focus:border-[#F47C26] transition-all"
                  placeholder="Proposal Subject..."
                />
              </div>

              {/* Rich Text Editor */}
              <div className="flex-1 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col">
                <ReactQuill
                  theme="snow"
                  value={currentMessage}
                  onChange={(val) => setValue(currentMessageField, val)}
                  className="flex-1 dark:text-gray-200 flex flex-col"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "clean"],
                    ],
                  }}
                />
              </div>

              {/* Actions */}
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
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <FiSend /> Send Proposal
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendProposal;
