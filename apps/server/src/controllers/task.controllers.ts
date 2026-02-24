import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { TaskSchema } from "@projo/contracts";
import * as z from "zod";

// FETCH all tasks in a project;
export async function getAllTasks(req:Request, res:Response):Promise<Response> {
  try {
    const user = req.user;
    const projectId = req.params.projectId as string;

    if(!projectId) {
      return res.status(400).json({error: "Invalid project ID!"});
    }

    if (!user?.id){
      return res.status(401).json({
        error: "Unauthorized!"
      })
    }
    
    // ensure project exists;
    const project = await prisma.project.findUnique({
      where: { id: projectId},
      select: {
        workspaceId: true,
        id: true,
      }
    });

    if (!project){
      return res.status(404).json({
        error: "Project not found."
      })
    }

    // check if workspace exists and user is member;
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: project.workspaceId,
      },
      select: {
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
    const isMember =
      workspace.creatorId === user?.id ||
      workspace.members.some((m) => m.userId === user?.id);
    if (!isMember) {
      return res.status(403).json({ error: "You are not a member!" });
    }
    // fetch tasks and return in response;
    const tasks = await prisma.task.findMany({
      where: {
        projectId: project.id,

      }
    })

    return res.status(200).json({
      data: tasks
    })
  } catch (error:unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({error: "Something went wrong."})
  }  
}

// CREATE a task
// any workspace member can create task
// tasks begin as pending by default
export async function createTask(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const user = req.user;
    const { projectId } = req.params;
    // validate ids;
    if (!user?.id) return res.status(401).json({ error: "Unauthorized!" });
    if (!projectId)
      return res.status(400).json({ error: "Invalid project ID" });

    // validate user input;

    const parsed = TaskSchema.safeParse(req.body);
    if (!parsed.success) {
      const { formErrors, fieldErrors } = z.flattenError(parsed.error);
      const messages = [
        ...Object.values(fieldErrors).flat(),
        ...Object.values(formErrors).flat(),
      ];
      return res.status(400).json({ error: messages });
    }
    const title = parsed.data.title.trim()
    if (!title) return res.status(400).json({ error: "Title is required." });
    // get project + its wsID;
    const project = await prisma.project.findUnique({
      where: {
        id: String(projectId),
      },
      select: {
        id: true,
        workspaceId: true,
      },
    });
    if (!project) {
      return res.status(404).json({
        error: "Project not found.",
      });
    }

    // check if workspace exists and user is member;
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: project.workspaceId,
      },
      select: {
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
    const isMember =
      workspace.creatorId === user.id ||
      workspace.members.some((m) => m.userId === user.id);
    if (!isMember) {
      return res.status(403).json({ error: "You are not a member!" });
    }
    // check for task uniqueness
    const task = await prisma.task.findFirst({
      where: {
        title,
        projectId: project.id,
      },
      select: { id: true },
    });
    if (task) {
      return res.status(409).json({ error: "Title is in use!" });
    }
    // create the task;
    const newTask = await prisma.task.create({
      data: {
        title,
        workspaceId: project.workspaceId,
        projectId: project.id,
        status: "PENDING",
        createdById: user.id,
      },
    });

    return res.status(201).json({
      message: "Task created successfully.",
      data: newTask,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
