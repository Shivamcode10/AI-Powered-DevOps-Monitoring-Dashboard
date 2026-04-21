"use client";

import { ReactNode } from "react";

export interface CardProps {
  title: string;
  value: string | number; // ✅ FIX (supports number + string)
  icon: ReactNode;
  trend: string;
}

export default function Card({ title, value, icon, trend }: CardProps) {
  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-700 hover:border-blue-500 transition">
      
      <div className="flex justify-between items-center">
        <h3 className="text-sm text-slate-400">{title}</h3>
        <div className="text-blue-400">{icon}</div>
      </div>

      <h2 className="text-2xl font-bold mt-3 text-white">
        {value}
      </h2>

      <p className="text-xs text-slate-400 mt-1">
        {trend}
      </p>
    </div>
  );
}