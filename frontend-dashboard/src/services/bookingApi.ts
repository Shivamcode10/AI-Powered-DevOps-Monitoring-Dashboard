import axios from "axios";
import { Booking, CreateBookingInput } from "@/types";

const bookingApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BOOKING_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token automatically
bookingApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ✅ FETCH BOOKINGS
export const fetchBookings = async (): Promise<{
  bookings: Booking[];
  ai_prediction: any;
}> => {
  try {
    const { data } = await bookingApi.get("/api/bookings");

    return {
      bookings: Array.isArray(data.bookings) ? data.bookings : [],
      ai_prediction: data.ai_prediction || null,
    };
  } catch (err: any) {
    throw new Error(
      err.response?.data?.error || "Failed to fetch bookings"
    );
  }
};

// ✅ CREATE BOOKING (FIXED)
export const createBooking = async (bookingData: CreateBookingInput) => {
  try {
    const { data } = await bookingApi.post("/api/bookings", bookingData);
    return data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.error || "Failed to create booking"
    );
  }
};