import express from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import { createTask } from "../controllers/task.controllers.js";

const router = express.Router();

router.post("/project/:projectId", isAuthenticated, createTask);

export default router;
