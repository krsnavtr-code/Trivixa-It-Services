import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs"; // Moved to top
import { fileURLToPath } from "url";

// --- Import Routes ---
// Auth & Users
import authRoutes from "./route/auth.routes.js"; // Used authRoutes instead of authRoute
import userRoutes from "./route/user.routes.js";
import profileRoute from "./route/profile.route.js";

// Core Business Logic
import categoryRoute from "./route/category.route.js";
import subcategoryRoute from "./route/subcategory.route.js";
import servicesRoute from "./route/services.route.js";
import contactRoute from "./route/contact.routes.js";
import faqRoute from "./route/faq.route.js";
import blogRoutes from "./route/blog.route.js";
import discussionRoutes from "./route/discussion.routes.js";

// Admin & Operations
import adminRoutes from "./route/admin.routes.js";
import uploadRoute from "./route/upload.route.js";
import externalContactRoutes from "./route/externalContact.routes.js";
import chatRoutes from "./route/chat.route.js";

// Payments
import paymentRoutes from "./route/payment.routes.js";
import adminPaymentRoutes from "./route/adminPayment.routes.js";

// Emails
import adminEmailRoutes from "./route/adminEmail.routes.js";
import emailRecordRoutes from "./route/emailRecord.routes.js";

// --- Configuration & Setup ---
dotenv.config();
const app = express();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Paths
const publicDir = path.join(__dirname, "public");
const uploadsDir = path.join(__dirname, "public", "uploads");
const candidateProfileDir = path.join(publicDir, "candidate_profile");

// --- Middleware Configuration ---
// Body Parser with increased payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Timeout (5 minutes)
app.timeout = 300000;

// 3. CORS
const corsOptions = {
    origin: function (origin, callback) {
        if (process.env.NODE_ENV !== "production" || !origin) {
            return callback(null, true);
        }
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://trivixa.in",
            "https://www.trivixa.com",
        ];
        if (allowedOrigins.includes(origin) || origin.endsWith(".trivixa.com")) {
            return callback(null, true);
        }
        console.warn("CORS blocked request from origin:", origin);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type", "Authorization", "x-auth-token", "x-user-agent",
        "x-client-ip", "Cache-Control", "Pragma", "Expires", "Accept",
        "Access-Control-Allow-Origin",
    ],
    exposedHeaders: [
        "Content-Length", "Content-Type", "Content-Disposition",
        "x-auth-token", "x-user-agent", "x-client-ip",
    ],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// --- File System & Static Files ---

// Ensure directories exist
[uploadsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// List public files (Debug logs)
// try {
//     fs.readdirSync(publicDir);
//     fs.readdirSync(uploadsDir);
// } catch (e) { console.error("Error listing files", e); }

// Static Route: Uploads (with specific MIME types)
app.use("/uploads", (req, res, next) => {
    // console.log('Request for upload file:', req.path);
    next();
}, express.static(uploadsDir, {
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase().substring(1);
        const mimeTypes = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp" };
        if (mimeTypes[ext]) {
            res.set("Content-Type", mimeTypes[ext]);
            res.set("Cache-Control", "public, max-age=31536000");
        }
    },
}));

// Static Route: Candidate Profiles
app.use("/candidate_profile", express.static(candidateProfileDir, {
    setHeaders: (res, path) => {
        res.setHeader("Cache-Control", "public, max-age=31536000");
    },
}));


// Static Route: Candidate Profiles
app.use("/candidate_profile", express.static(candidateProfileDir, {
    setHeaders: (res, path) => {
        res.setHeader("Cache-Control", "public, max-age=31536000");
    },
}));

// Fallback Static Route (General public folder)
app.use(express.static(publicDir, {
    setHeaders: (res, path) => {
        res.setHeader("Cache-Control", "public, max-age=31536000");
    },
}));

// Test Endpoint for uploads
app.get("/test-upload/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ success: false, message: "File not found", path: filePath });
    }
});

// --- Database Connection ---
const PORT = process.env.PORT || 4002;
const URI = process.env.MongoDBURI;

mongoose
    .connect(URI)
    .then(() => console.log("✅ Successfully connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        if (err.name === "MongoServerError") console.error("MongoDB Server Error:", err.message);
        process.exit(1);
    });

// --- API Routes ---

// Health & Debug
app.get("/api/ping", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

app.get("/api/health", (req, res) => res.status(200).json({ status: "OK", timestamp: new Date() }));

// Public Routes
app.use("/api/categories", categoryRoute);
app.use("/api/subcategories", subcategoryRoute);
app.use("/api/services", servicesRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/contact", contactRoute); 
app.use("/api/faqs", faqRoute);
app.use("/api/blog", blogRoutes);
app.use("/api/outcontact", externalContactRoutes);

// Authentication
app.use("/api/auth", authRoutes);

// Protected Routes / Operations
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/chat", chatRoutes);

// Payments
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);

// Emails & Records
app.use("/api/v1/admin/emails", adminEmailRoutes);
app.use("/api/emails", emailRecordRoutes);


// --- Global Error Handling ---
app.use((err, req, res, next) => {
    const isDev = process.env.NODE_ENV === "development";
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 409;
        const fields = Object.keys(err.keyValue || {});
        if (fields.includes("email")) {
            message = "Email already registered. Go to Login page";
        } else {
            message = "Duplicate value entered";
        }
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
    }

    res.status(statusCode).json({
        status: String(statusCode).startsWith("4") ? "fail" : "error",
        message,
        ...(isDev ? { stack: err.stack } : {}),
    });
});

// --- Server Start ---
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections (crash safety)
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! Shutting down...");
    console.error(err);
    server.close(() => {
        process.exit(1);
    });
});

export default app;