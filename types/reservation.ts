export type ReservationStatus = "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled";

export interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  status: ReservationStatus;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  totalPrice: number;
  createdAt: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomNumber: string;
  status: ReservationStatus;
  totalAmount: number;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'checked-in'
  | 'checked-out'
  | 'cancelled';

export interface ReservationUpdate {
  type: 'new' | 'update' | 'delete';
  data: Reservation;
}

export interface ReservationsState {
  items: Reservation[];
  loading: boolean;
  error: string | null;
}