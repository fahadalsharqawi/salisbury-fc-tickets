export type Match = {
  id: string;
  opponent: string;
  competition: string;
  kickoff: string; // ISO datetime
  venue: string;
  isHome: boolean;
  pricePerSeat: number;
  notes?: string;
  cancelledAt?: string;
  cancellationReason?: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "attended";

export type CancelledBy = "customer" | "owner" | "match";

export type PaymentMethod = "card" | "apple" | "google";

export type Booking = {
  id: string;
  matchId: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  seats: string[];
  adultCount: number;
  concessionCount: number;
  under17Count: number;
  under5Count: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: BookingStatus;
  cancelledAt?: string;
  cancelledBy?: CancelledBy;
  attendedAt?: string;
  createdAt: string;
  tapChargeId?: string;
  confirmedAt?: string;
};

export type MatchWithAvailability = Match & {
  bookedSeats: string[];
  ticketsSold: number;
  capacity: number;
  remaining: number;
  isSoldOut: boolean;
};
