import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import industryRoutes from "./routes/industries";
import { APP_PORT, MONGODB_URI } from "./config/env";

// Create and configure Express app
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Industry Management API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/industries", industryRoutes);

async function start() {
  try {
    if (!MONGODB_URI) {
      console.error("MONGODB_URI is not set");
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);

    app.listen(APP_PORT, () => {
      console.log(`Server listening on port ${APP_PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();

