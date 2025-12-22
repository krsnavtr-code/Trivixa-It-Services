import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaTimes,
  FaRobot,
  FaUser,
  FaSpinner,
  FaChevronDown,
  FaMagic,
} from "react-icons/fa";
// import { chatApi } from '../../api/chatApi'; // Keep your API import

// --- Constants & Config ---
const INITIAL_MESSAGE =
  "Welcome to **Trivixa**! I'm your AI Concierge. I can help you explore our services, get a project quote, or answer technical questions. How can I assist you today?";

const QUICK_REPLIES = [
  "Get a Quote",
  "Web Development",
  "Mobile Apps",
  "Pricing Models",
  "Contact Support",
];

// --- Advanced Local Intelligence Engine ---
// This simulates a backend NLP processor
const processAIResponse = async (input, context) => {
  const text = input.toLowerCase();
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 1000)
  ); // Natural typing delay

  // 1. Quote / Project Flow (Stateful)
  if (context.mode === "quote") {
    if (!context.step)
      return {
        text: "What kind of project are you looking to build? (e.g., E-commerce, Corporate Site, Mobile App)",
        nextContext: { ...context, step: "project_type" },
      };

    if (context.step === "project_type") {
      return {
        text: `Got it, a **${input}**. Roughly, what is your estimated budget for this project?`,
        nextContext: { ...context, step: "budget", projectType: input },
      };
    }
    if (context.step === "budget") {
      return {
        text: "Understood. And what is your expected timeline for launch?",
        nextContext: { ...context, step: "timeline", budget: input },
      };
    }
    if (context.step === "timeline") {
      return {
        text: `Perfect. I've compiled your request:\n\n* **Project:** ${context.projectType}\n* **Budget:** ${context.budget}\n* **Timeline:** ${input}\n\nA Trivixa consultant will analyze this and email you a formal proposal within 24 hours. Is there anything else?`,
        nextContext: { mode: "normal" }, // Reset
      };
    }
  }

  // 2. Intent Recognition (Regex Matching)

  // -- Greetings
  if (/^(hi|hello|hey|greetings)/.test(text)) {
    return {
      text: "Hello! Ready to innovate? Ask me about our **Services** or type **'Quote'** to start a project.",
    };
  }

  // -- Quote Trigger
  if (/(quote|price|cost|estimate|budget)/.test(text)) {
    return {
      text: "I can definitely help with a quote! Let's get some details first. What is your **Name**?",
      nextContext: { mode: "quote", step: "name" },
    };
  }

  // -- Services: Web
  if (/(web|website|react|node|frontend|backend)/.test(text)) {
    return {
      text: "At **Trivixa**, we craft high-performance web apps using:\n\n* **Frontend:** React.js, Next.js, Vue\n* **Backend:** Node.js, Python, Go\n* **Database:** MongoDB, PostgreSQL\n\nWould you like to see our portfolio?",
    };
  }

  // -- Services: Mobile
  if (/(mobile|app|ios|android|flutter|react native)/.test(text)) {
    return {
      text: "**Mobile Excellence:** We specialize in cross-platform development using **React Native** and **Flutter** to deliver native-like performance on iOS and Android from a single codebase.",
    };
  }

  // -- Services: AI/ML
  if (/(ai|ml|artificial|intelligence|bot|gpt)/.test(text)) {
    return {
      text: "Our **AI Solutions** include:\n\n1.  Custom Chatbots (like me!)\n2.  Predictive Analytics\n3.  NLP & Computer Vision models.\n\nWe help businesses automate workflows intelligently.",
    };
  }

  // -- Contact
  if (/(contact|email|phone|support|reach)/.test(text)) {
    return {
      text: "You can reach our team directly at:\n\n* 📧 **Email:** hello@trivixa.com\n* 📞 **Phone:** +1 (555) 000-0000\n* 📍 **HQ:** Tech Park, Innovation City",
    };
  }

  // -- Fallback
  return {
    text: "I'm not 100% sure about that specific query, but I'm learning every day! \n\nYou can try asking about our **Web Services**, **Mobile Apps**, or type **'Contact'** to speak with a human.",
  };
};

const QuoteChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: INITIAL_MESSAGE, sender: "ai", timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState({ mode: "normal" }); // Stores conversation state
  const messagesEndRef = useRef(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSendMessage = async (textOverride = null) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg = {
      id: Date.now(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // 2. Process AI Response (Simulated)
      const response = await processAIResponse(text, context);

      // Update Context if conversation flow changed
      if (response.nextContext) setContext(response.nextContext);

      // 3. Add AI Message
      const aiMsg = {
        id: Date.now() + 1,
        text: response.text,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Optional: Trigger your real API save here
      // await chatApi.saveMessage(...)
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to render bold text and lists
  const formatMessage = (text) => {
    return text.split("\n").map((line, i) => {
      // Basic Bold Parsing (**text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-1 leading-relaxed">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-bold text-[#F47C26]">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-end sm:p-6 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pointer-events-auto relative w-full sm:max-w-[400px] h-[85vh] sm:h-[600px] bg-white dark:bg-[#0f172a] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 font-sans"
      >
        {/* --- Header --- */}
        <div className="bg-[#0a0f2d] p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F47C26] to-purple-600 flex items-center justify-center text-white shadow-lg">
                <FaRobot />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0f2d] rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Trivixa AI</h3>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* --- Chat Body --- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-[#0f172a] scroll-smooth">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex w-full ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-[#F47C26] to-[#e06514] text-white rounded-br-none"
                    : "bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none"
                }`}
              >
                {formatMessage(msg.text)}
                <div
                  className={`text-[10px] mt-1.5 text-right opacity-70 ${
                    msg.sender === "user" ? "text-white" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- Quick Actions --- */}
        {!isTyping && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-[#0f172a] overflow-x-auto flex gap-2 no-scrollbar">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSendMessage(reply)}
                className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-[#F47C26] hover:text-[#F47C26] transition-all shadow-sm"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* --- Input Area --- */}
        <div className="p-4 bg-white dark:bg-[#0a0f2d] border-t border-gray-200 dark:border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 relative"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-gray-100 dark:bg-[#1e293b] text-gray-900 dark:text-white pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F47C26] transition-all placeholder-gray-500"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F47C26]">
                <FaMagic
                  className={inputValue ? "opacity-100" : "opacity-30"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              <FaPaperPlane />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">
              Powered by Trivixa Neural Engine v2.0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuoteChat;
