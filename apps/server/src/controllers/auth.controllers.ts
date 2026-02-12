import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/password.utils.js";
import { RegisterUserSchema } from "@projo/contracts";

export async function registerUser(
  req: Request,
  res: Response,
): Promise<Response | void> {
  try {
    // validate user input.
    const parsed = RegisterUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }
    const userData = parsed.data;

    // check if user is already registered;
    const user = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (user) {
      return res.status(409).json({ error: "This user already exists." });
    }
    // if not registered then, hash password;
    const hashedPassword = await hashPassword(userData.password);

    // create the new user;
    const newUser = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });

    // return the new user;
    return res.status(201).json({
      message: "Account created successfully.",
      data: newUser,
    });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
