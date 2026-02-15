// ✅ Load environment variables first — before anything else
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Resolve current directory correctly for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend folder (absolute path)
dotenv.config({ path: path.join(__dirname, "../.env") });

// Debug info
console.log("🧩 Loading .env from:", path.join(__dirname, "../.env"));
console.log("🔹 DB_URL:", process.env.DB_URL ? "Loaded ✅" : "❌ Not loaded");

// ✅ Import dependencies
import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

// ✅ Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());

// Routes
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "✅ API is up and running" });
});

app.get("/api/test", (req, res) => {
  res.status(200).json({ msg: "✅ Test route works" });
});

// ✅ Extra DB status route for debugging
import mongoose from "mongoose";
app.get("/db-status", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: states[mongoose.connection.readyState],
    db_url: process.env.DB_URL ? "Loaded ✅" : "❌ Not loaded",
  });
});

// ✅ Serve frontend if in production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*", (_, res) =>
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"))
  );
}

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log(`🚀 Server fully started and listening on http://localhost:${ENV.PORT}`)
    );
  } catch (error) {
    console.error("💥 Error starting the server:", error);
  }
};

startServer();
