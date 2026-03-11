import express from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import {
  createTask,
  deleteATask,
  getAllTasks,
  updateTask,
} from "../controllers/task.controllers.js";

const router = express.Router();

router.post("/project/:projectId", isAuthenticated, createTask);
router.get("/project/:projectId", isAuthenticated, getAllTasks);
router.delete("/project/:projectId/task/:taskId", isAuthenticated, deleteATask);
router.patch(
  "/workspace/:workspaceId/project/:projectId/task/:taskId",
  isAuthenticated,
  updateTask,
);

export default router;
