import fetch from "node-fetch";
import { Router, Request, Response } from "express";
import os from "os";
import { exec } from "child_process";

const router = Router();

// ==========================
// 🔥 TYPE SAFE KEYS
// ==========================
type ServiceName = "Auth Service" | "Booking Service" | "AI Service";

// ==========================
// 🔥 SERVICE MAP
// ==========================
const SERVICE_MAP: Record<ServiceName, string> = {
  "Auth Service": "http://auth:5001/health",
  "Booking Service": "http://booking:5002/health",
  "AI Service": "http://ai:8000",
};

// ==========================
// 🔥 CONTAINER MAP
// ==========================
const CONTAINER_MAP: Record<string, string> = {
  "auth-service": "project-root-auth-1",
  "booking-service": "project-root-booking-1",
  "system-service": "project-root-system-1",
};

// ==========================
// 🔥 COOLDOWN
// ==========================
const restartCooldown: Record<string, number> = {};
const COOLDOWN_TIME = 30000;

// ==========================
// 🔥 STORAGE
// ==========================
let alertHistory: any[] = [];
let deployments: any[] = [];

// ==========================
// 🔥 HELPER
// ==========================
const checkService = async (url: string) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    return res.ok;
  } catch {
    return false;
  }
};

// ==========================
// 🚨 ALERT WEBHOOK
// ==========================
router.post("/alert", async (req: Request, res: Response) => {
  try {
    const alerts = req.body.alerts || [];

    for (const alert of alerts) {
      const service = alert.labels?.job;

      if (!service) continue;

      const container = CONTAINER_MAP[service];

      if (!container) {
        console.log(`⚠️ No container mapping for ${service}`);
        continue;
      }

      const now = Date.now();
      const lastRestart = restartCooldown[service] || 0;

      if (now - lastRestart < COOLDOWN_TIME) {
        console.log(`⏳ Cooldown active for ${service}`);
        continue;
      }

      console.log(`🚨 ALERT → ${service}`);
      console.log(`🔁 Restarting ${container}...`);

      exec(`docker restart ${container}`, (err, stdout, stderr) => {
        if (err) {
          console.error(`❌ Restart failed:`, err.message);
        } else {
          console.log(`✅ Restarted ${container}`);
          console.log(stdout);
        }

        if (stderr) console.error(stderr);
      });

      alertHistory.unshift({
        service,
        action: "RESTART",
        time: new Date().toISOString(),
      });

      restartCooldown[service] = now;
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// ✅ SERVICES API (FIXED)
// ==========================
router.get("/services", async (_req: Request, res: Response) => {
  const serviceNames = Object.keys(SERVICE_MAP) as ServiceName[];

  const results = await Promise.all(
    serviceNames.map(async (name, index) => {
      const isUp = await checkService(SERVICE_MAP[name]);

      return {
        id: index + 1,
        name,
        status: isUp ? "running" : "down",
        cpu: isUp ? Math.floor(Math.random() * 70) + 10 : 0,
        memory: isUp ? Math.floor(Math.random() * 60) + 20 : 0,
      };
    })
  );

  res.json(results);
});

// ==========================
// ✅ HEALTH API (FIXED)
// ==========================
router.get("/health", async (_req: Request, res: Response) => {
  const serviceNames = Object.keys(SERVICE_MAP) as ServiceName[];

  const checks = await Promise.all(
    serviceNames.map(async (name) => {
      const isUp = await checkService(SERVICE_MAP[name]);

      return {
        service: name,
        status: isUp ? "healthy" : "down",
      };
    })
  );

  res.json({
    status: checks.every((s) => s.status === "healthy") ? "healthy" : "degraded",
    uptime: process.uptime().toFixed(0) + " sec",
    services: checks,
  });
});

// ==========================
// ✅ METRICS
// ==========================
router.get("/metrics", (_req: Request, res: Response) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  res.json({
    cpu: os.loadavg()[0].toFixed(2),
    memory: (((totalMem - freeMem) / totalMem) * 100).toFixed(2),
    uptime: process.uptime().toFixed(0),
  });
});

// ==========================
// ✅ ALERT HISTORY
// ==========================
router.get("/alerts/history", (_req: Request, res: Response) => {
  res.json(alertHistory.slice(0, 20));
});

// ==========================
// ✅ DEPLOYMENTS
// ==========================
router.get("/deployments", (_req: Request, res: Response) => {
  res.json(deployments);
});

router.post("/deployments", (req: Request, res: Response) => {
  const { service, version } = req.body;

  const newDeployment = {
    id: Date.now(),
    service,
    version,
    user: "Shivam",
    status: "success",
    time: new Date().toISOString(),
  };

  deployments.unshift(newDeployment);
  res.json(newDeployment);
});

export default router;