import express from "express";
import {
  createWorkspace,
  deleteWorkspace,
  getUserWorkspaces,
  updateWorkspace,
} from "../controllers/workspace.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create", isAuthenticated, createWorkspace);
router.get("/", isAuthenticated, getUserWorkspaces);
router.delete("/delete/:workspaceId", isAuthenticated, deleteWorkspace);
router.put("/update/:workspaceId", isAuthenticated, updateWorkspace);
export default router;
