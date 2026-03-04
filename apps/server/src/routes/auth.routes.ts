import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  renewAccessToken,
  getCurrentUser,
} from "../controllers/auth.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import {
  authLimiter,
  refreshLimiter,
} from "../middlewares/rateLimit.middlewares.js";
const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshLimiter, renewAccessToken);
router.get("/me", refreshLimiter, isAuthenticated, getCurrentUser);
export default router;
