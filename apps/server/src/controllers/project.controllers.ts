import type { Request, Response } from "express";
import * as z from "zod";
import { ProjectSchema } from "@projo/contracts";
import { prisma } from "../lib/prisma.js";

// GET all projects in a workspace;
export async function getWorkspaceProjects(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const workspaceId = req.params.workspaceId as string;
    const user = req.user;

    // ensure id is valid;
    if (!workspaceId) {
      return res.status(400).json({ error: "Invalid workspace ID!" });
    }

    // ensure user is present;
    if (!user?.id) {
      return res.status(404).json({ error: "User not found!" });
    }

    // ensure workspace exists;
    const existsWs = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      select: {
        members: {
          select: {
            userId: true,
            status: true,
          },
        },
      },
    });

    if (!existsWs) {
      return res.status(404).json({ error: "Workspace does not exist!" });
    }
    // ensure user is a member of the workspace;
    const isMember = existsWs.members.find((m) => m.userId === String(user.id));
    if (!isMember) {
      res.status(403).json({ error: "You are not a member!" });
    }

    // fetch projects;
    const projects = await prisma.project.findMany({
      where: {
        workspaceId,
      },
    });

    return res.status(200).json({ data: projects });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

// CREATE a new project;
export async function createProjectInWorkspace(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const user = req.user;
    const workspaceId = req.params.workspaceId as string;

    // ensure id is valid;
    if (!workspaceId) {
      return res.status(400).json({ error: "Invalid workspace ID!" });
    }

    // ensure user is present;
    if (!user?.id) {
      return res.status(404).json({ error: "User not found!" });
    }
    // validate user input;
    const parsed = ProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      const { formErrors, fieldErrors } = z.flattenError(parsed.error);
      const messages = [
        ...Object.values(fieldErrors).flat(),
        ...Object.values(formErrors).flat(),
      ];
      return res.status(400).json({ error: messages });
    }
    // check if workspace exists;
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        creatorId: true,
        members: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found." });
    }

    // check if user is a member of workspace;
    const isMember = workspace?.members.find(
      (m) => String(m.userId) === String(user?.id),
    );
    if (!isMember) {
      return res.status(401).json({ error: "You are not a member!" });
    }
    const name = parsed.data.name.trim();

    // check if project with this name exists;
    const projectExists = await prisma.project.findFirst({ where: { name } });
    if (projectExists) {
      return res.status(409).json({ error: "Name is in use!" });
    }

    // create project;
    const newProject = await prisma.project.create({
      data: {
        name: name,
        workspaceId: String(workspace.id),
        createdById: String(user?.id),
      },
    });

    // return new project in response;
    return res.status(201).json({
      message: "Project created successfully.",
      data: newProject,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
