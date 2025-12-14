import express from "express";
import { createUser, updateUser } from "../controller/user.controller.js";
import { login, register, changePassword } from '../controller/auth.controller.js';
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/signup", register);
router.post("/login", login);

// Protected routes - require authentication
router.get("/me", protect, createUser);
router.put("/profile", protect, updateUser);
router.put("/change-password", protect, changePassword);

export default router;
