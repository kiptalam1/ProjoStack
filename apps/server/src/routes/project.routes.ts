import express from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import {
  createProjectInWorkspace,
  getWorkspaceProjects,
  deleteProjectInWorkspace,
} from "../controllers/project.controllers.js";

const router = express.Router();

//routes;
router.post(
  "/workspace/:workspaceId/create",
  isAuthenticated,
  createProjectInWorkspace,
);
router.get("/workspace/:workspaceId", isAuthenticated, getWorkspaceProjects);
router.delete(
  "/workspace/:workspaceId/project/:projectId",
  isAuthenticated,
  deleteProjectInWorkspace,
);
export default router;
