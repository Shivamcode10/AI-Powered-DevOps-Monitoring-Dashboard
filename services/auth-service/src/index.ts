import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { connectDB } from "./config/db";
import redis from "./config/redis";

// 🔥 PROMETHEUS
import client from "prom-client";

const app = express();

// ==========================
// 🔥 PROMETHEUS SETUP
// ==========================

// Collect default metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// Custom metric: total HTTP requests
const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// Custom metric: response time
const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// 🔥 Middleware for metrics
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
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ==========================
// ✅ ROUTES
// ==========================
app.use("/api/auth", authRoutes);

// ==========================
// ✅ HEALTH CHECK
// ==========================
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "auth-service",
  });
});

// ==========================
// 🔥 METRICS ENDPOINT
// ==========================
app.get("/metrics", async (req: Request, res: Response) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// ==========================
// 🚀 START SERVER
// ==========================
const start = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
    if (!process.env.REDIS_URL) throw new Error("REDIS_URL missing");

    // ✅ MongoDB
    await connectDB(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // ✅ Redis test
    await redis.set("test", "Hello Redis");
    const value = await redis.get("test");
    console.log("📦 Redis Test:", value);

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
      console.log(`🚀 Auth Service running on port ${PORT}`);
      console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
    });

  } catch (err) {
    console.error("❌ Startup Error:", err);
    process.exit(1);
  }
};

start();