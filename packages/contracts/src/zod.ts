import * as z from "zod";

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
  email: z.email({ error: "Ebter a valid email." }).trim().toLowerCase(),
  password: z
    .string({ error: "Password must be a string." })
    .min(8, { error: "Password must be at least 8 characters long." })
    .max(72, { error: "Password is too long!" })
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain a uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export type RegisterUserData = z.infer<typeof RegisterUserSchema>;
export type LoginUserData = z.infer<typeof LoginUserSchema>;
