"use client";

import { useEffect, useState } from "react";
import { fetchBookings, createBooking } from "@/services/bookingApi";
import { Booking } from "@/types";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [prediction, setPrediction] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
  });

  // 🔥 FORM STATE
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    date: "",
    amount: "",
  });

  // 📦 LOAD BOOKINGS
  const loadBookings = async () => {
    try {
      setLoading(true);

      const res = await fetchBookings();

      const data = res.bookings || [];

      setBookings(data);
      setPrediction(res.ai_prediction || null);

      // ✅ CALCULATE STATS
      const totalRevenue = data.reduce(
        (sum, b) => sum + b.amount,
        0);
      setStats({
        totalRevenue,
        totalBookings: data.length,
      });

    } catch (err: any) {
      console.error("❌ Load Error:", err.message);

      setError(err.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // 🆕 CREATE BOOKING
  const handleCreate = async () => {
    try {
      if (!form.clientName || !form.clientEmail || !form.amount || !form.date) {
        return alert("Please fill all required fields");
      }

      await createBooking({
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        date: form.date,
        amount: parseFloat(form.amount) || 0,
        status: "Pending",
      });

      await loadBookings();

      setForm({
        clientName: "",
        clientEmail: "",
        date: "",
        amount: "",
      });

    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="space-y-6 text-white">

      <h1 className="text-3xl font-bold">Bookings Dashboard</h1>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">Total Revenue</p>
          <h2 className="text-xl font-bold">₹ {stats.totalRevenue}</h2>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">Total Bookings</p>
          <h2 className="text-xl font-bold">{stats.totalBookings}</h2>
        </div>
      </div>

      {/* 🤖 AI PREDICTION */}
      {prediction && (
        <div className="bg-purple-900/40 border border-purple-500 p-4 rounded-lg">
          <h2 className="font-bold text-purple-300">
            AI Prediction (Next Revenue Trend)
          </h2>

          <p className="text-lg mt-2">
            ₹ {prediction.predicted_revenue?.toFixed(2)}
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Based on booking activity
          </p>
        </div>
      )}

      {/* 🔥 CREATE FORM */}
      <div className="bg-slate-900 p-4 rounded-lg space-y-3">
        <h2 className="font-bold">Create Booking</h2>

        <input
          placeholder="Name"
          value={form.clientName}
          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
          className="w-full p-2 bg-slate-800 rounded"
        />

        <input
          placeholder="Email"
          value={form.clientEmail}
          onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
          className="w-full p-2 bg-slate-800 rounded"
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full p-2 bg-slate-800 rounded"
        />

        <input
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full p-2 bg-slate-800 rounded"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Create Booking
        </button>
      </div>

      {/* 📊 TABLE */}
      <table className="w-full text-left">
        <thead className="text-slate-400">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={5}>No bookings available</td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.clientName}</td>
                <td>{b.clientEmail}</td>
                <td>{b.date}</td>
                <td>{b.status}</td>
                <td>₹ {b.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}