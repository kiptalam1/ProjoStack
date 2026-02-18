import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
//functions;
import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
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
app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
//

export default app;
