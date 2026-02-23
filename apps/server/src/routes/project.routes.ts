import express from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import {
  createProjectInWorkspace,
  getWorkspaceProjects,
  deleteProjectInWorkspace,
  updateProjectInWorkspace,
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
router.put(
  "/workspace/:workspaceId/project/:projectId",
  isAuthenticated,
  updateProjectInWorkspace,
);
export default router;
