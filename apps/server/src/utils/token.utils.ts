import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
type Payload = {
  id: string;
  role: Role;
};

const accessSecret: string = process.env.ACCESS_SECRET!;

export function generateAccessToken({ id, role }: Payload): string {
  return jwt.sign({ id, role }, accessSecret, {
    expiresIn: "15m",
  });
}
