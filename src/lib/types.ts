export type Match = {
  id: string;
  opponent: string;
  competition: string;
  kickoff: string; // ISO datetime
  venue: string;
  isHome: boolean;
  pricePerSeat: number;
  notes?: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type PaymentMethod = "card" | "apple" | "google";

export type Booking = {
  id: string;
  matchId: string;
  customerName: string;
  email: string;
  phone: string;
  seats: string[]; // e.g. ["A-1", "A-2"]
  paymentMethod: PaymentMethod;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
};

export type DB = {
  matches: Match[];
  bookings: Booking[];
};

export type MatchWithAvailability = Match & {
  bookedSeats: string[];
  ticketsSold: number;
  capacity: number;
  remaining: number;
  isSoldOut: boolean;
};
