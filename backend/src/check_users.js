import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import User from "./models/User.js";

import fs from "fs";
const logFile = path.join(__dirname, "../users_check.log");
async function checkUsers() {
    try {
        await mongoose.connect(process.env.DB_URL);
        const users = await User.find({});
        const msg = "USERS_COUNT:" + users.length + "\nUSERS_IDS:" + JSON.stringify(users.map(u => u.clerkId));
        fs.writeFileSync(logFile, msg);
        await mongoose.disconnect();
    } catch (err) {
        fs.writeFileSync(logFile, "ERROR: " + err.stack);
    }
}

checkUsers();
