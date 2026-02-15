import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import fs from "fs";
const logFile = path.join(__dirname, "../test_modules.log");
const log = (msg) => {
    fs.appendFileSync(logFile, msg + "\n");
};

log("Loading modules...");
import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import mongoose from "mongoose";

log("Loading custom modules...");
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

log("All modules loaded successfully");
fs.appendFileSync(logFile, "SUCCESS\n");
process.exit(0);
