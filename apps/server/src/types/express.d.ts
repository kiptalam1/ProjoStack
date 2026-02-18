import type { Payload } from "../utils/token.utils.ts";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "ADMIN" | "USER" | "MEMBER";
      };
    }
  }
}
export {};
