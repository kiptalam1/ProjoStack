import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

// decline ws-invite;
export async function rejectWsInvite(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { user } = req;
    const { token } = req.params;

    // validate logged in user's userId and token provided;
    if (!user?.id) {
      return res.status(401).json({
        error: "Unauthorized!",
      });
    }
    if (!token) {
      return res.status(400).json({
        error: "Invite token required!",
      });
    }
    // check if user is in db;
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        email: true,
      },
    });
    if (!dbUser) {
      return res.status(401).json({
        error: "Unauthorized!",
      });
    }

    // check if invite exists;
    const invite = await prisma.workspaceInvite.findFirst({
      where: {
        token: String(token),
        email: dbUser.email,
      },
    });
    if (!invite) {
      return res.status(404).json({
        error: "Invite required!",
      });
    }

    // check if invite is already declined or is expired;
    if (invite.status === "DECLINED") {
      return res.status(200).json({
        message: "Invite already declined!",
      });
    }
    if (
      invite.status !== "PENDING" ||
      (invite.expiresAt && invite.expiresAt < new Date())
    ) {
      return res.status(400).json({
        error: "Invite is no longer actionable!",
      });
    }

    await prisma.workspaceInvite.update({
      where: { id: invite.id },
      data: {
        status: "DECLINED",
      },
    });

    return res.status(200).json({
      message: "Invite declined successfully.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

// accept ws invite;
export async function acceptWsInvite(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { user } = req;
    const { token } = req.params;

    // check if user is logged in;
    if (!user?.id) {
      return res.status(401).json({
        error: "Unauthorized!",
      });
    }
    // check if invite token is present;
    if (!token) {
      return res.status(400).json({
        error: "Token required!",
      });
    }

    // check if invite with provided token is present;
    const invite = await prisma.workspaceInvite.findUnique({
      where: {
        token: String(token),
      },
    });
    if (!invite) {
      return res.status(404).json({
        error: "Invalid invite!",
      });
    }

    // check if logged in user exists in db;
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        email: true,
      },
    });
    if (!dbUser) {
      return res.status(404).json({
        error: "User not found!",
      });
    }

    // check if invite belongs to user;
    if (dbUser.email !== invite.email) {
      return res.status(403).json({
        error: "Unauthorized!",
      });
    }

    // ensure invite is not expired and is pending;
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return res.status(400).json({
        error: "Invite has expired!",
      });
    }

    if (invite.status !== "PENDING") {
      return res.status(400).json({
        error: "Invite is already settled.",
      });
    }

    // check if user is already ws member;
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: invite.workspaceId,
        },
      },
    });
    if (existingMember) {
      return res.status(400).json({
        error: "You are already a member.",
      });
    }

    // create membership;
    const membership = await prisma.$transaction(async (tx) => {
      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: invite.workspaceId,
          status: "ACTIVE",
          memberRole: "MEMBER",
          invitedById: invite.sentById,
        },
      });

      await tx.workspaceInvite.update({
        where: {
          id: invite.id,
        },
        data: {
          status: "ACCEPTED",
        },
      });
    });

    return res.status(200).json({
      message: "Invite accepted",
      data: membership,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

// get workspace invites;
export async function getWorkspaceInvites(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { user } = req;

    if (!user?.id) {
      return res.status(401).json({
        error: "Unauthorized!",
      });
    }

    const existsUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    if (!existsUser) {
      return res.status(401).json({
        error: "User not found!",
      });
    }

    const invites = await prisma.workspaceInvite.findMany({
      where: {
        email: existsUser?.email,
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        sentBy: {
          select: {
            username: true,
            email: true,
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: invites,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

// send workspace invite;
export async function sendWorkspaceInvite(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const MAX_INVITES = 20;
    const { user } = req;
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
        error: "Already invited!",
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
