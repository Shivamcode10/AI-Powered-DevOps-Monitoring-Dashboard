"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Terminal } from "lucide-react";
import { systemApi } from "@/services/systemApi";

export default function LogsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    const data = await systemApi.getLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.from(".log-line", {
      opacity: 0,
      x: -10,
      duration: 0.3,
      stagger: 0.05,
    });
  }, [logs]);

  if (loading) return <div className="text-white">Loading logs...</div>;

  return (
    <div ref={containerRef} className="space-y-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Logs</h1>
          <p className="text-slate-400">
            Live stream of events across microservices
          </p>
        </div>

        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </div>
      </div>

      {/* TERMINAL */}
      <div className="glass-panel rounded-xl border border-slate-700 overflow-hidden font-mono text-sm">

        {/* HEADER */}
        <div className="bg-black px-4 py-2 border-b border-slate-700 flex items-center gap-2">
          <Terminal size={14} className="text-green-400" />
          <span className="text-green-400">root@aiops</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$ tail -f logs</span>
        </div>

        {/* BODY */}
        <div className="bg-black p-4 h-[500px] overflow-y-auto space-y-1">

          {logs.length === 0 && (
            <div className="text-slate-500">No logs available</div>
          )}

          {logs.map((log) => (
            <div
              key={log.id}
              className="log-line flex gap-3 px-2 py-1 rounded hover:bg-white/5"
            >
              {/* ✅ FIXED TIME */}
              <span className="text-gray-500 w-[90px]">
                {new Date(log.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </span>

              {/* LEVEL */}
              <span
                className={`w-[70px] font-bold ${
                  log.level === "ERROR"
                    ? "text-red-400"
                    : log.level === "WARN"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {log.level}
              </span>

              {/* SERVICE */}
              <span className="text-blue-400 w-[120px]">
                [{log.service}]
              </span>

              {/* MESSAGE */}
              <span className="text-white">
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}