"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { systemApi } from "@/services/systemApi";
import { Metrics } from "@/types";

export default function MetricsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  // 🔥 Fetch metrics
  const loadMetrics = async () => {
    const data = await systemApi.getMetrics();

    if (!data) return;

    setMetrics(data);

    // 🔥 Append for chart (last 10 points)
    setChartData((prev) => {
      const newData = [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          cpu: Number(data.cpu),
          memory: Number(data.memory),
        },
      ];
      return newData.slice(-10);
    });
  };

  useEffect(() => {
    loadMetrics();

    const interval = setInterval(loadMetrics, 2000); // 🔁 auto refresh

    return () => clearInterval(interval);
  }, []);

  // 🎨 Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".chart-card", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!metrics) return <p className="text-white">Loading Metrics...</p>;

  return (
    <div ref={containerRef} className="space-y-6 text-white">
      <h1 className="text-3xl font-bold">System Metrics</h1>

      {/* 🔥 LIVE STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-lg">
          <p className="text-slate-400">CPU</p>
          <h2 className="text-xl font-bold">{metrics.cpu}</h2>
        </div>

        <div className="glass-panel p-4 rounded-lg">
          <p className="text-slate-400">Memory</p>
          <h2 className="text-xl font-bold">{metrics.memory}%</h2>
        </div>

        <div className="glass-panel p-4 rounded-lg">
          <p className="text-slate-400">Uptime</p>
          <h2 className="text-xl font-bold">{metrics.uptime}s</h2>
        </div>

        <div className="glass-panel p-4 rounded-lg">
          <p className="text-slate-400">Platform</p>
          <h2 className="text-xl font-bold">{metrics.platform}</h2>
        </div>
      </div>

      {/* 🔥 CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Chart */}
        <div className="chart-card glass-panel p-6 rounded-xl">
          <h3 className="mb-4">CPU Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area dataKey="cpu" stroke="#3b82f6" fill="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Chart */}
        <div className="chart-card glass-panel p-6 rounded-xl">
          <h3 className="mb-4">Memory Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="memory" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}