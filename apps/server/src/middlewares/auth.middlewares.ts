import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PayloadSchema } from "@projo/contracts";

// ensure user is admin
export async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const role = req.user?.role;
    if (!role) {
      return res.status(401).json({ error: "Unauthorized!" });
    }
    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized!" });
    }
    next();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    res.status(403).json({ error: "Unauthorized!" });
  }
}

// ensure user is logged in;
export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const secret = process.env.ACCESS_SECRET as string;
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized!" });
    }
    const decoded = jwt.verify(accessToken, secret);
    if (typeof decoded === "string") {
      return res.status(401).json({ error: "Unauthorized!" });
    }
    const parsed = PayloadSchema.safeParse(decoded);
    if (!parsed.success) {
      return res.status(401).json({ error: "Unauthorized!" });
    }
    req.user = parsed.data;

    next();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return res.status(401).json({ error: "Unauthorized!" });
  }
}
