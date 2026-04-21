import { Request, Response } from "express";
import redis from "../config/redis";
import axios from "axios";
import {
  createBookingService,
  getBookingsService,
} from "../services/bookingService";

// ✅ CREATE BOOKING
export const createBooking = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const booking = await createBookingService(req.body);

    // 🔥 Clear cache after new booking
    await redis.del("bookings");

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ GET BOOKINGS + AI INTEGRATION
export const getBookings = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let bookings;

    // 🔥 1. Redis Cache
    const cached = await redis.get("bookings");

    if (cached) {
      console.log("⚡ From Redis Cache");
      bookings = JSON.parse(cached);
    } else {
      console.log("📦 From MongoDB");

      bookings = await getBookingsService();

      // cache for 60 seconds
      await redis.set("bookings", JSON.stringify(bookings), "EX", 60);
    }

    // 🔥 2. CALCULATE STATS
    const totalRevenue = bookings.reduce(
      (sum: number, b: any) => sum + (b.amount || 0),
      0
    );

    const totalBookings = bookings.length;

    // 🔥 3. CALL AI SERVICE
    let aiPrediction = null;

    try {
      const AI_URL = process.env.AI_URL || "http://ai:8000";

      const aiRes = await axios.post(`${AI_URL}/predict`, {
        totalRevenue,
        totalBookings,
        bookings,
      });

      console.log("🤖 AI response received");

      aiPrediction = aiRes.data;
    } catch (err) {
      console.log("⚠️ AI Service not available");
    }

    // 🔥 4. FINAL RESPONSE (THIS WAS MISSING ❗)
    res.json({
      bookings,
      stats: {
        totalRevenue,
        totalBookings,
      },
      ai_prediction: aiPrediction,
    });

  } catch (error: any) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};