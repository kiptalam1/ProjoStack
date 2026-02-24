import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
//function routes;
import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

// limiter
import {
  authLimiter,
  apiLimiter,
} from "./middlewares/rateLimit.middlewares.js";

// create express app;
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({}));
app.use(cors({ credentials: true }));
app.use(cookieParser());
//
// routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/workspaces", apiLimiter, workspaceRoutes);
app.use("/api/projects", apiLimiter, projectRoutes);
app.use("/api/tasks", apiLimiter, taskRoutes);
//

export default app;
