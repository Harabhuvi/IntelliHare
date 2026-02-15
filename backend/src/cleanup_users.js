import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import User from "./models/User.js";

const logFile = path.join(__dirname, "../cleanup.log");
const log = (msg) => {
    fs.appendFileSync(logFile, msg + "\n");
};

async function cleanup() {
    try {
        await mongoose.connect(process.env.DB_URL);
        const result = await User.deleteMany({ name: "Clerk User" });
        log(`🗑️ Deleted ${result.deletedCount} placeholder records.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        log("ERROR: " + err.stack);
        process.exit(1);
    }
}

cleanup();
