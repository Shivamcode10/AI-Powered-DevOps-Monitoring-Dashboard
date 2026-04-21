"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Card from "@/components/Card";
import { Activity, Users, Zap, Server } from "lucide-react";
import { systemApi } from "@/services/systemApi";
import { fetchBookings } from "@/services/bookingApi";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [services, setServices] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
  });
  const [prediction, setPrediction] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  // 🎬 Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 📦 Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, healthData, bookingRes] = await Promise.all([
          systemApi.getServices(),
          systemApi.getHealth(),
          fetchBookings(),
        ]);

        setServices(servicesData || []);
        setHealth(healthData);

        const bookings = bookingRes.bookings || [];

        const totalRevenue = bookings.reduce(
          (sum: number, b: any) => sum + (b.amount || 0),
          0
        );

        setStats({
          totalRevenue,
          totalBookings: bookings.length,
        });

        setPrediction(bookingRes.ai_prediction);

      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <p className="text-white">Loading Dashboard...</p>;
  }

  const runningServices = services.filter(
    (s) => s.status === "running"
  ).length;

  return (
    <div ref={containerRef} className="space-y-8 text-white">

      {/* 🔥 HEADER */}
      <div className="hero-text">
        <h1 className="text-4xl font-bold mb-2">
          Overview Dashboard
        </h1>
        <p className="text-slate-400">
          Real-time system + business monitoring
        </p>
      </div>

      {/* 🔥 MAIN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card
          title="Total Services"
          value={services.length}
          icon={<Server size={24} />}
          trend={`${runningServices} Running`}
        />

        <Card
          title="System Health"
          value={health?.status || "Unknown"}
          icon={<Activity size={24} />}
          trend="Live"
        />

        <Card
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Users size={24} />}
          trend="Updated"
        />

        <Card
          title="Total Revenue"
          value={`₹ ${stats.totalRevenue}`}
          icon={<Zap size={24} />}
          trend="Live Data"
        />

      </div>

      {/* 🤖 AI SECTION */}
      {prediction && (
        <div className="glass-panel p-6 rounded-xl border border-purple-500/30 hero-text">
          <h2 className="text-lg font-bold text-purple-300">
            AI Predicted Revenue
          </h2>

          <p className="text-2xl mt-2">
            ₹ {prediction.predicted_revenue?.toFixed(2)}
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Based on booking trends
          </p>
        </div>
      )}

    </div>
  );
}