"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Rocket, CheckCircle, XCircle, Clock } from "lucide-react";
import { systemApi } from "@/services/systemApi";

export default function DeploymentsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [deployments, setDeployments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD DATA
  const loadDeployments = async () => {
    const data = await systemApi.getDeployments();
    setDeployments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDeployments();

    const interval = setInterval(loadDeployments, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.from(".deploy-row", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
    });
  }, [deployments]);

  // 🔥 CREATE DEPLOYMENT
  const handleDeploy = async () => {
    await systemApi.createDeployment({
      service: "Booking Service",
      version: `v1.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    });

    loadDeployments();
  };

  const getStatusIcon = (status: string) => {
    if (status === "success") return <CheckCircle className="text-green-500" />;
    if (status === "failed") return <XCircle className="text-red-500" />;
    return <Clock className="text-yellow-500 animate-spin" />;
  };

  if (loading) return <div className="text-white">Loading Deployments...</div>;

  return (
    <div ref={containerRef} className="space-y-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Deployments</h1>
          <p className="text-slate-400">CI/CD pipeline simulation</p>
        </div>

        <button
          onClick={handleDeploy}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded flex gap-2"
        >
          <Rocket size={16} /> New Deployment
        </button>
      </div>

      {/* TABLE */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Version</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Time</th>
            </tr>
          </thead>

          <tbody>
            {deployments.map((dep) => (
              <tr key={dep.id} className="deploy-row border-t border-slate-700">
                <td className="px-6 py-4">{getStatusIcon(dep.status)}</td>
                <td className="px-6 py-4">{dep.service}</td>
                <td className="px-6 py-4 text-blue-400">{dep.version}</td>
                <td className="px-6 py-4">{dep.user}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">
                  {new Date(dep.time).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}