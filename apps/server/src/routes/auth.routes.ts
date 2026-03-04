import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  renewAccessToken,
  getMe,
} from "../controllers/auth.controllers.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", renewAccessToken);
router.get("/me", getMe);
export default router;
