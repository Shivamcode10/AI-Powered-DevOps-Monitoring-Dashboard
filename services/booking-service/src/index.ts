import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import bookingRoutes from "./routes/bookingRoutes";
import { connectDB } from "./config/db";
import redis from "./config/redis";

// 🔥 PROMETHEUS
import client from "prom-client";

const app = express();
const PORT = process.env.PORT || 5002;

// ==========================
// 🔥 PROMETHEUS SETUP
// ==========================
client.collectDefaultMetrics();

const httpRequests = new client.Counter({
  name: "booking_http_requests_total",
  help: "Total number of HTTP requests in booking service",
  labelNames: ["method", "route", "status"],
});

const httpDuration = new client.Histogram({
  name: "booking_http_request_duration_seconds",
  help: "Duration of HTTP requests in booking service",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// 🔥 Metrics middleware
app.use((req, res, next) => {
  const end = httpDuration.startTimer();

  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    };

    httpRequests.inc(labels);
    end(labels);
  });

  next();
});

// ==========================
// ✅ MIDDLEWARE
// ==========================
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// ==========================
// ✅ ROOT ROUTE (🔥 IMPORTANT FIX)
// ==========================
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Booking Service Running 🚀",
  });
});

// ==========================
// ✅ HEALTH CHECK
// ==========================
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "booking-service",
  });
});

// ==========================
// 🔥 METRICS ENDPOINT
// ==========================
app.get("/metrics", async (_req: Request, res: Response) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// ==========================
// ✅ ROUTES
// ==========================
app.use("/api/bookings", bookingRoutes);

// ==========================
// 🚀 START SERVER
// ==========================
const start = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
    if (!process.env.REDIS_URL) throw new Error("REDIS_URL missing");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");

    console.log(`🔐 JWT Loaded: ${process.env.JWT_SECRET.substring(0, 5)}...`);

    // MongoDB
    await connectDB(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Redis test
    await redis.set("booking:test", "OK");
    const test = await redis.get("booking:test");
    console.log("📦 Redis Test:", test);

    app.listen(PORT, () => {
      console.log(`🚀 Booking Service running on port ${PORT}`);
      console.log(`📊 Metrics: http://localhost:${PORT}/metrics`);
    });

  } catch (err) {
    console.error("❌ Startup Error:", err);
    process.exit(1);
  }
};

start();