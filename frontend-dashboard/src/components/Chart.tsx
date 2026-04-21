"use client";

import { MetricData } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface ChartProps {
  data: MetricData[];
  title?: string; // ✅ flexible title
}

export default function Chart({ data, title = "Revenue Prediction (AI)" }: ChartProps) {
  // ✅ handle empty data safely
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500 text-center">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      
      {/* 🔥 Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {title}
      </h3>

      {/* 🔥 Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />

            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
              formatter={(value: number) => [`₹ ${value}`, "Revenue"]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4F46E5"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}