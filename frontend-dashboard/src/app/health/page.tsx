"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { systemApi } from "@/services/systemApi";
import { Heart, Activity, Clock, ServerCrash } from "lucide-react";

export default function HealthPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    systemApi.getHealth()
      .then(data => {
        setHealth(data);
        setLoading(false);
        gsap.from(".health-metric", {
            scale: 0.8, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)"
        });
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white">Loading Health...</div>;
  if (!health) return <div className="text-white">No Health Data Available</div>;

  return (
    <div ref={containerRef} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">System Health</h1>
        <p className="text-slate-400">Overall platform status and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="health-metric glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-green-500/10 mb-4 text-green-400">
            <Heart size={32} className="fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 capitalize">{health.status}</h2>
          <span className="text-slate-400 text-sm">Overall Status</span>
        </div>

        <div className="health-metric glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-blue-500/10 mb-4 text-blue-400">
            <Clock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{health.uptime}</h2>
          <span className="text-slate-400 text-sm">System Uptime</span>
        </div>

        <div className="health-metric glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-purple-500/10 mb-4 text-purple-400">
            <Activity size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{health.apiLatency}</h2>
          <span className="text-slate-400 text-sm">Avg Latency</span>
        </div>

        <div className="health-metric glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-red-500/10 mb-4 text-red-400">
            <ServerCrash size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{health.errorsLastHour}</h2>
          <span className="text-slate-400 text-sm">Errors (Last 1h)</span>
        </div>
      </div>
    </div>
  );
}