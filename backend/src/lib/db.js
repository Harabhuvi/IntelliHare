import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  if (!ENV.DB_URL) {
    throw new Error("DB_URL is not defined in environment variables");
  }

  try {
    await mongoose.connect(ENV.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB", error);
    process.exit(1);
  }
};
