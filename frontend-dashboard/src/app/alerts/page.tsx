"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { systemApi } from "@/services/systemApi";
import { AlertCircle, ShieldAlert, CheckCircle } from "lucide-react";

export default function AlertsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  systemApi.getAlerts()
    .then(data => {
      setAlerts(data);
      setLoading(false);

      gsap.from(".alert-item", {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
      });
    })
    .catch(() => setLoading(false));
}, []);

  if (loading) return <div className="text-white">Loading Alerts...</div>;

  const getSeverityColor = (severity: string) => {
    if(severity === 'HIGH') return 'border-red-500/50 bg-red-500/5';
    if(severity === 'MEDIUM') return 'border-yellow-500/50 bg-yellow-500/5';
    return 'border-blue-500/50 bg-blue-500/5';
  };

  const getIcon = (severity: string) => {
    if(severity === 'HIGH') return <AlertCircle className="text-red-500" />;
    if(severity === 'MEDIUM') return <ShieldAlert className="text-yellow-500" />;
    return <CheckCircle className="text-blue-500" />;
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Intelligence & Alerts</h1>
        <p className="text-slate-400">Predictive analysis and system anomalies detected by AI Core.</p>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 && <div className="text-slate-500 text-center p-8">No alerts detected.</div>}
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item glass-panel p-5 rounded-xl border-l-4 ${getSeverityColor(alert.severity)} flex items-start gap-4`}>
            <div className="mt-1">{getIcon(alert.severity)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-lg">{alert.type}</h3>
                <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">
                  {alert.severity} SEVERITY
                </span>
              </div>
              <p className="text-slate-300 mt-1">{alert.message}</p>
              <div className="mt-4 flex items-center gap-3">
                <button className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wide">
                  {alert.action} →
                </button>
                <span className="text-xs text-slate-500">• Just now</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}