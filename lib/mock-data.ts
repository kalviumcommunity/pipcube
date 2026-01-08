// Mock data storage for the bus ticket cancellation system
// In a real application, this would be replaced with a database

import type { User, Booking } from "@/types/api";

// In-memory storage for users
let users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+0987654321",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    createdAt: new Date().toISOString(),
  },
];

// In-memory storage for bookings
let bookings: Booking[] = [
  {
    id: "1",
    userId: "1",
    route: "New York to Boston",
    departureDate: "2024-12-20",
    departureTime: "10:00 AM",
    seatNumber: "A12",
    price: 45.99,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "1",
    route: "Boston to New York",
    departureDate: "2024-12-25",
    departureTime: "02:30 PM",
    seatNumber: "B05",
    price: 45.99,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "2",
    route: "Chicago to Detroit",
    departureDate: "2024-12-18",
    departureTime: "08:00 AM",
    seatNumber: "C08",
    price: 32.50,
    status: "cancelled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    userId: "2",
    route: "Detroit to Chicago",
    departureDate: "2024-12-22",
    departureTime: "11:15 AM",
    seatNumber: "D15",
    price: 32.50,
    status: "refunded",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    userId: "3",
    route: "Los Angeles to San Francisco",
    departureDate: "2024-12-19",
    departureTime: "09:30 AM",
    seatNumber: "E22",
    price: 55.75,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
];

// Helper functions to interact with mock data
export const getUsers = (): User[] => {
  return users;
};

export const createUser = (userData: Omit<User, "id" | "createdAt">): User => {
  const newUser: User = {
    ...userData,
    id: (users.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const getBookings = (): Booking[] => {
  return bookings;
};

export const createBooking = (
  bookingData: Omit<Booking, "id" | "createdAt" | "status">
): Booking => {
  const newBooking: Booking = {
    ...bookingData,
    id: (bookings.length + 1).toString(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  return newBooking;
};

export const getBookingsByUserId = (userId: string): Booking[] => {
  return bookings.filter((booking) => booking.userId === userId);
};
