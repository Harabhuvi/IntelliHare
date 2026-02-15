import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, "../startup_log.txt");

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + "\n");
}

log("Starting debug server...");
dotenv.config({ path: path.join(__dirname, "../.env") });
log("DB_URL: " + (process.env.DB_URL ? "Exists" : "MISSING"));

import("./server.js").then(() => {
    log("Server.js imported");
}).catch(err => {
    log("FAILED TO IMPORT server.js: " + err.stack);
});
