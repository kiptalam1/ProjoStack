import { rateLimit } from "express-rate-limit";

// strict limiter for auth
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many auth attempts. Try again later.",
  },
});

// general limiter for app usage
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Slow down." },
});

// moderate limiter for refresh;
export const refreshLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // 30 refresh attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many refresh attempts." },
});
