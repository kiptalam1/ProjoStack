import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

// send workspace invite;
export async function sendWorkspaceInvite(
	req: Request,
	res: Response,
): Promise<Response> {
	try {
		const MAX_INVITES = 20;
		const user = req.user;
		const workspaceId = req.params.workspaceId as string;
		const { emails } = req.body as { emails: string[] };

		if (!user?.id) {
			return res.status(401).json({
				error: "Unauthorized!",
			});
		}
		if (!workspaceId) {
			return res.status(400).json({
				error: "Invalid workspace ID!",
			});
		}

		if (!Array.isArray(emails)) {
			return res.status(400).json({ error: "Invalid input format!" });
		}

		if (emails.length > MAX_INVITES) {
			return res.status(400).json({
				error: "Too many emails! (maximum of 20)",
			});
		}
		// ensure workspace exists;
		const workspace = await prisma.workspace.findUnique({
			where: {
				id: workspaceId,
			},
		});
		if (!workspace) {
			return res.status(404).json({
				error: "Workspace not found!",
			});
		}

		// ensure current user is owner of workspace;
		const isAllowed = workspace.creatorId === user.id || user.role === "ADMIN";
		if (!isAllowed) {
			return res.status(403).json({
				error: "Permission denied!",
			});
		}

		const normalizedEmails = emails
			.map((e) => e.toLowerCase().trim())
			.filter(Boolean);
		if (normalizedEmails.length === 0) {
			return res.status(400).json({
				error: "Provide user email(s)!",
			});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const validEmails = normalizedEmails.filter((email) =>
			emailRegex.test(email),
		);
		if (validEmails.length === 0) {
			return res.status(400).json({
				error: "Provide valid emails!",
			});
		}
		// ensure invite has not already been sent;
		const existingInvites = await prisma.workspaceInvite.findMany({
			where: {
				workspaceId,
				email: { in: validEmails },
			},
			select: { email: true },
		});
		const existingSet = new Set(existingInvites.map((i) => i.email));
		const newEmails = validEmails.filter((e) => !existingSet.has(e));

		if (newEmails.length === 0) {
			return res.status(409).json({
				error: "All emails already invited!",
			});
		}

		// send invites;
		const invites = await prisma.$transaction(
			newEmails.map((email) =>
				prisma.workspaceInvite.create({
					data: {
						workspaceId,
						sentById: user.id,
						email,
						expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
					},
				}),
			),
		);
		return res.status(201).json({
			message: "Invite sent successfully",
			data: invites,
		});
	} catch (error: unknown) {
		const msg = error instanceof Error ? error.message : String(error);
		console.error(msg);
		return res.status(500).json({ error: "Something went wrong." });
	}
}
