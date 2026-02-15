import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import { comparePassword, hashPassword } from "../utils/password.utils.js";
import {
  RegisterUserSchema,
  LoginUserSchema,
  type LoginUserData,
} from "@projo/contracts";
import * as z from "zod";
import { generateAccessToken } from "../utils/token.utils.js";

// register user logic;
export async function registerUser(
  req: Request,
  res: Response,
): Promise<Response | void> {
  try {
    // validate user input.
    const parsed = RegisterUserSchema.safeParse(req.body);
    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error);
      const messages = [...Object.values(fieldErrors).flat()];
      return res.status(400).json({ error: messages });
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
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    // return the new user;
    return res.status(201).json({
      message: "Account created successfully.",
      data: newUser,
    });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

// login user function;
export async function loginUser(
  req: Request,
  res: Response,
): Promise<Response | void> {
  try {
    // get and validate user input;

    const parsed = LoginUserSchema.safeParse(req.body);

    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error);
      const messages = [...Object.values(fieldErrors).flat()];
      return res.status(400).json({ error: messages });
    }
    const userData = parsed.data;
    //check if email exists;
    const userFound = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!userFound) {
      return res
        .status(400)
        .json({ error: "This email does not exist. Try another one." });
    }

    // if email exists, check if password is correct;
    const isValidPassword = await comparePassword(
      userData.password,
      userFound?.password,
    );
    if (!isValidPassword) {
      return res.status(400).json({ error: "Wrong password!" });
    }

    //generate jwt access token and attach;
    const accessToken = generateAccessToken({
      id: userFound.id,
      role: userFound.role,
    });

    res.cookie("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });

    // return logged in user if success
    const { password: _, ...safeUser } = userFound;
    return res.status(200).json({
      message: "Logged in successfully.",
      data: safeUser,
    });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
}
