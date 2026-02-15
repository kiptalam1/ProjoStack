import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import type { Response } from "express";
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

export function attachCookie(key: string, value: string, res: Response) {
  res.cookie(key, value, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
  });
}
