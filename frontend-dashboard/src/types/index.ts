export interface User {
  id: string;
  email: string;
  name: string;
}

// ✅ DB / Response type
export interface Booking {
  _id: string;
  clientName: string;
  clientEmail: string;
  date: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  amount: number;
}

// ✅ API INPUT TYPE (VERY IMPORTANT)
export interface CreateBookingInput {
  clientName: string;
  clientEmail: string;
  date: string;
  amount: number;
  status: "Confirmed" | "Pending" | "Cancelled";
}

export interface MetricData {
  name: string;
  revenue: number;
  bookings: number;
}

export interface Metrics {
  cpu: string;
  memory: string;
  uptime: string;
  platform: string;
}