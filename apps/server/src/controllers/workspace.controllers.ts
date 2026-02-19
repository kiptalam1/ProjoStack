import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { WorkspaceSchema, type WorkspaceData } from "@projo/contracts";
import * as z from "zod";

// get all workspaces for that user belongs in;
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
      });
    } else {
      workspaces = await prisma.workspace.findMany();
    }
    return res.status(200).json({ data: workspaces });
  } catch (error) {
    console.error(error);
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
    const workspace = await prisma.workspace.findFirst({
      where: { name },
    });
    if (workspace) {
      return res.status(409).json({ error: "This name is in use." });
    }
    // create the workspace;
    const newWorkspace = await prisma.workspace.create({
      data: {
        name: name,
        creatorId: req.user.id,
      },
    });
    return res
      .status(201)
      .json({ message: "Workspace created successfully.", data: newWorkspace });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
