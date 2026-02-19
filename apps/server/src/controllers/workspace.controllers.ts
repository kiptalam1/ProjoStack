import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { WorkspaceSchema, type WorkspaceData } from "@projo/contracts";
import * as z from "zod";

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
