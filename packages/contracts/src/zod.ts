import * as z from "zod";
import { Role } from "@prisma/client";

export const RegisterUserSchema = z.object({
  username: z
    .string({ error: "Username must be a string." })
    .trim()
    .min(3, { error: "Username must be atleast 3 characters" })
    .max(32, { error: "Username is too long." })
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.email({ error: "Enter a valid email." }).trim().toLowerCase(),
  password: z
    .string({ error: "Password must be a string." })
    .min(8, { error: "Password must be at least 8 characters long." })
    .max(72, { error: "Password is too long!" })
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain a uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const LoginUserSchema = z.object({
  email: z.email({ error: "Enter a valid email." }).trim().toLowerCase(),
  password: z
    .string({ error: "Password must be a string." })
    .min(8, { error: "Password must be at least 8 characters long." })
    .max(72, { error: "Password is too long!" })
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain a uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const PayloadSchema = z.object({
  id: z.string(),
  role: z.enum(Role),
});

export const WorkspaceSchema = z.object({
  name: z
    .string({ error: "Workspace name must be a string." })
    .trim()
    .min(3, { error: "Name must be at least 3 characters long." })
    .max(72, { error: "Name is too long!" })
    .regex(/^[a-zA-Z0-9]+([ _-][a-zA-Z0-9]+)*$/, {
      error: "Name contains invalid characters.",
    }),
});

export const ProjectSchema = z.object({
  name: z
    .string({ error: "Project name must be a string." })
    .trim()
    .min(3, { error: "Name must be at least 3 characters long." })
    .max(72, { error: "Name is too long!" })
    .regex(/^[a-zA-Z0-9]+([ _-][a-zA-Z0-9]+)*$/, {
      error: "Name contains invalid characters.",
    }),
});

export const TaskSchema = z.object({
  title: z
    .string({ error: "Title must be a string." })
    .trim()
    .min(3, { error: "Title must be at least 3 characters long." })
    .max(72, { error: "Title is too long!" })
    .regex(/^[a-zA-Z0-9]+([ _-][a-zA-Z0-9]+)*$/, {
      error: "Title contains invalid characters.",
    }),
});

export type RegisterUserData = z.infer<typeof RegisterUserSchema>;
export type LoginUserData = z.infer<typeof LoginUserSchema>;
export type PayloadData = z.infer<typeof PayloadSchema>;
export type WorkspaceData = z.infer<typeof WorkspaceSchema>;
export type ProjectData = z.infer<typeof ProjectSchema>;
export type TaskData = z.infer<typeof TaskSchema>;
