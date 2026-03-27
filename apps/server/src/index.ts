import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);
// Listen to app at port;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
