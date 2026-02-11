import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/password.utils.js";

export async function registerUser(
  req: Request,
  res: Response,
): Promise<Response | void> {
  try {
    const { email, password } = req.body;
    // check if user is already registered;
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(400).json({ error: "This user already exists." });
    }
    // if not registered then, hash password;
    const hashedPassword = await hashPassword(password);
    await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
