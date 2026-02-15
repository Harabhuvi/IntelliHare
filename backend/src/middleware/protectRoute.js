import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      let user = await User.findOne({ clerkId });

      // If user is authenticated in Clerk but not in our DB, fetch from Clerk and create
      if (!user) {
        console.log(`👤 Fetching official profile for Clerk ID: ${clerkId}`);
        const clerkUser = await clerkClient.users.getUser(clerkId);

        user = await User.create({
          clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "no-email@clerk.user",
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Clerk User",
          profileImage: clerkUser.imageUrl,
        });
        console.log(`✅ Successfully synced: ${user.name}`);
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
