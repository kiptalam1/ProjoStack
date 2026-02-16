import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import type { Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
export type Payload = {
  id: string;
  role: Role;
};

const accessSecret: string = process.env.ACCESS_SECRET!;
const refreshSecret: string = process.env.REFRESH_SECRET!;

export function generateAccessToken({ id, role }: Payload): string {
  return jwt.sign({ id, role }, accessSecret, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken({ id, role }: Payload): string {
  return jwt.sign({ id, role }, refreshSecret, { expiresIn: "7d" });
}

export function attachCookie(
  key: string,
  value: string,
  res: Response,
  options?: { path?: string; maxAgeMs?: number },
) {
  res.cookie(key, value, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: true,
    path: options?.path ?? "/",
    maxAge: options?.maxAgeMs ?? 15 * 60 * 1000,
  });
}

export async function hashRefreshToken(token: string) {
  const saltRounds = 12;
  await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(token, saltRounds);
}

export async function compareRefreshTokens(
  generated: string,
  db_stored: string,
) {
  return await bcrypt.compare(generated, db_stored);
}
