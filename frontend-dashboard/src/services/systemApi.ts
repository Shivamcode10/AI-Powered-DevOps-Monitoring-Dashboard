import { fetcher } from "./apiClient";

const BASE_URL = process.env.NEXT_PUBLIC_SYSTEM_API!;

export const systemApi = {
  getServices: async () => {
    try {
      const data = await fetcher("/api/system/services");
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getHealth: async () => {
    try {
      return await fetcher("/api/system/health");
    } catch {
      return null;
    }
  },

  getLogs: async () => {
    try {
      const data = await fetcher("/api/system/logs");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getMetrics: async () => {
    try {
      return await fetcher("/api/system/metrics");
    } catch {
      return null;
    }
  },

  getAlerts: async () => {
    try {
      const data = await fetcher("/api/system/alerts");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getAlertHistory: async () => {
    try {
      const data = await fetcher("/api/system/alerts/history");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  // 🔥 CONTROL
  restartService: async (name: string) => {
    return fetch(`${BASE_URL}/api/system/restart/${encodeURIComponent(name)}`, {
      method: "POST",
    });
  },

  startService: async (name: string) => {
    return fetch(`${BASE_URL}/api/system/start/${encodeURIComponent(name)}`, {
      method: "POST",
    });
  },

  stopService: async (name: string) => {
    return fetch(`${BASE_URL}/api/system/stop/${encodeURIComponent(name)}`, {
      method: "POST",
    });
  },

  getDeployments: async () => {
    try {
      const data = await fetcher("/api/system/deployments");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  createDeployment: async (payload: any) => {
    return fetch(`${BASE_URL}/api/system/deployments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },
};