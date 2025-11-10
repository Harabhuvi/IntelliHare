import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5174",
};

// 🔍 Optional safety check (log only when something’s missing)
const required = ["DB_URL", "CLIENT_URL"];
for (const key of required) {
  if (!ENV[key]) {
    console.warn(`⚠️  Missing environment variable: ${key}`);
  }
}
