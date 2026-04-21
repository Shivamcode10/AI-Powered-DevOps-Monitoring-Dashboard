import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import systemRoutes from "./routes/systemRoutes";

// 🔥 PROMETHEUS
import client from "prom-client";

dotenv.config();

const app = express();

// ==========================
// 🔥 PROMETHEUS SETUP
// ==========================

// Default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics();

// Unique metric names for this service
const httpRequests = new client.Counter({
  name: "system_http_requests_total",
  help: "Total number of HTTP requests in system service",
  labelNames: ["method", "route", "status"],
});

const httpDuration = new client.Histogram({
  name: "system_http_request_duration_seconds",
  help: "Duration of HTTP requests in system service",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// 🔥 Metrics middleware (must be before routes)
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
app.use(cors());
app.use(express.json());

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
app.use("/api/system", systemRoutes);

// ==========================
// ✅ ROOT CHECK
// ==========================
app.get("/", (_req: Request, res: Response) => {
  res.send("System Service Running 🚀");
});

// ==========================
// 🚀 START SERVER
// ==========================
const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`🚀 System Service running on port ${PORT}`);
  console.log(`📊 Metrics: http://localhost:${PORT}/metrics`);
});