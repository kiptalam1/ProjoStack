import express from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import { createProjectInWorkspace } from "../controllers/project.controllers.js";

const router = express.Router();

//routes;
router.post(
  "/workspace/:workspaceId/create",
  isAuthenticated,
  createProjectInWorkspace,
);

export default router;
