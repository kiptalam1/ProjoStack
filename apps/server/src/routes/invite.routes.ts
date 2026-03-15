import express from "express";
import { sendWorkspaceInvite } from "../controllers/invite.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post(
	"/workspace/:workspaceId/invite",
	isAuthenticated,
	sendWorkspaceInvite,
);

export default router;
