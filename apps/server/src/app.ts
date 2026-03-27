import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
//function routes;
import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import inviteRoutes from "./routes/invite.routes.js";

// limiter
import { apiLimiter } from "./middlewares/rateLimit.middlewares.js";

// create express app;
const app = express();

// const allowedOrigins = ["http://localhost:3000/"];
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({}));
app.use(
	cors({
		origin: ["http://localhost:3000", "https://projostack.onrender.com"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);
app.use(cookieParser());

// explicitly handle preflight
// app.options("/.*/", cors());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", apiLimiter, workspaceRoutes);
app.use("/api/projects", apiLimiter, projectRoutes);
app.use("/api/tasks", apiLimiter, taskRoutes);
app.use("/api/invites", apiLimiter, inviteRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// serve frontend;
app.use(express.static(path.join(__dirname, "../../web/dist")));
// SPA fallback;
app.get("*", (_req, res) => {
	res.sendFile(path.join(__dirname, "../../web/dist/index.html"));
});
export default app;
