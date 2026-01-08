// API-related types for the bus ticket cancellation system

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  route: string;
  departureDate: string;
  departureTime: string;
  seatNumber: string;
  price: number;
  status: "confirmed" | "cancelled" | "refunded";
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email?: string;
  phone?: string;
}

export interface CreateBookingRequest {
  userId: string;
  route: string;
  departureDate: string;
  departureTime: string;
  seatNumber: string;
  price: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
