import express from "express";
import {
	acceptWsInvite,
	getWorkspaceInvites,
	sendWorkspaceInvite,
} from "../controllers/invite.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post(
	"/workspace/:workspaceId/invite",
	isAuthenticated,
	sendWorkspaceInvite,
);
router.get("/", isAuthenticated, getWorkspaceInvites);
router.post("/:token/accept", isAuthenticated, acceptWsInvite);

export default router;
