import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
//functions;
import authRoutes from "./routes/auth.routes.js";
const PORT = process.env.PORT || 5000;
// create express app;
const app = express();

// routes
app.use("/api/auth", authRoutes);
//
// Listen to app at port;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
