import mongoose from "mongoose";

export const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  }
};