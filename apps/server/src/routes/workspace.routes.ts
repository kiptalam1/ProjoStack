import express from "express";
import {
  createWorkspace,
  getUserWorkspaces,
} from "../controllers/workspace.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create", isAuthenticated, createWorkspace);
router.get("/", isAuthenticated, getUserWorkspaces);
export default router;
