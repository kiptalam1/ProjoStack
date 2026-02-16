import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
//functions;
import authRoutes from "./routes/auth.routes.js";
dotenv.config();
// create express app;
const app = express();

//middlewares
app.use(express.json());
app.use(helmet({}));
app.use(cors());
app.use(cookieParser());
//
// routes
app.use("/api/auth", authRoutes);
//

export default app;
