import express from "express";
import { createWorkspace } from "../controllers/workspace.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create", isAuthenticated, createWorkspace);

export default router;
