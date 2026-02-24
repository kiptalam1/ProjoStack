import express from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import { createTask, getAllTasks } from "../controllers/task.controllers.js";

const router = express.Router();

router.post("/project/:projectId", isAuthenticated, createTask);
router.get("/project/:projectId", isAuthenticated, getAllTasks);

export default router;
