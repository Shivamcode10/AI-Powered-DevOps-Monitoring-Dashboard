"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { systemApi } from "@/services/systemApi";
import { Server, RefreshCw } from "lucide-react";

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // 🔥 LOAD SERVICES
  const loadServices = async () => {
    try {
      const data = await systemApi.getServices();
      setServices(data);

      if (containerRef.current) {
        gsap.fromTo(
          ".service-card",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // 🔥 START / STOP
  const handleAction = async (srv: any) => {
    setProcessing(srv.name);

    if (srv.status === "running") {
      await systemApi.stopService(srv.name);
    } else {
      await systemApi.startService(srv.name);
    }

    await loadServices();
    setProcessing(null);
  };

  // 🔥 RESTART
  const handleRestart = async (name: string) => {
    setProcessing(name);
    await systemApi.restartService(name);
    await loadServices();
    setProcessing(null);
  };

  if (loading) {
    return <div className="text-white p-8">Loading Services...</div>;
  }

  return (
    <div ref={containerRef} className="space-y-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Microservices</h1>
          <p className="text-slate-400">
            Real-time monitoring & control panel
          </p>
        </div>

        <button
          onClick={loadServices}
          className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10 transition"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {services.map((srv) => (
          <div
            key={srv.id}
            className="service-card glass-panel p-6 rounded-xl border border-slate-700 flex flex-col justify-between relative"
          >

            {/* STATUS BAR */}
            <div
              className={`absolute left-0 top-0 h-full w-1 ${
                srv.status === "running" ? "bg-green-500" : "bg-red-500"
              }`}
            />

            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    srv.status === "running"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  <Server size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-white">{srv.name}</h3>
                  <p className="text-xs text-slate-400">
                    Port: {srv.port}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-bold uppercase ${
                  srv.status === "running"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {srv.status}
              </span>
            </div>

            {/* METRICS */}
            <div className="space-y-3 mb-5">

              {/* CPU */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>CPU</span>
                  <span>{srv.cpu}%</span>
                </div>

                <div className="h-2 bg-slate-700 rounded">
                  <div
                    className="h-full bg-blue-500 rounded"
                    style={{ width: `${srv.cpu}%` }}
                  />
                </div>
              </div>

              {/* MEMORY */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Memory</span>
                  <span>{srv.memory}%</span>
                </div>

                <div className="h-2 bg-slate-700 rounded">
                  <div
                    className="h-full bg-purple-500 rounded"
                    style={{ width: `${srv.memory}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={() => handleAction(srv)}
              disabled={processing === srv.name}
              className={`w-full py-2 rounded-lg text-sm transition border ${
                srv.status === "running"
                  ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                  : "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
              }`}
            >
              {processing === srv.name
                ? "Processing..."
                : srv.status === "running"
                ? "Stop Service"
                : "Start Service"}
            </button>

            {/* RESTART BUTTON */}
            <button
              onClick={() => handleRestart(srv.name)}
              disabled={processing === srv.name}
              className="mt-2 w-full py-2 rounded-lg text-sm border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition"
            >
              Restart Service
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}