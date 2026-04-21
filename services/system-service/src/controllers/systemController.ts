import { Request, Response } from "express";
import { SERVICES } from "../config/services";
import { checkService } from "../utils/checkService";
import axios from "axios";

// ✅ GET SERVICES
export const getServices = async (req: Request, res: Response) => {
  const results = await Promise.all(
    SERVICES.map(async (srv) => {
      const status = await checkService(srv.url);

      return {
        id: srv.id,
        name: srv.name,
        port: srv.port,
        status,
        cpu: Math.floor(Math.random() * 80) + 10,
        memory: Math.floor(Math.random() * 80) + 10,
      };
    })
  );

  res.json(results);
};

// ✅ HEALTH
export const getHealth = async (req: Request, res: Response) => {
  const health: any = {};

  for (const srv of SERVICES) {
    try {
      await axios.get(srv.url);
      health[srv.name] = "UP";
    } catch {
      health[srv.name] = "DOWN";
    }
  }

  res.json(health);
};

// ✅ LOGS (mock)
export const getLogs = (req: Request, res: Response) => {
  res.json([
    { service: "Auth", message: "User login", time: "2 min ago" },
    { service: "Booking", message: "Booking created", time: "5 min ago" },
  ]);
};