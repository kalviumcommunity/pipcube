// API-related types for the bus ticket cancellation and refund system

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface BusOperator {
  id: string;
  name: string;
  licenseNumber: string;
  contactEmail: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  operatorId: string;
  route: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  tripId: string;
  seatNumber: string;
  price: number;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export interface Cancellation {
  id: string;
  ticketId: string;
  userId: string;
  reason: string;
  cancelledBy: "user" | "operator" | "system";
  cancellationPolicy: string;
  refundEligibility: boolean;
  refundAmount?: number;
  status: "pending" | "processed" | "rejected";
  createdAt: string;
  processedAt?: string;
}

export interface Refund {
  id: string;
  cancellationId: string;
  ticketId: string;
  userId: string;
  originalAmount: number;
  refundAmount: number;
  refundPercentage: number;
  reason: string;
  status: "pending" | "processing" | "completed" | "failed";
  processedAt?: string;
  expectedCompletionDate?: string;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email?: string;
  phone?: string;
}

export interface CreateTicketRequest {
  userId: string;
  tripId: string;
  seatNumber: string;
}

export interface CreateCancellationRequest {
  ticketId: string;
  reason: string;
}

export interface CreateRefundRequest {
  cancellationId: string;
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
