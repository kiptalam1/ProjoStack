import express from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import {
  createProjectInWorkspace,
  getWorkspaceProjects,
} from "../controllers/project.controllers.js";

const router = express.Router();

//routes;
router.post(
  "/workspace/:workspaceId/create",
  isAuthenticated,
  createProjectInWorkspace,
);
router.get("/workspace/:workspaceId", isAuthenticated, getWorkspaceProjects);
export default router;
