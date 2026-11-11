import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
  const URI = process.env.MONGODB_URI;
  if (!URI) {
    throw new Error("MONGODB_URI environment variable is missing!");
  }
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Successfully connected to DanceGrid MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}
