import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { WorkspaceSchema, type WorkspaceData } from "@projo/contracts";
import * as z from "zod";

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

// UPDATE workspace;
export async function updateWorkspace(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const user = req.user;
    const workspaceId = req.params.workspaceId as string;
    // validate user input
    const parsed = WorkspaceSchema.safeParse(req.body);
    if (!parsed.success) {
      const { formErrors, fieldErrors } = z.flattenError(parsed.error);
      const messages = [
        ...Object.values(fieldErrors).flat(),
        ...Object.values(formErrors).flat(),
      ];
      return res.status(400).json({ error: messages });
    }
    const name = parsed.data.name.trim();

    // ensure user is valid;
    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized!" });
    }
    // ensure workspace id is valid;
    if (!workspaceId) {
      return res.status(400).json({ error: "Invalid workspace ID!" });
    }
    // check if workspace exists;
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        creatorId: true,
      },
    });
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found!" });
    }

    // ONLY creator and ADMIN can update the workspace;
    const isCreatorWs = workspace.creatorId === user.id;
    const isAdmin = user.role === "ADMIN";
    if (!isCreatorWs && !isAdmin) {
      return res.status(403).json({ error: "Permission denied!" });
    }
    const updatedWorkspace = await prisma.workspace.update({
      where: {
        id: workspace.id,
      },
      data: {
        name: name,
      },
    });

    // return workspace in response;
    return res.status(200).json({
      message: "Workspace updated successfully.",
      data: updatedWorkspace,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

/* DELETE a workspace;
 * only admin and workspace-creator can delete
 * all members should be removed from workspace
 * the deletion should be a hard delete;
 */
export async function deleteWorkspace(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const workspaceId = req.params.workspaceId as string;
    const user = req.user;
    const isAdmin = user?.role === "ADMIN";
    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized!" });
    }
    // ensure workspace id is valid;
    if (!workspaceId) {
      return res.status(400).json({ error: "Invalid workspace ID!" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      select: {
        creatorId: true,
      },
    });
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found." });
    }
    if (!isAdmin && workspace.creatorId !== user.id) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    await prisma.workspace.delete({
      where: {
        id: workspaceId,
        creatorId: user.id,
      },
    });

    return res.status(200).json({
      message: "Workspace deleted successfully.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({ error: "Something went wrong!" });
  }
}
// get all workspaces that user belongs in;
export async function getUserWorkspaces(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized!" });
    }
    let workspaces;
    if (user.role !== "ADMIN") {
      workspaces = await prisma.workspace.findMany({
        where: {
          creatorId: user.id,
        },
        include: {
          members: true,
        },
      });
    } else {
      workspaces = await prisma.workspace.findMany({
        include: { members: true },
      });
    }
    return res.status(200).json({ data: workspaces });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

// any authenticated user can create a workspace;
export async function createWorkspace(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }
    // validate user input using zod schema;
    const parsed = WorkspaceSchema.safeParse(req.body);
    if (!parsed.success) {
      const { fieldErrors, formErrors } = z.flattenError(parsed.error);
      const messages = [
        ...Object.values(formErrors).flat(),
        ...Object.values(fieldErrors).flat(),
      ];
      return res.status(400).json({ error: messages });
    }
    const { name } = parsed.data satisfies WorkspaceData;
    // check if user has a similar workspace;
    const exist = await prisma.workspace.findFirst({
      where: { name, creatorId: req.user.id },
      select: { id: true },
    });
    if (exist) {
      return res.status(409).json({ error: "This name is in use." });
    }
    // create the workspace;
    const newWorkspace = await prisma.$transaction(async (tx) => {
      const ws = await tx.workspace.create({
        data: { name: name, creatorId: req.user!.id },
      });
      await tx.workspaceMember.create({
        data: {
          userId: ws.creatorId,
          workspaceId: ws.id,
          memberRole: "OWNER",
        },
      });
      return ws;
    });

    return res
      .status(201)
      .json({ message: "Workspace created successfully.", data: newWorkspace });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
