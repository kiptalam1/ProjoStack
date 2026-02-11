import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

const PORT = process.env.PORT || 5000;
// create express app;
const app = express();

// Listen to app at port;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
