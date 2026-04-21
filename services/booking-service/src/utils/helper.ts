export const calculateTotalRevenue = (bookings: any[]): number => {
  return bookings.reduce((sum, booking) => sum + booking.amount, 0);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};