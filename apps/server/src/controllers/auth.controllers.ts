import { type Request, type Response } from "express";
import {
  hashRefreshToken,
  compareRefreshTokens,
} from "../utils/token.utils.js";
import { prisma } from "../lib/prisma.js";
import { comparePassword, hashPassword } from "../utils/password.utils.js";
import jwt from "jsonwebtoken";
import {
  RegisterUserSchema,
  LoginUserSchema,
  type LoginUserData,
  type RegisterUserData,
} from "@projo/contracts";
import * as z from "zod";
import {
  generateAccessToken,
  generateRefreshToken,
  attachCookie,
  type Payload,
} from "../utils/token.utils.js";

const isProd = process.env.NODE_ENV === "production";

// register user logic;
export async function registerUser(
  req: Request,
  res: Response,
): Promise<Response | void> {
  try {
    // validate user input.
    const parsed = RegisterUserSchema.safeParse(req.body);
    if (!parsed.success) {
      const { fieldErrors, formErrors } = z.flattenError(parsed.error);
      const messages = [
        ...Object.values(formErrors).flat(),
        ...Object.values(fieldErrors).flat(),
      ];
      return res.status(400).json({ error: messages });
    }
    const userData = parsed.data satisfies RegisterUserData;

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
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
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
      const { formErrors, fieldErrors } = z.flattenError(parsed.error);
      const messages = [
        ...Object.values(formErrors).flat(),
        ...Object.values(fieldErrors).flat(),
      ];
      return res.status(400).json({ error: messages });
    }
    const userData = parsed.data satisfies LoginUserData;

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
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    //generate jwt access token and attach;
    const accessToken = generateAccessToken({
      id: userFound.id,
      role: userFound.role,
    });
    attachCookie("accessToken", accessToken, res);

    // generate jwt refresh token, attach and save to db;
    const refreshToken = generateRefreshToken({
      id: userFound.id,
      role: userFound.role,
    });
    attachCookie("refreshToken", refreshToken, res, {
      path: "/api/auth",
      maxAgeMs: 7 * 24 * 60 * 60 * 1000,
    });

    const hashedToken = await hashRefreshToken(refreshToken);
    await prisma.user.update({
      where: {
        email: userFound.email,
        id: userFound.id,
      },
      data: {
        refreshToken: hashedToken,
      },
    });
    // return logged in user if success
    const { password: _pw, refreshToken: _rt, ...safeUser } = userFound;
    return res.status(200).json({
      message: "Logged in successfully.",
      data: safeUser,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
}

// user logout functionality;
export async function logoutUser(
  req: Request,
  res: Response,
): Promise<Response | void> {
  const refresh = req.cookies.refreshToken;

  if (refresh) {
    try {
      const decoded = jwt.verify(refresh, process.env.REFRESH_SECRET as string);
      if (typeof decoded !== "string") {
        const payload = decoded as Payload;
        await prisma.user.update({
          where: {
            id: payload?.id,
          },
          data: {
            refreshToken: null,
          },
        });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(msg);
    }
  }
  res.clearCookie("accessToken", {
		secure: isProd,
		sameSite: "strict",
		httpOnly: true,
		path: "/",
	});
  res.clearCookie("refreshToken", {
		secure: isProd,
		sameSite: "strict",
		httpOnly: true,
		path: "/api/auth",
	});
  return res.status(200).json({ message: "Logged out successfully." });
}

// refresh token;
export async function renewAccessToken(
  req: Request,
  res: Response,
): Promise<Response | void> {
  // check whether refresh token exists;
  const savedRefreshToken = req.cookies?.refreshToken;
  if (!savedRefreshToken) {
    return res.status(401).json({ error: "Unauthorized!" });
  }
  try {
    // verify token if valid;
    const decoded = jwt.verify(
      savedRefreshToken,
      process.env.REFRESH_SECRET as string,
    );

    if (typeof decoded === "string") {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const payload = decoded as Payload;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { refreshToken: true, role: true },
    });

    if (!user?.refreshToken) {
      return res.status(401).json({ error: "Unauthorized!" });
    }
    //reject if token was rotated/logged out;
    const isValidRefreshToken = await compareRefreshTokens(
      savedRefreshToken,
      user?.refreshToken as string,
    );
    if (!isValidRefreshToken) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    // generate new access token;
    const newAccessToken = generateAccessToken({
      id: payload.id,
      role: user.role,
    });
    // also generate new refresh token to rotate;
    const newRefreshToken = generateRefreshToken({
      id: payload.id,
      role: user.role,
    });
    attachCookie("accessToken", newAccessToken, res);
    attachCookie("refreshToken", newRefreshToken, res, {
      path: "/api/auth",
      maxAgeMs: 7 * 24 * 60 * 60 * 1000,
    });

    // update refresh token in db for rotation;
    const hashedRefreshToken = await hashRefreshToken(newRefreshToken);
    await prisma.user.update({
      where: { id: payload.id },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    return res
      .status(200)
      .json({ message: "Token renewed and cookie attached" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(401).json({ error: "Unauthorized!" });
  }
}
