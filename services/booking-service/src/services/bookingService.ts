import Booking, { IBooking } from '../models/Booking';

export const createBookingService = async (data: Partial<IBooking>) => {
  return await Booking.create(data);
};

export const getBookingsService = async () => {
  return await Booking.find().sort({ createdAt: -1 });
};