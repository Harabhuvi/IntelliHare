import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

let chatClient = null;
let streamClient = null;

// Validate credentials
if (!apiKey || !apiSecret) {
  console.warn("⚠️ STREAM_API_KEY or STREAM_API_SECRET is missing — Stream services disabled.");
} else {
  try {
    // Initialize both clients
    chatClient = StreamChat.getInstance(apiKey, apiSecret);
    streamClient = new StreamClient(apiKey, apiSecret);
    console.log("✅ Stream clients initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize Stream clients:", err.message);
  }
}

// Export safely (null if not available)
export { chatClient, streamClient };

// Safely upsert user
export const upsertStreamUser = async (userData) => {
  if (!chatClient) {
    console.warn("⚠️ Stream Chat client not initialized. Skipping user upsert.");
    return;
  }

  try {
    await chatClient.upsertUser(userData);
    console.log("✅ Stream user upserted successfully:", userData.id || userData);
  } catch (error) {
    console.error("❌ Error upserting Stream user:", error.message);
  }
};

// Safely delete user
export const deleteStreamUser = async (userId) => {
  if (!chatClient) {
    console.warn("⚠️ Stream Chat client not initialized. Skipping user deletion.");
    return;
  }

  try {
    await chatClient.deleteUser(userId);
    console.log("✅ Stream user deleted successfully:", userId);
  } catch (error) {
    console.error("❌ Error deleting the Stream user:", error.message);
  }
};
